<script lang="ts">
	import { MessageInput, ChatMessage } from '$lib/components/chat';
	import { chatState } from '$lib/hooks/chat.svelte.js';
	import { slotText } from 'slot-text/svelte';
	import { untrack } from 'svelte';
	import Bot from '@lucide/svelte/icons/bot';
	import ArrowDown from '@lucide/svelte/icons/arrow-down';

	type MsgPart = { type: string; text?: string };

	let messagesContainer = $state<HTMLDivElement>();
	let showWelcome = $derived(chatState.chat.messages.length === 0);
	let isAtBottom = $state(true);

	function isStreaming(msgId: string) {
		const msgs = chatState.chat.messages;
		if (msgs.length === 0) return false;
		return msgs[msgs.length - 1].id === msgId && chatState.chat.status === 'streaming';
	}

	function hasText(msg: { parts: MsgPart[] }): boolean {
		return msg.parts.some((p) => p.type === 'text' && p.text);
	}

	function getActivityLabel(): string | null {
		if (chatState.chat.status === 'submitted') return 'Thinking...';
		if (chatState.chat.status !== 'streaming') return null;
		const msgs = chatState.chat.messages;
		if (!msgs.length) return null;
		const last = msgs[msgs.length - 1] as unknown as { role: string; parts: MsgPart[] };
		if (last.role !== 'assistant') return null;
		if (hasText(last)) return null;
		if (last.parts.some((p) => p.type.startsWith('tool'))) return 'Analyzing...';
		return 'Thinking...';
	}

	let activityLabel = $derived(getActivityLabel());

	function onScroll() {
		if (!messagesContainer) return;
		const { scrollTop, scrollHeight, clientHeight } = messagesContainer;
		isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
	}

	function scrollToBottom() {
		messagesContainer?.scrollTo({
			top: messagesContainer.scrollHeight,
			behavior: 'smooth'
		});
	}

	$effect(() => {
		const msgCount = chatState.chat.messages.length;
		const status = chatState.chat.status;
		if (!messagesContainer) return;
		if (status === 'submitted') {
			messagesContainer.scrollTo({
				top: messagesContainer.scrollHeight,
				behavior: 'smooth'
			});
		} else if (untrack(() => isAtBottom)) {
			messagesContainer.scrollTop = messagesContainer.scrollHeight;
		}
	});

	$effect(() => {
		if (chatState.chat.status !== 'streaming') return;
		const interval = setInterval(() => {
			if (untrack(() => isAtBottom) && messagesContainer) {
				messagesContainer.scrollTop = messagesContainer.scrollHeight;
			}
		}, 100);
		return () => clearInterval(interval);
	});
</script>

<div class="flex min-h-0 flex-1 flex-col">
	{#if showWelcome}
		<div class="flex min-h-0 flex-1 flex-col items-center overflow-y-auto px-8">
			<div class="flex w-full max-w-[680px] flex-1 flex-col justify-center">
				<div class="flex flex-col items-center">
					<h1 class="text-center text-ink" style="font: var(--type-welcome-headline)">
						Hello there!
					</h1>
					<p
						class="mt-2 text-center"
						style="font: var(--type-welcome-subtitle); color: var(--colors-mute)"
					>
						How can I help you today?
					</p>
				</div>
			</div>
		</div>
	{:else}
		<div class="relative min-h-0 flex-1">
			<div
				bind:this={messagesContainer}
				onscroll={onScroll}
				class="h-full overflow-y-auto px-8 py-6"
			>
				<div class="mx-auto flex w-full max-w-[680px] flex-col gap-4">
					{#each chatState.chat.messages as msg (msg.id)}
						{#if isStreaming(msg.id) && !hasText(msg as unknown as { parts: MsgPart[] })}
							<!-- skip: loading indicator handles this -->
						{:else}
							<ChatMessage {msg} streaming={isStreaming(msg.id)} />
						{/if}
					{/each}

					{#if chatState.chat.status === 'error'}
						<div class="text-sm" style="color: var(--color-error, #ef4444)">
							Something went wrong. Please try again.
						</div>
					{:else if activityLabel}
						<div class="flex gap-3">
							<div
								class="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface-elevated"
							>
								<Bot class="size-[18px]" />
							</div>
							<div
								class="flex items-center gap-2 rounded-2xl border border-hairline bg-surface-card px-4 py-3 text-xs"
								style="color: var(--colors-mute)"
							>
								<span class="size-2 animate-pulse rounded-full bg-current"></span>
								<span
									use:slotText={{
										text: activityLabel,
										options: { direction: 'up', stagger: 35, duration: 280 }
									}}
								>
									{activityLabel}
								</span>
							</div>
						</div>
					{/if}
				</div>
			</div>
			{#if !isAtBottom}
				<button
					onclick={scrollToBottom}
					class="scroll-btn absolute bottom-4 left-1/2 z-10 flex size-9 items-center justify-center rounded-full border border-hairline bg-surface-elevated text-icon-default transition-colors hover:border-hairline-strong hover:text-ink"
					aria-label="Scroll to latest"
				>
					<ArrowDown class="size-4" />
				</button>
			{/if}
		</div>
	{/if}

	<div class="shrink-0 px-8 py-8">
		<div class="mx-auto max-w-[680px]">
			<MessageInput />
		</div>
	</div>
</div>

<style>
	.scroll-btn {
		animation: scroll-btn-in 0.25s cubic-bezier(0.22, 1, 0.36, 1);
	}
	@keyframes scroll-btn-in {
		from {
			opacity: 0;
			transform: translateY(8px) translateX(-50%);
		}
		to {
			opacity: 1;
			transform: translateY(0) translateX(-50%);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.scroll-btn {
			animation: none !important;
		}
	}
</style>
