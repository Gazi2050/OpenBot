import { eq } from 'drizzle-orm'
import { logger } from '@openbot/shared'
import type { Database } from '../../db/index.js'
import { conversations, messages } from '../../db/schema/index.js'

export async function persistAssistantMessage(
	db: Database,
	conversationId: string,
	text: string
): Promise<void> {
	try {
		const id = crypto.randomUUID()
		await db.insert(messages).values({
			id,
			conversationId,
			role: 'assistant',
			content: text,
		})
		await db
			.update(conversations)
			.set({ updatedAt: new Date() })
			.where(eq(conversations.id, conversationId))
	} catch (e) {
		logger.error(`[ai] failed to persist assistant message for conversation ${conversationId}:`)
		logger.error(e instanceof Error ? e.message : String(e))
	}
}
