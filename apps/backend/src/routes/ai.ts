import { Hono } from 'hono'
import { streamText, convertToModelMessages } from 'ai'
import { getModel, DEFAULT_MODEL } from '../lib/ai/providers.js'
import { SYSTEM_PROMPT } from 'openbot-sdk'

const app = new Hono()

app.post('/chat', async (c) => {
	const { messages, model: modelId = DEFAULT_MODEL } = await c.req.json()
	const result = streamText({
		model: getModel(modelId),
		messages: await convertToModelMessages(messages),
		system: SYSTEM_PROMPT,
	})
	return result.toUIMessageStreamResponse()
})

export default app
