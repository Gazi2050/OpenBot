import { eq } from 'drizzle-orm'
import { logger } from '@openbot/shared'
import type { Database } from '../../db/index.js'
import { conversations, messages } from '../../db/schema/index.js'
import { DEFAULT_CONVERSATION_TITLE, TITLE_MAX_LENGTH } from '../constants.js'

export async function ensureConversation(
	db: Database,
	userId: string,
	conversationId: string | null,
	title?: string
): Promise<{ conversationId: string; title: string }> {
	const effectiveTitle = (title || DEFAULT_CONVERSATION_TITLE).slice(0, TITLE_MAX_LENGTH)

	if (conversationId) {
		const [conv] = await db
			.select({ id: conversations.id, userId: conversations.userId })
			.from(conversations)
			.where(eq(conversations.id, conversationId))
			.limit(1)
		if (conv && conv.userId === userId) {
			return { conversationId: conv.id, title: effectiveTitle }
		}
		logger.warn(
			`[ai] stale or unauthorized conversationId="${conversationId}" for userId="${userId}", creating new conversation`
		)
	}

	const newId = crypto.randomUUID()
	await db.insert(conversations).values({
		id: newId,
		userId,
		title: effectiveTitle,
	})
	return { conversationId: newId, title: effectiveTitle }
}

export async function persistUserMessage(
	db: Database,
	conversationId: string,
	messageId: string,
	content: string,
	userId: string,
	title: string
): Promise<string> {
	const [existing] = await db
		.select({ id: messages.id })
		.from(messages)
		.where(eq(messages.id, messageId))
		.limit(1)
	if (existing) return conversationId

	try {
		await db.insert(messages).values({
			id: messageId,
			conversationId,
			role: 'user',
			content,
		})
		return conversationId
	} catch (e: any) {
		if (e?.cause?.code === '23503' || e?.code === '23503') {
			logger.warn(
				`[ai] FK violation persisting user message; creating fresh conversation. staleConversationId="${conversationId}" userId="${userId}"`
			)
			const newId = crypto.randomUUID()
			await db.insert(conversations).values({
				id: newId,
				userId,
				title,
			})
			await db.insert(messages).values({
				id: messageId,
				conversationId: newId,
				role: 'user',
				content,
			})
			return newId
		}
		throw e
	}
}
