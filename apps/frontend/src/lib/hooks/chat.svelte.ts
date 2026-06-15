import { Chat } from '@ai-sdk/svelte'
import { DefaultChatTransport } from 'ai'

let model = $state('gemma-4-31b')

const _chat = new Chat({
	transport: new DefaultChatTransport({
		api: '/api/ai/chat',
		get body() {
			return { model }
		},
	}),
})

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
}
