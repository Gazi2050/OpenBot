<script lang="ts">
	import { prepare, layout } from '@chenglou/pretext';
	import { Button } from '$lib/components/ui/button/index.js';
	import ModelSelector from './model-selector.svelte';
	import ArrowUp from '@lucide/svelte/icons/arrow-up';
	import { chatState } from '$lib/hooks/chat.svelte.js';

	const INPUT_FONT = '400 15px "Geist", "Inter", system-ui, sans-serif';
	const INPUT_LINE_HEIGHT = 22.5;
	const INPUT_MAX_HEIGHT = 200;
	const INPUT_MIN_HEIGHT = 44;

	let message = $state('');
	let textarea = $state<HTMLTextAreaElement>();
	let contentWidth = $state(0);
	let hasText = $derived(message.trim().length > 0);
	let isSending = $derived(
		hasText && (chatState.chat.status === 'submitted' || chatState.chat.status === 'streaming')
	);

	$effect(() => {
		if (!textarea) return;
		contentWidth = textarea.clientWidth;
		function onResize() {
			if (textarea) contentWidth = textarea.clientWidth;
		}
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	});

	function autoResize() {
		if (!textarea) return;
		if (!message.trim()) {
			textarea.style.height = 'auto';
			return;
		}
		try {
			if (contentWidth > 0) {
				const prepared = prepare(message, INPUT_FONT, { whiteSpace: 'pre-wrap' });
				const { height } = layout(prepared, contentWidth, INPUT_LINE_HEIGHT);
				textarea.style.height = `${Math.min(Math.max(height + 4, INPUT_MIN_HEIGHT), INPUT_MAX_HEIGHT)}px`;
				return;
			}
		} catch {
			// pretext failed — DOM fallback below
		}
		textarea.style.height = 'auto';
		textarea.style.height = `${Math.min(textarea.scrollHeight, INPUT_MAX_HEIGHT)}px`;
	}

	function send() {
		if (!hasText || isSending) return;
		chatState.chat.sendMessage({ text: message });
		message = '';
		if (textarea) textarea.style.height = 'auto';
	}

	function onKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			send();
		}
	}
</script>

<div class="flex flex-col gap-2 rounded-xl border border-hairline-strong bg-surface-input p-3.5">
	<textarea
		bind:this={textarea}
		bind:value={message}
		oninput={autoResize}
		onkeydown={onKeyDown}
		placeholder="Ask anything — code, explain, brainstorm..."
		class="resize-none bg-transparent text-sm text-ink outline-none placeholder:text-placeholder-text"
		style="font: var(--type-input-text); max-height: {INPUT_MAX_HEIGHT}px; overflow-y: auto;"
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
			disabled={!hasText || isSending}
			onclick={send}
		>
			<ArrowUp class="size-4" />
		</Button>
	</div>
</div>
