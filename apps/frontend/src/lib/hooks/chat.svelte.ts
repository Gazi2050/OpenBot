import { browser } from '$app/environment';
import { replaceState } from '$app/navigation';
import { models } from 'openbot-sdk';
import { createChat } from 'openbot-sdk/chat';
import type { Chat } from '@ai-sdk/svelte';
import type { UIMessage } from 'ai';
import { conversationsState } from './conversations.svelte.js';

let model = $state(models[0].id);
let enabledModelIds = $state<string[] | null>(null);

function titleFromChat(chat: Chat<UIMessage>) {
	const lastUser = [...chat.messages].reverse().find((m) => m.role === 'user');
	const text = lastUser?.parts?.find((p) => p.type === 'text');
	return (text && 'text' in text ? text.text : undefined)?.slice(0, 50) ?? 'New Chat';
}

async function syncModelAvailability(): Promise<void> {
	try {
		const res = await fetch('/api/ai/models');
		if (!res.ok) return;
		const json = await res.json();
		if (!json?.success || !json?.data) return;
		const { defaultModelId, enabledModelIds: enabled } = json.data as {
			defaultModelId: string;
			enabledModelIds: string[];
		};
		if (Array.isArray(enabled)) {
			enabledModelIds = enabled;
			if (!enabled.includes(model) && typeof defaultModelId === 'string') {
				model = defaultModelId;
			}
		}
	} catch {
		// ignore; backend will fallback if needed
	}
}

if (browser) {
	// One-time best-effort hydration; keeps UI selection aligned with backend.
	void syncModelAvailability();
}

function createChatInstance(initialMessages?: UIMessage[]) {
	const chat = createChat({
		api: '/api/ai/chat',
		getBody: () => {
			const body: Record<string, unknown> = { model };
			if (conversationsState.currentId) {
				body.conversationId = conversationsState.currentId;
			}
			return body;
		},
		initialMessages,
		onResponse: (res: Response) => {
			const cid = res.headers.get('X-Conversation-Id');
			if (!cid) return;
			if (conversationsState.currentId !== cid) {
				conversationsState.setCurrentId(cid);
			}
			conversationsState.prependConversation(cid, titleFromChat(chat));
			if (browser && window.location.pathname === '/') {
				replaceState('/c/' + cid, {});
			}
		}
	});
	return chat;
}

let _chat = $state(createChatInstance());

export const chatState = {
	get chat() {
		return _chat;
	},
	get model() {
		return model;
	},
	get enabledModelIds() {
		return enabledModelIds;
	},
	setModel: (m: string) => {
		model = m;
	},

	newConversation() {
		conversationsState.setCurrentId(null);
		_chat = createChatInstance();
	},

	clearChat() {
		_chat = createChatInstance();
	},

	replaceChat(initialMessages: UIMessage[], conversationId: string) {
		conversationsState.setCurrentId(conversationId);
		_chat = createChatInstance(initialMessages);
	}
};
