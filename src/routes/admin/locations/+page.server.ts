import db from '$lib/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	const pings = db.prepare(`
		SELECT l.id, l.device_id, d.mithun_name, l.lat, l.lng, l.ts
		FROM locations l
		LEFT JOIN devices d ON l.device_id = d.device_id
		ORDER BY l.ts DESC
		LIMIT 100
	`).all();

	return { pings };
};
