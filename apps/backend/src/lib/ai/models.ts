export const models = [
	// Google / Gemma
	{ id: 'gemma-4-31b', label: 'Gemma 4 31B', provider: 'google' },
	{ id: 'gemini-3.5-flash', label: 'Gemini 3.5 Flash', provider: 'google' },
	{ id: 'gemini-3.1-flash-lite', label: 'Gemini 3.1 Flash Lite', provider: 'google' },
	{ id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro', provider: 'google' },
	// Groq
	{ id: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B Instant', provider: 'groq' },
	{ id: 'meta-llama/llama-prompt-guard-2-22m', label: 'Prompt Guard 2 22M', provider: 'groq' },
	{ id: 'meta-llama/llama-prompt-guard-2-86m', label: 'Prompt Guard 2 86M', provider: 'groq' },
] as const

export const DEFAULT_MODEL = 'gemma-4-31b'
