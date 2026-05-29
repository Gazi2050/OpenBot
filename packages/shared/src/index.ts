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
