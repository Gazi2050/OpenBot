<script lang="ts">
	import { page } from '$app/stores';
	import ChatPage from '$lib/components/chat/chat-page.svelte';
	import { chatState } from '$lib/hooks/chat.svelte.js';
	import { conversationsState } from '$lib/hooks/conversations.svelte.js';
	import type { Message } from '@openbot/shared';

	let conversationId = $derived($page.params.id);

	$effect(() => {
		const id = conversationId;
		if (!id) return;
		if (conversationsState.currentId === id) return;

		const status = chatState.chat.status;
		if (
			(status === 'submitted' || status === 'streaming') &&
			conversationsState.currentId
		) {
			return;
		}

		chatState.clearChat();

		let loadId = id;

		async function load() {
			const res = await fetch(`/api/conversations/${id}`);
			const json = await res.json();
			if (loadId !== conversationId) return;
			if (!json.success) return;
			const msgs = json.data.messages as Message[];
			const uiMessages = msgs.map((m: Message) => ({
				id: m.id,
				role: m.role as 'user' | 'assistant',
				parts: [{ type: 'text' as const, text: m.content }],
			}));
			chatState.replaceChat(uiMessages, id as string);
		}

		load();

		return () => {
			loadId = '';
		};
	});
</script>

<ChatPage />
