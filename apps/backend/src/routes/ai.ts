import { Hono } from 'hono'
import { getAuth } from '@clerk/hono'
import { streamText, convertToModelMessages } from 'ai'
import type { ApiResponse } from '@openbot/shared'
import { getModel, resolveModelId, DEFAULT_MODEL, availableModelIds } from '../lib/ai/index.js'
import { SYSTEM_PROMPT } from '@openbot/shared'
import { logger } from '@openbot/shared'
import { getDb } from '../db/index.js'
import { DEFAULT_CONVERSATION_TITLE, TITLE_MAX_LENGTH, ERROR_UNAUTHORIZED } from '../lib/constants.js'
import { ensureConversation, persistUserMessage } from '../lib/chat/conversations.js'
import { persistAssistantMessage } from '../lib/chat/persistence.js'

const app = new Hono()

app.get('/models', (c) => {
	return c.json<ApiResponse<{ defaultModelId: string; enabledModelIds: string[] }>>({
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
		return Response.json({ success: false, error: ERROR_UNAUTHORIZED }, { status: 401 })
	}
	const db = getDb()

	const lastUserMsg = [...uiMessages].reverse().find((m: any) => m.role === 'user')
	const title = (lastUserMsg?.parts?.[0]?.text ?? DEFAULT_CONVERSATION_TITLE).slice(0, TITLE_MAX_LENGTH)

	let { conversationId } = await ensureConversation(db, userId, existingId, title)

	if (lastUserMsg?.id && lastUserMsg?.parts?.[0]?.text) {
		conversationId = await persistUserMessage(
			db,
			conversationId,
			lastUserMsg.id,
			lastUserMsg.parts[0].text,
			userId,
			title
		)
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
			await persistAssistantMessage(db, conversationId, text)
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
