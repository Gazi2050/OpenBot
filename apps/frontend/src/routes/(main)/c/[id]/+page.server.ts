import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Conversation, Message } from '@openbot/shared';
import { serverApiFetch } from '$lib/server/api';

export const load: PageServerLoad = async ({ params, locals }) => {
	const auth = locals.auth();
	if (!auth?.userId) {
		throw redirect(307, '/sign-in');
	}

	const id = params.id;
	const res = await serverApiFetch(
		`/api/conversations/${id}`,
		() => locals.auth().getToken() ?? Promise.resolve(null)
	);

	if (res.status === 404) {
		throw error(404, 'Conversation not found');
	}
	if (!res.ok) {
		throw error(res.status ?? 500, 'Failed to load conversation');
	}

	const json = await res.json();
	if (!json?.success || !json?.data) {
		throw error(500, 'Malformed conversation response');
	}

	const { conversation, messages } = json.data as {
		conversation: Conversation;
		messages: Message[];
	};

	return { conversation, messages };
};
