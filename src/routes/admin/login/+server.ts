import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { username, password } = await request.json();

	if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
		cookies.set('admin_session', 'authenticated', {
			path: '/',
			httpOnly: true,
			maxAge: 60 * 60 * 24 // 24 hours
		});

		return json({ success: true });
	}

	return json({ success: false, message: 'Invalid username or password' });
};
