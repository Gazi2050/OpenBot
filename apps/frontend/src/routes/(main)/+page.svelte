<script lang="ts">
	import PromptCard from '$lib/components/custom/prompt-card.svelte';
	import MessageInput from '$lib/components/custom/message-input.svelte';
	import MarkdownRenderer from '$lib/components/custom/markdown-renderer.svelte';
	import { chatState } from '$lib/hooks/chat.svelte.js';

	let messagesContainer = $state<HTMLDivElement>();
	let showWelcome = $derived(chatState.chat.messages.length === 0);

	function getMessageText(msg: (typeof chatState.chat.messages)[number]) {
		const textPart = msg.parts.find((p) => p.type === 'text');
		return textPart?.type === 'text' ? textPart.text : '';
	}

	function isStreaming(msgId: string) {
		const msgs = chatState.chat.messages;
		if (msgs.length === 0) return false;
		return msgs[msgs.length - 1].id === msgId && chatState.chat.status === 'streaming';
	}

	$effect(() => {
		const msgs = chatState.chat.messages;
		const lastMsg = msgs[msgs.length - 1];
		const lastText = lastMsg ? getMessageText(lastMsg) : '';
		if (messagesContainer && lastText) {
			messagesContainer.scrollTop = messagesContainer.scrollHeight;
		}
	});
</script>

<div class="flex flex-1 flex-col">
	{#if showWelcome}
		<div class="flex flex-1 flex-col items-center overflow-y-auto px-8">
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
				<div class="mt-12 grid w-full grid-cols-2 gap-3">
					<PromptCard title="What's the weather" subtitle="In San Francisco?" />
					<PromptCard title="Explain React hooks" subtitle="like useState and useEffect" />
				</div>
			</div>
		</div>
	{:else}
		<div
			bind:this={messagesContainer}
			class="flex-1 overflow-y-auto px-8 py-6"
		>
			<div class="mx-auto flex w-full max-w-[680px] flex-col gap-4">
				{#each chatState.chat.messages as msg, i (msg.id)}
					{#if msg.role === 'user'}
						<div class="flex justify-end">
							<div
								class="max-w-[80%] rounded-2xl bg-surface-elevated px-4 py-3 text-sm"
								style="color: var(--colors-ink)"
							>
								{getMessageText(msg)}
							</div>
						</div>
					{:else if msg.role === 'assistant'}
						<div class="text-sm" style="color: var(--colors-ink)">
							<MarkdownRenderer
								markdown={getMessageText(msg)}
								streaming={isStreaming(msg.id)}
							/>
						</div>
					{/if}
				{/each}

				{#if chatState.chat.status === 'submitted'}
					<div class="flex items-center gap-2 py-2 text-xs" style="color: var(--colors-mute)">
						<span class="size-2 animate-pulse rounded-full" style="background-color: var(--colors-mute)"></span>
						Thinking...
					</div>
				{:else if chatState.chat.status === 'error'}
					<div class="text-sm" style="color: var(--color-error, #ef4444)">
						Something went wrong. Please try again.
					</div>
				{/if}
			</div>
		</div>
	{/if}

	<div class="px-8 py-8">
		<div class="mx-auto max-w-[680px]">
			<MessageInput />
		</div>
	</div>
</div>
