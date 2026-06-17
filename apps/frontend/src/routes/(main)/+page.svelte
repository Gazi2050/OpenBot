<script lang="ts">
	import { onMount } from 'svelte';
	import ChatPage from '$lib/components/chat/chat-page.svelte';
	import { chatState } from '$lib/hooks/chat.svelte.js';
	import { conversationsState } from '$lib/hooks/conversations.svelte.js';

	onMount(() => {
		if (window.location.pathname !== '/') return;
		const status = chatState.chat.status;
		if (status === 'submitted' || status === 'streaming') return;
		if (!conversationsState.currentId && chatState.chat.messages.length === 0) return;
		chatState.newConversation();
	});
</script>

<ChatPage />
