import { goto } from '$app/navigation'
import type { Conversation, Message } from '@openbot/shared'

class ConversationsState {
	conversations = $state<Conversation[]>([])
	loading = $state(false)
	error = $state<string | null>(null)
	currentId = $state<string | null>(null)
	private fetchPromise: Promise<void> | null = null

	async fetch() {
		if (this.fetchPromise) return this.fetchPromise
		this.fetchPromise = this.doFetch().finally(() => {
			this.fetchPromise = null
		})
		return this.fetchPromise
	}

	private async doFetch() {
		this.loading = true
		this.error = null
		try {
			const res = await fetch('/api/conversations')
			if (!res.ok) throw new Error('Failed to fetch conversations')
			const json = await res.json()
			if (!json.success) throw new Error(json.error)
			this.conversations = json.data
		} catch (e) {
			this.error = e instanceof Error ? e.message : 'Unknown error'
		} finally {
			this.loading = false
		}
	}

	prependConversation(id: string, title: string) {
		if (this.conversations.some((c) => c.id === id)) return
		const now = new Date()
		const conv: Conversation = {
			id,
			userId: '',
			title: title.slice(0, 50) || 'New Chat',
			createdAt: now,
			updatedAt: now,
		}
		this.conversations = [conv, ...this.conversations]
	}

	async create(title?: string): Promise<string | null> {
		try {
			const res = await fetch('/api/conversations', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ title }),
			})
			const json = await res.json()
			if (!json.success) throw new Error(json.error)
			this.conversations = [json.data, ...this.conversations]
			this.currentId = json.data.id
			return json.data.id
		} catch (e) {
			this.error = e instanceof Error ? e.message : 'Unknown error'
			return null
		}
	}

	async loadConversation(id: string): Promise<Message[]> {
		try {
			const res = await fetch(`/api/conversations/${id}`)
			const json = await res.json()
			if (!json.success) throw new Error(json.error)
			this.currentId = id
			return json.data.messages
		} catch (e) {
			this.error = e instanceof Error ? e.message : 'Unknown error'
			return []
		}
	}

	async remove(id: string) {
		try {
			const res = await fetch(`/api/conversations/${id}`, { method: 'DELETE' })
			const json = await res.json()
			if (!json.success) throw new Error(json.error)
			this.conversations = this.conversations.filter((c) => c.id !== id)
			if (this.currentId === id) {
				this.currentId = null
				goto('/')
			}
		} catch (e) {
			this.error = e instanceof Error ? e.message : 'Unknown error'
		}
	}
}

export const conversationsState = new ConversationsState()
