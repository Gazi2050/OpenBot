import { useClerkContext } from 'svelte-clerk/client';

export async function apiFetch(url: string, options: RequestInit = {}) {
	const ctx = useClerkContext();
	const token = await ctx.session?.getToken();

	return fetch(url, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...options.headers
		}
	});
}
