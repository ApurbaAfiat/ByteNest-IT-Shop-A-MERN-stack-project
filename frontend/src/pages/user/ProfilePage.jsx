import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { HiOutlineUser, HiOutlineShoppingBag, HiOutlineHeart, HiOutlineLockClosed, HiOutlinePencil } from 'react-icons/hi';

const ProfilePage = () => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo) return null;

  return (
    <>
      <Helmet><title>My Profile — ByteNest</title></Helmet>
      <div className="container-custom py-8">
        <h1 className="section-title mb-6">User Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Navigation Links */}
          <aside className="card p-4 h-fit space-y-1">
            <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
              <HiOutlineUser className="w-5 h-5" /> Account Details
            </Link>
            <Link to="/my-orders" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800">
              <HiOutlineShoppingBag className="w-5 h-5" /> My Orders
            </Link>
            <Link to="/wishlist" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800">
              <HiOutlineHeart className="w-5 h-5" /> Wishlist
            </Link>
            <Link to="/change-password" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800">
              <HiOutlineLockClosed className="w-5 h-5" /> Change Password
            </Link>
          </aside>

          {/* Account Details */}
          <div className="md:col-span-3 card p-6">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              <h2 className="font-display font-bold text-xl">Account Details</h2>
              <Link to="/profile/edit" className="btn-secondary btn-sm flex items-center gap-1.5">
                <HiOutlinePencil className="w-4 h-4" /> Edit Profile
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-xs text-surface-400 font-semibold uppercase tracking-wider block mb-1">Full Name</label>
                <p className="font-medium text-surface-900 dark:text-white">{userInfo.name}</p>
              </div>
              <div>
                <label className="text-xs text-surface-400 font-semibold uppercase tracking-wider block mb-1">Email Address</label>
                <p className="font-medium text-surface-900 dark:text-white">{userInfo.email}</p>
              </div>
              <div>
                <label className="text-xs text-surface-400 font-semibold uppercase tracking-wider block mb-1">Phone Number</label>
                <p className="font-medium text-surface-900 dark:text-white">{userInfo.phone || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-xs text-surface-400 font-semibold uppercase tracking-wider block mb-1">Account Role</label>
                <p className="font-medium text-surface-900 dark:text-white">{userInfo.isAdmin ? 'Administrator' : 'Standard User'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
