import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  addToWishlist,
  removeFromWishlist,
  getUsers
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/address').post(protect, addAddress);
router.route('/address/:id').put(protect, updateAddress).delete(protect, deleteAddress);
router.route('/wishlist/:productId').post(protect, addToWishlist).delete(protect, removeFromWishlist);
router.get('/', protect, admin, getUsers);

export default router;
