export * from './logger.js'

export interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
}

export interface Bot {
  id: string
  name: string
  status: BotStatus
  createdAt: Date
  updatedAt: Date
}

export type BotStatus = 'online' | 'offline' | 'maintenance'

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
