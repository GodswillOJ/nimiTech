import { createApi } from '@reduxjs/toolkit/query/react';
import { secureBaseQuery } from './baseQuery';
import { encrypt } from './authUtils';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: secureBaseQuery,
  tagTypes: ['Admin'],
  endpoints: (builder) => ({
    registerAdmin: builder.mutation({
      query: (adminData) => ({
        url: '/admin/register',
        method: 'POST',
        body: {
          encryptedData: encrypt(adminData),
        },
      }),
      invalidatesTags: ['Admin'],
    }),

    loginAdmin: builder.mutation({
      query: (credentials) => ({
        url: '/admin/login',
        method: 'POST',
        body: {
          encryptedData: encrypt(credentials),
        },
      }),
      invalidatesTags: ['Admin'],
    }),

    getAdminProfile: builder.query({
      query: () => '/admin/profile',
      providesTags: ['Admin'],
    }),

    updateAdminProfile: builder.mutation({
      query: (profileData) => ({
        url: '/admin/profile',
        method: 'PUT',
        body: {
          encryptedData: encrypt(profileData),
        },
      }),
      invalidatesTags: ['Admin'],
    }),

    changeAdminPassword: builder.mutation({
      query: (passwordData) => ({
        url: '/admin/change-password',
        method: 'PUT',
        body: {
          encryptedData: encrypt(passwordData),
        },
      }),
    }),

    refreshAdminToken: builder.mutation({
      query: () => ({
        url: '/admin/refresh-token',
        method: 'POST',
      }),
    }),

    logoutAdmin: builder.mutation({
      query: () => ({
        url: '/admin/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Admin'],
    }),
  }),
});

export const {
  useRegisterAdminMutation,
  useLoginAdminMutation,
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation,
  useChangeAdminPasswordMutation,
  useRefreshAdminTokenMutation,
  useLogoutAdminMutation,
} = adminApi;
