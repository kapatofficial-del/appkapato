import db from '$lib/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	const totalClients   = (db.prepare('SELECT COUNT(*) as c FROM clients').get() as { c: number }).c;
	const activeClients  = (db.prepare('SELECT COUNT(*) as c FROM clients WHERE active = 1').get() as { c: number }).c;
	const totalDevices   = (db.prepare('SELECT COUNT(*) as c FROM devices').get() as { c: number }).c;
	const activeDevices  = (db.prepare('SELECT COUNT(*) as c FROM devices WHERE active = 1').get() as { c: number }).c;
	const totalPings     = (db.prepare('SELECT COUNT(*) as c FROM locations').get() as { c: number }).c;
	const todayPings     = (db.prepare("SELECT COUNT(*) as c FROM locations WHERE ts >= date('now')").get() as { c: number }).c;
	const unassigned     = (db.prepare('SELECT COUNT(*) as c FROM devices WHERE client_id IS NULL').get() as { c: number }).c;

	const recentPings = db.prepare(`
		SELECT l.device_id, d.mithun_name, l.lat, l.lng, l.ts
		FROM locations l
		LEFT JOIN devices d ON d.device_id = l.device_id
		ORDER BY l.ts DESC
		LIMIT 5
	`).all();

	return { totalClients, activeClients, totalDevices, activeDevices, totalPings, todayPings, unassigned, recentPings };
};
