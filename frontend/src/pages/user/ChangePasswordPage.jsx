import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { HiOutlineUser, HiOutlineShoppingBag, HiOutlineHeart, HiOutlineLockClosed } from 'react-icons/hi';
import { useChangePasswordMutation } from '../../slices/usersApiSlice';

const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error('New passwords do not match');
    }
    try {
      await changePassword({ currentPassword, newPassword }).unwrap();
      toast.success('Password changed successfully');
      navigate('/profile');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to change password');
    }
  };

  return (
    <>
      <Helmet><title>Change Password — ByteNest</title></Helmet>
      <div className="container-custom py-8">
        <h1 className="section-title mb-6">User Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside className="card p-4 h-fit space-y-1">
            <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800">
              <HiOutlineUser className="w-5 h-5" /> Account Details
            </Link>
            <Link to="/my-orders" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800">
              <HiOutlineShoppingBag className="w-5 h-5" /> My Orders
            </Link>
            <Link to="/wishlist" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800">
              <HiOutlineHeart className="w-5 h-5" /> Wishlist
            </Link>
            <Link to="/change-password" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
              <HiOutlineLockClosed className="w-5 h-5" /> Change Password
            </Link>
          </aside>

          <div className="md:col-span-3 card p-6">
            <h2 className="font-display font-bold text-xl border-b pb-4 mb-6">Change Password</h2>
            <form onSubmit={handleSubmit} className="max-w-md space-y-4">
              <div>
                <label className="label">Current Password</label>
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="input" required />
              </div>
              <div>
                <label className="label">New Password</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input" required />
              </div>
              <div>
                <label className="label">Confirm New Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input" required />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={isLoading} className="btn-primary">
                  {isLoading ? 'Updating...' : 'Change Password'}
                </button>
                <Link to="/profile" className="btn-secondary">Cancel</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePasswordPage;
