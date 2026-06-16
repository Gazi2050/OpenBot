import { models } from 'openbot-sdk'
import { createChat } from 'openbot-sdk/chat'

let model = $state(models[0].id)

const _chat = createChat({
	api: '/api/ai/chat',
	getBody: () => ({ model }),
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
