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

await connectDB();

// Auto-seed Bonkerscorner products if empty
async function seedIfEmpty() {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('[seed] Products collection empty — seeding Bonkerscorner products...');
      // Categories
      const categories = await Category.insertMany([
        { name: 'Tops', slug: 'tops' },
        { name: 'Dresses', slug: 'dresses' },
        { name: 'Handbags', slug: 'handbags' },
        { name: 'Footwear', slug: 'footwear' },
        { name: 'Trousers', slug: 'trousers' },
        { name: 'Coords', slug: 'coords' },
      ]);
      const catMap = Object.fromEntries(categories.map(c => [c.slug, c._id]));

      const products = [
        { name: 'Tie Back Halter Fitted Top in Powder Blue', slug: 'tie-back-halter-top-powder-blue', price: 749, category: catMap.tops, description: 'Stylish halter top with tie back detail', image_url: 'https://littleboxindia.com/cdn/shop/files/20260625101011-TP13301_20_2.jpg?v=1783617144&width=480', isNewArrival: true },
        { name: 'V-Neck Collared Knit Fitted Top in Navy', slug: 'v-neck-collared-knit-top-navy', price: 599, category: catMap.tops, description: 'Classic v-neck knit top', image_url: 'https://littleboxindia.com/cdn/shop/files/V-Neck_Collared_Layered_Look_Fitted_Knit_Top_in_Navy_Blue.webp?v=1769775291&width=480' },
        { name: 'Asymmetric Neck Curved Hem Half Sleeve Top', slug: 'asymmetric-neck-curved-hem-top', price: 799, category: catMap.tops, description: 'Modern asymmetric neck top', image_url: 'https://littleboxindia.com/cdn/shop/files/20260603103035-3.jpg?v=1780591852&width=480' },
        { name: 'Ruched Waist Batwing Sleeve Mini Dress in Dusty Blue', slug: 'ruched-waist-batwing-dress-dusty-blue', price: 999, category: catMap.dresses, description: 'Elegant mini dress with ruched waist', image_url: 'https://littleboxindia.com/cdn/shop/files/20260703124130-DR14223_20_1.jpg?v=1783676885&width=480', isNewArrival: true },
        { name: 'Off Shoulder Mesh Ruched Fitted Dress in Coco', slug: 'off-shoulder-mesh-dress-coco', price: 1199, category: catMap.dresses, description: 'Chic off-shoulder dress', image_url: 'https://littleboxindia.com/cdn/shop/files/Off_Shoulder_Mesh_Ruched_Fitted_Dress_With_Long_Sleeve_in_Coco_0.webp?v=1784022172&width=480' },
        { name: 'Maroon Faux Fishbone One-Shoulder Dress', slug: 'maroon-faux-fishbone-dress', price: 1199, category: catMap.dresses, description: 'Bold one-shoulder dress', image_url: 'https://littleboxindia.com/cdn/shop/files/Maroon_Faux_Fishbone_Design_Romantic_One-Shoulder_Dress.webp?v=1754570398&width=480' },
        { name: 'Functional Shoulder Bag With Contrast Strap', slug: 'functional-shoulder-bag-contrast-strap', price: 2199, category: catMap.handbags, description: 'Practical shoulder bag with contrast strap', image_url: 'https://littleboxindia.com/cdn/shop/files/20260512114021-SHB1035_20_1.jpg?v=1778659618&width=480' },
        { name: 'Adjustable Strap Shoulder Bag in Espresso', slug: 'adjustable-strap-shoulder-bag-espresso', price: 2399, category: catMap.handbags, description: 'Versatile adjustable strap bag', image_url: 'https://littleboxindia.com/cdn/shop/files/20260512114315-SHB1034_20_1.jpg?v=1778659317&width=480' },
        { name: 'Glossy Shoulder Bag With Tie Detail in Red', slug: 'glossy-shoulder-bag-tie-detail-red', price: 1399, category: catMap.handbags, description: 'Glossy red bag with tie detail', image_url: 'https://littleboxindia.com/cdn/shop/files/20260512104923-SHB1004_20_4.jpg?v=1778657418&width=480' },
        { name: 'Double Buckle Strap Platform Mary Jane in Black', slug: 'double-buckle-platform-mary-jane-black', price: 1699, category: catMap.footwear, description: 'Stylish platform mary janes', image_url: 'https://littleboxindia.com/cdn/shop/files/20260605105653-PL1311_20_2.jpg?v=1780661873&width=480' },
        { name: 'Motorcycle Side Zipper Chunky Sole Knee Boots', slug: 'motorcycle-side-zipper-knee-boots', price: 1799, category: catMap.footwear, description: 'Edgy knee boots with side zipper', image_url: 'https://littleboxindia.com/cdn/shop/files/Motorcycle_Side_Zipper_Chunky_Sole_Knee_Boots.jpg?v=1769686487&width=480' },
        { name: 'Oxford Lace Up Brogue Boots', slug: 'oxford-lace-up-brogue-boots', price: 1799, category: catMap.footwear, description: 'Classic brogue boots', image_url: 'https://littleboxindia.com/cdn/shop/files/20260422111623-BT1294_4.jpg?v=1776949362&width=480' },
        { name: 'High Waist Wide Leg Linen Trousers in White', slug: 'high-waist-wide-leg-linen-trousers-white', price: 999, category: catMap.trousers, description: 'Comfortable linen trousers', image_url: 'https://littleboxindia.com/cdn/shop/files/High_Waist_Wide_Leg_Linen_Trousers_In_White.webp?v=1769519079&width=480' },
        { name: 'Striped Suit Pants High Waist in Brown', slug: 'striped-suit-pants-high-waist-brown', price: 1099, category: catMap.trousers, description: 'Professional striped pants', image_url: 'https://littleboxindia.com/cdn/shop/files/Striped_Suit_Pants_High_Waist_Trousers_in_Brown.jpg?v=1781597998&width=480' },
        { name: 'High Waist Pleated Trousers in Black', slug: 'high-waist-pleated-trousers-black', price: 1099, category: catMap.trousers, description: 'Elegant pleated trousers', image_url: 'https://littleboxindia.com/cdn/shop/products/High_Waist_Pleated_Trousers_In_Black.jpg?v=1769664453&width=480' },
        { name: 'Tie Front Shrug & Cami Dress Co-Ord in Cocoa', slug: 'tie-front-shrug-cami-coord-cocoa', price: 1599, category: catMap.coords, description: 'Matching co-ord set', image_url: 'https://littleboxindia.com/cdn/shop/files/20260709122819-set_203a.jpg?v=1783613995&width=480', isBestSeller: true },
        { name: 'Off Shoulder Crop Top & Wide Leg Pant in Grey', slug: 'off-shoulder-crop-top-wide-leg-pant-grey', price: 899, category: catMap.coords, description: 'Casual co-ord set', image_url: 'https://littleboxindia.com/cdn/shop/products/Off_Shoulder_Crop_Top_And_Wide_Leg_Pant_In_Grey.jpg?v=1741852524&width=480' },
        { name: 'Striped V-Neck Jacket & Wide-Leg Pants Suit', slug: 'striped-v-neck-jacket-wide-leg-pants-suit', price: 1849, category: catMap.coords, description: 'Formal striped suit', image_url: 'https://littleboxindia.com/cdn/shop/files/Navy_Blue_Striped_V-Neck_Asymmetric_Long_Sleeve_Jacket_Wide-Leg_Pants_Suit.jpg?v=1770297504&width=480' },
      ];

      await Product.insertMany(products.map(p => ({
        ...p,
        images: [{ url: p.image_url, alt: p.name }],
        stock: 100,
        sizes: [
          { size: 'XS', stock: 10 },
          { size: 'S', stock: 20 },
          { size: 'M', stock: 30 },
          { size: 'L', stock: 20 },
          { size: 'XL', stock: 10 }
        ],
        isActive: true
      })));
      console.log('[seed] Seeded 18 Bonkerscorner products');
    } else {
      console.log(`[seed] Products already exist (${count}), skipping seed`);
    }
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
      if (!origin || allowedOrigins.includes(origin)) {
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