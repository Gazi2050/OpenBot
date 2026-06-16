<script lang="ts">
	import { PromptCard, MessageInput, ChatMessage } from '$lib/components/chat';
	import { OpenBotLogo } from '$lib/components/layout';
	import { chatState } from '$lib/hooks/chat.svelte.js';

	let messagesContainer = $state<HTMLDivElement>();
	let showWelcome = $derived(chatState.chat.messages.length === 0);

	function isStreaming(msgId: string) {
		const msgs = chatState.chat.messages;
		if (msgs.length === 0) return false;
		return msgs[msgs.length - 1].id === msgId && chatState.chat.status === 'streaming';
	}

	$effect(() => {
		if (messagesContainer) {
			messagesContainer.scrollTop = messagesContainer.scrollHeight;
		}
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
				<div class="mt-12 grid w-full grid-cols-2 gap-3">
					<PromptCard title="What's the weather" subtitle="In San Francisco?" />
					<PromptCard title="Explain React hooks" subtitle="like useState and useEffect" />
				</div>
			</div>
		</div>
	{:else}
		<div
			bind:this={messagesContainer}
			class="min-h-0 flex-1 overflow-y-auto px-8 py-6"
		>
			<div class="mx-auto flex w-full max-w-[680px] flex-col gap-4">
				{#each chatState.chat.messages as msg (msg.id)}
					<ChatMessage {msg} streaming={isStreaming(msg.id)} />
				{/each}

				{#if chatState.chat.status === 'submitted'}
					<div class="flex gap-3">
						<div
							class="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-surface-elevated"
						>
							<OpenBotLogo class="size-4" />
						</div>
						<div
							class="flex items-center gap-2 rounded-2xl border border-hairline bg-surface-card px-4 py-3 text-xs"
							style="color: var(--colors-mute)"
						>
							<span class="size-2 animate-pulse rounded-full bg-current"></span>
							Thinking...
						</div>
					</div>
				{:else if chatState.chat.status === 'error'}
					<div class="text-sm" style="color: var(--color-error, #ef4444)">
						Something went wrong. Please try again.
					</div>
				{/if}
			</div>
		</div>
	{/if}

	<div class="shrink-0 px-8 py-8">
		<div class="mx-auto max-w-[680px]">
			<MessageInput />
		</div>
	</div>
</div>
