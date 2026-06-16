import type { ApiResponse, Bot, Conversation, Message } from '@openbot/shared'
import { API_PATHS } from './config/constants.js'

export type { ApiResponse, Bot, Conversation, Message }

export class OpenBotClient {
	private baseUrl: string

	constructor(options: { baseUrl: string }) {
		this.baseUrl = options.baseUrl.replace(/\/$/, '')
	}

	private async request<T>(path: string): Promise<ApiResponse<T>> {
		const res = await fetch(`${this.baseUrl}${path}`)
		return res.json()
	}

	private async requestWithBody<T>(path: string, body: object, method = 'POST'): Promise<ApiResponse<T>> {
		const res = await fetch(`${this.baseUrl}${path}`, {
			method,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		})
		return res.json()
	}

	async health() {
		return this.request<{ status: string }>(API_PATHS.HEALTH)
	}

	async getBots() {
		return this.request<Bot[]>('/bots')
	}

	async getConversations() {
		return this.request<Conversation[]>(API_PATHS.CONVERSATIONS)
	}

	async getConversation(id: string) {
		return this.request<{ conversation: Conversation; messages: Message[] }>(
			`${API_PATHS.CONVERSATIONS}/${id}`
		)
	}

	async createConversation(title?: string) {
		return this.requestWithBody<Conversation>(API_PATHS.CONVERSATIONS, { title })
	}

	async deleteConversation(id: string) {
		const res = await fetch(`${this.baseUrl}${API_PATHS.CONVERSATIONS}/${id}`, {
			method: 'DELETE',
		})
		return res.json()
	}
}
