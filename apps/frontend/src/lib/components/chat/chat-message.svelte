<script lang="ts">
	import { untrack } from 'svelte';
	import MarkdownRenderer from './markdown-renderer.svelte';
	import CopyButton from './copy-button.svelte';
	import Bot from '@lucide/svelte/icons/bot';
	import User from '@lucide/svelte/icons/user';

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
		return textPart?.type === 'text' ? textPart.text ?? '' : '';
	}

	let content = $derived(getContent());
	let isUser = $derived(msg.role === 'user');

	let displayedContent = $state('');

	$effect(() => {
		if (!streaming) {
			displayedContent = untrack(() => content);
		}
	});

	$effect(() => {
		if (!streaming) return;

		const interval = setInterval(() => {
			const target = untrack(() => content);
			const current = untrack(() => displayedContent);
			if (current.length >= target.length) return;
			const remaining = target.length - current.length;
			const speed = Math.min(5, Math.max(2, Math.ceil(remaining / 30)));
			displayedContent = target.slice(0, current.length + speed);
		}, 20);

		return () => clearInterval(interval);
	});

	let isTyping = $derived(!isUser && streaming);
</script>

<div class="message-enter group flex flex-col {isUser ? 'items-end' : 'items-start'}">
	<div class="flex gap-3 {isUser ? 'flex-row-reverse' : ''}" style="max-width: 85%">
		<div
			class="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface-elevated"
			style="color: var(--colors-ink)"
		>
			{#if isUser}
				<User class="size-[18px]" />
			{:else}
				<Bot class="size-[18px]" />
			{/if}
		</div>
		<div
			class="min-w-0 flex-1 rounded-2xl border px-3 py-2 text-[15px]"
			class:border-hairline={!isUser}
			class:bg-surface-card={!isUser}
			class:bg-surface-elevated={isUser}
			style="color: var(--colors-ink)"
		>
			{#if content}
				<MarkdownRenderer markdown={displayedContent} streaming={isTyping} />
			{:else if !streaming}
				<span class="text-xs" style="color: var(--colors-mute)">No response</span>
			{/if}
		</div>
	</div>
	<div
		class="{isUser ? 'mr-11' : 'ml-11'} mt-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
	>
		<CopyButton text={content} />
	</div>
</div>

<style>
	@keyframes message-in {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.message-enter {
		animation: message-in 0.35s cubic-bezier(0.22, 1, 0.36, 1);
	}
	@media (prefers-reduced-motion: reduce) {
		.message-enter {
			animation: none !important;
		}
	}
</style>
