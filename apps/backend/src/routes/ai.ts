import { Hono } from 'hono'
import { getAuth } from '@clerk/hono'
import { streamText, convertToModelMessages } from 'ai'
import { eq } from 'drizzle-orm'
import { getModel, DEFAULT_MODEL } from '../lib/ai/providers.js'
import { SYSTEM_PROMPT } from 'openbot-sdk'
import { logger } from '@openbot/shared'
import { getDb } from '../db/index.js'
import { conversations, messages } from '../db/schema/index.js'

const app = new Hono()

app.post('/chat', async (c) => {
	const { messages: uiMessages, model: modelId = DEFAULT_MODEL, conversationId: existingId } = await c.req.json()

	const { userId } = getAuth(c)
	const db = getDb()
	let conversationId = existingId

	if (!conversationId && userId) {
		conversationId = crypto.randomUUID()
		const lastUserMsg = [...uiMessages].reverse().find((m: any) => m.role === 'user')
		const title = (lastUserMsg?.parts?.[0]?.text ?? 'New Chat').slice(0, 50)

		await db.insert(conversations).values({
			id: conversationId,
			userId,
			title,
		})
	}

	if (conversationId) {
		const lastUserMsg = [...uiMessages].reverse().find((m: any) => m.role === 'user')
		if (lastUserMsg?.id && lastUserMsg?.parts?.[0]?.text) {
			const [existing] = await db
				.select({ id: messages.id })
				.from(messages)
				.where(eq(messages.id, lastUserMsg.id))
				.limit(1)
			if (!existing) {
				await db.insert(messages).values({
					id: lastUserMsg.id,
					conversationId,
					role: 'user',
					content: lastUserMsg.parts[0].text,
				})
			}
		}
	}

	const result = streamText({
		model: getModel(modelId),
		messages: await convertToModelMessages(uiMessages),
		system: SYSTEM_PROMPT,
		onError: ({ error }) => {
			logger.error(`[ai] stream error — model="${modelId}" msgCount=${uiMessages?.length ?? 0} conversationId=${conversationId ?? '-'}`)
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
		headers: conversationId ? { 'X-Conversation-Id': conversationId } : undefined,
		onError: (error) => error instanceof Error ? error.message : String(error),
	})
})

export default app
