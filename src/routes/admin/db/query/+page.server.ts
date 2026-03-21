import db from '$lib/db';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	return { rows: [], columns: [], error: null, sql: '', rowsAffected: null, ddl: false };
};

export const actions: Actions = {
	run: async ({ request }) => {
		const data = await request.formData();
		const sql = (data.get('sql') as string ?? '').trim();

		if (!sql) return fail(400, { rows: [], columns: [], error: 'No query provided', sql, rowsAffected: null, ddl: false });

		try {
			const firstWord = sql.replace(/\/\*[\s\S]*?\*\/|--[^\n]*/g, '').trim().split(/\s+/)[0].toUpperCase();
			const isReader = ['SELECT', 'PRAGMA', 'EXPLAIN', 'WITH'].includes(firstWord);

			if (isReader) {
				const rows = db.prepare(sql).all() as Record<string, unknown>[];
				const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
				return { rows, columns, error: null, sql, rowsAffected: null, ddl: false };
			} else {
				db.exec(sql);
				return { rows: [], columns: [], error: null, sql, rowsAffected: 0, ddl: true };
			}
		} catch (e: unknown) {
			const message = e instanceof Error ? e.message : String(e);
			return fail(400, { rows: [], columns: [], error: message, sql, rowsAffected: null, ddl: false });
		}
	}
};
