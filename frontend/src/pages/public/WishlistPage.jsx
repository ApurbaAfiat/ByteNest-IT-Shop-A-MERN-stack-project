import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { HiOutlineHeart } from 'react-icons/hi';
import { useGetWishlistQuery } from '../../slices/usersApiSlice';
import ProductCard from '../../components/product/ProductCard';
import { ProductCardSkeleton } from '../../components/ui/Skeleton';

const WishlistPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: wishlist, isLoading } = useGetWishlistQuery(undefined, { skip: !userInfo });

  if (!userInfo) {
    return (
      <div className="container-custom py-16 text-center card max-w-md mx-auto my-12">
        <HiOutlineHeart className="w-16 h-16 text-surface-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Your Wishlist</h2>
        <p className="text-surface-500 mb-6">Please log in to view and manage your saved products.</p>
        <Link to="/login" className="btn-primary">Log In</Link>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>My Wishlist — ByteNest</title></Helmet>
      <div className="container-custom py-8">
        <h1 className="section-title mb-6">My Wishlist</h1>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(4).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : wishlist?.length === 0 ? (
          <div className="text-center py-16 card max-w-xl mx-auto">
            <HiOutlineHeart className="w-16 h-16 text-surface-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Your wishlist is empty</h2>
            <p className="text-surface-500 mb-6">Add items to your wishlist while browsing to save them for later.</p>
            <Link to="/products" className="btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist?.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default WishlistPage;
