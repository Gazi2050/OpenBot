<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import ModelSelector from './model-selector.svelte';
	import ArrowUp from '@lucide/svelte/icons/arrow-up';
	import { chatState } from '$lib/hooks/chat.svelte.js';

	let message = $state('');
	let hasText = $derived(message.trim().length > 0);
	let isSending = $derived(
		hasText &&
			(chatState.chat.status === 'submitted' || chatState.chat.status === 'streaming')
	);

	function send() {
		if (!hasText || isSending) return;
		chatState.chat.sendMessage({ text: message });
		message = '';
	}

	function onKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			send();
		}
	}
</script>

<div
	class="flex min-h-[80px] flex-col justify-between rounded-lg border border-hairline-strong bg-surface-input p-3.5"
>
	<textarea
		bind:value={message}
		onkeydown={onKeyDown}
		placeholder="Ask anything — code, explain, brainstorm..."
		class="flex-1 resize-none bg-transparent text-sm text-ink outline-none placeholder:text-placeholder-text"
		style="font: var(--type-input-text)"
		rows="2"
	></textarea>

	<div class="flex items-center justify-between">
		<div class="flex items-center gap-2">
			<ModelSelector model={chatState.model} onChange={(m) => chatState.setModel(m)} />
		</div>
		<Button
			variant="ghost"
			size="icon"
			class="size-8 rounded-full {hasText
				? 'bg-ink text-canvas hover:bg-ink/90'
				: 'bg-surface-elevated text-icon-default hover:text-ink'}"
			aria-label="Send message"
			onclick={send}
		>
			<ArrowUp class="size-4" />
		</Button>
	</div>
</div>
