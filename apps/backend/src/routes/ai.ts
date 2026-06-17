import { Hono } from 'hono'
import { getAuth } from '@clerk/hono'
import { streamText, convertToModelMessages } from 'ai'
import { eq } from 'drizzle-orm'
import { getModel, resolveModelId, DEFAULT_MODEL, availableModelIds } from '../lib/ai/providers.js'
import { SYSTEM_PROMPT } from 'openbot-sdk'
import { logger } from '@openbot/shared'
import { getDb } from '../db/index.js'
import { conversations, messages } from '../db/schema/index.js'

const app = new Hono()

app.get('/models', (c) => {
	return c.json({
		success: true,
		data: {
			defaultModelId: DEFAULT_MODEL,
			enabledModelIds: availableModelIds,
		},
	})
})

app.post('/chat', async (c) => {
	const { messages: uiMessages, model: modelId = DEFAULT_MODEL, conversationId: existingId } = await c.req.json()

	const { userId } = getAuth(c)
	if (!userId) {
		return c.json({ success: false, error: 'Unauthorized' }, 401)
	}
	const db = getDb()
	let conversationId = existingId

	const lastUserMsg = [...uiMessages].reverse().find((m: any) => m.role === 'user')
	const title = (lastUserMsg?.parts?.[0]?.text ?? 'New Chat').slice(0, 50)

	// If client provided a conversationId, verify it exists and is owned by the user.
	if (conversationId) {
		const [conv] = await db
			.select({ id: conversations.id, userId: conversations.userId })
			.from(conversations)
			.where(eq(conversations.id, conversationId))
			.limit(1)
		if (!conv || conv.userId !== userId) {
			logger.warn(
				`[ai] stale or unauthorized conversationId="${conversationId}" for userId="${userId}", creating new conversation`
			)
			conversationId = null
		}
	}

	if (!conversationId) {
		conversationId = crypto.randomUUID()
		await db.insert(conversations).values({
			id: conversationId,
			userId,
			title,
		})
	}

	if (conversationId) {
		if (lastUserMsg?.id && lastUserMsg?.parts?.[0]?.text) {
			const [existing] = await db
				.select({ id: messages.id })
				.from(messages)
				.where(eq(messages.id, lastUserMsg.id))
				.limit(1)
			if (!existing) {
				// Persist user message; tolerate FK violations (deleted/stale conversation).
				try {
					await db.insert(messages).values({
						id: lastUserMsg.id,
						conversationId,
						role: 'user',
						content: lastUserMsg.parts[0].text,
					})
				} catch (e: any) {
					// 23503 = foreign key violation (conversation deleted or missing)
					if (e?.cause?.code === '23503' || e?.code === '23503') {
						logger.warn(
							`[ai] FK violation persisting user message; creating fresh conversation. staleConversationId="${conversationId}" userId="${userId}"`
						)
						conversationId = crypto.randomUUID()
						await db.insert(conversations).values({
							id: conversationId,
							userId,
							title,
						})
						await db.insert(messages).values({
							id: lastUserMsg.id,
							conversationId,
							role: 'user',
							content: lastUserMsg.parts[0].text,
						})
					} else {
						throw e
					}
				}
			}
		}
	}

	const effectiveModelId = resolveModelId(modelId)
	if (effectiveModelId !== modelId) {
		logger.warn(`[ai] requested model "${modelId}" unavailable; using "${effectiveModelId}"`)
	}

	const result = streamText({
		model: getModel(effectiveModelId),
		messages: await convertToModelMessages(uiMessages),
		system: SYSTEM_PROMPT,
		onError: ({ error }) => {
			logger.error(
				`[ai] stream error — requestedModel="${modelId}" effectiveModel="${effectiveModelId}" msgCount=${uiMessages?.length ?? 0} conversationId=${conversationId ?? '-'}`
			)
			if (error instanceof Error) {
				logger.error(`${error.name}: ${error.message}`)
				if (error.stack) logger.error(error.stack)
			} else {
				logger.error(String(error))
			}
		},
		onFinish: async ({ text }) => {
			if (!conversationId || !text) return
			try {
				const assistantMsgId = crypto.randomUUID()
				await db.insert(messages).values({
					id: assistantMsgId,
					conversationId,
					role: 'assistant',
					content: text,
				})
				await db.update(conversations)
					.set({ updatedAt: new Date() })
					.where(eq(conversations.id, conversationId))
			} catch (e) {
				logger.error(`[ai] failed to persist assistant message for conversation ${conversationId}:`)
				logger.error(e instanceof Error ? e.message : String(e))
			}
		},
	})

	return result.toUIMessageStreamResponse({
		headers: conversationId
			? { 'X-Conversation-Id': conversationId, 'X-Effective-Model-Id': effectiveModelId }
			: { 'X-Effective-Model-Id': effectiveModelId },
		onError: (error) => error instanceof Error ? error.message : String(error),
	})
})

export default app
