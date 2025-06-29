import { createApi } from '@reduxjs/toolkit/query/react';
import { secureBaseQuery } from './utilis/baseQuery';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: secureBaseQuery,
  tagTypes: ['HomePage'],
  endpoints: (builder) => ({
    getBusinessPosts: builder.query({
      query: () => '/business',
      providesTags: ['HomePage'],
    }),

    // 👇 Contact form mutation
    sendContactForm: builder.mutation({
      query: (formData) => ({
        url: '/contact-us',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetBusinessPostsQuery,
  useSendContactFormMutation, // <-- export it
} = api;
