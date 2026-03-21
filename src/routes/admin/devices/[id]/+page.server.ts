import db from '$lib/db';
import { fail, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	const device = db.prepare(`
		SELECT d.*, c.name as client_name
		FROM devices d
		LEFT JOIN clients c ON c.id = d.client_id
		WHERE d.id = ?
	`).get(params.id) as Record<string, unknown> | undefined;

	if (!device) error(404, 'Device not found');

	const pings = db.prepare(`
		SELECT id, lat, lng, ts
		FROM locations
		WHERE device_id = ?
		ORDER BY ts DESC
		LIMIT 200
	`).all(device.device_id as string) as { id: number; lat: number; lng: number; ts: string }[];

	const clients = db.prepare('SELECT id, name FROM clients WHERE active = 1 ORDER BY name').all();

	return { device, pings, clients };
};

export const actions: Actions = {
	update: async ({ request, params }) => {
		const fd = await request.formData();
		const device_id = (fd.get('device_id') as string)?.trim().toUpperCase();
		const mithun_name = (fd.get('mithun_name') as string)?.trim();
		const client_id = (fd.get('client_id') as string)?.trim() || null;

		if (!device_id || !mithun_name) {
			return fail(400, { error: 'Device ID and Mithun name are required' });
		}

		const conflict = db.prepare('SELECT 1 FROM devices WHERE device_id = ? AND id != ?').get(device_id, params.id);
		if (conflict) return fail(400, { error: `Device ID "${device_id}" already in use` });

		db.prepare('UPDATE devices SET device_id = ?, mithun_name = ?, client_id = ? WHERE id = ?')
			.run(device_id, mithun_name, client_id, params.id);

		return { success: true };
	},

	toggle: async ({ params }) => {
		const device = db.prepare('SELECT active FROM devices WHERE id = ?').get(params.id) as { active: number } | undefined;
		if (!device) return fail(404, { error: 'Device not found' });
		db.prepare('UPDATE devices SET active = ? WHERE id = ?').run(device.active ? 0 : 1, params.id);
		return { success: true };
	},

	deletePing: async ({ request }) => {
		const fd = await request.formData();
		const id = fd.get('id') as string;
		db.prepare('DELETE FROM locations WHERE id = ?').run(id);
		return { success: true };
	}
};
