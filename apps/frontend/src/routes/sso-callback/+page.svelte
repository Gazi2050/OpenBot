<script lang="ts">
	import { AuthenticateWithRedirectCallback } from 'svelte-clerk/client';
</script>

<AuthenticateWithRedirectCallback signInUrl="/sign-in" signUpUrl="/sign-up" />
