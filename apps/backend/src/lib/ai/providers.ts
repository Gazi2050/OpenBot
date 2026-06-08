import { google } from '@ai-sdk/google'
import { groq } from '@ai-sdk/groq'
import type { LanguageModel } from 'ai'
import { models, DEFAULT_MODEL } from './models.js'

const providers: Record<string, LanguageModel> = {}
for (const m of models) {
	providers[m.id] = m.provider === 'google' ? google(m.id) : groq(m.id)
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
