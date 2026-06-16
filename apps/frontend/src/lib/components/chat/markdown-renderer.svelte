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

<Comark {markdown} {streaming} caret class={className} components={{ mermaid: Mermaid }} plugins={[mermaid()]} />
