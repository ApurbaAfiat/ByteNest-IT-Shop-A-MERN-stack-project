import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { HiOutlineUser, HiOutlineShoppingBag, HiOutlineHeart, HiOutlineLockClosed } from 'react-icons/hi';
import { useGetMyOrdersQuery } from '../../slices/ordersApiSlice';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';
import Skeleton from '../../components/ui/Skeleton';

const MyOrdersPage = () => {
  const { data: orders, isLoading } = useGetMyOrdersQuery();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered': return <span className="badge-success">Delivered</span>;
      case 'Cancelled': return <span className="badge-danger">Cancelled</span>;
      case 'Shipped': return <span className="badge-info">Shipped</span>;
      case 'Processing': return <span className="badge-warning">Processing</span>;
      default: return <span className="badge-primary">Pending</span>;
    }
  };

  return (
    <>
      <Helmet><title>My Orders — ByteNest</title></Helmet>
      <div className="container-custom py-8">
        <h1 className="section-title mb-6">User Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside className="card p-4 h-fit space-y-1">
            <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800">
              <HiOutlineUser className="w-5 h-5" /> Account Details
            </Link>
            <Link to="/my-orders" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
              <HiOutlineShoppingBag className="w-5 h-5" /> My Orders
            </Link>
            <Link to="/wishlist" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800">
              <HiOutlineHeart className="w-5 h-5" /> Wishlist
            </Link>
            <Link to="/change-password" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800">
              <HiOutlineLockClosed className="w-5 h-5" /> Change Password
            </Link>
          </aside>

          <div className="md:col-span-3 space-y-4">
            <div className="card p-6">
              <h2 className="font-display font-bold text-xl border-b pb-4 mb-6">My Orders</h2>

              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="w-full h-12" />
                  <Skeleton className="w-full h-12" />
                  <Skeleton className="w-full h-12" />
                </div>
              ) : !orders || orders.length === 0 ? (
                <p className="text-surface-500 py-4 text-center">You haven't placed any orders yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-surface-200 dark:border-surface-700 text-sm text-surface-500">
                        <th className="pb-3 pr-4">Order ID</th>
                        <th className="pb-3 px-4">Date</th>
                        <th className="pb-3 px-4">Total</th>
                        <th className="pb-3 px-4">Status</th>
                        <th className="pb-3 pl-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id} className="border-b border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800/30">
                          <td className="py-4 pr-4 font-mono text-xs font-semibold">{order._id}</td>
                          <td className="py-4 px-4 text-sm">{formatDate(order.createdAt)}</td>
                          <td className="py-4 px-4 text-sm font-semibold">{formatPrice(order.totalPrice)}</td>
                          <td className="py-4 px-4">{getStatusBadge(order.status)}</td>
                          <td className="py-4 pl-4">
                            <Link to={`/order/${order._id}`} className="btn-secondary btn-sm">
                              View Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyOrdersPage;
