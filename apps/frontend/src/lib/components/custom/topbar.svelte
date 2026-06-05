<script lang="ts">
	import * as SidebarPrimitive from '$lib/components/ui/sidebar/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import ModelSelector from './model-selector.svelte';
	import Share from '@lucide/svelte/icons/share';
</script>

<header class="flex h-16 items-center justify-between border-b border-hairline px-4">
	<div>
		<SidebarPrimitive.Trigger class="-ml-1 rounded-lg hover:bg-surface-card" />
	</div>
	<div class="mx-auto">
		<ModelSelector />
	</div>
	<Button
		variant="outline"
		class="h-9 gap-2 rounded-xl border-hairline bg-surface-elevated px-3.5 text-sm font-semibold text-ink hover:bg-surface-card"
	>
		<Share class="size-4 text-icon-default" />
		Share
	</Button>
</header>
