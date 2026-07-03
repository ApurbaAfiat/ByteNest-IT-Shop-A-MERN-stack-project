import { createSlice } from '@reduxjs/toolkit';

const updateCart = (state) => {
  // Calculate items price
  state.itemsPrice = state.cartItems.reduce(
    (acc, item) => acc + (item.discountPrice || item.price) * item.qty,
    0
  );
  // Shipping: free over ৳5000, else ৳100
  state.shippingPrice = state.itemsPrice > 5000 ? 0 : 100;
  // VAT: 5%
  state.taxPrice = Math.round(state.itemsPrice * 0.05);
  // Total
  state.totalPrice = state.itemsPrice + state.shippingPrice + state.taxPrice - (state.discountAmount || 0);

  localStorage.setItem('cart', JSON.stringify(state));
  return state;
};

const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : {
      cartItems: [],
      shippingAddress: {},
      paymentMethod: 'Cash on Delivery',
      itemsPrice: 0,
      shippingPrice: 0,
      taxPrice: 0,
      discountAmount: 0,
      couponCode: '',
      totalPrice: 0,
    };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      return updateCart(state);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      return updateCart(state);
    },
    updateQty: (state, action) => {
      const { id, qty } = action.payload;
      const item = state.cartItems.find((x) => x._id === id);
      if (item) {
        item.qty = qty;
      }
      return updateCart(state);
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    applyCouponDiscount: (state, action) => {
      state.discountAmount = action.payload.discount;
      state.couponCode = action.payload.code;
      return updateCart(state);
    },
    removeCoupon: (state) => {
      state.discountAmount = 0;
      state.couponCode = '';
      return updateCart(state);
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      state.discountAmount = 0;
      state.couponCode = '';
      return updateCart(state);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQty,
  saveShippingAddress,
  savePaymentMethod,
  applyCouponDiscount,
  removeCoupon,
  clearCartItems,
} = cartSlice.actions;

export default cartSlice.reducer;
