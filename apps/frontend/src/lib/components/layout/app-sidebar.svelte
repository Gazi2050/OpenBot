<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import SearchDialog from './search-dialog.svelte';
	import ProfilePopover from './profile-popover.svelte';
	import { useSidebar } from '$lib/components/ui/sidebar/context.svelte.js';
	import { useClerkContext } from 'svelte-clerk/client';
	import { chatState } from '$lib/hooks/chat.svelte.js';
	import { conversationsState } from '$lib/hooks/conversations.svelte.js';
	import type { Conversation } from '@openbot/shared';
	import Bot from '@lucide/svelte/icons/bot';
	import Search from '@lucide/svelte/icons/search';
	import PlusCircle from '@lucide/svelte/icons/plus-circle';
	import MessageSquare from '@lucide/svelte/icons/message-square';
	import LogIn from '@lucide/svelte/icons/log-in';
	import Trash2 from '@lucide/svelte/icons/trash-2';

	const sidebar = useSidebar();
	let searchOpen = $state(false);

	const ctx = useClerkContext();
	const isLoaded = $derived(ctx.auth.userId !== undefined);
	const isSignedIn = $derived(ctx.auth.userId !== null && ctx.auth.userId !== undefined);
	const userName = $derived(ctx.user?.fullName ?? ctx.user?.username ?? 'User');
	const userEmail = $derived(ctx.user?.emailAddresses?.[0]?.emailAddress ?? '');
	const userAvatar = $derived(ctx.user?.imageUrl ?? '');

	let layoutConversations = $derived<Conversation[]>(
		($page.data.conversations as Conversation[] | undefined) ?? []
	);

	$effect(() => {
		conversationsState.hydrate(layoutConversations);
	});

	let currentChatId = $derived($page.params.id ?? conversationsState.currentId);

	function handleNewChat() {
		sidebar.setOpenMobile(false);
		chatState.newConversation();
		goto('/');
	}

	function handleSelectChat(id: string) {
		sidebar.setOpenMobile(false);
		goto('/c/' + id);
	}

	async function handleDeleteChat(id: string, e: MouseEvent | KeyboardEvent) {
		e.stopPropagation();
		const isViewing = window.location.pathname === `/c/${id}`;
		await conversationsState.remove(id);
		if (isViewing) {
			chatState.newConversation();
			await goto('/');
		}
	}

	$effect(() => {
		if (isSignedIn && !conversationsState.hydrated) {
			conversationsState.fetch();
		}
	});

	onMount(() => {
		if (!conversationsState.hydrated) {
			conversationsState.fetch();
		}
	});
</script>

<Sidebar.Root collapsible="offcanvas" side="left" variant="sidebar">
	<Sidebar.Header class="p-4">
		<div class="flex items-center justify-center gap-3">
			<Bot class="size-7 text-ink" />
			<span class="text-lg font-semibold text-ink">OpenBot</span>
		</div>
	</Sidebar.Header>

	<Sidebar.Content class="px-4">
		<button
			class="mb-3 flex h-10 w-full items-center gap-3 rounded-md border border-hairline bg-surface-input px-3 text-sm text-placeholder-text"
			onclick={() => {
				sidebar.setOpenMobile(false);
				searchOpen = true;
			}}
		>
			<Search class="size-4 text-icon-default" />
			Search chats...
		</button>

		<Button
			variant="ghost"
			class="mb-3 h-11 w-full justify-start gap-2 rounded-lg bg-accent-lime px-4 text-sm font-semibold text-accent-lime-on hover:brightness-[0.92]"
			style="background-color: #a8f251; color: #0e1a00; border-radius: 12px"
			onclick={handleNewChat}
		>
			<PlusCircle class="size-[18px]" />
			New Chat
		</Button>

		<div class="mt-2 flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto">
			{#each conversationsState.conversations as conv (conv.id)}
				<button
					onclick={() => handleSelectChat(conv.id)}
					class="group flex h-10 w-full items-center gap-3 rounded-md px-4 text-mute-text transition-colors hover:bg-surface-card hover:text-ink"
					class:bg-surface-card={currentChatId === conv.id}
					class:text-ink={currentChatId === conv.id}
				>
					<MessageSquare class="size-[18px] text-icon-default" />
					<span style="font: var(--type-nav-label)" class="truncate">{conv.title}</span>
					<span
						onclick={(e: MouseEvent) => handleDeleteChat(conv.id, e)}
						onkeydown={(e: KeyboardEvent) => {
							if (e.key === 'Enter' || e.key === ' ') handleDeleteChat(conv.id, e);
						}}
						role="button"
						tabindex="0"
						class="ml-auto hidden rounded p-0.5 text-icon-default opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-400"
						aria-label="Delete chat"
					>
						<Trash2 class="size-3.5" />
					</span>
				</button>
			{/each}
			{#if conversationsState.conversations.length === 0 && !conversationsState.hydrated}
				{#each [0, 1, 2] as i (i)}
					<div class="h-10 animate-pulse rounded-md bg-surface-card"></div>
				{/each}
			{:else if conversationsState.conversations.length === 0 && !conversationsState.loading}
				<div class="px-4 py-6 text-center text-xs" style="color: var(--colors-mute)">
					No conversations yet
				</div>
			{/if}
		</div>
	</Sidebar.Content>

	<Sidebar.Footer class="flex items-start p-4">
		{#if !isLoaded}
			<div class="size-8 animate-pulse rounded-full bg-surface-card"></div>
		{:else if !isSignedIn}
			<a
				href="/sign-in"
				class="flex h-8 items-center gap-2 rounded-lg px-3 text-sm text-mute-text transition-colors hover:bg-surface-card hover:text-ink"
			>
				<LogIn class="size-4 text-icon-default" />
				<span style="font: var(--type-nav-label)">Sign In</span>
			</a>
		{:else}
			<Popover.Popover>
				<Popover.PopoverTrigger
					class="cursor-pointer rounded-full transition-all outline-none hover:ring-2 hover:ring-hairline-strong focus-visible:ring-2 focus-visible:ring-accent-blue"
				>
					<Avatar.Root class="size-8 rounded-full border border-hairline-strong">
						<Avatar.Image src={userAvatar} alt={userName} />
						<Avatar.Fallback>{userName.charAt(0).toUpperCase()}</Avatar.Fallback>
					</Avatar.Root>
				</Popover.PopoverTrigger>
				<Popover.PopoverContent
					side="right"
					align="end"
					sideOffset={8}
					class="w-auto rounded-lg border border-hairline p-0 shadow-none"
				>
					<ProfilePopover {userName} {userEmail} {userAvatar} />
				</Popover.PopoverContent>
			</Popover.Popover>
		{/if}
	</Sidebar.Footer>
</Sidebar.Root>

<SearchDialog bind:open={searchOpen} />
