import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { useGetOrderDetailsQuery, useUpdateOrderStatusMutation } from '../../slices/ordersApiSlice';
import { formatPrice } from '../../utils/formatPrice';
import { formatDateTime } from '../../utils/formatDate';
import Skeleton from '../../components/ui/Skeleton';

const AdminOrderDetailPage = () => {
  const { id } = useParams();
  const { data: order, isLoading, refetch } = useGetOrderDetailsQuery(id);
  const [updateStatus, { isLoading: updating }] = useUpdateOrderStatusMutation();

  const handleStatusChange = async (e) => {
    const status = e.target.value;
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success('Order status updated successfully');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update order status');
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
      <Helmet><title>Order #{id?.substring(0, 8)} Details — Admin</title></Helmet>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Link to="/admin/orders" className="text-sm text-primary-600 hover:underline">← Back to Orders</Link>
            <h1 className="text-2xl md:text-3xl font-display font-bold mt-2">Manage Order</h1>
          </div>
        </div>

        {isLoading ? (
          <Skeleton className="w-full h-96" />
        ) : !order ? (
          <div className="card p-6 text-center text-red-500">Order not found.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Col - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Info */}
              <div className="card p-6 space-y-2">
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                  <h3 className="font-display font-semibold text-lg">Order Information</h3>
                  {getStatusBadge(order.status)}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-surface-500 block">Placed On</span>
                    <span className="font-semibold">{formatDateTime(order.createdAt)}</span>
                  </div>
                  <div>
                    <span className="text-surface-500 block">Customer</span>
                    <span className="font-semibold">{order.user?.name || 'Guest User'} ({order.user?.email})</span>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="card p-6">
                <h3 className="font-display font-semibold border-b pb-4 mb-4 text-lg">Order Items</h3>
                <div className="divide-y divide-surface-200 dark:divide-surface-700">
                  {order.orderItems.map((item) => (
                    <div key={item._id} className="py-4 flex gap-4 items-center">
                      <img src={item.image} alt="" className="w-14 h-14 object-contain bg-surface-50 dark:bg-surface-800 rounded-lg p-1" />
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
            </div>

            {/* Right Col - Controls & Summary */}
            <div className="space-y-6">
              {/* Update Status */}
              <div className="card p-6 space-y-4">
                <h3 className="font-display font-semibold">Order Actions</h3>
                <div>
                  <label className="label">Update Order Status</label>
                  <select value={order.status} onChange={handleStatusChange} disabled={updating || order.status === 'Cancelled' || order.status === 'Delivered'} className="input">
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Address & Pricing */}
              <div className="card p-6 space-y-4">
                <h3 className="font-display font-semibold border-b pb-2">Order Calculations</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-surface-500">Subtotal</span>
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
                    <div className="flex justify-between text-emerald-500 font-semibold">
                      <span>Discount ({order.couponCode})</span>
                      <span>-{formatPrice(order.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2 font-bold text-base mt-2">
                    <span>Total Amount</span>
                    <span className="text-primary-600 dark:text-primary-400">{formatPrice(order.totalPrice)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminOrderDetailPage;
