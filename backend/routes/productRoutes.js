import express from 'express';
import {
  getProducts,
  getProductById,
  getProductBySlug,
  getFeaturedProducts,
  getNewArrivals,
  getBestSellers,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview
} from '../controllers/productController.js';
import { protect, optionalProtect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.get('/featured', getFeaturedProducts);
router.get('/new-arrivals', getNewArrivals);
router.get('/best-sellers', getBestSellers);
router.get('/slug/:slug', getProductBySlug);
router.route('/:id').get(getProductById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);
router.post('/:id/reviews', optionalProtect, createProductReview);

export default router;
