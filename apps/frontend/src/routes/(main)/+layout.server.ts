import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import type { Conversation } from '@openbot/shared';
import { serverApiFetch } from '$lib/server/api';

export const load: LayoutServerLoad = async ({ locals }) => {
	const auth = locals.auth();
	if (!auth?.userId) {
		throw redirect(307, '/sign-in');
	}

	let conversations: Conversation[] = [];
	try {
		const res = await serverApiFetch(
			'/api/conversations',
			() => locals.auth().getToken() ?? Promise.resolve(null)
		);
		if (res.ok) {
			const json = await res.json();
			if (json?.success && Array.isArray(json.data)) {
				conversations = json.data as Conversation[];
			}
		}
	} catch {
		// Sidebar client hook will retry; don't block render.
	}

	return { conversations };
};
