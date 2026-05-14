import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { createShipmentForPaidOrder } from '../services/delhiveryService.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    platformFee,
    taxPrice,
    totalPrice
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  // Update stock
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (product) {
      const sizeIndex = product.sizes.findIndex(s => s.size === item.size);
      if (sizeIndex !== -1) {
        product.sizes[sizeIndex].stock -= item.quantity;
        await product.save();
      }
    }
  }

  const order = new Order({
    user: req.user?._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    platformFee,
    taxPrice,
    totalPrice
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});


// @desc    Create temporary Delhivery test order
// @route   POST /api/orders/test-delhivery
// @access  Protected by TEST_DELHIVERY_SECRET
export const testDelhiveryOrder = asyncHandler(async (req, res) => {
  if (process.env.ENABLE_DELHIVERY_TEST_ROUTE !== 'true') {
    res.status(404);
    throw new Error('Test route is disabled');
  }

  const providedSecret = req.headers['x-test-secret'] || req.body.testSecret;

  if (!process.env.TEST_DELHIVERY_SECRET || providedSecret !== process.env.TEST_DELHIVERY_SECRET) {
    res.status(403);
    throw new Error('Invalid test secret');
  }

  const testProductId = new mongoose.Types.ObjectId();

  const order = new Order({
    user: req.user?._id,
    orderItems: [
      {
        product: testProductId,
        name: 'Delhivery Test Product',
        image: '/uploads/sample-tshirt.jpg',
        price: 100,
        size: 'M',
        quantity: 1
      }
    ],
    shippingAddress: {
      fullName: req.body.fullName || 'Test Customer',
      phone: req.body.phone || '9999999999',
      addressLine1: req.body.addressLine1 || 'Test address near market',
      addressLine2: req.body.addressLine2 || '',
      city: req.body.city || 'Kokrajhar',
      state: req.body.state || 'Assam',
      pincode: req.body.pincode || '783370'
    },
    paymentMethod: 'razorpay',
    paymentResult: {
      razorpay_order_id: 'test_order_for_delhivery',
      razorpay_payment_id: 'test_payment_for_delhivery',
      razorpay_signature: 'test_signature_for_delhivery',
      status: 'completed'
    },
    itemsPrice: 100,
    shippingPrice: 0,
    platformFee: 0,
    taxPrice: 0,
    totalPrice: 100,
    isPaid: true,
    paidAt: Date.now(),
    orderStatus: 'confirmed',
    notes: 'Temporary Delhivery API test order. Delete this after testing.'
  });

  await order.save();

  const updatedOrder = await createShipmentForPaidOrder(order);

  res.status(201).json({
    success: true,
    message: 'Delhivery test order created',
    order: updatedOrder,
    warning: 'Remove or disable this test route after testing by setting ENABLE_DELHIVERY_TEST_ROUTE=false.'
  });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    if (order.user) {
      if (!req.user) {
        res.status(401);
        throw new Error('Please login to view this order');
      }

      if (!req.user.isAdmin && order.user._id.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to view this order');
      }
    }

    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      razorpay_order_id: req.body.razorpay_order_id,
      razorpay_payment_id: req.body.razorpay_payment_id,
      razorpay_signature: req.body.razorpay_signature,
      status: 'completed'
    };
    order.orderStatus = 'confirmed';

    await order.save();
    const updatedOrder = await createShipmentForPaidOrder(order);
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.orderStatus = req.body.status;
    
    if (req.body.status === 'delivered') {
      order.deliveredAt = Date.now();
    }
    
    if (req.body.trackingNumber) {
      order.trackingNumber = req.body.trackingNumber;
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = asyncHandler(async (req, res) => {
  const pageSize = 20;
  const page = Number(req.query.page) || 1;
  
  const count = await Order.countDocuments({});
  const orders = await Order.find({})
    .populate('user', 'id name email')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    orders,
    page,
    pages: Math.ceil(count / pageSize),
    total: count
  });
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    if (order.orderStatus === 'shipped' || order.orderStatus === 'delivered') {
      res.status(400);
      throw new Error('Cannot cancel shipped or delivered order');
    }

    // Restore stock
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        const sizeIndex = product.sizes.findIndex(s => s.size === item.size);
        if (sizeIndex !== -1) {
          product.sizes[sizeIndex].stock += item.quantity;
          await product.save();
        }
      }
    }

    order.orderStatus = 'cancelled';
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});
