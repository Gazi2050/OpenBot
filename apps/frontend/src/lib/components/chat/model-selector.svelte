<script lang="ts">
	import * as Popover from '$lib/components/ui/popover/index.js';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { models } from '@openbot/shared';

	let {
		model = models[0].id,
		enabledModelIds,
		onChange
	}: {
		model?: string;
		enabledModelIds?: string[] | null;
		onChange?: (modelId: string) => void;
	} = $props();

	let selected = $derived(model);

	let open = $state(false);

	function selectModel(id: string) {
		selected = id;
		open = false;
		onChange?.(id);
	}
</script>

<Popover.Popover bind:open>
	<Popover.PopoverTrigger
		class="flex h-7 cursor-pointer items-center gap-1.5 rounded-md border border-hairline bg-surface-elevated px-2 text-xs outline-none hover:bg-surface-card focus-visible:ring-2 focus-visible:ring-accent-blue"
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
		{#each models.filter((m) => !enabledModelIds || enabledModelIds.includes(m.id)) as m (m.id)}
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
