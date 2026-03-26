import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import db from '$lib/db';
import { getClientFromRequest } from '$lib/jwt';

export const GET: RequestHandler = async ({ request }) => {
	const payload = getClientFromRequest(request);
	if (!payload) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const client = db
		.prepare('SELECT id, name, email, phone, address, active, created_at FROM clients WHERE id = ?')
		.get(payload.id) as {
		id: string;
		name: string;
		email: string;
		phone: string | null;
		address: string | null;
		active: number;
		created_at: string;
	} | undefined;

	if (!client) {
		return json({ error: 'Client not found' }, { status: 404 });
	}

	if (!client.active) {
		return json({ error: 'Account is inactive' }, { status: 403 });
	}

	return json({
		id: client.id,
		name: client.name,
		email: client.email,
		phone: client.phone,
		address: client.address,
		active: client.active === 1,
		created_at: client.created_at
	});
};
