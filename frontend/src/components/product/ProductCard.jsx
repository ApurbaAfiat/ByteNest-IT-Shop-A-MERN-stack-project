import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { HiOutlineHeart, HiOutlineShoppingCart } from 'react-icons/hi';
import { addToCart } from '../../slices/cartSlice';
import Rating from '../ui/Rating';
import { formatPrice, getDiscountPercent } from '../../utils/formatPrice';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ ...product, qty: 1 }));
    toast.success('Added to cart!');
  };

  const discountPercent = getDiscountPercent(product.price, product.discountPrice);

  return (
    <Link to={`/product/${product._id}`} className="card-hover group block">
      {/* Image */}
      <div className="relative overflow-hidden bg-surface-100 dark:bg-surface-700">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 sm:h-52 object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discountPercent > 0 && (
            <span className="price-discount text-[10px]">-{discountPercent}%</span>
          )}
          {product.isNewArrival && (
            <span className="badge bg-emerald-500 text-white text-[10px]">NEW</span>
          )}
          {product.countInStock === 0 && (
            <span className="badge bg-surface-500 text-white text-[10px]">OUT OF STOCK</span>
          )}
        </div>
        {/* Quick actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            className="w-8 h-8 bg-white dark:bg-surface-800 rounded-full flex items-center justify-center shadow-md hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
          >
            <HiOutlineHeart className="w-4 h-4 text-surface-600 dark:text-surface-400" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mb-1">{product.brand}</p>
        <h3 className="text-sm font-medium text-surface-900 dark:text-white line-clamp-2 mb-2 min-h-[2.5rem] group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {product.name}
        </h3>
        <Rating value={product.rating} count={product.numReviews} size="xs" />

        <div className="flex items-center justify-between mt-3">
          <div>
            {product.discountPrice > 0 ? (
              <div className="flex items-center gap-2">
                <span className="price-current text-base">{formatPrice(product.discountPrice)}</span>
                <span className="price-original">{formatPrice(product.price)}</span>
              </div>
            ) : (
              <span className="price-current text-base">{formatPrice(product.price)}</span>
            )}
          </div>
          {product.countInStock > 0 && (
            <button
              onClick={handleAddToCart}
              className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
              aria-label="Add to cart"
            >
              <HiOutlineShoppingCart className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
