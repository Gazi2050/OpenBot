<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { AppSidebar, TopBar } from '$lib/components/layout';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<Tooltip.Provider>
	<Sidebar.Provider style="--sidebar-width: 275px;" class="h-svh overflow-hidden">
		<AppSidebar />
		<main class="flex min-h-0 min-w-0 flex-1 flex-col">
			<TopBar />
			{@render children()}
		</main>
	</Sidebar.Provider>
</Tooltip.Provider>
