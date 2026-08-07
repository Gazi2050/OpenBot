<script lang="ts">
	import { AuthenticateWithRedirectCallback, ClerkLoaded } from 'svelte-clerk/client';
</script>

<div class="flex min-h-svh items-center justify-center bg-canvas">
	<div class="flex flex-col items-center gap-4">
		<svg
			class="size-8 animate-spin text-accent-lime"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
		>
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
			<path
				class="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
			/>
		</svg>
		<p class="text-sm text-mute-text">Completing authentication...</p>
		<ClerkLoaded>
			<AuthenticateWithRedirectCallback signInUrl="/sign-in" signUpUrl="/sign-up" />
		</ClerkLoaded>
	</div>
</div>
