export * from './logger.js'
export { models, type Model, type ModelProvider } from './models.js'
export { SYSTEM_PROMPT } from './system-prompt.js'

export interface ApiResponse<T> {
	success: boolean
	data: T
	error?: string
}

export interface Conversation {
	id: string
	userId: string
	title: string
	createdAt: Date
	updatedAt: Date
}

export interface Message {
	id: string
	conversationId: string
	role: 'user' | 'assistant'
	content: string
	createdAt: Date
}
