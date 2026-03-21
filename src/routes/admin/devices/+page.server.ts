import db from '$lib/db';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

function nextDeviceId(): string {
	const last = db
		.prepare(`SELECT device_id FROM devices WHERE device_id GLOB 'KPT[0-9][0-9][0-9]' ORDER BY device_id DESC LIMIT 1`)
		.get() as { device_id: string } | undefined;
	if (!last) return 'KPT001';
	const num = parseInt(last.device_id.slice(3));
	return `KPT${String(num + 1).padStart(3, '0')}`;
}

export const load: PageServerLoad = () => {
	const devices = db.prepare(`
		SELECT d.*, c.name as client_name
		FROM devices d
		LEFT JOIN clients c ON c.id = d.client_id
		ORDER BY d.created_at DESC
	`).all();
	const clients = db.prepare('SELECT id, name FROM clients WHERE active = 1 ORDER BY name').all();
	const nextId = nextDeviceId();
	return { devices, clients, nextId };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const fd = await request.formData();
		const device_id = (fd.get('device_id') as string)?.trim().toUpperCase();
		const mithun_name = (fd.get('mithun_name') as string)?.trim();
		const client_id = (fd.get('client_id') as string)?.trim() || null;

		if (!device_id || !mithun_name) {
			return fail(400, { error: 'Device ID and Mithun name are required' });
		}

		const exists = db.prepare('SELECT 1 FROM devices WHERE device_id = ?').get(device_id);
		if (exists) return fail(400, { error: `Device ID "${device_id}" already exists` });

		db.prepare('INSERT INTO devices (device_id, mithun_name, client_id) VALUES (?, ?, ?)').run(device_id, mithun_name, client_id);
		return { success: true };
	},

	update: async ({ request }) => {
		const fd = await request.formData();
		const id = parseInt(fd.get('id') as string);
		const device_id = (fd.get('device_id') as string)?.trim().toUpperCase();
		const mithun_name = (fd.get('mithun_name') as string)?.trim();
		const client_id = (fd.get('client_id') as string)?.trim() || null;

		if (!id || !device_id || !mithun_name) {
			return fail(400, { error: 'Device ID and Mithun name are required' });
		}

		const conflict = db.prepare('SELECT 1 FROM devices WHERE device_id = ? AND id != ?').get(device_id, id);
		if (conflict) return fail(400, { error: `Device ID "${device_id}" already in use` });

		db.prepare('UPDATE devices SET device_id = ?, mithun_name = ?, client_id = ? WHERE id = ?').run(device_id, mithun_name, client_id, id);
		return { success: true };
	},

	toggle: async ({ request }) => {
		const fd = await request.formData();
		const id = fd.get('id') as string;
		const active = fd.get('active') === '1' ? 0 : 1;
		db.prepare('UPDATE devices SET active = ? WHERE id = ?').run(active, id);
		return { success: true };
	},

	delete: async ({ request }) => {
		const fd = await request.formData();
		const id = fd.get('id') as string;
		db.prepare('DELETE FROM devices WHERE id = ?').run(id);
		return { success: true };
	}
};
