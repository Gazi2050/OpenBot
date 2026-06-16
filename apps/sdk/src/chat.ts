import { Chat } from '@ai-sdk/svelte'
import { DefaultChatTransport } from 'ai'

export interface CreateChatOptions {
	api: string
	getBody?: () => Record<string, unknown>
}

export function createChat(opts: CreateChatOptions): Chat {
	return new Chat({
		transport: new DefaultChatTransport({
			api: opts.api,
			get body() {
				return opts.getBody?.() ?? {}
			},
		}),
	})
}
