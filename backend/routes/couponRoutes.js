import express from 'express';
import { applyCoupon, validateCoupon } from '../controllers/couponController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/apply', protect, applyCoupon);
router.post('/validate', protect, validateCoupon);

export default router;
