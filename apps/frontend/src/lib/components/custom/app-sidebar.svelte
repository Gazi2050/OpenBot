<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import SearchDialog from './search-dialog.svelte';
	import { useSidebar } from '$lib/components/ui/sidebar/context.svelte.js';
	import Bot from '@lucide/svelte/icons/bot';
	import Search from '@lucide/svelte/icons/search';
	import PlusCircle from '@lucide/svelte/icons/plus-circle';
	import MessageSquare from '@lucide/svelte/icons/message-square';
	import Settings2 from '@lucide/svelte/icons/settings-2';

	const sidebar = useSidebar();
	let searchOpen = $state(false);
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

		<Sidebar.Group>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton
							class="h-10 rounded-md px-4 text-mute-text hover:bg-surface-card hover:text-ink"
						>
							{#snippet child({ props })}
								<a href="#" {...props}>
									<MessageSquare class="size-[18px] text-icon-default" />
									<span style="font: var(--type-nav-label)">Chats</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton
							class="h-10 rounded-md px-4 text-mute-text hover:bg-surface-card hover:text-ink"
						>
							{#snippet child({ props })}
								<a href="#" {...props}>
									<Settings2 class="size-[18px] text-icon-default" />
									<span style="font: var(--type-nav-label)">Settings</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>

	<Sidebar.Footer class="flex items-start p-4">
		<Avatar.Root class="size-8 rounded-full border border-hairline-strong">
			<Avatar.Image src="https://github.com/shadcn.png" alt="User" />
			<Avatar.Fallback>U</Avatar.Fallback>
		</Avatar.Root>
	</Sidebar.Footer>
</Sidebar.Root>

<SearchDialog bind:open={searchOpen} />
