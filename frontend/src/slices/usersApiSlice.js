import { apiSlice } from './apiSlice';
import { USERS_URL } from '../constants';

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: 'POST',
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: USERS_URL,
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
      }),
    }),
    getProfile: builder.query({
      query: () => `${USERS_URL}/profile`,
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/change-password`,
        method: 'PUT',
        body: data,
      }),
    }),
    getWishlist: builder.query({
      query: () => `${USERS_URL}/wishlist`,
      providesTags: ['User'],
    }),
    addToWishlist: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/wishlist`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    removeFromWishlist: builder.mutation({
      query: (productId) => ({
        url: `${USERS_URL}/wishlist/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    // Admin
    getUsers: builder.query({
      query: () => `${USERS_URL}/all`,
      providesTags: ['User'],
    }),
    getUserById: builder.query({
      query: (id) => `${USERS_URL}/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${USERS_URL}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    blockUser: builder.mutation({
      query: (id) => ({
        url: `${USERS_URL}/${id}/block`,
        method: 'PUT',
      }),
      invalidatesTags: ['User'],
    }),
    unblockUser: builder.mutation({
      query: (id) => ({
        url: `${USERS_URL}/${id}/unblock`,
        method: 'PUT',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useBlockUserMutation,
  useUnblockUserMutation,
} = usersApiSlice;
