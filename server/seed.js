require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, 'data');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
const dbPath = path.join(dbDir, 'litebouyszone.db');
const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

const migration = fs.readFileSync(path.join(__dirname, 'migrations', '001_initial.sql'), 'utf8');
db.exec(migration);

const curated = require('../curatedProducts.json');

const catSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const categories = [...new Set(curated.map(p => p.category))].map(name => ({ name, slug: catSlug(name) }));

const insertCat = db.prepare('INSERT OR IGNORE INTO categories (name, slug) VALUES (?, ?)');
for (const c of categories) insertCat.run(c.name, c.slug);

const catMap = {};
for (const c of categories) { const row = db.prepare('SELECT id FROM categories WHERE slug = ?').get(c.slug); if (row) catMap[c.slug] = row.id; }

const insertProduct = db.prepare('INSERT OR IGNORE INTO products (name, slug, price, image_url, category_id, stock) VALUES (?, ?, ?, ?, ?, ?)');
const insertMany = db.transaction(() => {
  for (const p of curated) {
    insertProduct.run(p.name, p.slug, p.price, p.image, catMap[catSlug(p.category)], 100);
  }
});
insertMany();

console.log(`Seeded ${categories.length} categories and ${curated.length} products`);
