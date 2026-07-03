import express from 'express';
import {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  blockUser,
  unblockUser,
  resetPasswordRequest,
  resetPassword
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/', registerUser);
router.post('/login', loginUser);
router.post('/reset-password/request', resetPasswordRequest);
router.post('/reset-password/reset/:id/:token', resetPassword);

// Protected routes
router.post('/logout', protect, logoutUser);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.put('/change-password', protect, changePassword);

// Wishlist routes
router.route('/wishlist')
  .get(protect, getWishlist)
  .post(protect, addToWishlist);
router.delete('/wishlist/:productId', protect, removeFromWishlist);

// Admin routes
router.get('/all', protect, admin, getUsers);
router.route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);
router.put('/:id/block', protect, admin, blockUser);
router.put('/:id/unblock', protect, admin, unblockUser);

export default router;
