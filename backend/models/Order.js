import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  size: { type: String, required: true },
  quantity: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'User'
  },

  orderItems: [orderItemSchema],

  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
  },

  paymentMethod: {
    type: String,
    required: true,
    enum: ['razorpay', 'cod']
  },

  paymentResult: {
    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String,
    status: String
  },

  itemsPrice: {
    type: Number,
    required: true,
    default: 0
  },

  shippingPrice: {
    type: Number,
    required: true,
    default: 0
  },

  platformFee: {
    type: Number,
    required: true,
    default: 0
  },

  taxPrice: {
    type: Number,
    required: true,
    default: 0
  },

  totalPrice: {
    type: Number,
    required: true,
    default: 0
  },

  isPaid: {
    type: Boolean,
    required: true,
    default: false
  },

  paidAt: Date,

  orderStatus: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },

  deliveredAt: Date,

  trackingNumber: String,

  delhivery: {
    awb: {
      type: String,
      default: null
    },
    status: {
      type: String,
      enum: ['not_created', 'created', 'failed'],
      default: 'not_created'
    },
    trackingUrl: {
      type: String,
      default: null
    },
    rawResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    error: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    createdAt: Date
  },

  notes: String
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

export default Order;