import { apiSlice } from './apiSlice';
import { STATS_URL } from '../constants';

export const statsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => `${STATS_URL}/dashboard`,
      providesTags: ['Stats'],
    }),
    getSalesChart: builder.query({
      query: (months) => `${STATS_URL}/sales-chart?months=${months || 6}`,
      providesTags: ['Stats'],
    }),
    getRecentOrders: builder.query({
      query: (limit) => `${STATS_URL}/recent-orders?limit=${limit || 10}`,
      providesTags: ['Stats'],
    }),
    getCategoryStats: builder.query({
      query: () => `${STATS_URL}/categories`,
      providesTags: ['Stats'],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetSalesChartQuery,
  useGetRecentOrdersQuery,
  useGetCategoryStatsQuery,
} = statsApiSlice;
