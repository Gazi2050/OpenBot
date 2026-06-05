<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import OpenbotLogo from './openbot-logo.svelte';
	import Search from '@lucide/svelte/icons/search';
	import PlusCircle from '@lucide/svelte/icons/plus-circle';
	import MessageSquare from '@lucide/svelte/icons/message-square';
	import Settings2 from '@lucide/svelte/icons/settings-2';
</script>

<Sidebar.Root collapsible="none" side="left" variant="sidebar">
	<Sidebar.Header class="p-4">
		<div class="flex items-center gap-2">
			<OpenbotLogo class="text-ink" />
			<span style="font: var(--type-logo)" class="text-ink">OpenBot</span>
		</div>
	</Sidebar.Header>

	<Sidebar.Content class="px-4">
		<div class="relative mb-3">
			<Search class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-icon-default" />
			<Input
				placeholder="Search chats..."
				class="h-10 rounded-lg border-hairline bg-surface-input pl-10 text-sm text-ink placeholder:text-placeholder-text"
			/>
		</div>

		<Button
			class="mb-3 h-11 w-full justify-start gap-2 rounded-[20px] border-0 bg-accent-lime px-4 text-sm font-semibold text-accent-lime-on hover:brightness-[0.92]"
		>
			<PlusCircle class="size-[18px]" />
			New Chat
		</Button>

		<Sidebar.Group>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton
							class="h-10 rounded-lg text-mute-text hover:bg-surface-card hover:text-ink"
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
							class="h-10 rounded-lg text-mute-text hover:bg-surface-card hover:text-ink"
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

	<Sidebar.Footer class="flex items-center justify-end p-4">
		<Avatar.Root class="size-8 rounded-full">
			<Avatar.Image src="https://github.com/shadcn.png" alt="User" />
			<Avatar.Fallback>U</Avatar.Fallback>
		</Avatar.Root>
	</Sidebar.Footer>
</Sidebar.Root>
