import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import db from '$lib/db';
import { getClientFromRequest } from '$lib/jwt';

export const GET: RequestHandler = async ({ request, params }) => {
	const payload = getClientFromRequest(request);
	if (!payload) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const deviceRowId = Number(params.id);
	if (isNaN(deviceRowId)) {
		return json({ error: 'Invalid device id' }, { status: 400 });
	}

	const device = db
		.prepare(
			`SELECT id, device_id, mithun_name, active, created_at
			FROM devices
			WHERE id = ? AND client_id = ?`
		)
		.get(deviceRowId, payload.id) as {
		id: number;
		device_id: string;
		mithun_name: string;
		active: number;
		created_at: string;
	} | undefined;

	if (!device) {
		return json({ error: 'Device not found' }, { status: 404 });
	}

	const latest = db
		.prepare(
			`SELECT id, lat, lng, ts FROM locations
			WHERE device_id = ?
			ORDER BY ts DESC
			LIMIT 1`
		)
		.get(device.device_id) as { id: number; lat: number; lng: number; ts: string } | undefined;

	return json({
		id: device.id,
		device_id: device.device_id,
		mithun_name: device.mithun_name,
		active: device.active === 1,
		created_at: device.created_at,
		latest_location: latest ?? null
	});
};
