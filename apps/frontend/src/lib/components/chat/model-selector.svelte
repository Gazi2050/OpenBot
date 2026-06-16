<script lang="ts">
	import * as Popover from '$lib/components/ui/popover/index.js';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { models } from 'openbot-sdk';

	let {
		model = models[0].id,
		onChange
	}: {
		model?: string
		onChange?: (modelId: string) => void
	} = $props();

	let selected = $state(models[0].id);

	$effect(() => {
		selected = model;
	});

	let open = $state(false);

	function selectModel(id: string) {
		selected = id;
		open = false;
		onChange?.(id);
	}
</script>

<Popover.Popover bind:open>
	<Popover.PopoverTrigger
		class="flex h-7 cursor-pointer items-center gap-1.5 rounded-md border border-hairline px-2 text-xs hover:bg-surface-card outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
		style="background-color: #2a2a2a; color: var(--colors-ink)"
	>
		<span class="flex size-3.5 items-center justify-center rounded-full bg-ink/10">
			<span class="size-1.5 rounded-full bg-ink/60"></span>
		</span>
		{models.find((m) => m.id === selected)?.label ?? selected}
		<ChevronDown class="size-3 text-icon-default transition-transform {open ? 'rotate-180' : ''}" />
	</Popover.PopoverTrigger>
	<Popover.PopoverContent
		side="bottom"
		align="start"
		sideOffset={4}
		class="w-52 rounded-xl border border-hairline bg-surface-elevated p-1 shadow-none"
	>
		{#each models as m (m.id)}
			<button
				class="flex w-full items-center rounded-lg px-3 py-2 text-xs transition-colors hover:bg-surface-card"
				style="color: var(--colors-ink)"
				onclick={() => selectModel(m.id)}
			>
				{m.label}
			</button>
		{/each}
	</Popover.PopoverContent>
</Popover.Popover>
