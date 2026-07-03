import { apiSlice } from './apiSlice';
import { COUPONS_URL } from '../constants';

export const couponsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    applyCoupon: builder.mutation({
      query: (data) => ({
        url: `${COUPONS_URL}/apply`,
        method: 'POST',
        body: data,
      }),
    }),
    validateCoupon: builder.mutation({
      query: (data) => ({
        url: `${COUPONS_URL}/validate`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useApplyCouponMutation,
  useValidateCouponMutation,
} = couponsApiSlice;
