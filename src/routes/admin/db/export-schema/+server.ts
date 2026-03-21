import db from '$lib/db';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
	const tables = db.prepare(
		`SELECT name, sql FROM sqlite_master WHERE type='table' AND sql IS NOT NULL AND name NOT LIKE 'sqlite_%' ORDER BY name`
	).all() as { name: string; sql: string }[];

	const lines: string[] = [
		`-- Kapato Database Schema`,
		`-- Exported: ${new Date().toISOString()}`,
		`-- Tables: ${tables.length}`,
		``
	];

	for (const table of tables) {
		lines.push(`-- Table: ${table.name}`);
		lines.push(`${table.sql};`);
		lines.push(``);
	}

	const sql = lines.join('\n');
	const filename = `kapato-schema-${new Date().toISOString().slice(0, 10)}.sql`;

	return new Response(sql, {
		headers: {
			'Content-Type': 'text/plain',
			'Content-Disposition': `attachment; filename="${filename}"`
		}
	});
};
