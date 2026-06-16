<script lang="ts">
	import MarkdownRenderer from './markdown-renderer.svelte';
	import CopyButton from './copy-button.svelte';
	import { OpenBotLogo } from '$lib/components/layout';

	type MessagePart = { type: string; text?: string };

	type ChatMsg = {
		id: string;
		role: 'user' | 'assistant' | 'system';
		parts: MessagePart[];
	};

	let {
		msg,
		streaming = false
	}: {
		msg: ChatMsg;
		streaming?: boolean;
	} = $props();

	function getContent(): string {
		const textPart = msg.parts.find((p) => p.type === 'text');
		if (textPart?.type === 'text' && textPart.text) return textPart.text;
		const reasoningPart = msg.parts.find((p) => p.type === 'reasoning');
		return reasoningPart?.type === 'reasoning' ? reasoningPart.text ?? '' : '';
	}

	let content = $derived(getContent());
</script>

{#if msg.role === 'user'}
	<div class="group relative flex justify-end">
		<div
			class="max-w-[80%] rounded-2xl bg-surface-elevated px-4 py-3 pr-10 text-sm"
			style="color: var(--colors-ink)"
		>
			<p class="whitespace-pre-wrap break-words">{content}</p>
			<div
				class="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
			>
				<CopyButton text={content} />
			</div>
		</div>
	</div>
{:else}
	<div class="group flex gap-3">
		<div class="mt-0.5 shrink-0">
			<div
				class="flex size-7 items-center justify-center rounded-lg bg-surface-elevated"
			>
				<OpenBotLogo class="size-4" />
			</div>
		</div>
		<div
			class="relative min-h-0 flex-1 rounded-2xl border border-hairline bg-surface-card px-4 py-3 pr-10 text-sm"
			style="color: var(--colors-ink)"
		>
			<MarkdownRenderer markdown={content} {streaming} />
			<div
				class="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
			>
				<CopyButton text={content} />
			</div>
		</div>
	</div>
{/if}
