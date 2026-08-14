import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import express from 'express';
import cors from 'cors';

import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import Product from './models/Product.js';
import Category from './models/Category.js';
import curatedProducts from './curatedProducts.js';

await connectDB();

// Auto-seed curated Bonkerscorner products. Reseeds whenever the curated
// catalog is not present (e.g. empty DB or stale Littlebox seed).
async function seedIfEmpty() {
  try {
    const curated = curatedProducts;
    const curatedSlugs = curated.map(p => p.slug);

    const existing = await Product.find({}, { slug: 1 });
    const existingSlugs = new Set(existing.map(p => p.slug));
    const hasCurated = curatedSlugs.every(s => existingSlugs.has(s));

    if (hasCurated) {
      console.log(`[seed] Curated catalog present (${existing.length} products), skipping seed`);
      return;
    }

    console.log(`[seed] Curated catalog missing (${existing.length} existing) — re-seeding...`);
    // Simplified categories (curated)
    await Product.deleteMany({});
    await Category.deleteMany({ name: { $in: ['Spider-Man','Tops','Polos','Bottoms','Hoodies','Coords','Dance','Dresses','Handbags','Footwear','Trousers'] } });
    const categories = await Category.insertMany([
      { name: 'Spider-Man', slug: 'spider-man' },
      { name: 'Tops', slug: 'tops' },
      { name: 'Polos', slug: 'polos' },
      { name: 'Bottoms', slug: 'bottoms' },
      { name: 'Hoodies', slug: 'hoodies' },
      { name: 'Coords', slug: 'coords' },
      { name: 'Dance', slug: 'dance' },
    ]);
    const catMap = Object.fromEntries(categories.map(c => [c.slug, c._id]));

    const products = curated.map(p => ({
      name: p.name,
      slug: p.slug,
      price: p.price,
      originalPrice: p.compareAtPrice || null,
      discount: p.discount || 0,
      description: 'Streetwear essentials crafted for bold, unisex fits.',
      images: [{ url: p.image, alt: p.name }],
      category: catMap[p.category],
      sizes: p.sizes && p.sizes.length ? p.sizes : [{ size: 'M', stock: 100 }],
      isNewArrival: false,
      isBestSeller: false,
      isFeatured: false,
      isActive: true
    }));

    await Product.insertMany(products);
    console.log(`[seed] Seeded ${products.length} curated Bonkerscorner products`);
  } catch (err) {
    console.error('[seed] Error:', err.message);
  }
}

await seedIfEmpty();

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://lite-bouys-zone.vercel.app',
  'https://bosera.vercel.app'
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || /^https:\/\/.*\.onrender\.com$/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploads
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'BOSERA backend is running'
  });
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payment', paymentRoutes);

app.get('/api/config/razorpay', (req, res) => {
  res.json({
    keyId: process.env.RAZORPAY_KEY_ID
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});