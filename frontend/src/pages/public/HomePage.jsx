import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { HiOutlineTruck, HiOutlineShieldCheck, HiOutlineSupport, HiOutlineCash, HiArrowRight, HiOutlineDeviceMobile, HiOutlineVolumeUp, HiOutlineClock, HiOutlineDesktopComputer } from 'react-icons/hi';
import { useGetFeaturedProductsQuery, useGetNewArrivalsQuery, useGetBestSellingQuery } from '../../slices/productsApiSlice';
import ProductCard from '../../components/product/ProductCard';
import { ProductCardSkeleton } from '../../components/ui/Skeleton';

const categories = [
  { name: 'Laptops', slug: 'laptops', icon: HiOutlineDesktopComputer, color: 'from-blue-500 to-indigo-600', desc: '20 Products' },
  { name: 'Earbuds', slug: 'earbuds', icon: HiOutlineVolumeUp, color: 'from-pink-500 to-rose-600', desc: '15 Products' },
  { name: 'Smartwatches', slug: 'smartwatches', icon: HiOutlineClock, color: 'from-emerald-500 to-teal-600', desc: '10 Products' },
  { name: 'Accessories', slug: 'accessories', icon: HiOutlineDeviceMobile, color: 'from-amber-500 to-orange-600', desc: '10 Products' },
];

const brands = ['ASUS', 'HP', 'Dell', 'Lenovo', 'MSI', 'Acer', 'Sony', 'Samsung', 'Apple', 'JBL', 'Bose', 'Logitech', 'Razer', 'Corsair', 'Garmin'];

const HomePage = () => {
  const { data: featured, isLoading: loadingFeatured } = useGetFeaturedProductsQuery(8);
  const { data: newArrivals, isLoading: loadingNew } = useGetNewArrivalsQuery(8);
  const { data: bestSelling, isLoading: loadingBest } = useGetBestSellingQuery(4);

  const renderProducts = (products, isLoading, count = 4) => {
    if (isLoading) return Array(count).fill(0).map((_, i) => <ProductCardSkeleton key={i} />);
    if (!products?.length) return <p className="col-span-full text-center text-surface-500">No products found</p>;
    return products.map((product) => <ProductCard key={product._id} product={product} />);
  };

  return (
    <>
      <Helmet>
        <title>ByteNest — Premium IT Products Online</title>
        <meta name="description" content="Shop laptops, earbuds, smartwatches, and accessories at ByteNest. Best prices, authentic products, fast delivery." />
      </Helmet>

      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 dark:from-primary-900 dark:via-surface-900 dark:to-surface-950 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent-500 rounded-full blur-3xl" />
        </div>
        <div className="container-custom relative z-10 py-16 md:py-24 lg:py-32">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white text-sm font-medium rounded-full mb-6 animate-fade-in">
              🔥 Summer Sale — Up to 30% Off
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-white leading-tight mb-6 animate-slide-up">
              Your Premium<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-300 to-accent-500">IT Product</span> Destination
            </h1>
            <p className="text-lg text-primary-100 mb-8 max-w-lg animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Discover top-tier laptops, earbuds, smartwatches, and accessories. Authentic products. Best prices. Free delivery over ৳5,000.
            </p>
            <div className="flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link to="/products" className="btn bg-white text-primary-700 hover:bg-surface-100 shadow-xl shadow-primary-900/30 btn-lg font-semibold">
                Shop Now <HiArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/category/laptops" className="btn border-2 border-white/30 text-white hover:bg-white/10 btn-lg">
                Browse Laptops
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container-custom py-12 md:py-16">
        <div className="text-center mb-8">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Find exactly what you need</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${cat.color} text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500" />
              <cat.icon className="w-10 h-10 mb-3 relative z-10" />
              <h3 className="font-display font-bold text-lg relative z-10">{cat.name}</h3>
              <p className="text-sm text-white/70 relative z-10">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-surface-50 dark:bg-surface-900/50 py-12 md:py-16">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="section-subtitle">Handpicked products just for you</p>
            </div>
            <Link to="/products" className="btn-outline btn-sm hidden sm:flex">
              View All <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {renderProducts(featured, loadingFeatured, 8)}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="container-custom py-12">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-accent-500 to-accent-600 p-8 md:p-12">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute left-1/2 bottom-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2" />
          <div className="relative z-10 max-w-xl">
            <span className="badge bg-white/20 text-white mb-4">Limited Time Offer</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">
              Use Code <span className="bg-white/20 px-3 py-1 rounded-lg">SAVE10</span>
            </h2>
            <p className="text-white/80 mb-6">Get 10% off on your first order. Minimum purchase ৳5,000. Valid on all products.</p>
            <Link to="/products" className="btn bg-white text-accent-700 hover:bg-surface-100 shadow-lg font-semibold">
              Shop Now <HiArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Best Selling */}
      <section className="container-custom py-12 md:py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">Best Selling</h2>
            <p className="section-subtitle">Our most popular products</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {renderProducts(bestSelling, loadingBest, 4)}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="bg-surface-50 dark:bg-surface-900/50 py-12 md:py-16">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">New Arrivals</h2>
              <p className="section-subtitle">Fresh drops you do not want to miss</p>
            </div>
            <Link to="/products?sort=newest" className="btn-outline btn-sm hidden sm:flex">
              View All <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {renderProducts(newArrivals, loadingNew, 8)}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="container-custom py-12 md:py-16">
        <div className="text-center mb-8">
          <h2 className="section-title">Top Brands</h2>
          <p className="section-subtitle">We partner with the world's leading tech brands</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {brands.map((brand) => (
            <Link
              key={brand}
              to={`/products?brand=${brand}`}
              className="px-6 py-3 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-sm font-semibold text-surface-700 dark:text-surface-300 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 hover:shadow-md transition-all"
            >
              {brand}
            </Link>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-surface-50 dark:bg-surface-900/50 py-12 md:py-16">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="section-title">Why Choose ByteNest?</h2>
            <p className="section-subtitle">We make IT shopping simple, reliable, and affordable</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: HiOutlineTruck, title: 'Free Delivery', desc: 'Free shipping on orders above ৳5,000 across Bangladesh' },
              { icon: HiOutlineShieldCheck, title: '100% Authentic', desc: 'All products are genuine with manufacturer warranty' },
              { icon: HiOutlineSupport, title: '24/7 Support', desc: 'Our support team is always ready to help you' },
              { icon: HiOutlineCash, title: 'Best Prices', desc: 'Competitive prices with exclusive deals and offers' },
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 mx-auto bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary-600 transition-colors duration-300">
                  <item.icon className="w-8 h-8 text-primary-600 dark:text-primary-400 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-display font-semibold text-surface-900 dark:text-white mb-1">{item.title}</h3>
                <p className="text-sm text-surface-500 dark:text-surface-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="container-custom py-12 md:py-16">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-800 dark:to-primary-950 rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">Stay Updated</h2>
          <p className="text-primary-200 mb-6 max-w-md mx-auto">Subscribe to our newsletter for the latest deals, product launches, and tech news.</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-primary-200 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            <button type="submit" className="btn bg-white text-primary-700 hover:bg-surface-100 font-semibold px-6">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default HomePage;
