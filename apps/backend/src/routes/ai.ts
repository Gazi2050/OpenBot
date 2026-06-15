import { Hono } from 'hono'
import { streamText, generateText, convertToModelMessages } from 'ai'
import { getModel, DEFAULT_MODEL } from '../lib/ai/providers.js'

const app = new Hono()

app.post('/chat', async (c) => {
	const { messages, model: modelId = DEFAULT_MODEL } = await c.req.json()
	const model = getModel(modelId)
	const systemMessage = {
		role: 'system' as const,
		content:
			'You are OpenBot, a helpful AI assistant. Respond in well-formatted markdown. Use code blocks with language tags, lists, tables, and mermaid diagrams when appropriate. Do not wrap your response in JSON. Use proper markdown: **bold**, `inline code`, ```code blocks```, ```mermaid diagrams```, > blockquotes.',
	}
	const result = streamText({
		model,
		messages: [systemMessage, ...(await convertToModelMessages(messages))],
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
