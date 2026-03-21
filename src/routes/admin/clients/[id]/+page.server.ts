import db from '$lib/db';
import { fail, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	const client = db.prepare('SELECT * FROM clients WHERE id = ?').get(params.id) as Record<string, unknown> | undefined;
	if (!client) error(404, 'Client not found');

	const devices = db.prepare(`
		SELECT * FROM devices WHERE client_id = ? ORDER BY created_at DESC
	`).all(params.id);

	const unassigned = db.prepare(`
		SELECT * FROM devices WHERE client_id IS NULL ORDER BY device_id
	`).all();

	return { client, devices, unassigned };
};

export const actions: Actions = {
	update: async ({ request, params }) => {
		const fd = await request.formData();
		const name = (fd.get('name') as string)?.trim();
		const email = (fd.get('email') as string)?.trim().toLowerCase();
		const password = (fd.get('password') as string)?.trim();
		const phone = (fd.get('phone') as string)?.trim() || null;
		const address = (fd.get('address') as string)?.trim() || null;

		if (!name || !email || !password) {
			return fail(400, { error: 'Name, email and password are required' });
		}

		try {
			db.prepare(
				'UPDATE clients SET name = ?, email = ?, password = ?, phone = ?, address = ? WHERE id = ?'
			).run(name, email, password, phone, address, params.id);
		} catch {
			return fail(400, { error: 'Email already in use by another client' });
		}

		return { success: true };
	},

	toggle: async ({ params }) => {
		const client = db.prepare('SELECT active FROM clients WHERE id = ?').get(params.id) as { active: number } | undefined;
		if (!client) return fail(404, { error: 'Client not found' });
		db.prepare('UPDATE clients SET active = ? WHERE id = ?').run(client.active ? 0 : 1, params.id);
		return { success: true };
	},

	assignDevice: async ({ request, params }) => {
		const fd = await request.formData();
		const device_id = fd.get('device_id') as string;
		if (!device_id) return fail(400, { error: 'No device selected' });
		db.prepare('UPDATE devices SET client_id = ? WHERE id = ?').run(params.id, device_id);
		return { success: true };
	},

	unassignDevice: async ({ request }) => {
		const fd = await request.formData();
		const device_id = fd.get('device_id') as string;
		db.prepare('UPDATE devices SET client_id = NULL WHERE id = ?').run(device_id);
		return { success: true };
	}
};
