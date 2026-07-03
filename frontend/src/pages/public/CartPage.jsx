import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { HiOutlineTrash, HiOutlineShoppingCart, HiArrowRight, HiMinus, HiPlus } from 'react-icons/hi';
import { removeFromCart, updateQty } from '../../slices/cartSlice';
import { formatPrice } from '../../utils/formatPrice';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems, itemsPrice } = useSelector((state) => state.cart);

  const handleCheckout = () => {
    navigate('/login?redirect=/checkout');
  };

  return (
    <>
      <Helmet><title>Shopping Cart — ByteNest</title></Helmet>
      <div className="container-custom py-8">
        <h1 className="section-title mb-6">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 card max-w-xl mx-auto">
            <HiOutlineShoppingCart className="w-16 h-16 text-surface-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-surface-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/products" className="btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item._id} className="card p-4 flex gap-4 items-center">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-contain bg-surface-50 dark:bg-surface-800 rounded-lg p-1" />
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item._id}`} className="font-semibold text-surface-900 dark:text-white hover:text-primary-600 truncate block">
                      {item.name}
                    </Link>
                    <p className="text-xs text-surface-500 mb-1">{item.brand}</p>
                    <p className="price-current text-sm">{formatPrice(item.discountPrice || item.price)}</p>
                  </div>
                  {/* Quantity controls */}
                  <div className="flex items-center border border-surface-200 dark:border-surface-700 rounded-lg">
                    <button onClick={() => dispatch(updateQty({ id: item._id, qty: Math.max(1, item.qty - 1) }))} className="p-1.5 hover:bg-surface-100 dark:hover:bg-surface-700"><HiMinus className="w-3.5 h-3.5" /></button>
                    <span className="px-3 text-sm font-semibold">{item.qty}</span>
                    <button onClick={() => dispatch(updateQty({ id: item._id, qty: Math.min(item.countInStock, item.qty + 1) }))} className="p-1.5 hover:bg-surface-100 dark:hover:bg-surface-700"><HiPlus className="w-3.5 h-3.5" /></button>
                  </div>
                  <button onClick={() => dispatch(removeFromCart(item._id))} className="text-red-500 hover:text-red-600 p-2"><HiOutlineTrash className="w-5 h-5" /></button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="card p-6 h-fit space-y-4">
              <h2 className="font-display font-bold text-lg border-b pb-3">Order Summary</h2>
              <div className="flex justify-between text-sm">
                <span className="text-surface-500">Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})</span>
                <span className="font-semibold">{formatPrice(itemsPrice)}</span>
              </div>
              <p className="text-xs text-surface-500">Shipping and tax calculated at checkout.</p>
              <button onClick={handleCheckout} className="btn-primary w-full justify-center">
                Proceed to Checkout <HiArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;
