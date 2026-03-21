import db from '$lib/db';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

type ColumnInfo = { cid: number; name: string; type: string; notnull: number; dflt_value: string | null; pk: number };

function getTables() {
	return (db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name`).all() as { name: string }[]).map((t) => t.name);
}

function getColumnInfo(table: string): ColumnInfo[] {
	return db.prepare(`PRAGMA table_info("${table}")`).all() as ColumnInfo[];
}

export const load: PageServerLoad = ({ url }) => {
	const tables = getTables();
	const selected = url.searchParams.get('table') ?? tables[0] ?? null;
	const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1'));
	const limit = 50;
	const offset = (page - 1) * limit;

	let rows: Record<string, unknown>[] = [];
	let columnInfo: ColumnInfo[] = [];
	let total = 0;

	if (selected && tables.includes(selected)) {
		columnInfo = getColumnInfo(selected);
		total = (db.prepare(`SELECT COUNT(*) as count FROM "${selected}"`).get() as { count: number }).count;
		rows = db.prepare(`SELECT rowid as _rid, * FROM "${selected}" LIMIT ? OFFSET ?`).all(limit, offset) as Record<string, unknown>[];
	}

	return { tables, selected, rows, columnInfo, total, page, limit };
};

export const actions: Actions = {
	insert: async ({ request }) => {
		const fd = await request.formData();
		const table = fd.get('__table__') as string;
		const tables = getTables();
		if (!tables.includes(table)) return fail(400, { error: 'Invalid table' });

		const cols = getColumnInfo(table);
		// exclude auto-increment integer pk columns
		const editable = cols.filter((c) => !(c.pk === 1 && c.type.toUpperCase() === 'INTEGER'));
		const names = editable.map((c) => c.name);
		const values = names.map((n) => fd.get(n) ?? null);
		const placeholders = names.map(() => '?').join(', ');

		try {
			db.prepare(`INSERT INTO "${table}" (${names.map((n) => `"${n}"`).join(', ')}) VALUES (${placeholders})`).run(...values);
			return { success: true };
		} catch (e: unknown) {
			return fail(400, { error: e instanceof Error ? e.message : String(e) });
		}
	},

	update: async ({ request }) => {
		const fd = await request.formData();
		const table = fd.get('__table__') as string;
		const rowid = parseInt(fd.get('__rowid__') as string);
		const tables = getTables();
		if (!tables.includes(table)) return fail(400, { error: 'Invalid table' });

		const cols = getColumnInfo(table);
		const names = cols.map((c) => c.name);
		const values = names.map((n) => fd.get(n) ?? null);
		const setClause = names.map((n) => `"${n}" = ?`).join(', ');

		try {
			db.prepare(`UPDATE "${table}" SET ${setClause} WHERE rowid = ?`).run(...values, rowid);
			return { success: true };
		} catch (e: unknown) {
			return fail(400, { error: e instanceof Error ? e.message : String(e) });
		}
	},

	delete: async ({ request }) => {
		const fd = await request.formData();
		const table = fd.get('__table__') as string;
		const rowid = parseInt(fd.get('__rowid__') as string);
		const tables = getTables();
		if (!tables.includes(table)) return fail(400, { error: 'Invalid table' });

		try {
			db.prepare(`DELETE FROM "${table}" WHERE rowid = ?`).run(rowid);
			return { success: true };
		} catch (e: unknown) {
			return fail(400, { error: e instanceof Error ? e.message : String(e) });
		}
	},

	deleteMany: async ({ request }) => {
		const fd = await request.formData();
		const table = fd.get('__table__') as string;
		const tables = getTables();
		if (!tables.includes(table)) return fail(400, { error: 'Invalid table' });

		const rowids = fd.getAll('__rowids__').map((v) => parseInt(v as string)).filter((n) => !isNaN(n));
		if (rowids.length === 0) return fail(400, { error: 'No rows selected' });

		try {
			const placeholders = rowids.map(() => '?').join(', ');
			db.prepare(`DELETE FROM "${table}" WHERE rowid IN (${placeholders})`).run(...rowids);
			return { success: true };
		} catch (e: unknown) {
			return fail(400, { error: e instanceof Error ? e.message : String(e) });
		}
	}
};
