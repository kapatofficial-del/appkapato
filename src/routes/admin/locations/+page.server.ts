import db from '$lib/db';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	const pings = db.prepare(`
		SELECT l.id, l.device_id, d.mithun_name, l.lat, l.lng, l.ts
		FROM locations l
		LEFT JOIN devices d ON l.device_id = d.device_id
		ORDER BY l.ts DESC
		LIMIT 100
	`).all();

	const devices = db.prepare('SELECT device_id, mithun_name FROM devices ORDER BY device_id').all() as { device_id: string; mithun_name: string }[];

	return { pings, devices };
};

export const actions: Actions = {
	delete: async ({ request }) => {
		const fd = await request.formData();
		const id = fd.get('id') as string;
		db.prepare('DELETE FROM locations WHERE id = ?').run(id);
		return { success: true };
	},

	deleteMany: async ({ request }) => {
		const fd = await request.formData();
		const ids = fd.getAll('ids').map((v) => parseInt(v as string)).filter((n) => !isNaN(n));
		if (ids.length === 0) return fail(400, { error: 'No rows selected' });
		const placeholders = ids.map(() => '?').join(', ');
		db.prepare(`DELETE FROM locations WHERE id IN (${placeholders})`).run(...ids);
		return { success: true };
	}
};
