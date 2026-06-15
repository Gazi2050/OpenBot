import { google } from '@ai-sdk/google'
import { groq } from '@ai-sdk/groq'
import { createOllama } from 'ollama-ai-provider-v2'
import type { LanguageModel } from 'ai'
import { models, DEFAULT_MODEL } from './models.js'

const ollama = createOllama({
	baseURL: 'https://ollama.com/api',
	headers: process.env.OLLAMA_API_KEY
		? { Authorization: `Bearer ${process.env.OLLAMA_API_KEY}` }
		: undefined,
})

const providers: Record<string, LanguageModel> = {}
for (const m of models) {
	if (m.provider === 'google') providers[m.id] = google(m.id)
	else if (m.provider === 'groq') providers[m.id] = groq(m.id)
	else if (m.provider === 'ollama') providers[m.id] = ollama(m.id)
}

export { DEFAULT_MODEL }

export function getModel(modelId: string): LanguageModel {
	const provider = providers[modelId]
	if (!provider) {
		console.warn(`Unknown model "${modelId}", falling back to ${DEFAULT_MODEL}`)
		return providers[DEFAULT_MODEL]
	}
	return provider
}
