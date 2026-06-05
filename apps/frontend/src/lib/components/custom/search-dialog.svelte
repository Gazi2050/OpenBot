<script lang="ts">
	import * as Command from '$lib/components/ui/command/index.js';
	import MessageSquare from '@lucide/svelte/icons/message-square';

	let { open = $bindable(false) } = $props();
</script>

<Command.Dialog bind:open>
	<Command.Input placeholder="Search chats..." />
	<Command.List>
		<Command.Empty>No chats found.</Command.Empty>
		<Command.Group heading="Recent Chats">
			<Command.Item>
				<MessageSquare class="me-2 size-4" />
				<span>React hooks explanation</span>
			</Command.Item>
			<Command.Item>
				<MessageSquare class="me-2 size-4" />
				<span>Weather in San Francisco</span>
			</Command.Item>
			<Command.Item>
				<MessageSquare class="me-2 size-4" />
				<span>Debug Node.js authentication</span>
			</Command.Item>
			<Command.Item>
				<MessageSquare class="me-2 size-4" />
				<span>Plan trip to Tokyo</span>
			</Command.Item>
		</Command.Group>
	</Command.List>
</Command.Dialog>
