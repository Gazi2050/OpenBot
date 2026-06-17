import { Chat } from '@ai-sdk/svelte'
import { DefaultChatTransport } from 'ai'
import type { UIMessage } from 'ai'

export interface CreateChatOptions {
	api: string
	getBody?: () => Record<string, unknown>
	initialMessages?: UIMessage[]
	onResponse?: (response: Response) => void
}

export function createChat(opts: CreateChatOptions): Chat {
	return new Chat({
		transport: new DefaultChatTransport({
			api: opts.api,
			body: opts.getBody,
			fetch: opts.onResponse
				? async (url, init) => {
						const response = await fetch(url, init)
						opts.onResponse!(response)
						return response
					}
				: undefined,
		}),
		messages: opts.initialMessages,
	})
}
