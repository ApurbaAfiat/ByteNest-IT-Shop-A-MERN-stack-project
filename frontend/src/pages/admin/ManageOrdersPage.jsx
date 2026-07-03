import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';
import Skeleton from '../../components/ui/Skeleton';

const ManageOrdersPage = () => {
  const { data: orders, isLoading } = useGetOrdersQuery();

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
      <Helmet><title>Manage Orders — ByteNest</title></Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Orders</h1>
          <p className="text-sm text-surface-500 mt-1">Monitor sales orders, shipping updates, and payment details.</p>
        </div>

        <div className="card p-6">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-full h-12" />
            </div>
          ) : !orders || orders.length === 0 ? (
            <p className="text-surface-500 text-center py-4">No orders found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-surface-200 dark:border-surface-700 text-surface-500">
                    <th className="pb-3 pr-4">Order ID</th>
                    <th className="pb-3 px-4">Customer</th>
                    <th className="pb-3 px-4">Date</th>
                    <th className="pb-3 px-4">Total</th>
                    <th className="pb-3 px-4">Status</th>
                    <th className="pb-3 pl-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800/30">
                      <td className="py-3.5 pr-4 font-mono text-xs font-semibold">{order._id}</td>
                      <td className="py-3.5 px-4 font-semibold">{order.user?.name || 'Guest/Deleted'}</td>
                      <td className="py-3.5 px-4">{formatDate(order.createdAt)}</td>
                      <td className="py-3.5 px-4 font-semibold">{formatPrice(order.totalPrice)}</td>
                      <td className="py-3.5 px-4">{getStatusBadge(order.status)}</td>
                      <td className="py-3.5 pl-4">
                        <Link to={`/admin/orders/${order._id}`} className="btn-secondary btn-sm">
                          Manage
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
    </>
  );
};

export default ManageOrdersPage;
