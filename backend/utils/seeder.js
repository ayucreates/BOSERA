import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};



const categories = [
  { name: 'Men', description: 'Men\'s clothing collection' },
  { name: 'Women', description: 'Women\'s clothing collection' },
  { name: 'T-Shirts', description: 'Casual and stylish t-shirts' },
  { name: 'Shirts', description: 'Formal and casual shirts' },
  { name: 'Jeans', description: 'Denim jeans collection' },
  { name: 'Dresses', description: 'Beautiful dresses for all occasions' },
  { name: 'Accessories', description: 'Fashion accessories' }
];

const sampleProducts = [
  {
    name: 'Classic Vintage Denim Jacket',
    description: 'A timeless vintage denim jacket perfect for layering. Features authentic distressed details and a comfortable relaxed fit.',
    price: 2499,
    originalPrice: 3499,
    discount: 29,
    images: [{ url: '/uploads/sample-jacket.jpg', alt: 'Denim Jacket' }],
    sizes: [
      { size: 'S', stock: 10 },
      { size: 'M', stock: 15 },
      { size: 'L', stock: 12 },
      { size: 'XL', stock: 8 }
    ],
    color: 'Blue',
    material: 'Denim',
    tags: ['vintage', 'denim', 'jacket', 'casual'],
    isFeatured: true,
    isNewArrival: true
  },
  {
    name: 'Retro Graphic T-Shirt',
    description: 'Soft cotton t-shirt with retro-inspired graphics. Perfect for a casual day out.',
    price: 799,
    originalPrice: 999,
    discount: 20,
    images: [{ url: '/uploads/sample-tshirt.jpg', alt: 'Graphic T-Shirt' }],
    sizes: [
      { size: 'S', stock: 20 },
      { size: 'M', stock: 25 },
      { size: 'L', stock: 20 },
      { size: 'XL', stock: 15 }
    ],
    color: 'White',
    material: 'Cotton',
    tags: ['retro', 'tshirt', 'casual', 'graphic'],
    isFeatured: true,
    isBestSeller: true
  },
  {
    name: 'Vintage Floral Dress',
    description: 'Elegant floral dress with vintage charm. Features a flattering A-line silhouette.',
    price: 1899,
    originalPrice: 2499,
    discount: 24,
    images: [{ url: '/uploads/sample-dress.jpg', alt: 'Floral Dress' }],
    sizes: [
      { size: 'XS', stock: 8 },
      { size: 'S', stock: 12 },
      { size: 'M', stock: 15 },
      { size: 'L', stock: 10 }
    ],
    color: 'Floral',
    material: 'Polyester',
    tags: ['vintage', 'dress', 'floral', 'elegant'],
    isNewArrival: true
  }
];

const seedData = async () => {
  try {
    await connectDB();

    await Category.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // Create admin user
    await User.create({
      name: 'Admin',
      email: 'admin@bosera.shop',
      password: 'admin123',
      isAdmin: true
    });

    // Create categories
    const createdCategories = await Category.create(categories);
    
    // Add category reference to products
    const productsWithCategory = sampleProducts.map((product, index) => ({
  ...product,
  category: createdCategories[index % createdCategories.length]._id
}));

    await Product.create(productsWithCategory);

    console.log('Data seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();
