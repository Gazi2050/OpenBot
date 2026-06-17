<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import * as SidebarPrimitive from '$lib/components/ui/sidebar/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { chatState } from '$lib/hooks/chat.svelte.js';
	import { conversationsState } from '$lib/hooks/conversations.svelte.js';
	import Share from '@lucide/svelte/icons/share';
	import Trash2 from '@lucide/svelte/icons/trash-2';

	async function handleDelete() {
		const id = conversationsState.currentId;
		if (!id) return;
		const isViewingDeletedChat = $page.params.id === id;
		await conversationsState.remove(id);
		if (isViewingDeletedChat) {
			chatState.newConversation();
			await goto('/');
		}
	}
</script>

<header
	class="flex h-16 items-center justify-between border-b border-solid border-hairline px-4"
	style="border-bottom: 1px solid rgba(255, 255, 255, 0.08)"
>
	<SidebarPrimitive.Trigger
		class="-ml-1 rounded-lg text-icon-default hover:bg-surface-card [&_svg]:size-5"
	/>
	<div class="flex items-center gap-2">
		{#if conversationsState.currentId}
			<Button
				variant="ghost"
				class="h-9 gap-2 rounded-lg border border-hairline bg-surface-elevated px-3 text-sm text-icon-default hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
				onclick={handleDelete}
				aria-label="Delete chat"
			>
				<Trash2 class="size-4" />
				Delete
			</Button>
		{/if}
		<Button
			variant="ghost"
			class="h-9 gap-2 rounded-lg border border-hairline bg-surface-elevated px-3.5 text-sm font-semibold text-ink hover:bg-surface-card"
			style="background-color: #2a2a2a"
		>
			<Share class="size-4 text-icon-default" />
			Share
		</Button>
	</div>
</header>
