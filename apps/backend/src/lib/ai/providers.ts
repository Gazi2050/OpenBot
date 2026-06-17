import { google } from '@ai-sdk/google'
import { groq } from '@ai-sdk/groq'
import { createOllama } from 'ollama-ai-provider-v2'
import type { LanguageModel } from 'ai'
import { models } from 'openbot-sdk'
import { logger } from '@openbot/shared'

const ollama = createOllama({
	baseURL: 'https://ollama.com/api',
	headers: process.env.OLLAMA_API_KEY
		? { Authorization: `Bearer ${process.env.OLLAMA_API_KEY}` }
		: undefined,
})

const hasKey: Record<string, boolean> = {
	google: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
	groq: !!process.env.GROQ_API_KEY,
	ollama: !!process.env.OLLAMA_API_KEY,
}

const providers: Record<string, LanguageModel> = {}
for (const m of models) {
	if (!hasKey[m.provider]) continue
	if (m.provider === 'google') providers[m.id] = google(m.id)
	else if (m.provider === 'groq') providers[m.id] = groq(m.id)
	else if (m.provider === 'ollama') providers[m.id] = ollama(m.id)
}

const availableIds = Object.keys(providers)

if (availableIds.length === 0) {
	throw new Error(
		'No AI providers loaded. Set at least one of GOOGLE_GENERATIVE_AI_API_KEY, GROQ_API_KEY, or OLLAMA_API_KEY in the repo root .env.'
	)
}

export const DEFAULT_MODEL = availableIds[0]
export const availableModelIds = availableIds

export function resolveModelId(modelId: string): string {
	return providers[modelId] ? modelId : DEFAULT_MODEL
}

export function getModel(modelId: string): LanguageModel {
	const provider = providers[modelId]
	if (!provider) {
		logger.warn(`Unknown or unavailable model "${modelId}", falling back to ${DEFAULT_MODEL}`)
		return providers[DEFAULT_MODEL]
	}
	return provider
}
