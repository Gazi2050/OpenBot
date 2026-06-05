<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';

	let { title, subtitle }: { title: string; subtitle: string } = $props();
</script>

<Card.Root
	class="min-h-[90px] cursor-pointer rounded-xl border border-hairline bg-surface-card p-6 transition-colors hover:border-hairline-strong hover:bg-surface-elevated"
>
	<Card.Content class="p-0">
		<h3 class="text-ink" style="font: var(--type-card-title)">
			{title}
		</h3>
		<p class="mt-1" style="font: var(--type-card-body); color: var(--colors-mute)">
			{subtitle}
		</p>
	</Card.Content>
</Card.Root>
