import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:10000/api' }), // change to your backend base url
  tagTypes: ['Business', 'Blogs', 'HomePage', 'BlogPostEditor'],
  endpoints: (builder) => ({
    // landing page
    getBusinessPosts: builder.query({
      query: () => '/', // your API endpoint for business posts
      providesTags: ['HomePage'],
    }),

    // blogs
    getBlogs: builder.query({
      query: () => '/blogs',
      providesTags: ['Blogs'],
    }),

    // blogs
    getBlogEditor: builder.query({
      query: () => '/blog-editor',
      providesTags: ['BlogPostEditor'],
    }),
  }),
});

export const { useGetBusinessPostsQuery, useGetBlogEditorQuery } = api;
