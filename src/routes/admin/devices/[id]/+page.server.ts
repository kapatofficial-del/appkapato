import db from '$lib/db';
import { fail, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	const device = db.prepare(`
		SELECT d.*, c.name as client_name, c.phone as client_phone
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
		const board = (fd.get('board') as string)?.trim() || 'BOARD_NODEMCU_ESP32';
		const mode = (fd.get('mode') as string)?.trim() || 'MODE_BOTH';
		const apn = (fd.get('apn') as string)?.trim() || 'airteliot.com';
		const sms_number = (fd.get('sms_number') as string)?.trim() || null;
		const interval_ms = parseInt(fd.get('interval_ms') as string) || 30000;
		const gps_warmup_min = parseInt(fd.get('gps_warmup_min') as string) || 5;
		const gps_timeout_ms = parseInt(fd.get('gps_timeout_ms') as string) || 90000;

		if (!device_id || !mithun_name) {
			return fail(400, { error: 'Device ID and Mithun name are required' });
		}

		const conflict = db.prepare('SELECT 1 FROM devices WHERE device_id = ? AND id != ?').get(device_id, params.id);
		if (conflict) return fail(400, { error: `Device ID "${device_id}" already in use` });

		db.prepare(`
			UPDATE devices
			SET device_id = ?, mithun_name = ?, client_id = ?,
			    board = ?, mode = ?, apn = ?, sms_number = ?,
			    interval_ms = ?, gps_warmup_min = ?, gps_timeout_ms = ?
			WHERE id = ?
		`).run(device_id, mithun_name, client_id, board, mode, apn, sms_number, interval_ms, gps_warmup_min, gps_timeout_ms, params.id);

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
