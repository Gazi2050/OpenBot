<script lang="ts">
	import { tick } from 'svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import ModelSelector from './model-selector.svelte';
	import ArrowUp from '@lucide/svelte/icons/arrow-up';
	import Bold from '@lucide/svelte/icons/bold';
	import Italic from '@lucide/svelte/icons/italic';
	import Code from '@lucide/svelte/icons/code';
	import CodeXml from '@lucide/svelte/icons/code-xml';
	import List from '@lucide/svelte/icons/list';
	import Link from '@lucide/svelte/icons/link';
	import { chatState } from '$lib/hooks/chat.svelte.js';

	let message = $state('');
	let textarea = $state<HTMLTextAreaElement>();
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

	async function wrapSelection(before: string, after: string = before) {
		if (!textarea) return;
		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const selected = message.slice(start, end) || 'text';
		message = message.slice(0, start) + before + selected + after + message.slice(end);
		await tick();
		textarea.focus();
		const selStart = start + before.length;
		textarea.setSelectionRange(selStart, selStart + selected.length);
	}

	async function insertLinePrefix(prefix: string) {
		if (!textarea) return;
		const start = textarea.selectionStart;
		const lineStart = message.lastIndexOf('\n', start - 1) + 1;
		message = message.slice(0, lineStart) + prefix + message.slice(lineStart);
		await tick();
		textarea.focus();
	}

	async function insertCodeBlock() {
		if (!textarea) return;
		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const selected = message.slice(start, end) || 'code';
		const insertion = '\n```\n' + selected + '\n```\n';
		message = message.slice(0, start) + insertion + message.slice(end);
		await tick();
		textarea.focus();
	}
</script>

<div
	class="flex min-h-[80px] flex-col justify-between rounded-xl border border-hairline-strong bg-surface-input p-3.5"
>
	<div class="mb-1.5 flex items-center gap-0.5">
		<button
			onclick={() => wrapSelection('**')}
			class="flex size-6 items-center justify-center rounded-md text-icon-default transition-colors hover:bg-surface-elevated hover:text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
			title="Bold"
			aria-label="Bold"
		>
			<Bold class="size-3.5" />
		</button>
		<button
			onclick={() => wrapSelection('*')}
			class="flex size-6 items-center justify-center rounded-md text-icon-default transition-colors hover:bg-surface-elevated hover:text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
			title="Italic"
			aria-label="Italic"
		>
			<Italic class="size-3.5" />
		</button>
		<button
			onclick={() => wrapSelection('`')}
			class="flex size-6 items-center justify-center rounded-md text-icon-default transition-colors hover:bg-surface-elevated hover:text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
			title="Inline code"
			aria-label="Inline code"
		>
			<Code class="size-3.5" />
		</button>
		<button
			onclick={insertCodeBlock}
			class="flex size-6 items-center justify-center rounded-md text-icon-default transition-colors hover:bg-surface-elevated hover:text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
			title="Code block"
			aria-label="Code block"
		>
			<CodeXml class="size-3.5" />
		</button>
		<button
			onclick={() => insertLinePrefix('- ')}
			class="flex size-6 items-center justify-center rounded-md text-icon-default transition-colors hover:bg-surface-elevated hover:text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
			title="List"
			aria-label="List"
		>
			<List class="size-3.5" />
		</button>
		<button
			onclick={() => wrapSelection('[', '](url)')}
			class="flex size-6 items-center justify-center rounded-md text-icon-default transition-colors hover:bg-surface-elevated hover:text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
			title="Link"
			aria-label="Link"
		>
			<Link class="size-3.5" />
		</button>
	</div>

	<textarea
		bind:this={textarea}
		bind:value={message}
		onkeydown={onKeyDown}
		placeholder="Ask anything — code, explain, brainstorm..."
		class="flex-1 resize-none bg-transparent text-sm text-ink outline-none placeholder:text-placeholder-text"
		style="font: var(--type-input-text)"
		rows="2"
	></textarea>

	<div class="flex items-center justify-between pt-2">
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
