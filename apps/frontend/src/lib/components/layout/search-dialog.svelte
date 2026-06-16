<script lang="ts">
	import { goto } from '$app/navigation'
	import * as Command from '$lib/components/ui/command/index.js';
	import { conversationsState } from '$lib/hooks/conversations.svelte.js';
	import MessageSquare from '@lucide/svelte/icons/message-square';

	let { open = $bindable(false) } = $props();
	let search = $state('');

	let filtered = $derived(
		search
			? conversationsState.conversations.filter((c) =>
					c.title.toLowerCase().includes(search.toLowerCase())
				)
			: conversationsState.conversations
	);

	function onSelect(id: string) {
		open = false;
		goto('/c/' + id);
	}
</script>

<Command.Dialog bind:open>
	<Command.Input bind:value={search} placeholder="Search chats..." />
	<Command.List>
		<Command.Empty>No chats found.</Command.Empty>
		<Command.Group heading="Chats">
			{#each filtered as conv (conv.id)}
				<Command.Item onselect={() => onSelect(conv.id)}>
					<MessageSquare class="me-2 size-4" />
					<span>{conv.title}</span>
				</Command.Item>
			{/each}
		</Command.Group>
	</Command.List>
</Command.Dialog>
