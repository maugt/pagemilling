#!/usr/bin/env node

const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const jsonPath = process.argv[2] || path.join(__dirname, '..', 'public', 'riders.json');
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '..', 'data', 'riders.db');

console.log(`Seeding ${dbPath} from ${jsonPath}`);

const riders = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.exec(`
  CREATE TABLE IF NOT EXISTS riders (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    count INTEGER NOT NULL DEFAULT 0
  )
`);

const upsert = db.prepare('INSERT OR REPLACE INTO riders (id, name, count) VALUES (?, ?, ?)');
const insertMany = db.transaction((riders) => {
  for (const r of riders) {
    upsert.run(r.id, r.name, r.count);
  }
});

insertMany(riders);
console.log(`Seeded ${riders.length} riders`);
db.close();
