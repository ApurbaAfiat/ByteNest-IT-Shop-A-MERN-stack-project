import mongoose from 'mongoose';

// Define the schema for product reviews
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    name: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    title: {
      type: String,
      default: ''
    },
    comment: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

// Define the schema for products
const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    name: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true,
      unique: true
    },
    brand: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    model: {
      type: String,
      default: ''
    },
    sku: {
      type: String,
      required: true,
      unique: true
    },
    // Primary image (backward compatible)
    image: {
      type: String,
      required: true
    },
    // Additional images
    images: [
      {
        type: String
      }
    ],
    shortDescription: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      required: true
    },
    // Category-specific specifications stored as flexible object
    specifications: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    price: {
      type: Number,
      required: true,
      default: 0
    },
    discountPrice: {
      type: Number,
      default: 0
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0
    },
    warranty: {
      type: String,
      default: '1 Year Warranty'
    },
    availability: {
      type: String,
      enum: ['In Stock', 'Out of Stock', 'Pre-Order', 'Coming Soon'],
      default: 'In Stock'
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isNewArrival: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function () {
  if (this.discountPrice && this.discountPrice < this.price) {
    return Math.round(((this.price - this.discountPrice) / this.price) * 100);
  }
  return 0;
});

// Generate slug from name before validation
productSchema.pre('validate', function (next) {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Text index for search
productSchema.index({ name: 'text', brand: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;
