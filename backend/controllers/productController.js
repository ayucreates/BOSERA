import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 12;
  const page = Number(req.query.page) || 1;
  
  const keyword = req.query.keyword
    ? { $text: { $search: req.query.keyword } }
    : {};

  const category = req.query.category
    ? { category: req.query.category }
    : {};

  const priceFilter = {};
  if (req.query.minPrice) priceFilter.$gte = Number(req.query.minPrice);
  if (req.query.maxPrice) priceFilter.$lte = Number(req.query.maxPrice);
  const price = Object.keys(priceFilter).length ? { price: priceFilter } : {};

  const sort = {};
  if (req.query.sort) {
    const sortField = req.query.sort.startsWith('-') 
      ? req.query.sort.substring(1) 
      : req.query.sort;
    sort[sortField] = req.query.sort.startsWith('-') ? -1 : 1;
  } else {
    sort.createdAt = -1;
  }

  const filters = {
    isActive: true,
    ...keyword,
    ...category,
    ...price
  };

  if (req.query.size) {
    filters['sizes.size'] = req.query.size;
    filters['sizes.stock'] = { $gt: 0 };
  }

  const count = await Product.countDocuments(filters);
  const products = await Product.find(filters)
    .populate('category', 'name slug')
    .sort(sort)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
    total: count
  });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name slug');

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Fetch product by slug
// @route   GET /api/products/slug/:slug
// @access  Public
export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate('category', 'name slug');

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true, isActive: true })
    .populate('category', 'name slug')
    .limit(8);
  res.json(products);
});

// @desc    Get new arrivals
// @route   GET /api/products/new-arrivals
// @access  Public
export const getNewArrivals = asyncHandler(async (req, res) => {
  const products = await Product.find({ isNewArrival: true, isActive: true })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .limit(8);
  res.json(products);
});

// @desc    Get best sellers
// @route   GET /api/products/best-sellers
// @access  Public
export const getBestSellers = asyncHandler(async (req, res) => {
  const products = await Product.find({ isBestSeller: true, isActive: true })
    .populate('category', 'name slug')
    .limit(8);
  res.json(products);
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    ...req.body,
    user: req.user._id
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    Object.assign(product, req.body);
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create product review after delivery
// @route   POST /api/products/:id/reviews
// @access  Public for guest order links / Private for logged in orders
export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment, orderId, images = [] } = req.body;

  const numericRating = Number(rating);

  if (!orderId) {
    res.status(400);
    throw new Error('Order ID is required to review this product');
  }

  if (!numericRating || numericRating < 1 || numericRating > 5) {
    res.status(400);
    throw new Error('Please select a rating between 1 and 5');
  }

  if (!comment || !comment.trim()) {
    res.status(400);
    throw new Error('Please write a review comment');
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.user) {
    if (!req.user) {
      res.status(401);
      throw new Error('Please login to review this order');
    }

    const isOwner = order.user.toString() === req.user._id.toString();
    const isAdmin = req.user.isAdmin;

    if (!isOwner && !isAdmin) {
      res.status(403);
      throw new Error('Not authorized to review this order');
    }
  }

  if (order.orderStatus !== 'delivered') {
    res.status(400);
    throw new Error('You can review only after the product is delivered');
  }

  const productInOrder = order.orderItems.some(
    (item) => item.product.toString() === product._id.toString()
  );

  if (!productInOrder) {
    res.status(400);
    throw new Error('This product is not part of the selected order');
  }

  const alreadyReviewed = product.reviews.find(
    (review) => review.order?.toString() === order._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('This order has already reviewed this product');
  }

  const reviewImages = Array.isArray(images)
    ? images.slice(0, 3).map((imageUrl, index) => ({
        url: imageUrl,
        alt: `${product.name} review image ${index + 1}`
      }))
    : [];

  const review = {
    name: req.user?.name || order.shippingAddress?.fullName || 'Verified Customer',
    rating: numericRating,
    comment: comment.trim(),
    user: req.user?._id,
    order: order._id,
    images: reviewImages,
    verifiedPurchase: true
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save();

  res.status(201).json({ message: 'Review added' });
});
