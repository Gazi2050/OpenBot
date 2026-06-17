import { env } from '$env/dynamic/public';

const BASE_URL = env.PUBLIC_API_URL || 'http://localhost:3000';

type GetToken = () => Promise<string | null>;

export async function serverApiFetch(
	path: string,
	getToken: GetToken,
	options: RequestInit = {}
): Promise<Response> {
	const token = await getToken();
	const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;

	return fetch(url, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...options.headers
		}
	});
}
