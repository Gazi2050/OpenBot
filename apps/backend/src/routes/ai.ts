import { Hono } from 'hono'
import { streamText, generateText, convertToModelMessages } from 'ai'
import { getModel, DEFAULT_MODEL } from '../lib/ai/providers.js'

const app = new Hono()

app.post('/chat', async (c) => {
	const { messages, model: modelId = DEFAULT_MODEL } = await c.req.json()
	const model = getModel(modelId)
	const result = streamText({
		model,
		messages: await convertToModelMessages(messages),
	})
	return result.toUIMessageStreamResponse()
})

app.post('/chat/sync', async (c) => {
	const { messages, model: modelId = DEFAULT_MODEL } = await c.req.json()
	const model = getModel(modelId)
	const result = await generateText({
		model,
		messages: await convertToModelMessages(messages),
	})
	return c.json({ text: result.text })
})

export default app
