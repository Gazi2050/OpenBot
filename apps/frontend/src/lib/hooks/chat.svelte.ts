import { browser } from '$app/environment'
import { replaceState } from '$app/navigation'
import { models } from 'openbot-sdk'
import { createChat } from 'openbot-sdk/chat'
import type { Chat } from '@ai-sdk/svelte'
import type { UIMessage } from 'ai'
import { conversationsState } from './conversations.svelte.js'

let model = $state(models[0].id)

function titleFromChat(chat: Chat<UIMessage>) {
	const lastUser = [...chat.messages].reverse().find((m) => m.role === 'user')
	const text = lastUser?.parts?.find((p) => p.type === 'text')
	return (text && 'text' in text ? text.text : undefined)?.slice(0, 50) ?? 'New Chat'
}

function createChatInstance(initialMessages?: UIMessage[]) {
	const chat = createChat({
		api: '/api/ai/chat',
		getBody: () => {
			const body: Record<string, unknown> = { model }
			if (conversationsState.currentId) {
				body.conversationId = conversationsState.currentId
			}
			return body
		},
		initialMessages,
		onResponse: (res: Response) => {
			const cid = res.headers.get('X-Conversation-Id')
			if (!cid || conversationsState.currentId) return
			conversationsState.currentId = cid
			conversationsState.prependConversation(cid, titleFromChat(chat))
			if (browser && window.location.pathname === '/') {
				replaceState('/c/' + cid, {})
			}
		},
	})
	return chat
}

let _chat = $state(createChatInstance())

export const chatState = {
	get chat() {
		return _chat
	},
	get model() {
		return model
	},
	setModel: (m: string) => {
		model = m
	},

	newConversation() {
		conversationsState.currentId = null
		_chat = createChatInstance()
	},

	clearChat() {
		_chat = createChatInstance()
	},

	replaceChat(initialMessages: UIMessage[], conversationId: string) {
		conversationsState.currentId = conversationId
		_chat = createChatInstance(initialMessages)
	},
}
