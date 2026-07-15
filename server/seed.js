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

const categories = [
  { name: 'Tops', slug: 'tops' },
  { name: 'Dresses', slug: 'dresses' },
  { name: 'Handbags', slug: 'handbags' },
  { name: 'Footwear', slug: 'footwear' },
  { name: 'Trousers', slug: 'trousers' },
  { name: 'Coords', slug: 'coords' },
];

const insertCat = db.prepare('INSERT OR IGNORE INTO categories (name, slug) VALUES (?, ?)');
for (const c of categories) insertCat.run(c.name, c.slug);

const products = [
  { name: 'Tie Back Halter Fitted Top in Powder Blue', slug: 'tie-back-halter-top-powder-blue', price: 749, cat: 'tops', img: 'https://littleboxindia.com/cdn/shop/files/20260625101011-TP13301_20_2.jpg?v=1783617144&width=480' },
  { name: 'V-Neck Collared Knit Fitted Top in Navy', slug: 'v-neck-collared-knit-top-navy', price: 599, cat: 'tops', img: 'https://littleboxindia.com/cdn/shop/files/V-Neck_Collared_Layered_Look_Fitted_Knit_Top_in_Navy_Blue.webp?v=1769775291&width=480' },
  { name: 'Asymmetric Neck Curved Hem Half Sleeve Top', slug: 'asymmetric-neck-curved-hem-top', price: 799, cat: 'tops', img: 'https://littleboxindia.com/cdn/shop/files/20260603103035-3.jpg?v=1780591852&width=480' },
  { name: 'Ruched Waist Batwing Sleeve Mini Dress in Dusty Blue', slug: 'ruched-waist-batwing-dress-dusty-blue', price: 999, cat: 'dresses', img: 'https://littleboxindia.com/cdn/shop/files/20260703124130-DR14223_20_1.jpg?v=1783676885&width=480' },
  { name: 'Off Shoulder Mesh Ruched Fitted Dress in Coco', slug: 'off-shoulder-mesh-dress-coco', price: 1199, cat: 'dresses', img: 'https://littleboxindia.com/cdn/shop/files/Off_Shoulder_Mesh_Ruched_Fitted_Dress_With_Long_Sleeve_in_Coco_0.webp?v=1784022172&width=480' },
  { name: 'Maroon Faux Fishbone One-Shoulder Dress', slug: 'maroon-faux-fishbone-dress', price: 1199, cat: 'dresses', img: 'https://littleboxindia.com/cdn/shop/files/Maroon_Faux_Fishbone_Design_Romantic_One-Shoulder_Dress.webp?v=1754570398&width=480' },
  { name: 'Functional Shoulder Bag With Contrast Strap', slug: 'functional-shoulder-bag-contrast-strap', price: 2199, cat: 'handbags', img: 'https://littleboxindia.com/cdn/shop/files/20260512114021-SHB1035_20_1.jpg?v=1778659618&width=480' },
  { name: 'Adjustable Strap Shoulder Bag in Espresso', slug: 'adjustable-strap-shoulder-bag-espresso', price: 2399, cat: 'handbags', img: 'https://littleboxindia.com/cdn/shop/files/20260512114315-SHB1034_20_1.jpg?v=1778659317&width=480' },
  { name: 'Glossy Shoulder Bag With Tie Detail in Red', slug: 'glossy-shoulder-bag-tie-detail-red', price: 1399, cat: 'handbags', img: 'https://littleboxindia.com/cdn/shop/files/20260512104923-SHB1004_20_4.jpg?v=1778657418&width=480' },
  { name: 'Double Buckle Strap Platform Mary Jane in Black', slug: 'double-buckle-platform-mary-jane-black', price: 1699, cat: 'footwear', img: 'https://littleboxindia.com/cdn/shop/files/20260605105653-PL1311_20_2.jpg?v=1780661873&width=480' },
  { name: 'Motorcycle Side Zipper Chunky Sole Knee Boots', slug: 'motorcycle-side-zipper-knee-boots', price: 1799, cat: 'footwear', img: 'https://littleboxindia.com/cdn/shop/files/Motorcycle_Side_Zipper_Chunky_Sole_Knee_Boots.jpg?v=1769686487&width=480' },
  { name: 'Oxford Lace Up Brogue Boots', slug: 'oxford-lace-up-brogue-boots', price: 1799, cat: 'footwear', img: 'https://littleboxindia.com/cdn/shop/files/20260422111623-BT1294_4.jpg?v=1776949362&width=480' },
  { name: 'High Waist Wide Leg Linen Trousers in White', slug: 'high-waist-wide-leg-linen-trousers-white', price: 999, cat: 'trousers', img: 'https://littleboxindia.com/cdn/shop/files/High_Waist_Wide_Leg_Linen_Trousers_In_White.webp?v=1769519079&width=480' },
  { name: 'Striped Suit Pants High Waist in Brown', slug: 'striped-suit-pants-high-waist-brown', price: 1099, cat: 'trousers', img: 'https://littleboxindia.com/cdn/shop/files/Striped_Suit_Pants_High_Waist_Trousers_in_Brown.jpg?v=1781597998&width=480' },
  { name: 'High Waist Pleated Trousers in Black', slug: 'high-waist-pleated-trousers-black', price: 1099, cat: 'trousers', img: 'https://littleboxindia.com/cdn/shop/products/High_Waist_Pleated_Trousers_In_Black.jpg?v=1769664453&width=480' },
  { name: 'Tie Front Shrug & Cami Dress Co-Ord in Cocoa', slug: 'tie-front-shrug-cami-coord-cocoa', price: 1599, cat: 'coords', img: 'https://littleboxindia.com/cdn/shop/files/20260709122819-set_203a.jpg?v=1783613995&width=480' },
  { name: 'Off Shoulder Crop Top & Wide Leg Pant in Grey', slug: 'off-shoulder-crop-top-wide-leg-pant-grey', price: 899, cat: 'coords', img: 'https://littleboxindia.com/cdn/shop/products/Off_Shoulder_Crop_Top_And_Wide_Leg_Pant_In_Grey.jpg?v=1741852524&width=480' },
  { name: 'Striped V-Neck Jacket & Wide-Leg Pants Suit', slug: 'striped-v-neck-jacket-wide-leg-pants-suit', price: 1849, cat: 'coords', img: 'https://littleboxindia.com/cdn/shop/files/Navy_Blue_Striped_V-Neck_Asymmetric_Long_Sleeve_Jacket_Wide-Leg_Pants_Suit.jpg?v=1770297504&width=480' },
];

const catMap = {};
for (const c of categories) { const row = db.prepare('SELECT id FROM categories WHERE slug = ?').get(c.slug); if (row) catMap[c.slug] = row.id; }

const insertProduct = db.prepare('INSERT OR IGNORE INTO products (name, slug, price, image_url, category_id, stock) VALUES (?, ?, ?, ?, ?, ?)');
const insertMany = db.transaction(() => {
  for (const p of products) {
    insertProduct.run(p.name, p.slug, p.price, p.img, catMap[p.cat], 100);
  }
});
insertMany();

console.log(`Seeded ${categories.length} categories and ${products.length} products`);
