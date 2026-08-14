import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import Product from '../backend/models/Product.js';
import Category from '../backend/models/Category.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bosera';

const catSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('Cleared existing data');

    const curated = JSON.parse(fs.readFileSync(new URL('../curatedProducts.json', import.meta.url), 'utf8'));

    const categories = await Category.insertMany(
      [...new Set(curated.map(p => p.category))].map(name => ({ name, slug: catSlug(name) }))
    );
    console.log(`Seeded ${categories.length} categories`);

    const catMap = {};
    categories.forEach(c => catMap[c.slug] = c._id);

    const products = curated.map(p => ({
      name: p.name,
      slug: p.slug,
      price: p.price,
      originalPrice: p.compareAtPrice || null,
      discount: p.discount || 0,
      description: 'Streetwear essentials crafted for bold, unisex fits.',
      images: [{ url: p.image, alt: p.name }],
      category: catMap[catSlug(p.category)],
      sizes: p.sizes && p.sizes.length ? p.sizes : [{ size: 'M', stock: 100 }],
      isActive: true
    }));

    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products`);

    await mongoose.disconnect();
    console.log('Done');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();