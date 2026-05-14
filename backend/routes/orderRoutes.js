import express from 'express';
import {
  createOrder,
  testDelhiveryOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderStatus,
  getMyOrders,
  getOrders,
  cancelOrder
} from '../controllers/orderController.js';
import { protect, optionalProtect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(optionalProtect, createOrder).get(protect, admin, getOrders);
router.post('/test-delhivery', optionalProtect, testDelhiveryOrder);
router.get('/myorders', protect, getMyOrders);
router.route('/:id').get(optionalProtect, getOrderById);
router.put('/:id/pay', optionalProtect, updateOrderToPaid);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.put('/:id/cancel', protect, cancelOrder);

export default router;
