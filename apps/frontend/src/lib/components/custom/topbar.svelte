<script lang="ts">
	import * as SidebarPrimitive from '$lib/components/ui/sidebar/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import Share from '@lucide/svelte/icons/share';
</script>

<header
	class="flex h-16 items-center justify-between border-b border-solid border-hairline px-4"
	style="border-bottom: 1px solid rgba(255, 255, 255, 0.08)"
>
	<SidebarPrimitive.Trigger
		class="-ml-1 rounded-lg text-icon-default hover:bg-surface-card [&_svg]:size-5"
	/>
	<Button
		variant="ghost"
		class="h-9 gap-2 rounded-lg border border-hairline bg-surface-elevated px-3.5 text-sm font-semibold text-ink hover:bg-surface-card"
		style="background-color: #2a2a2a"
	>
		<Share class="size-4 text-icon-default" />
		Share
	</Button>
</header>
