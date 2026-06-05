<script lang="ts">
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
</script>

<button
	class="flex h-9 items-center gap-2 rounded-full border border-hairline bg-surface-elevated px-3.5 text-sm hover:bg-surface-card"
	style="font: var(--type-model-pill); color: var(--colors-ink)"
>
	<span class="flex size-[18px] items-center justify-center rounded-full bg-ink/10">
		<span class="size-2 rounded-full bg-ink/60"></span>
	</span>
	GPT-5.4 Nano
	<ChevronDown class="size-4 text-icon-default" />
</button>
