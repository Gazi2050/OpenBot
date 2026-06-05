<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import AppSidebar from '$lib/components/custom/app-sidebar.svelte';
	import TopBar from '$lib/components/custom/topbar.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<Tooltip.Provider>
	<Sidebar.Provider style="--sidebar-width: 275px;" class="h-svh overflow-hidden">
		<AppSidebar />
		<main class="flex min-w-0 flex-1 flex-col">
			<TopBar />
			{@render children()}
		</main>
	</Sidebar.Provider>
</Tooltip.Provider>
