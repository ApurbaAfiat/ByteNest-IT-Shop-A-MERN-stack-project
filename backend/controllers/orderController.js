import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';

// @desc     Create new order
// @method   POST
// @endpoint /api/v1/orders
// @access   Private
const addOrderItems = async (req, res, next) => {
  try {
    const {
      cartItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      discountAmount,
      couponCode,
      totalPrice
    } = req.body;

    if (!cartItems || cartItems.length === 0) {
      res.statusCode = 400;
      throw new Error('No order items.');
    }

    const order = new Order({
      user: req.user._id,
      orderItems: cartItems.map(item => ({
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.discountPrice || item.price,
        product: item._id
      })),
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      discountAmount: discountAmount || 0,
      couponCode: couponCode || '',
      totalPrice,
      isPaid: paymentMethod === 'Online Payment',
      paidAt: paymentMethod === 'Online Payment' ? new Date() : undefined
    });

    const createdOrder = await order.save();

    // Reduce stock for each ordered item
    for (const item of cartItems) {
      const product = await Product.findById(item._id);
      if (product) {
        product.countInStock = Math.max(0, product.countInStock - item.qty);
        if (product.countInStock === 0) {
          product.availability = 'Out of Stock';
        }
        await product.save();
      }
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    next(error);
  }
};

// @desc     Get logged-in user orders
// @method   GET
// @endpoint /api/v1/orders/my-orders
// @access   Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1
    });
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc     Get order by ID
// @method   GET
// @endpoint /api/v1/orders/:id
// @access   Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email phone'
    );

    if (!order) {
      res.statusCode = 404;
      throw new Error('Order not found!');
    }

    // Ensure user can only see their own orders (or admin can see all)
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      res.statusCode = 403;
      throw new Error('Not authorized to view this order.');
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

// @desc     Update order to paid
// @method   PUT
// @endpoint /api/v1/orders/:id/pay
// @access   Private
const updateOrderToPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.statusCode = 404;
      throw new Error('Order not found!');
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.updateTime,
      email_address: req.body.email
    };

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

// @desc     Update order status (admin)
// @method   PUT
// @endpoint /api/v1/orders/:id/status
// @access   Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.statusCode = 404;
      throw new Error('Order not found!');
    }

    order.orderStatus = status;

    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
      // Mark COD orders as paid upon delivery
      if (order.paymentMethod === 'Cash on Delivery' && !order.isPaid) {
        order.isPaid = true;
        order.paidAt = new Date();
      }
    }

    if (status === 'Cancelled') {
      // Restore stock
      for (const item of order.orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
          product.countInStock += item.qty;
          product.availability = 'In Stock';
          await product.save();
        }
      }
    }

    const updatedOrder = await order.save();
    res.status(200).json({ message: `Order ${status}`, order: updatedOrder });
  } catch (error) {
    next(error);
  }
};

// @desc     Cancel order (user)
// @method   PUT
// @endpoint /api/v1/orders/:id/cancel
// @access   Private
const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.statusCode = 404;
      throw new Error('Order not found!');
    }

    if (order.user.toString() !== req.user._id.toString()) {
      res.statusCode = 403;
      throw new Error('Not authorized.');
    }

    if (order.orderStatus !== 'Processing') {
      res.statusCode = 400;
      throw new Error('Can only cancel orders that are still Processing.');
    }

    order.orderStatus = 'Cancelled';

    // Restore stock
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.countInStock += item.qty;
        product.availability = 'In Stock';
        await product.save();
      }
    }

    const updatedOrder = await order.save();
    res.status(200).json({ message: 'Order cancelled', order: updatedOrder });
  } catch (error) {
    next(error);
  }
};

// @desc     Get all orders (admin)
// @method   GET
// @endpoint /api/v1/orders
// @access   Private/Admin
const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderStatus,
  cancelOrder,
  getOrders
};
