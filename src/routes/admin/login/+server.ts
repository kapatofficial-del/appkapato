import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import db from '$lib/db';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { username, password } = await request.json();

	const user = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username, password);

	if (user) {
		cookies.set('admin_session', 'authenticated', {
			path: '/',
			httpOnly: true,
			maxAge: 60 * 60 * 24 // 24 hours
		});

		return json({ success: true });
	}

	return json({ success: false, message: 'Invalid username or password' });
};
