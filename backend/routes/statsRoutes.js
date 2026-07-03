import express from 'express';
import {
  getDashboardStats,
  getSalesChart,
  getRecentOrders,
  getCategoryStats
} from '../controllers/statsController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, admin, getDashboardStats);
router.get('/sales-chart', protect, admin, getSalesChart);
router.get('/recent-orders', protect, admin, getRecentOrders);
router.get('/categories', protect, admin, getCategoryStats);

export default router;
