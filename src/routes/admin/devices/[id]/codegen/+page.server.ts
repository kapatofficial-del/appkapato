import db from '$lib/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	const device = db.prepare(`
		SELECT d.*, c.name as client_name, c.phone as client_phone
		FROM devices d
		LEFT JOIN clients c ON c.id = d.client_id
		WHERE d.id = ?
	`).get(params.id) as Record<string, unknown> | undefined;

	if (!device) error(404, 'Device not found');
	return { device };
};
