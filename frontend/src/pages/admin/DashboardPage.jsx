import { Helmet } from 'react-helmet-async';
import { HiOutlineTrendingUp, HiOutlineCube, HiOutlineShoppingBag, HiOutlineUsers } from 'react-icons/hi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useGetDashboardStatsQuery, useGetSalesChartQuery, useGetRecentOrdersQuery } from '../../slices/statsApiSlice';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';
import Skeleton from '../../components/ui/Skeleton';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { data: stats, isLoading: loadingStats } = useGetDashboardStatsQuery();
  const { data: chartData, isLoading: loadingChart } = useGetSalesChartQuery();
  const { data: recentOrders, isLoading: loadingOrders } = useGetRecentOrdersQuery(5);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered': return <span className="badge-success">Delivered</span>;
      case 'Cancelled': return <span className="badge-danger">Cancelled</span>;
      case 'Shipped': return <span className="badge-info">Shipped</span>;
      case 'Processing': return <span className="badge-warning">Processing</span>;
      default: return <span className="badge-primary">Pending</span>;
    }
  };

  const statCards = [
    { label: 'Total Revenue', value: stats ? formatPrice(stats.totalRevenue) : '৳0', icon: HiOutlineTrendingUp, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' },
    { label: 'Total Products', value: stats?.totalProducts || 0, icon: HiOutlineCube, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: HiOutlineShoppingBag, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20' },
    { label: 'Total Customers', value: stats?.totalUsers || 0, icon: HiOutlineUsers, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20' },
  ];

  return (
    <>
      <Helmet><title>Admin Overview — ByteNest</title></Helmet>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Dashboard</h1>
          <p className="text-sm text-surface-500 mt-1">Welcome to the ByteNest store overview and system statistics.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, i) => (
            <div key={i} className="card p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1">{card.label}</p>
                {loadingStats ? <Skeleton className="w-16 h-6" /> : <h3 className="text-xl md:text-2xl font-bold font-display">{card.value}</h3>}
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
                <card.icon className="w-6 h-6" />
              </div>
            </div>
          ))}
        </div>

        {/* Chart & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Chart */}
          <div className="lg:col-span-2 card p-6 space-y-4">
            <h3 className="font-display font-semibold text-lg">Sales Analytics</h3>
            <div className="h-80 w-full">
              {loadingChart ? (
                <Skeleton className="w-full h-full" />
              ) : chartData?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
                    <Tooltip formatter={(value) => [`৳${value.toLocaleString('en-BD')}`, 'Sales']} />
                    <Area type="monotone" dataKey="sales" stroke="#4F46E5" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-surface-500">No sales data available.</div>
              )}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="card p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-display font-semibold text-lg border-b pb-3 mb-4">Recent Orders</h3>
              {loadingOrders ? (
                <div className="space-y-3">
                  <Skeleton className="w-full h-12" />
                  <Skeleton className="w-full h-12" />
                </div>
              ) : recentOrders?.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order._id} className="flex justify-between items-center text-sm border-b pb-3">
                      <div>
                        <p className="font-mono text-xs font-semibold">{order._id.substring(0, 8)}...</p>
                        <p className="text-xs text-surface-500 mt-0.5">{formatDate(order.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatPrice(order.totalPrice)}</p>
                        <div className="mt-1">{getStatusBadge(order.status)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-surface-500 text-sm py-4">No recent orders.</p>
              )}
            </div>
            <Link to="/admin/orders" className="btn-secondary w-full justify-center text-xs mt-4">
              View All Orders
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
