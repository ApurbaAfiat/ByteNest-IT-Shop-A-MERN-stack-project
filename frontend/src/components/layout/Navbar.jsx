import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { HiOutlineShoppingCart, HiOutlineHeart, HiOutlineUser, HiOutlineSearch, HiOutlineMenu, HiOutlineX, HiOutlineLogout, HiOutlineViewGrid, HiOutlineCog } from 'react-icons/hi';
import { useLogoutMutation } from '../../slices/usersApiSlice';
import { clearCredentials } from '../../slices/authSlice';
import { toggleTheme } from '../../slices/themeSlice';
import { HiMoon, HiSun } from 'react-icons/hi';
import { toast } from 'react-toastify';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);

  const [logout] = useLogoutMutation();

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setIsUserMenuOpen(false);
    if (isUserMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isUserMenuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearCredentials());
      toast.success('Logged out successfully');
      navigate('/');
    } catch (err) {
      toast.error(err?.data?.message || 'Logout failed');
    }
  };

  const categories = [
    { name: 'Laptops', slug: 'laptops' },
    { name: 'Earbuds', slug: 'earbuds' },
    { name: 'Smartwatches', slug: 'smartwatches' },
    { name: 'Accessories', slug: 'accessories' },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'glass shadow-lg shadow-surface-900/5 dark:shadow-surface-900/30' : 'bg-white dark:bg-surface-900'}`}>
      {/* Top bar */}
      <div className="bg-primary-600 dark:bg-primary-900 text-white text-xs py-1.5">
        <div className="container-custom flex justify-between items-center">
          <span>📞 +880 1700-000001 | Free shipping on orders over ৳5,000</span>
          <div className="hidden sm:flex items-center gap-4">
            <Link to="/about" className="hover:text-primary-200 transition-colors">About</Link>
            <Link to="/contact" className="hover:text-primary-200 transition-colors">Contact</Link>
            <Link to="/faq" className="hover:text-primary-200 transition-colors">FAQ</Link>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="font-display font-bold text-xl text-surface-900 dark:text-white hidden sm:block">
              Byte<span className="text-primary-600">Nest</span>
            </span>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search laptops, earbuds, smartwatches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-2.5 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 text-sm"
              />
              <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                <HiOutlineSearch className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Theme toggle */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 rounded-lg text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              aria-label="Toggle theme"
            >
              {darkMode ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" className="p-2 rounded-lg text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors hidden sm:block">
              <HiOutlineHeart className="w-5 h-5" />
            </Link>

            {/* Cart */}
            <Link to="/cart" className="p-2 rounded-lg text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors relative">
              <HiOutlineShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-accent-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-scale-in">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* User menu */}
            {userInfo ? (
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setIsUserMenuOpen(!isUserMenuOpen); }}
                  className="flex items-center gap-2 p-2 rounded-lg text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                >
                  <div className="w-7 h-7 bg-primary-100 dark:bg-primary-900/40 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 dark:text-primary-300 text-xs font-bold">
                      {userInfo.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium hidden lg:block">{userInfo.name.split(' ')[0]}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 card p-2 animate-slide-down z-50" onClick={(e) => e.stopPropagation()}>
                    <div className="px-3 py-2 border-b border-surface-200 dark:border-surface-700 mb-1">
                      <p className="text-sm font-semibold text-surface-900 dark:text-white">{userInfo.name}</p>
                      <p className="text-xs text-surface-500">{userInfo.email}</p>
                    </div>
                    <Link to="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg" onClick={() => setIsUserMenuOpen(false)}>
                      <HiOutlineUser className="w-4 h-4" /> Profile
                    </Link>
                    <Link to="/my-orders" className="flex items-center gap-2 px-3 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg" onClick={() => setIsUserMenuOpen(false)}>
                      <HiOutlineViewGrid className="w-4 h-4" /> My Orders
                    </Link>
                    <Link to="/wishlist" className="flex items-center gap-2 px-3 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg" onClick={() => setIsUserMenuOpen(false)}>
                      <HiOutlineHeart className="w-4 h-4" /> Wishlist
                    </Link>
                    {userInfo.isAdmin && (
                      <Link to="/admin" className="flex items-center gap-2 px-3 py-2 text-sm text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg" onClick={() => setIsUserMenuOpen(false)}>
                        <HiOutlineCog className="w-4 h-4" /> Admin Dashboard
                      </Link>
                    )}
                    <hr className="my-1 border-surface-200 dark:border-surface-700" />
                    <button
                      onClick={() => { handleLogout(); setIsUserMenuOpen(false); }}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg w-full"
                    >
                      <HiOutlineLogout className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary btn-sm">
                <HiOutlineUser className="w-4 h-4" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 md:hidden"
            >
              {isMobileMenuOpen ? <HiOutlineX className="w-5 h-5" /> : <HiOutlineMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Category nav */}
        <nav className="hidden md:flex items-center gap-1 pb-2 -mt-1">
          <Link to="/products" className="px-3 py-1.5 text-sm font-medium text-surface-700 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors">
            All Products
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="px-3 py-1.5 text-sm font-medium text-surface-700 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-surface-900 border-t border-surface-200 dark:border-surface-700 animate-slide-down">
          <div className="container-custom py-4 space-y-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-surface-400">
                  <HiOutlineSearch className="w-5 h-5" />
                </button>
              </div>
            </form>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/products" className="px-4 py-2.5 text-sm font-medium text-surface-700 dark:text-surface-300 bg-surface-50 dark:bg-surface-800 rounded-lg text-center" onClick={() => setIsMobileMenuOpen(false)}>
                All Products
              </Link>
              {categories.map((cat) => (
                <Link key={cat.slug} to={`/category/${cat.slug}`} className="px-4 py-2.5 text-sm font-medium text-surface-700 dark:text-surface-300 bg-surface-50 dark:bg-surface-800 rounded-lg text-center" onClick={() => setIsMobileMenuOpen(false)}>
                  {cat.name}
                </Link>
              ))}
            </div>
            <div className="flex gap-2">
              <Link to="/about" className="text-sm text-surface-500 hover:text-primary-600" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
              <Link to="/contact" className="text-sm text-surface-500 hover:text-primary-600" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
              <Link to="/faq" className="text-sm text-surface-500 hover:text-primary-600" onClick={() => setIsMobileMenuOpen(false)}>FAQ</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
