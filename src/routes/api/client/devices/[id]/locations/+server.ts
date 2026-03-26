import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import db from '$lib/db';
import { getClientFromRequest } from '$lib/jwt';

export const GET: RequestHandler = async ({ request, params, url }) => {
	const payload = getClientFromRequest(request);
	if (!payload) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const deviceRowId = Number(params.id);
	if (isNaN(deviceRowId)) {
		return json({ error: 'Invalid device id' }, { status: 400 });
	}

	// verify device belongs to this client
	const device = db
		.prepare('SELECT device_id FROM devices WHERE id = ? AND client_id = ?')
		.get(deviceRowId, payload.id) as { device_id: string } | undefined;

	if (!device) {
		return json({ error: 'Device not found' }, { status: 404 });
	}

	const limit = Math.min(Number(url.searchParams.get('limit') ?? '50'), 200);
	const offset = Number(url.searchParams.get('offset') ?? '0');

	const locations = db
		.prepare(
			`SELECT id, lat, lng, ts
			FROM locations
			WHERE device_id = ?
			ORDER BY ts DESC
			LIMIT ? OFFSET ?`
		)
		.all(device.device_id, limit, offset) as { id: number; lat: number; lng: number; ts: string }[];

	const total = (db
		.prepare('SELECT COUNT(*) as count FROM locations WHERE device_id = ?')
		.get(device.device_id) as { count: number }).count;

	return json({
		data: locations,
		pagination: {
			total,
			limit,
			offset,
			has_more: offset + limit < total
		}
	});
};
