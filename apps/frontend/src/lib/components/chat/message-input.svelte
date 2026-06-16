<script lang="ts">
	import { tick } from 'svelte';
	import { prepare, layout } from '@chenglou/pretext';
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

	const INPUT_FONT = '400 15px "Geist", "Inter", system-ui, sans-serif';
	const INPUT_LINE_HEIGHT = 22.5;
	const INPUT_MAX_HEIGHT = 200;
	const INPUT_MIN_HEIGHT = 44;

	let message = $state('');
	let textarea = $state<HTMLTextAreaElement>();
	let contentWidth = $state(0);
	let hasText = $derived(message.trim().length > 0);
	let isSending = $derived(
		hasText &&
			(chatState.chat.status === 'submitted' || chatState.chat.status === 'streaming')
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

	async function toggleWrap(before: string, after: string = before) {
		if (!textarea) return;
		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const selected = message.slice(start, end);
		const textBefore = message.slice(Math.max(0, start - before.length), start);
		const textAfter = message.slice(end, end + after.length);

		if (textBefore === before && textAfter === after) {
			message =
				message.slice(0, start - before.length) + selected + message.slice(end + after.length);
			await tick();
			textarea.focus();
			const ns = start - before.length;
			textarea.setSelectionRange(ns, ns + selected.length);
		} else {
			const text = selected || 'text';
			message = message.slice(0, start) + before + text + after + message.slice(end);
			await tick();
			textarea.focus();
			const ss = start + before.length;
			textarea.setSelectionRange(ss, ss + text.length);
		}
		autoResize();
	}

	async function toggleLinePrefix(prefix: string) {
		if (!textarea) return;
		const start = textarea.selectionStart;
		const lineStart = message.lastIndexOf('\n', start - 1) + 1;
		const lineContent = message.slice(lineStart);

		if (lineContent.startsWith(prefix)) {
			message = message.slice(0, lineStart) + message.slice(lineStart + prefix.length);
			await tick();
			textarea.focus();
			textarea.setSelectionRange(start - prefix.length, start - prefix.length);
		} else {
			message = message.slice(0, lineStart) + prefix + message.slice(lineStart);
			await tick();
			textarea.focus();
			textarea.setSelectionRange(start + prefix.length, start + prefix.length);
		}
		autoResize();
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
		autoResize();
	}
</script>

<div
	class="flex flex-col rounded-xl border border-hairline-strong bg-surface-input p-3.5 gap-2"
>
	<div class="flex items-center gap-0.5">
		<button
			onclick={() => toggleWrap('**')}
			class="flex size-6 items-center justify-center rounded-md text-icon-default transition-colors hover:bg-surface-elevated hover:text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
			title="Bold"
			aria-label="Bold"
		>
			<Bold class="size-3.5" />
		</button>
		<button
			onclick={() => toggleWrap('*')}
			class="flex size-6 items-center justify-center rounded-md text-icon-default transition-colors hover:bg-surface-elevated hover:text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
			title="Italic"
			aria-label="Italic"
		>
			<Italic class="size-3.5" />
		</button>
		<button
			onclick={() => toggleWrap('`')}
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
			onclick={() => toggleLinePrefix('- ')}
			class="flex size-6 items-center justify-center rounded-md text-icon-default transition-colors hover:bg-surface-elevated hover:text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
			title="List"
			aria-label="List"
		>
			<List class="size-3.5" />
		</button>
		<button
			onclick={() => toggleWrap('[', '](url)')}
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
			onclick={send}
		>
			<ArrowUp class="size-4" />
		</Button>
	</div>
</div>
