import Database from 'better-sqlite3';
import { join } from 'path';

// database file is stored at /data/kapato.db
const db = new Database(join(process.cwd(), 'data', 'kapato.db'));

// enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// create tables if they don't exist yet
db.exec(`
	CREATE TABLE IF NOT EXISTS users (
		id         INTEGER PRIMARY KEY AUTOINCREMENT,
		username   TEXT NOT NULL UNIQUE,
		password   TEXT NOT NULL,
		role       TEXT NOT NULL DEFAULT 'admin',
		created_at TEXT NOT NULL DEFAULT (datetime('now'))
	);

	CREATE TABLE IF NOT EXISTS devices (
		id          INTEGER PRIMARY KEY AUTOINCREMENT,
		device_id   TEXT NOT NULL UNIQUE,
		mithun_name TEXT NOT NULL,
		active      INTEGER NOT NULL DEFAULT 1,
		created_at  TEXT NOT NULL DEFAULT (datetime('now'))
	);

	CREATE TABLE IF NOT EXISTS locations (
		id        INTEGER PRIMARY KEY AUTOINCREMENT,
		device_id TEXT NOT NULL,
		lat       REAL NOT NULL,
		lng       REAL NOT NULL,
		ts        TEXT NOT NULL DEFAULT (datetime('now'))
	);
`);

// seed default admin if no users exist
const userCount = (db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number }).count;
if (userCount === 0) {
	db.prepare("INSERT INTO users (username, password) VALUES (?, ?)").run('admin', 'kapato123');
}

export default db;
