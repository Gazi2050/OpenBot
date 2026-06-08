<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { useClerkContext } from 'svelte-clerk/client';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import UserRound from '@lucide/svelte/icons/user-round';
	import LogOut from '@lucide/svelte/icons/log-out';

	let {
		userName,
		userEmail,
		userAvatar
	}: {
		userName: string;
		userEmail: string;
		userAvatar: string;
	} = $props();

	const ctx = useClerkContext();

	async function handleSignOut() {
		await ctx.clerk?.signOut();
		goto(resolve('/(auth)/sign-in'));
	}
</script>

<div class="flex min-w-[240px] flex-col p-4">
	<div class="flex items-center gap-3">
		<Avatar.Root class="size-10 rounded-full border border-hairline-strong">
			<Avatar.Image src={userAvatar} alt={userName} />
			<Avatar.Fallback>{userName.charAt(0).toUpperCase()}</Avatar.Fallback>
		</Avatar.Root>
		<div class="flex flex-col">
			<span class="text-sm font-semibold text-ink">{userName}</span>
			<span class="text-xs text-mute-text">{userEmail}</span>
		</div>
	</div>

	<Separator class="my-3 bg-hairline" />

	<Button
		variant="ghost"
		class="h-10 w-full justify-start gap-3 rounded-md px-4 text-mute-text hover:bg-surface-card hover:text-ink"
		onclick={() => {}}
	>
		<UserRound class="size-[18px] text-icon-default" />
		<span style="font: var(--type-nav-label)">Profile</span>
	</Button>

	<Button
		variant="ghost"
		class="h-10 w-full justify-start gap-3 rounded-md px-4 text-mute-text hover:bg-surface-card hover:text-ink"
		onclick={handleSignOut}
	>
		<LogOut class="size-[18px] text-icon-default" />
		<span style="font: var(--type-nav-label)">Sign Out</span>
	</Button>
</div>
