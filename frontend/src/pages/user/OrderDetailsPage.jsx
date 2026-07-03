import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { HiOutlineUser, HiOutlineShoppingBag, HiOutlineHeart, HiOutlineLockClosed } from 'react-icons/hi';
import { useGetOrderDetailsQuery, useCancelOrderMutation } from '../../slices/ordersApiSlice';
import { formatPrice } from '../../utils/formatPrice';
import { formatDateTime } from '../../utils/formatDate';
import Skeleton from '../../components/ui/Skeleton';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const { data: order, isLoading, refetch } = useGetOrderDetailsQuery(id);
  const [cancelOrder, { isLoading: cancelling }] = useCancelOrderMutation();

  const handleCancelOrder = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await cancelOrder(id).unwrap();
        toast.success('Order cancelled successfully');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || 'Failed to cancel order');
      }
    }
  };

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
      <Helmet><title>Order Details — ByteNest</title></Helmet>
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

          <div className="md:col-span-3 space-y-6">
            {isLoading ? (
              <Skeleton className="w-full h-96" />
            ) : !order ? (
              <div className="card p-6 text-center"><p className="text-red-500">Order not found.</p></div>
            ) : (
              <div className="space-y-6">
                {/* Header */}
                <div className="card p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="font-display font-bold text-xl flex items-center gap-3">
                      Order Details {getStatusBadge(order.status)}
                    </h2>
                    <p className="text-xs font-mono text-surface-500 mt-1">ID: {order._id}</p>
                    <p className="text-xs text-surface-500 mt-0.5">Placed on {formatDateTime(order.createdAt)}</p>
                  </div>
                  {order.status === 'Pending' && (
                    <button onClick={handleCancelOrder} disabled={cancelling} className="btn-danger btn-sm">
                      {cancelling ? 'Cancelling...' : 'Cancel Order'}
                    </button>
                  )}
                </div>

                {/* Items */}
                <div className="card p-6">
                  <h3 className="font-display font-semibold mb-4 text-lg">Order Items</h3>
                  <div className="divide-y divide-surface-200 dark:divide-surface-700">
                    {order.orderItems.map((item) => (
                      <div key={item._id} className="py-4 flex gap-4 items-center">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-contain bg-surface-50 dark:bg-surface-800 rounded-lg p-1" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-surface-900 dark:text-white truncate">{item.name}</p>
                          <p className="text-xs text-surface-500 mt-0.5">
                            {formatPrice(item.price)} × {item.qty}
                          </p>
                        </div>
                        <span className="font-bold text-sm">{formatPrice(item.price * item.qty)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping & Payment */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="card p-6">
                    <h3 className="font-display font-semibold mb-3">Shipping Address</h3>
                    <p className="text-sm leading-relaxed text-surface-700 dark:text-surface-300">
                      {order.shippingAddress.address}<br />
                      {order.shippingAddress.city} — {order.shippingAddress.postalCode}<br />
                      {order.shippingAddress.country}
                    </p>
                  </div>
                  <div className="card p-6 space-y-3">
                    <h3 className="font-display font-semibold">Payment Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-surface-500">Items Price</span>
                        <span>{formatPrice(order.itemsPrice)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-surface-500">Shipping</span>
                        <span>{formatPrice(order.shippingPrice)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-surface-500">VAT (5%)</span>
                        <span>{formatPrice(order.taxPrice)}</span>
                      </div>
                      {order.discountAmount > 0 && (
                        <div className="flex justify-between text-emerald-500 font-medium">
                          <span>Discount ({order.couponCode || 'Promo'})</span>
                          <span>-{formatPrice(order.discountAmount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
                        <span>Total Paid</span>
                        <span className="text-primary-600 dark:text-primary-400">{formatPrice(order.totalPrice)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsPage;
