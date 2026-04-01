import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/api/client')) {
		if (event.request.method === 'OPTIONS') {
			return new Response(null, {
				status: 204,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type, Authorization'
				}
			});
		}

		const response = await resolve(event);
		const headers = new Headers(response.headers);
		headers.set('Access-Control-Allow-Origin', '*');
		headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
		headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
		return new Response(response.body, { status: response.status, headers });
	}

	return resolve(event);
};
