import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import db from '$lib/db';
import { getClientFromRequest } from '$lib/jwt';

export const GET: RequestHandler = async ({ request }) => {
	const payload = getClientFromRequest(request);
	if (!payload) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const devices = db
		.prepare(
			`SELECT
				d.id,
				d.device_id,
				d.mithun_name,
				d.active,
				d.created_at,
				l.lat        AS last_lat,
				l.lng        AS last_lng,
				l.ts         AS last_ping
			FROM devices d
			LEFT JOIN locations l ON l.id = (
				SELECT id FROM locations
				WHERE device_id = d.device_id
				ORDER BY ts DESC
				LIMIT 1
			)
			WHERE d.client_id = ?
			ORDER BY d.created_at DESC`
		)
		.all(payload.id) as {
		id: number;
		device_id: string;
		mithun_name: string;
		active: number;
		created_at: string;
		last_lat: number | null;
		last_lng: number | null;
		last_ping: string | null;
	}[];

	return json(
		devices.map((d) => ({
			id: d.id,
			device_id: d.device_id,
			mithun_name: d.mithun_name,
			active: d.active === 1,
			created_at: d.created_at,
			last_location: d.last_lat !== null
				? { lat: d.last_lat, lng: d.last_lng, ts: d.last_ping }
				: null
		}))
	);
};
