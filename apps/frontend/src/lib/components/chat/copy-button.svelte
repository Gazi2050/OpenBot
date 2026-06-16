<script lang="ts">
	import Copy from '@lucide/svelte/icons/copy';
	import Check from '@lucide/svelte/icons/check';

	let { text }: { text: string } = $props();
	let copied = $state(false);
	let timeout: ReturnType<typeof setTimeout> | undefined;

	async function copy() {
		try {
			await navigator.clipboard.writeText(text);
			copied = true;
			clearTimeout(timeout);
			timeout = setTimeout(() => (copied = false), 2000);
		} catch {
			// clipboard not available
		}
	}
</script>

<button
	onclick={copy}
	class="flex size-7 items-center justify-center rounded-md text-icon-default transition-colors hover:bg-surface-elevated hover:text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
	aria-label="Copy message"
	title="Copy"
>
	{#if copied}
		<Check class="size-3.5 copy-icon" />
	{:else}
		<Copy class="size-3.5 copy-icon" />
	{/if}
</button>

<style>
	:global(.copy-icon) {
		transition:
			transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
			opacity 0.15s ease;
	}
	@media (prefers-reduced-motion: reduce) {
		:global(.copy-icon) {
			transition: none !important;
		}
	}
</style>
