export type ModelProvider = 'google' | 'groq' | 'ollama'

export interface Model {
	id: string
	label: string
	provider: ModelProvider
}

export const models: readonly Model[] = [
	{ id: 'gemini-3.1-flash-lite', label: 'Gemini 3.1', provider: 'google' },
	{ id: 'gemini-3.5-flash', label: 'Gemini 3.5', provider: 'google' },
	{ id: 'llama-3.1-8b-instant', label: 'Llama 3.1', provider: 'groq' },
	{ id: 'llama-3.3-70b-versatile', label: 'Llama 3.3', provider: 'groq' },
	{ id: 'gpt-oss:120b-cloud', label: 'GPT-OSS', provider: 'ollama' },
	{ id: 'minimax-m3:cloud', label: 'MiniMax M3', provider: 'ollama' },
] as const
