<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import Plus from '@lucide/svelte/icons/plus';
	import ArrowUp from '@lucide/svelte/icons/arrow-up';

	let message = $state('');
	let hasText = $derived(message.length > 0);
</script>

<div
	class="flex min-h-[80px] flex-col justify-between rounded-xl border border-hairline-strong bg-surface-input p-3.5"
>
	<textarea
		bind:value={message}
		placeholder="Send a message... (@ to mention, / for commands)"
		class="flex-1 resize-none bg-transparent text-sm text-ink outline-none placeholder:text-placeholder-text"
		style="font: var(--type-input-text)"
		rows="2"
	></textarea>

	<div class="flex items-center justify-between">
		<button
			class="flex size-[32px] items-center justify-center rounded-full text-icon-default hover:bg-surface-elevated"
			aria-label="Attach file"
		>
			<Plus class="size-[18px]" />
		</button>
		<Button
			variant="ghost"
			size="icon"
			class="size-8 rounded-full {hasText
				? 'bg-ink text-canvas hover:bg-ink/90'
				: 'bg-surface-elevated text-icon-default hover:text-ink'}"
			aria-label="Send message"
		>
			<ArrowUp class="size-4" />
		</Button>
	</div>
</div>
