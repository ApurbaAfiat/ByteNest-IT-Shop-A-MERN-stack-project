import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { useCreateOrderMutation } from '../../slices/ordersApiSlice';
import { useApplyCouponMutation } from '../../slices/couponsApiSlice';
import { applyCouponDiscount, clearCartItems } from '../../slices/cartSlice';
import { formatPrice } from '../../utils/formatPrice';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems, shippingAddress, itemsPrice, shippingPrice, taxPrice, discountAmount, couponCode, totalPrice } = cart;

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || 'Bangladesh');

  const [couponInput, setCouponInput] = useState('');
  const [applyCoupon, { isLoading: applyingCoupon }] = useApplyCouponMutation();
  const [createOrder, { isLoading: creatingOrder }] = useCreateOrderMutation();

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    try {
      const res = await applyCoupon({ code: couponInput, cartTotal: itemsPrice }).unwrap();
      dispatch(applyCouponDiscount({ discount: res.discount, code: couponInput.toUpperCase() }));
      toast.success('Coupon applied successfully!');
    } catch (err) {
      toast.error(err?.data?.message || 'Invalid coupon');
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address || !city || !postalCode || !country) {
      return toast.error('Please fill in all shipping details');
    }

    try {
      const res = await createOrder({
        orderItems: cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.discountPrice || item.price,
        })),
        shippingAddress: { address, city, postalCode, country },
        paymentMethod: 'Cash on Delivery',
        couponCode: couponCode || undefined,
        discountAmount,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      }).unwrap();

      dispatch(clearCartItems());
      toast.success('Order placed successfully!');
      navigate(`/order-success/${res._id}`);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to place order');
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <>
      <Helmet><title>Checkout — ByteNest</title></Helmet>
      <div className="container-custom py-8">
        <h1 className="section-title mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2 card p-6 h-fit">
            <h2 className="font-display font-bold text-lg border-b pb-3 mb-4">Shipping Information</h2>
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div>
                <label className="label">Delivery Address</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="input" placeholder="House/Flat No, Street Address" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="label">City</label>
                  <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="input" placeholder="Dhaka" required />
                </div>
                <div>
                  <label className="label">Postal Code</label>
                  <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="input" placeholder="1212" required />
                </div>
                <div>
                  <label className="label">Country</label>
                  <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} className="input" required />
                </div>
              </div>
              <div className="pt-4 border-t">
                <h3 className="font-display font-semibold mb-2">Payment Method</h3>
                <div className="p-4 bg-surface-50 dark:bg-surface-800 rounded-xl border">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" checked readOnly className="text-primary-600 focus:ring-primary-500" />
                    <span className="font-medium text-surface-900 dark:text-white">Cash on Delivery (COD)</span>
                  </label>
                </div>
              </div>
            </form>
          </div>

          {/* Cart Summary */}
          <div className="space-y-6">
            {/* Promo Code */}
            <div className="card p-6">
              <h3 className="font-display font-semibold mb-3">Apply Coupon</h3>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input type="text" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} placeholder="SAVE10" className="input uppercase" disabled={!!couponCode} />
                <button type="submit" disabled={applyingCoupon || !!couponCode} className="btn-primary whitespace-nowrap">
                  {couponCode ? 'Applied' : 'Apply'}
                </button>
              </form>
              {couponCode && (
                <p className="text-xs text-emerald-500 mt-2 font-medium">
                  Coupon "{couponCode}" applied (-{formatPrice(discountAmount)})
                </p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="card p-6 space-y-4">
              <h2 className="font-display font-bold text-lg border-b pb-3">Checkout Summary</h2>
              <div className="space-y-2 text-sm border-b pb-4">
                <div className="flex justify-between">
                  <span className="text-surface-500">Subtotal</span>
                  <span className="font-semibold">{formatPrice(itemsPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-500">Shipping</span>
                  <span className="font-semibold">{formatPrice(shippingPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-500">VAT (5%)</span>
                  <span className="font-semibold">{formatPrice(taxPrice)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-500 font-medium">
                    <span>Discount</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Amount</span>
                <span className="text-primary-600 dark:text-primary-400">{formatPrice(totalPrice)}</span>
              </div>
              <button onClick={handlePlaceOrder} disabled={creatingOrder} className="btn-primary w-full justify-center">
                {creatingOrder ? 'Placing Order...' : 'Place COD Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
