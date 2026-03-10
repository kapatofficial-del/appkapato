import db from '$lib/db';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	const devices = db.prepare('SELECT * FROM devices ORDER BY created_at DESC').all();
	return { devices };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const device_id = (data.get('device_id') as string)?.trim().toUpperCase();
		const mithun_name = (data.get('mithun_name') as string)?.trim();

		if (!device_id || !mithun_name) {
			return fail(400, { error: 'All fields are required' });
		}

		try {
			db.prepare('INSERT INTO devices (device_id, mithun_name) VALUES (?, ?)').run(device_id, mithun_name);
		} catch {
			return fail(400, { error: 'Device ID already exists' });
		}

		return { success: true };
	},

	toggle: async ({ request }) => {
		const data = await request.formData();
		const device_id = data.get('device_id') as string;
		const active = data.get('active') === '1' ? 0 : 1;
		db.prepare('UPDATE devices SET active = ? WHERE device_id = ?').run(active, device_id);
		return { success: true };
	},

	delete: async ({ request }) => {
		const data = await request.formData();
		const device_id = data.get('device_id') as string;
		db.prepare('DELETE FROM devices WHERE device_id = ?').run(device_id);
		return { success: true };
	}
};
