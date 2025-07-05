import { createApi } from '@reduxjs/toolkit/query/react';
import { secureBaseQuery } from './baseQuery';
import { encrypt } from './authUtils';

export const newsletterApi = createApi({
  reducerPath: 'newsletterApi',
  baseQuery: secureBaseQuery,
  tagTypes: ['Newsletter'],
  endpoints: (builder) => ({
    subscribeToNewsletter: builder.mutation({
      query: (subscriptionData) => ({
        url: '/newsletter/subscribe',
        method: 'POST',
        body: {
          encryptedData: encrypt(subscriptionData),
        },
      }),
      invalidatesTags: ['Newsletter'],
    }),

    getAllNewsletterSubscriptions: builder.query({
      query: ({
        page = 1,
        limit = 10,
        search,
        isActive,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      }: {
        page?: number;
        limit?: number;
        search?: string;
        isActive?: boolean;
        sortBy?: string;
        sortOrder?: string;
      } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          sortBy,
          sortOrder,
          ...(search && { search }),
          ...(isActive !== undefined && { isActive: isActive.toString() }),
        });

        return `/newsletter/subscriptions?${params.toString()}`;
      },
      providesTags: ['Newsletter'],
    }),

    getNewsletterStats: builder.query({
      query: () => '/newsletter/stats',
      providesTags: ['Newsletter'],
    }),

    deleteNewsletterSubscription: builder.mutation({
      query: (id) => ({
        url: `/newsletter/subscriptions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Newsletter'],
    }),

    exportNewsletterSubscriptions: builder.query({
      query: (params?: { format?: 'csv' | 'json'; isActive?: boolean }) => {
        const searchParams = new URLSearchParams();
        if (params?.format) searchParams.append('format', params.format);
        if (params?.isActive !== undefined)
          searchParams.append('isActive', params.isActive.toString());

        return `/newsletter/export?${searchParams.toString()}`;
      },
      providesTags: ['Newsletter'],
    }),
  }),
});

export const {
  useSubscribeToNewsletterMutation,
  useGetAllNewsletterSubscriptionsQuery,
  useGetNewsletterStatsQuery,
  useDeleteNewsletterSubscriptionMutation,
  useExportNewsletterSubscriptionsQuery,
} = newsletterApi;
