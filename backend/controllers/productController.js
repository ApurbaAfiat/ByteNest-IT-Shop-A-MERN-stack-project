import Product from '../models/productModel.js';
import { deleteFile } from '../utils/file.js';

// @desc     Fetch All Products with filtering, sorting, pagination
// @method   GET
// @endpoint /api/v1/products
// @access   Public
const getProducts = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};

    // Search by name
    if (req.query.search) {
      filter.name = { $regex: req.query.search, $options: 'i' };
    }

    // Filter by category
    if (req.query.category) {
      filter.category = { $regex: new RegExp(`^${req.query.category}$`, 'i') };
    }

    // Filter by brand
    if (req.query.brand) {
      filter.brand = { $regex: new RegExp(`^${req.query.brand}$`, 'i') };
    }

    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    // Filter by availability
    if (req.query.availability) {
      filter.availability = req.query.availability;
    }

    // Build sort object
    let sort = {};
    switch (req.query.sort) {
      case 'price-asc':
        sort = { price: 1 };
        break;
      case 'price-desc':
        sort = { price: -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'rating':
        sort = { rating: -1 };
        break;
      case 'name-asc':
        sort = { name: 1 };
        break;
      case 'name-desc':
        sort = { name: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sort)
      .limit(limit)
      .skip(skip);

    res.status(200).json({
      products,
      page,
      pages: Math.ceil(total / limit),
      total,
      limit
    });
  } catch (error) {
    next(error);
  }
};

// @desc     Fetch featured products
// @method   GET
// @endpoint /api/v1/products/featured
// @access   Public
const getFeaturedProducts = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 8;
    const products = await Product.find({ isFeatured: true }).limit(limit);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

// @desc     Fetch new arrival products
// @method   GET
// @endpoint /api/v1/products/new-arrivals
// @access   Public
const getNewArrivals = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 8;
    const products = await Product.find({ isNewArrival: true })
      .sort({ createdAt: -1 })
      .limit(limit);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

// @desc     Fetch top rated products
// @method   GET
// @endpoint /api/v1/products/top
// @access   Public
const getTopProducts = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 8;
    const products = await Product.find({}).sort({ rating: -1 }).limit(limit);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

// @desc     Fetch best selling (most reviewed) products
// @method   GET
// @endpoint /api/v1/products/best-selling
// @access   Public
const getBestSelling = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 8;
    const products = await Product.find({})
      .sort({ numReviews: -1 })
      .limit(limit);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

// @desc     Fetch related products (same category, excluding current)
// @method   GET
// @endpoint /api/v1/products/:id/related
// @access   Public
const getRelatedProducts = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.statusCode = 404;
      throw new Error('Product not found!');
    }

    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    }).limit(4);

    res.status(200).json(related);
  } catch (error) {
    next(error);
  }
};

// @desc     Fetch Single Product by ID
// @method   GET
// @endpoint /api/v1/products/:id
// @access   Public
const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.statusCode = 404;
      throw new Error('Product not found!');
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc     Fetch Single Product by slug
// @method   GET
// @endpoint /api/v1/products/slug/:slug
// @access   Public
const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      res.statusCode = 404;
      throw new Error('Product not found!');
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc     Get all unique brands
// @method   GET
// @endpoint /api/v1/products/brands
// @access   Public
const getBrands = async (req, res, next) => {
  try {
    const brands = await Product.distinct('brand');
    res.status(200).json(brands);
  } catch (error) {
    next(error);
  }
};

// @desc     Create product
// @method   POST
// @endpoint /api/v1/products
// @access   Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const {
      name, image, images, description, shortDescription, brand, category,
      model, sku, price, discountPrice, countInStock, specifications,
      warranty, availability, isFeatured, isNewArrival
    } = req.body;

    const product = new Product({
      user: req.user._id,
      name,
      image,
      images: images || [],
      description,
      shortDescription: shortDescription || '',
      brand,
      category,
      model: model || '',
      sku,
      price,
      discountPrice: discountPrice || 0,
      countInStock,
      specifications: specifications || {},
      warranty: warranty || '1 Year Warranty',
      availability: availability || 'In Stock',
      isFeatured: isFeatured || false,
      isNewArrival: isNewArrival || false
    });

    const createdProduct = await product.save();
    res.status(201).json({ message: 'Product created', createdProduct });
  } catch (error) {
    next(error);
  }
};

// @desc     Update product
// @method   PUT
// @endpoint /api/v1/products/:id
// @access   Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.statusCode = 404;
      throw new Error('Product not found!');
    }

    const previousImage = product.image;
    const fields = [
      'name', 'image', 'images', 'description', 'shortDescription', 'brand',
      'category', 'model', 'sku', 'price', 'discountPrice', 'countInStock',
      'specifications', 'warranty', 'availability', 'isFeatured', 'isNewArrival'
    ];

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    // Regenerate slug if name changed
    if (req.body.name) {
      product.slug = req.body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const updatedProduct = await product.save();

    // Delete old image if changed
    if (previousImage && previousImage !== updatedProduct.image) {
      deleteFile(previousImage);
    }

    res.status(200).json({ message: 'Product updated', updatedProduct });
  } catch (error) {
    next(error);
  }
};

// @desc     Delete product
// @method   DELETE
// @endpoint /api/v1/products/:id
// @access   Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.statusCode = 404;
      throw new Error('Product not found!');
    }
    await Product.deleteOne({ _id: product._id });
    if (product.image) deleteFile(product.image);
    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc     Create product review
// @method   POST
// @endpoint /api/v1/products/:id/reviews
// @access   Private
const createProductReview = async (req, res, next) => {
  try {
    const { rating, title, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.statusCode = 404;
      throw new Error('Product not found!');
    }

    const alreadyReviewed = product.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.statusCode = 400;
      throw new Error('Product already reviewed');
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      title: title || '',
      comment
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    next(error);
  }
};

// @desc     Update product review
// @method   PUT
// @endpoint /api/v1/products/:id/reviews/:reviewId
// @access   Private
const updateProductReview = async (req, res, next) => {
  try {
    const { rating, title, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.statusCode = 404;
      throw new Error('Product not found!');
    }

    const review = product.reviews.id(req.params.reviewId);
    if (!review) {
      res.statusCode = 404;
      throw new Error('Review not found!');
    }

    if (review.user.toString() !== req.user._id.toString()) {
      res.statusCode = 403;
      throw new Error('Not authorized to update this review');
    }

    review.rating = Number(rating) || review.rating;
    review.title = title !== undefined ? title : review.title;
    review.comment = comment || review.comment;

    product.rating =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) /
      product.reviews.length;

    await product.save();
    res.status(200).json({ message: 'Review updated' });
  } catch (error) {
    next(error);
  }
};

// @desc     Delete product review
// @method   DELETE
// @endpoint /api/v1/products/:id/reviews/:reviewId
// @access   Private
const deleteProductReview = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.statusCode = 404;
      throw new Error('Product not found!');
    }

    const review = product.reviews.id(req.params.reviewId);
    if (!review) {
      res.statusCode = 404;
      throw new Error('Review not found!');
    }

    if (
      review.user.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      res.statusCode = 403;
      throw new Error('Not authorized to delete this review');
    }

    product.reviews.pull({ _id: req.params.reviewId });
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.length > 0
        ? product.reviews.reduce((acc, r) => acc + r.rating, 0) /
          product.reviews.length
        : 0;

    await product.save();
    res.status(200).json({ message: 'Review deleted' });
  } catch (error) {
    next(error);
  }
};

export {
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
};
