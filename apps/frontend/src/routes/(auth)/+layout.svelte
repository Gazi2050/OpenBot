<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="flex min-h-svh items-center justify-center bg-canvas">
	{@render children()}
</div>
