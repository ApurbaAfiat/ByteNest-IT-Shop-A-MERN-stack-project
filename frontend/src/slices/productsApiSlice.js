import { apiSlice } from './apiSlice';
import { PRODUCTS_URL } from '../constants';

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => ({
        url: PRODUCTS_URL,
        params,
      }),
      providesTags: ['Product'],
      keepUnusedDataFor: 60,
    }),
    getProductDetails: builder.query({
      query: (id) => `${PRODUCTS_URL}/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    getProductBySlug: builder.query({
      query: (slug) => `${PRODUCTS_URL}/slug/${slug}`,
      providesTags: (result) => result ? [{ type: 'Product', id: result._id }] : [],
    }),
    getFeaturedProducts: builder.query({
      query: (limit) => `${PRODUCTS_URL}/featured?limit=${limit || 8}`,
      providesTags: ['Product'],
    }),
    getNewArrivals: builder.query({
      query: (limit) => `${PRODUCTS_URL}/new-arrivals?limit=${limit || 8}`,
      providesTags: ['Product'],
    }),
    getTopProducts: builder.query({
      query: (limit) => `${PRODUCTS_URL}/top?limit=${limit || 8}`,
      providesTags: ['Product'],
    }),
    getBestSelling: builder.query({
      query: (limit) => `${PRODUCTS_URL}/best-selling?limit=${limit || 8}`,
      providesTags: ['Product'],
    }),
    getRelatedProducts: builder.query({
      query: (id) => `${PRODUCTS_URL}/${id}/related`,
      providesTags: ['Product'],
    }),
    getBrands: builder.query({
      query: () => `${PRODUCTS_URL}/brands`,
    }),
    createProduct: builder.mutation({
      query: (data) => ({
        url: PRODUCTS_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${PRODUCTS_URL}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }, 'Product'],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `${PRODUCTS_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
    createReview: builder.mutation({
      query: ({ productId, ...data }) => ({
        url: `${PRODUCTS_URL}/${productId}/reviews`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: 'Product', id: productId }],
    }),
    updateReview: builder.mutation({
      query: ({ productId, reviewId, ...data }) => ({
        url: `${PRODUCTS_URL}/${productId}/reviews/${reviewId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: 'Product', id: productId }],
    }),
    deleteReview: builder.mutation({
      query: ({ productId, reviewId }) => ({
        url: `${PRODUCTS_URL}/${productId}/reviews/${reviewId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: 'Product', id: productId }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useGetProductBySlugQuery,
  useGetFeaturedProductsQuery,
  useGetNewArrivalsQuery,
  useGetTopProductsQuery,
  useGetBestSellingQuery,
  useGetRelatedProductsQuery,
  useGetBrandsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = productsApiSlice;
