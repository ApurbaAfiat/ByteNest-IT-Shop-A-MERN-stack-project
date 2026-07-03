import express from 'express';
import {
  getProducts,
  getProduct,
  getProductBySlug,
  getFeaturedProducts,
  getNewArrivals,
  getTopProducts,
  getBestSelling,
  getRelatedProducts,
  getBrands,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  updateProductReview,
  deleteProductReview
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

router.get('/featured', getFeaturedProducts);
router.get('/new-arrivals', getNewArrivals);
router.get('/top', getTopProducts);
router.get('/best-selling', getBestSelling);
router.get('/brands', getBrands);
router.get('/slug/:slug', getProductBySlug);

router.route('/:id')
  .get(getProduct)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

router.get('/:id/related', getRelatedProducts);

router.route('/:id/reviews')
  .post(protect, createProductReview);

router.route('/:id/reviews/:reviewId')
  .put(protect, updateProductReview)
  .delete(protect, deleteProductReview);

export default router;
