<script lang="ts">
	import { Comark } from '@comark/svelte';

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

<Comark {markdown} {streaming} caret class={className} />
