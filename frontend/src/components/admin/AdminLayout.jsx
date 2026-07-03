import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { HiOutlineChartBar, HiOutlineCube, HiOutlineFolder, HiOutlineUsers, HiOutlineShoppingBag, HiOutlineLogout, HiOutlineArrowLeft, HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { useLogoutMutation } from '../../slices/usersApiSlice';
import { clearCredentials } from '../../slices/authSlice';
import { toast } from 'react-toastify';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const [logout] = useLogoutMutation();

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

  const menuItems = [
    { label: 'Overview', to: '/admin', icon: HiOutlineChartBar, exact: true },
    { label: 'Products', to: '/admin/products', icon: HiOutlineCube },
    { label: 'Categories', to: '/admin/categories', icon: HiOutlineFolder },
    { label: 'Orders', to: '/admin/orders', icon: HiOutlineShoppingBag },
    { label: 'Users', to: '/admin/users', icon: HiOutlineUsers },
  ];

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.to;
    return location.pathname.startsWith(item.to) && location.pathname !== '/admin/products/add';
  };

  return (
    <div className="flex min-h-screen bg-surface-100 dark:bg-surface-950 text-surface-900 dark:text-surface-100">
      {/* Sidebar Mobile Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed bottom-4 right-4 z-50 p-3 bg-primary-600 text-white rounded-full shadow-lg md:hidden"
      >
        {isSidebarOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-800 transition-transform duration-300 transform md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Brand Logo */}
          <div className="h-16 flex items-center gap-2 px-6 border-b border-surface-200 dark:border-surface-800">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-base">B</span>
            </div>
            <span className="font-display font-bold text-lg text-surface-900 dark:text-white">
              Byte<span className="text-primary-600">Nest</span> Admin
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {menuItems.map((item) => {
              const active = isActive(item);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                      : 'text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800/50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t border-surface-200 dark:border-surface-800 space-y-2">
            <Link to="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800/50">
              <HiOutlineArrowLeft className="w-5 h-5" /> Back to Store
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 w-full text-left"
            >
              <HiOutlineLogout className="w-5 h-5" /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:pl-64 min-h-screen flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800 flex items-center justify-between px-6 md:px-8">
          <h2 className="font-display font-semibold text-lg">System Dashboard</h2>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold">{userInfo?.name}</p>
              <p className="text-xs text-surface-500">Administrator</p>
            </div>
            <div className="w-9 h-9 bg-primary-100 dark:bg-primary-900/40 rounded-full flex items-center justify-center">
              <span className="text-primary-700 dark:text-primary-300 font-bold text-sm">
                {userInfo?.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Nested Content */}
        <div className="flex-1 p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
