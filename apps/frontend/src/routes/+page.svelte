<script lang="ts">
	import PromptCard from '$lib/components/custom/prompt-card.svelte';
	import MessageInput from '$lib/components/custom/message-input.svelte';
</script>

<div class="flex flex-1 flex-col items-center overflow-y-auto">
	<div class="flex w-full max-w-[680px] flex-1 flex-col px-8">
		<div class="flex flex-1 flex-col items-center justify-center">
			<h1 class="text-center text-ink" style="font: var(--type-welcome-headline)">Hello there!</h1>
			<p
				class="mt-2 text-center"
				style="font: var(--type-welcome-subtitle); color: var(--colors-mute)"
			>
				How can I help you today?
			</p>
			<div class="mt-12 grid w-full grid-cols-2 gap-3">
				<PromptCard title="What's the weather" subtitle="In San Francisco?" />
				<PromptCard title="Explain React hooks" subtitle="like useState and useEffect" />
			</div>
		</div>
		<div class="py-8">
			<MessageInput />
		</div>
	</div>
</div>
