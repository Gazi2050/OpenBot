export type ModelProvider = 'google' | 'groq' | 'ollama'

export interface Model {
	id: string
	label: string
	provider: ModelProvider
}

export const models: readonly Model[] = [
	{ id: 'gemma-4-31b-it', label: 'Gemma 4', provider: 'google' },
	{ id: 'gemini-3.1-flash-lite', label: 'Gemini 3.1 Flash Lite', provider: 'google' },
	{ id: 'llama-3.1-8b-instant', label: 'Llama 3.1', provider: 'groq' },
	{ id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B', provider: 'groq' },
	{ id: 'gpt-oss:20b', label: 'GPT-OSS 20B', provider: 'ollama' },
	{ id: 'minimax-m3', label: 'MiniMax M3', provider: 'ollama' },
] as const
