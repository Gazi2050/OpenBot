<script lang="ts">
	import { Comark } from '@comark/svelte';
	import mermaid, { Mermaid } from '@comark/svelte/plugins/mermaid';

	let {
		markdown = '',
		streaming = false,
		class: className = ''
	}: {
		markdown?: string;
		streaming?: boolean;
		class?: string;
	} = $props();
</script>

<Comark
	{markdown}
	{streaming}
	caret={{ class: 'block-cursor' }}
	class={className}
	components={{ mermaid: Mermaid }}
	plugins={[mermaid()]}
/>

<style>
	:global(.block-cursor) {
		display: inline-block;
		width: 0.55em;
		height: 1.1em;
		background-color: var(--colors-ink);
		margin-left: 2px;
		vertical-align: text-bottom;
		border-radius: 2px;
		animation: cursor-blink 1.1s steps(1) infinite;
	}
	@keyframes cursor-blink {
		0%,
		50% {
			opacity: 1;
		}
		50.01%,
		100% {
			opacity: 0;
		}
	}

	:global(.comark-content) {
		font-size: 15px;
		line-height: 1.6;
		color: var(--colors-ink);
		overflow-wrap: break-word;
	}
	:global(.comark-content p) {
		margin: 0.5em 0;
	}
	:global(.comark-content h1) {
		font-size: 1.5em;
		font-weight: 700;
		margin: 1em 0 0.5em;
		line-height: 1.3;
	}
	:global(.comark-content h2) {
		font-size: 1.3em;
		font-weight: 600;
		margin: 0.8em 0 0.4em;
		line-height: 1.3;
	}
	:global(.comark-content h3) {
		font-size: 1.15em;
		font-weight: 600;
		margin: 0.6em 0 0.3em;
	}
	:global(.comark-content h4),
	:global(.comark-content h5),
	:global(.comark-content h6) {
		font-size: 1em;
		font-weight: 600;
		margin: 0.5em 0 0.25em;
	}
	:global(.comark-content strong) {
		font-weight: 600;
	}
	:global(.comark-content em) {
		font-style: italic;
	}
	:global(.comark-content :not(pre) > code) {
		background: rgba(255, 255, 255, 0.08);
		color: #f0a856;
		padding: 0.15em 0.4em;
		border-radius: 4px;
		font-size: 0.85em;
		font-family: ui-monospace, 'SF Mono', SFMono-Regular, Menlo, Consolas, monospace;
		white-space: nowrap;
	}
	:global(.comark-content pre) {
		background: #1a1a1a;
		border: 1px solid var(--colors-hairline);
		border-radius: 8px;
		padding: 12px 16px;
		overflow-x: auto;
		margin: 0.75em 0;
		font-size: 13px;
		line-height: 1.5;
	}
	:global(.comark-content pre code) {
		background: none;
		color: var(--colors-ink);
		padding: 0;
		border-radius: 0;
		font-size: inherit;
		font-family: ui-monospace, 'SF Mono', SFMono-Regular, Menlo, Consolas, monospace;
		white-space: pre;
	}
	:global(.comark-content ul),
	:global(.comark-content ol) {
		padding-left: 1.5em;
		margin: 0.5em 0;
	}
	:global(.comark-content ul) {
		list-style: disc;
	}
	:global(.comark-content ol) {
		list-style: decimal;
	}
	:global(.comark-content li) {
		margin: 0.25em 0;
	}
	:global(.comark-content li > ul),
	:global(.comark-content li > ol) {
		margin: 0.25em 0;
	}
	:global(.comark-content blockquote) {
		border-left: 3px solid rgba(255, 255, 255, 0.2);
		padding-left: 12px;
		margin: 0.75em 0;
		color: var(--colors-body);
		font-style: italic;
	}
	:global(.comark-content a) {
		color: var(--colors-accent-blue);
		text-decoration: none;
		border-bottom: 1px solid transparent;
		transition: border-color 0.15s ease;
	}
	:global(.comark-content a:hover) {
		border-bottom-color: var(--colors-accent-blue);
	}
	:global(.comark-content table) {
		border-collapse: collapse;
		width: 100%;
		margin: 0.75em 0;
		font-size: 0.9em;
	}
	:global(.comark-content th),
	:global(.comark-content td) {
		border: 1px solid var(--colors-hairline);
		padding: 6px 12px;
		text-align: left;
	}
	:global(.comark-content th) {
		background: rgba(255, 255, 255, 0.04);
		font-weight: 600;
	}
	:global(.comark-content hr) {
		border: none;
		border-top: 1px solid var(--colors-hairline);
		margin: 1em 0;
	}
	:global(.comark-content img) {
		max-width: 100%;
		border-radius: 8px;
		margin: 0.5em 0;
	}

	@media (prefers-reduced-motion: reduce) {
		:global(.block-cursor) {
			animation: none !important;
			opacity: 0.7;
		}
	}
</style>
