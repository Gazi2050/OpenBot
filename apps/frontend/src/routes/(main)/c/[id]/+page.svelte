<script lang="ts">
	import ChatPage from '$lib/components/chat/chat-page.svelte';
	import { chatState } from '$lib/hooks/chat.svelte.js';
	import { conversationsState } from '$lib/hooks/conversations.svelte.js';
	import type { Message } from '@openbot/shared';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function toUIMessages(msgs: Message[]) {
		return msgs.map((m) => ({
			id: m.id,
			role: m.role as 'user' | 'assistant',
			parts: [{ type: 'text' as const, text: m.content }]
		}));
	}

	let loadedId = $state<string | null>(null);

	$effect(() => {
		const id = data.conversation.id;
		if (!id) return;
		if (conversationsState.currentId === id) return;
		conversationsState.setCurrentId(id);
	});

	$effect(() => {
		const id = data.conversation.id;
		if (!id) return;
		if (loadedId === id) return;

		const status = chatState.chat.status;
		if (
			(status === 'submitted' || status === 'streaming') &&
			conversationsState.currentId &&
			conversationsState.currentId !== id
		) {
			return;
		}

		chatState.replaceChat(toUIMessages(data.messages), id);
		loadedId = id;
	});
</script>

<ChatPage />
