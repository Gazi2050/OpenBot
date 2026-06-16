import type { ApiResponse, Bot, BotStatus } from '@openbot/shared'
import { API_PATHS } from './config/constants.js'

export type { ApiResponse, Bot, BotStatus }

export class OpenBotClient {
	private baseUrl: string

	constructor(options: { baseUrl: string }) {
		this.baseUrl = options.baseUrl.replace(/\/$/, '')
	}

	private async request<T>(path: string): Promise<ApiResponse<T>> {
		const res = await fetch(`${this.baseUrl}${path}`)
		return res.json()
	}

	async health() {
		return this.request<{ status: string }>(API_PATHS.HEALTH)
	}

	async getBots() {
		return this.request<Bot[]>('/bots')
	}
}
