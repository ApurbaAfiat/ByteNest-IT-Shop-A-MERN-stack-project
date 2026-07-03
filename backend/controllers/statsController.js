import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';

// @desc     Get dashboard stats
// @method   GET
// @endpoint /api/v1/stats/dashboard
// @access   Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments({ isAdmin: false });

    // Calculate total revenue from paid orders
    const revenueResult = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Pending orders
    const pendingOrders = await Order.countDocuments({ orderStatus: 'Processing' });

    // Low stock products (less than 5)
    const lowStockProducts = await Product.countDocuments({ countInStock: { $lt: 5, $gt: 0 } });

    // Out of stock
    const outOfStock = await Product.countDocuments({ countInStock: 0 });

    res.status(200).json({
      totalRevenue,
      totalOrders,
      totalProducts,
      totalUsers,
      pendingOrders,
      lowStockProducts,
      outOfStock
    });
  } catch (error) {
    next(error);
  }
};

// @desc     Get monthly sales data for charts
// @method   GET
// @endpoint /api/v1/stats/sales-chart
// @access   Private/Admin
const getSalesChart = async (req, res, next) => {
  try {
    const months = Number(req.query.months) || 6;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          orderStatus: { $ne: 'Cancelled' }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          totalSales: { $sum: '$totalPrice' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Format data with month names
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const formattedData = salesData.map(item => ({
      month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      totalSales: item.totalSales,
      orderCount: item.orderCount
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    next(error);
  }
};

// @desc     Get recent orders
// @method   GET
// @endpoint /api/v1/stats/recent-orders
// @access   Private/Admin
const getRecentOrders = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit);
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc     Get category distribution
// @method   GET
// @endpoint /api/v1/stats/categories
// @access   Private/Admin
const getCategoryStats = async (req, res, next) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
};

export {
  getDashboardStats,
  getSalesChart,
  getRecentOrders,
  getCategoryStats
};
