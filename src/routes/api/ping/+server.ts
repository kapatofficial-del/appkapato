import { text } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import db from '$lib/db';

export const POST: RequestHandler = async ({ request }) => {
	const { id, lat, lng } = await request.json();

	if (!id || !lat || !lng) {
		return text('ERR', { status: 400 });
	}

	const device = db.prepare('SELECT device_id FROM devices WHERE device_id = ? AND active = 1').get(id);

	if (!device) {
		return text('ERR', { status: 404 });
	}

	db.prepare('INSERT INTO locations (device_id, lat, lng) VALUES (?, ?, ?)').run(id, lat, lng);

	return text('OK');
};
