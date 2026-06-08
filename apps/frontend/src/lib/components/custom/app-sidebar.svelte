<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import SearchDialog from './search-dialog.svelte';
	import ProfilePopover from './profile-popover.svelte';
	import { useSidebar } from '$lib/components/ui/sidebar/context.svelte.js';
	import { useClerkContext } from 'svelte-clerk/client';
	import Bot from '@lucide/svelte/icons/bot';
	import Search from '@lucide/svelte/icons/search';
	import PlusCircle from '@lucide/svelte/icons/plus-circle';
	import MessageSquare from '@lucide/svelte/icons/message-square';
	import LogIn from '@lucide/svelte/icons/log-in';

	const sidebar = useSidebar();
	let searchOpen = $state(false);

	const chatHistory = $state([
		{ id: '1', title: 'React hooks explanation' },
		{ id: '2', title: 'Weather in San Francisco' },
		{ id: '3', title: 'Debug Node.js authentication' },
		{ id: '4', title: 'Plan trip to Tokyo' }
	]);

	const ctx = useClerkContext();
	const isLoaded = $derived(ctx.auth.userId !== undefined);
	const isSignedIn = $derived(ctx.auth.userId !== null && ctx.auth.userId !== undefined);
	const userName = $derived(ctx.user?.fullName ?? ctx.user?.username ?? 'User');
	const userEmail = $derived(ctx.user?.emailAddresses?.[0]?.emailAddress ?? '');
	const userAvatar = $derived(ctx.user?.imageUrl ?? '');
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
		>
			<PlusCircle class="size-[18px]" />
			New Chat
		</Button>

		<div class="mt-2 flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto">
			{#each chatHistory as chat (chat.id)}
				<button
					class="flex h-10 w-full items-center gap-3 rounded-md px-4 text-mute-text transition-colors hover:bg-surface-card hover:text-ink"
				>
					<MessageSquare class="size-[18px] text-icon-default" />
					<span style="font: var(--type-nav-label)" class="truncate">{chat.title}</span>
				</button>
			{/each}
		</div>
	</Sidebar.Content>

	<Sidebar.Footer class="flex items-start p-4">
		{#if !isLoaded}
			<div class="size-8 animate-pulse rounded-full bg-surface-card" />
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
					<ProfilePopover
						{userName}
						{userEmail}
						{userAvatar}
					/>
				</Popover.PopoverContent>
			</Popover.Popover>
		{/if}
	</Sidebar.Footer>
</Sidebar.Root>

<SearchDialog bind:open={searchOpen} />
