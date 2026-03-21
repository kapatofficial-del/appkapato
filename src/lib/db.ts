import Database from 'better-sqlite3';

const DB_PATH = process.env.DB_PATH ?? './data/kapato.db';
const db = new Database(DB_PATH);

// enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// create tables if they don't exist yet
db.exec(`
	CREATE TABLE IF NOT EXISTS clients (
		id         TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-' || lower(hex(randomblob(2))) || '-' || lower(hex(randomblob(2))) || '-' || lower(hex(randomblob(6)))),
		name       TEXT NOT NULL,
		email      TEXT NOT NULL UNIQUE,
		password   TEXT NOT NULL,
		phone      TEXT,
		address    TEXT,
		active     INTEGER NOT NULL DEFAULT 1,
		created_at TEXT NOT NULL DEFAULT (datetime('now'))
	);

	CREATE TABLE IF NOT EXISTS devices (
		id          INTEGER PRIMARY KEY AUTOINCREMENT,
		device_id   TEXT NOT NULL UNIQUE,
		mithun_name TEXT NOT NULL,
		client_id   TEXT REFERENCES clients(id),
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

export default db;
