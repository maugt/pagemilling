const Database = require('better-sqlite3');
const path = require('path');

const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'riders.db');

let db;

function getDb() {
  if (!db) {
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.exec(`
      CREATE TABLE IF NOT EXISTS riders (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        count INTEGER NOT NULL DEFAULT 0
      )
    `);
  }
  return db;
}

function getAllRiders() {
  return getDb().prepare('SELECT id, name, count FROM riders ORDER BY count DESC').all();
}

function getRiderById(id) {
  return getDb().prepare('SELECT id, name, count FROM riders WHERE id = ?').get(id);
}

function createRider({ id, name, count }) {
  return getDb().prepare('INSERT INTO riders (id, name, count) VALUES (?, ?, ?)').run(id, name, count);
}

function updateRider(id, { name, count }) {
  return getDb().prepare('UPDATE riders SET name = ?, count = ? WHERE id = ?').run(name, count, id);
}

function deleteRider(id) {
  return getDb().prepare('DELETE FROM riders WHERE id = ?').run(id);
}

module.exports = { getAllRiders, getRiderById, createRider, updateRider, deleteRider };
