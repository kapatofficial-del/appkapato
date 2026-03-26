import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import db from '$lib/db';
import { signToken } from '$lib/jwt';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json().catch(() => null);

	if (!body?.email || !body?.password) {
		return json({ error: 'email and password are required' }, { status: 400 });
	}

	const email = String(body.email).trim().toLowerCase();
	const password = String(body.password).trim();

	const client = db
		.prepare('SELECT id, name, email, phone, address, active FROM clients WHERE email = ? AND password = ?')
		.get(email, password) as {
		id: string;
		name: string;
		email: string;
		phone: string | null;
		address: string | null;
		active: number;
	} | undefined;

	if (!client) {
		return json({ error: 'Invalid email or password' }, { status: 401 });
	}

	if (!client.active) {
		return json({ error: 'Account is inactive. Please contact support.' }, { status: 403 });
	}

	const token = signToken({ id: client.id, email: client.email });

	return json({
		token,
		client: {
			id: client.id,
			name: client.name,
			email: client.email,
			phone: client.phone,
			address: client.address
		}
	});
};
