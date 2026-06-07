<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import Eye from '@lucide/svelte/icons/eye';
	import EyeOff from '@lucide/svelte/icons/eye-off';
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Props = HTMLInputAttributes & {
		value?: string;
		class?: string;
	};

	let {
		value = $bindable(''),
		class: className,
		placeholder = 'Password',
		...restProps
	}: Props = $props();

	let visible = $state(false);
</script>

<div class="relative">
	<input
		type={visible ? 'text' : 'password'}
		bind:value
		{placeholder}
		class={cn(
			'h-11 w-full rounded-lg border border-hairline bg-surface-input px-4 pr-10 text-sm text-ink placeholder:text-placeholder-text focus:border-accent-blue focus:outline-none',
			className
		)}
		{...restProps}
	/>
	<Button
		variant="ghost"
		size="icon-sm"
		type="button"
		onclick={() => (visible = !visible)}
		class="absolute top-1/2 right-1.5 -translate-y-1/2 rounded-md text-icon-default hover:text-icon-active"
		aria-label={visible ? 'Hide password' : 'Show password'}
	>
		{#if visible}
			<Eye class="size-4" />
		{:else}
			<EyeOff class="size-4" />
		{/if}
	</Button>
</div>
