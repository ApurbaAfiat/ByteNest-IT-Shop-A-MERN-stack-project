import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { HiOutlineShoppingCart, HiOutlineHeart, HiHeart, HiOutlineTruck, HiOutlineShieldCheck, HiMinus, HiPlus, HiStar } from 'react-icons/hi';
import { useGetProductDetailsQuery, useGetRelatedProductsQuery, useCreateReviewMutation } from '../../slices/productsApiSlice';
import { useAddToWishlistMutation } from '../../slices/usersApiSlice';
import { addToCart } from '../../slices/cartSlice';
import ProductCard from '../../components/product/ProductCard';
import Rating from '../../components/ui/Rating';
import Breadcrumb from '../../components/ui/Breadcrumb';
import { ProductDetailsSkeleton } from '../../components/ui/Skeleton';
import { formatPrice, getDiscountPercent } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [activeTab, setActiveTab] = useState('description');

  const { data: product, isLoading, error } = useGetProductDetailsQuery(id);
  const { data: related } = useGetRelatedProductsQuery(id);
  const [createReview, { isLoading: reviewLoading }] = useCreateReviewMutation();
  const [addToWishlistMut] = useAddToWishlistMutation();

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, qty }));
    toast.success('Added to cart!');
  };

  const handleAddToWishlist = async () => {
    if (!userInfo) return toast.info('Please login to add to wishlist');
    try { await addToWishlistMut({ productId: id }).unwrap(); toast.success('Added to wishlist'); } catch (err) { toast.error(err?.data?.message || 'Failed'); }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!userInfo) return toast.info('Please login to write a review');
    try { await createReview({ productId: id, rating, comment }).unwrap(); toast.success('Review submitted!'); setComment(''); setRating(5); } catch (err) { toast.error(err?.data?.message || 'Failed'); }
  };

  if (isLoading) return <ProductDetailsSkeleton />;
  if (error) return <div className="container-custom py-12 text-center"><p className="text-red-500">Product not found</p><Link to="/products" className="btn-primary mt-4">Back to Products</Link></div>;
  if (!product) return null;

  const images = product.images?.length ? product.images : [product.image];
  const discountPercent = getDiscountPercent(product.price, product.discountPrice);

  return (
    <>
      <Helmet><title>{product.name} — ByteNest</title><meta name="description" content={product.shortDescription || product.description?.substring(0, 160)} /></Helmet>
      <div className="container-custom pb-12">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: product.category, href: `/category/${product.category.toLowerCase()}` }, { label: product.name }]} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div>
            <div className="bg-surface-100 dark:bg-surface-800 rounded-2xl overflow-hidden mb-4 aspect-square flex items-center justify-center">
              <img src={images[selectedImage]} alt={product.name} className="max-w-full max-h-full object-contain p-4" />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)} className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-colors ${i === selectedImage ? 'border-primary-500' : 'border-surface-200 dark:border-surface-700'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <p className="text-sm text-primary-600 dark:text-primary-400 font-medium mb-1">{product.brand}</p>
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-surface-900 dark:text-white mb-3">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <Rating value={product.rating} count={product.numReviews} size="md" />
              <span className="text-sm text-surface-500">SKU: {product.sku}</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              {product.discountPrice > 0 ? (
                <>
                  <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">{formatPrice(product.discountPrice)}</span>
                  <span className="text-lg text-surface-400 line-through">{formatPrice(product.price)}</span>
                  <span className="price-discount">-{discountPercent}%</span>
                </>
              ) : (
                <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">{formatPrice(product.price)}</span>
              )}
            </div>

            {product.shortDescription && <p className="text-surface-600 dark:text-surface-400 mb-6">{product.shortDescription}</p>}

            {/* Stock & Warranty */}
            <div className="flex flex-wrap gap-4 mb-6">
              <span className={`badge ${product.countInStock > 0 ? 'badge-success' : 'badge-danger'}`}>
                {product.availability}
              </span>
              {product.warranty && <span className="badge-info">{product.warranty}</span>}
            </div>

            {/* Quantity & Actions */}
            {product.countInStock > 0 && (
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex items-center border border-surface-300 dark:border-surface-600 rounded-xl">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-l-xl"><HiMinus className="w-4 h-4" /></button>
                  <span className="px-5 py-3 font-semibold min-w-[50px] text-center">{qty}</span>
                  <button onClick={() => setQty(Math.min(product.countInStock, qty + 1))} className="p-3 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-r-xl"><HiPlus className="w-4 h-4" /></button>
                </div>
                <button onClick={handleAddToCart} className="btn-primary flex-1 btn-lg">
                  <HiOutlineShoppingCart className="w-5 h-5" /> Add to Cart
                </button>
                <button onClick={handleAddToWishlist} className="btn-outline p-3">
                  <HiOutlineHeart className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 bg-surface-50 dark:bg-surface-800 rounded-xl">
                <HiOutlineTruck className="w-5 h-5 text-primary-600" />
                <span className="text-xs text-surface-600 dark:text-surface-400">Free delivery over ৳5,000</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-surface-50 dark:bg-surface-800 rounded-xl">
                <HiOutlineShieldCheck className="w-5 h-5 text-primary-600" />
                <span className="text-xs text-surface-600 dark:text-surface-400">Genuine product</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs: Description / Specs / Reviews */}
        <div className="mb-12">
          <div className="flex border-b border-surface-200 dark:border-surface-700 mb-6 overflow-x-auto no-scrollbar">
            {['description', 'specifications', 'reviews'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab ? 'border-primary-600 text-primary-600' : 'border-transparent text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'}`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)} {tab === 'reviews' && `(${product.numReviews})`}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div className="prose dark:prose-invert max-w-none"><p className="text-surface-700 dark:text-surface-300 leading-relaxed">{product.description}</p></div>
          )}

          {activeTab === 'specifications' && product.specifications && (
            <div className="overflow-x-auto">
              <table className="w-full max-w-2xl">
                <tbody>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <tr key={key} className="border-b border-surface-200 dark:border-surface-700">
                      <td className="py-3 px-4 text-sm font-medium text-surface-700 dark:text-surface-300 capitalize bg-surface-50 dark:bg-surface-800/50 w-1/3">{key.replace(/([A-Z])/g, ' $1').trim()}</td>
                      <td className="py-3 px-4 text-sm text-surface-600 dark:text-surface-400">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {/* Review form */}
              {userInfo && (
                <form onSubmit={handleSubmitReview} className="card p-6 max-w-xl">
                  <h3 className="font-display font-semibold text-surface-900 dark:text-white mb-4">Write a Review</h3>
                  <div className="mb-4">
                    <label className="label">Rating</label>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map((star) => (
                        <button key={star} type="button" onClick={() => setRating(star)}>
                          <HiStar className={`w-6 h-6 ${star <= rating ? 'text-amber-400' : 'text-surface-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="label">Comment</label>
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} className="input" placeholder="Share your experience..." required />
                  </div>
                  <button type="submit" disabled={reviewLoading} className="btn-primary">
                    {reviewLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}

              {/* Review list */}
              <div className="space-y-4">
                {product.reviews?.length > 0 ? product.reviews.map((review) => (
                  <div key={review._id} className="card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                          <span className="text-primary-700 dark:text-primary-300 font-bold text-sm">{review.name?.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-surface-900 dark:text-white">{review.name}</p>
                          <p className="text-xs text-surface-500">{formatDate(review.createdAt)}</p>
                        </div>
                      </div>
                      <Rating value={review.rating} showCount={false} size="xs" />
                    </div>
                    <p className="text-sm text-surface-600 dark:text-surface-400">{review.comment}</p>
                  </div>
                )) : <p className="text-surface-500 text-center py-8">No reviews yet. Be the first to review!</p>}
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        {related?.length > 0 && (
          <div>
            <h2 className="section-title mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetailsPage;
