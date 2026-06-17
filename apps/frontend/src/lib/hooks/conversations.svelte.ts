import { browser } from '$app/environment';
import type { Conversation, Message } from '@openbot/shared';

const ACTIVE_CONVERSATION_KEY = 'openbot.activeConversationId';

class ConversationsState {
	conversations = $state<Conversation[]>([]);
	loading = $state(false);
	hydrated = $state(false);
	error = $state<string | null>(null);
	currentId = $state<string | null>(null);
	private fetchPromise: Promise<void> | null = null;

	constructor() {
		if (!browser) return;
		const stored = sessionStorage.getItem(ACTIVE_CONVERSATION_KEY);
		if (stored) {
			this.currentId = stored;
		}
	}

	setCurrentId(id: string | null) {
		this.currentId = id;
		if (!browser) return;
		if (id) {
			sessionStorage.setItem(ACTIVE_CONVERSATION_KEY, id);
		} else {
			sessionStorage.removeItem(ACTIVE_CONVERSATION_KEY);
		}
	}

	hydrate(initial: Conversation[]) {
		if (this.hydrated) return;
		this.conversations = initial;
		this.hydrated = true;
	}

	async fetch() {
		if (this.fetchPromise) return this.fetchPromise;
		this.fetchPromise = this.doFetch().finally(() => {
			this.fetchPromise = null;
		});
		return this.fetchPromise;
	}

	private async doFetch(retries = 1): Promise<void> {
		this.loading = true;
		this.error = null;
		try {
			const res = await fetch('/api/conversations');
			if (res.status === 401 && retries > 0) {
				await new Promise((r) => setTimeout(r, 300));
				return this.doFetch(retries - 1);
			}
			if (!res.ok) throw new Error('Failed to fetch conversations');
			const json = await res.json();
			if (!json.success) throw new Error(json.error);
			this.conversations = json.data;
			this.hydrated = true;
		} catch (e) {
			this.error = e instanceof Error ? e.message : 'Unknown error';
		} finally {
			this.loading = false;
		}
	}

	prependConversation(id: string, title: string) {
		if (this.conversations.some((c) => c.id === id)) return;
		const now = new Date();
		const conv: Conversation = {
			id,
			userId: '',
			title: title.slice(0, 50) || 'New Chat',
			createdAt: now,
			updatedAt: now
		};
		this.conversations = [conv, ...this.conversations];
	}

	async create(title?: string): Promise<string | null> {
		try {
			const res = await fetch('/api/conversations', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ title })
			});
			const json = await res.json();
			if (!json.success) throw new Error(json.error);
			this.conversations = [json.data, ...this.conversations];
			this.setCurrentId(json.data.id);
			return json.data.id;
		} catch (e) {
			this.error = e instanceof Error ? e.message : 'Unknown error';
			return null;
		}
	}

	async loadConversation(id: string): Promise<Message[]> {
		try {
			const res = await fetch(`/api/conversations/${id}`);
			const json = await res.json();
			if (!json.success) throw new Error(json.error);
			this.setCurrentId(id);
			return json.data.messages;
		} catch (e) {
			this.error = e instanceof Error ? e.message : 'Unknown error';
			return [];
		}
	}

	async remove(id: string) {
		try {
			const res = await fetch(`/api/conversations/${id}`, { method: 'DELETE' });
			const json = await res.json();
			if (!json.success) throw new Error(json.error);
			this.conversations = this.conversations.filter((c) => c.id !== id);
			if (this.currentId === id) {
				this.setCurrentId(null);
			}
		} catch (e) {
			this.error = e instanceof Error ? e.message : 'Unknown error';
		}
	}
}

export const conversationsState = new ConversationsState();
