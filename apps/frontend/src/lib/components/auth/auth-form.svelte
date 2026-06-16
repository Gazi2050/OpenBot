<script lang="ts">
	import { useSignIn } from 'svelte-clerk/client';
	import { useSignUp } from 'svelte-clerk/client';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button/index.js';
	import PasswordInput from './password-input.svelte';
	import GoogleOAuthButton from './google-oauth-button.svelte';

	type Props = {
		mode: 'sign-in' | 'sign-up';
	};

	let { mode }: Props = $props();

	const signInState = useSignIn();
	const signUpState = useSignUp();

	let email = $state('');
	let password = $state('');
	let verificationCode = $state('');
	let step = $state<'form' | 'verify'>('form');
	let error = $state('');
	let loading = $state(false);

	const isSignUp = $derived(mode === 'sign-up');
	const title = $derived(isSignUp ? 'Create your account' : 'Sign in to OpenBot');
	const subtitle = $derived(
		isSignUp
			? step === 'form'
				? 'Enter your details to get started with OpenBot.'
				: 'Check your email for a verification code.'
			: 'Welcome back. Enter your credentials to continue.'
	);
	const submitLabel = $derived(
		loading
			? isSignUp
				? 'Creating account...'
				: 'Signing in...'
			: isSignUp
				? 'Sign Up'
				: 'Sign In'
	);
	const footerText = $derived(isSignUp ? 'Already have an account?' : "Don't have an account?");
	const footerLink = $derived(isSignUp ? 'Sign in' : 'Sign up');
	const footerHref = $derived(isSignUp ? resolve('/(auth)/sign-in') : resolve('/(auth)/sign-up'));

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		error = '';
		loading = true;

		try {
			if (isSignUp) {
				if (!signUpState.signUp) return;
				await signUpState.signUp.create({ emailAddress: email, password });
				await signUpState.signUp.verifications.sendEmailCode();
				step = 'verify';
			} else {
				if (!signInState.signIn) return;
				const { error: err } = await signInState.signIn.create({
					identifier: email,
					password
				});
				if (err) {
					error = err.message;
					return;
				}
				if (signInState.signIn.status === 'complete') {
					await signInState.signIn.finalize();
					goto(resolve('/'));
				}
			}
		} catch (err: unknown) {
			const msg = err instanceof Error ? err.message : 'Something went wrong';
			error = msg;
		} finally {
			loading = false;
		}
	}

	async function handleVerify(e: SubmitEvent) {
		e.preventDefault();
		if (!signUpState.signUp) return;
		error = '';
		loading = true;

		try {
			const { error: verifyError } = await signUpState.signUp.verifications.verifyEmailCode({
				code: verificationCode
			});

			if (verifyError) {
				error = verifyError.message;
				return;
			}

			if (signUpState.signUp.status === 'complete') {
				await signUpState.signUp.finalize();
				goto(resolve('/'));
			}
		} catch (err: unknown) {
			const msg = err instanceof Error ? err.message : 'Verification failed';
			error = msg;
		} finally {
			loading = false;
		}
	}

	const globalError = $derived(
		!isSignUp && signInState.errors?.global ? signInState.errors.global[0].message : ''
	);
	const displayError = $derived(error || globalError);
</script>

<div class="w-full max-w-[360px]">
	<h1 class="mb-2 text-center text-ink" style="font: var(--type-welcome-subtitle)">
		{title}
	</h1>
	<p class="mb-8 text-center text-sm text-mute-text">
		{subtitle}
	</p>

	{#if step === 'form'}
		<form onsubmit={handleSubmit} class="flex flex-col gap-4">
			<input
				type="email"
				bind:value={email}
				placeholder="Email"
				required
				class="h-11 w-full rounded-lg border border-hairline bg-surface-input px-4 text-sm text-ink placeholder:text-placeholder-text focus:border-accent-blue focus:outline-none"
			/>

			<PasswordInput bind:value={password} placeholder="Password" required minlength={8} />

			{#if displayError}
				<p class="text-sm text-red-400">{displayError}</p>
			{/if}

			<Button
				type="submit"
				variant="outline"
				disabled={loading}
				class="h-11 w-full rounded-lg font-semibold"
			>
				{submitLabel}
			</Button>
		</form>

		<div class="my-6 flex items-center gap-3">
			<div class="h-px flex-1 bg-hairline"></div>
			<span class="text-xs text-mute-text">or</span>
			<div class="h-px flex-1 bg-hairline"></div>
		</div>

		<GoogleOAuthButton {mode} />
	{:else}
		<form onsubmit={handleVerify} class="flex flex-col gap-4">
			<p class="text-sm text-mute-text">
				We sent a code to <span class="text-ink">{email}</span>
			</p>

			<input
				type="text"
				bind:value={verificationCode}
				placeholder="Verification code"
				required
				class="h-11 w-full rounded-lg border border-hairline bg-surface-input px-4 text-center text-sm tracking-[0.25em] text-ink placeholder:text-placeholder-text focus:border-accent-blue focus:outline-none"
			/>

			{#if error}
				<p class="text-sm text-red-400">{error}</p>
			{/if}

			<Button
				type="submit"
				variant="outline"
				disabled={loading}
				class="h-11 w-full rounded-lg font-semibold"
			>
				{loading ? 'Verifying...' : 'Verify Email'}
			</Button>
		</form>
	{/if}

	<p class="mt-6 text-center text-sm text-mute-text">
		{footerText}
		<a href={footerHref} class="text-accent-blue hover:underline">{footerLink}</a>
	</p>
</div>
