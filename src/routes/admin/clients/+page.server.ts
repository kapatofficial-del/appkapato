import db from '$lib/db';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	const clients = db.prepare('SELECT * FROM clients ORDER BY created_at DESC').all();
	return { clients };
};

export const actions: Actions = {
	create: async ({ request }) => {
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
				'INSERT INTO clients (name, email, password, phone, address) VALUES (?, ?, ?, ?, ?)'
			).run(name, email, password, phone, address);
		} catch {
			return fail(400, { error: 'Email already exists' });
		}

		return { success: true };
	},

	update: async ({ request }) => {
		const fd = await request.formData();
		const id = fd.get('id') as string;
		const name = (fd.get('name') as string)?.trim();
		const email = (fd.get('email') as string)?.trim().toLowerCase();
		const password = (fd.get('password') as string)?.trim();
		const phone = (fd.get('phone') as string)?.trim() || null;
		const address = (fd.get('address') as string)?.trim() || null;

		if (!id || !name || !email || !password) {
			return fail(400, { error: 'Name, email and password are required' });
		}

		try {
			db.prepare(
				'UPDATE clients SET name = ?, email = ?, password = ?, phone = ?, address = ? WHERE id = ?'
			).run(name, email, password, phone, address, id);
		} catch {
			return fail(400, { error: 'Email already in use by another client' });
		}

		return { success: true };
	},

	toggle: async ({ request }) => {
		const fd = await request.formData();
		const id = fd.get('id') as string;
		const active = fd.get('active') === '1' ? 0 : 1;
		db.prepare('UPDATE clients SET active = ? WHERE id = ?').run(active, id);
		return { success: true };
	},

	delete: async ({ request }) => {
		const fd = await request.formData();
		const id = fd.get('id') as string;
		db.prepare('DELETE FROM clients WHERE id = ?').run(id);
		return { success: true };
	}
};
