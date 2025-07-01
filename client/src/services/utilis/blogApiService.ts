import { createApi } from '@reduxjs/toolkit/query/react';
import { secureBaseQuery } from './baseQuery';

export const blogApi = createApi({
  reducerPath: 'blogApi',
  baseQuery: secureBaseQuery,
  tagTypes: ['Blogs', 'FeaturedPost', 'HomePage', 'BlogPostEditor'],
  endpoints: (builder) => ({
    getBusinessPosts: builder.query<any, void>({
      query: () => '/business',
      providesTags: ['HomePage'],
    }),

    getAllBlogPostPaginated: builder.query<
      any,
      { page?: number; limit?: number; category?: string; search?: string }
    >({
      query: ({ page = 1, limit = 10, category, search } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(category && category !== 'all' && { category }),
          ...(search && { search }),
        });
        return `/blogs?${params.toString()}`;
      },
      providesTags: (result) =>
        result?.posts
          ? [
              ...result.posts.map(({ _id, id }: any) => ({
                type: 'Blogs' as const,
                id: _id || id,
              })),
              { type: 'Blogs', id: 'LIST' },
            ]
          : [{ type: 'Blogs', id: 'LIST' }],
    }),

    getFeaturedPost: builder.query<any, void>({
      query: () => '/blogs/featured',
      providesTags: ['FeaturedPost'],
    }),

    getBlogPostById: builder.query<any, string>({
      query: (id) => `/blogs/${id}`,
      providesTags: (result, error, id) => [{ type: 'Blogs', id }],
    }),

    getRelatedPosts: builder.query<any, { id: string; limit?: number }>({
      query: ({ id, limit = 3 }) => `/blogs/${id}/related?limit=${limit}`,
      providesTags: (result, error, { id }) => [{ type: 'Blogs', id: `related-${id}` }],
    }),

    getBlogCategories: builder.query<any, void>({
      query: () => '/blogs/categories',
      providesTags: ['Blogs'],
    }),

    getBlogStats: builder.query<any, void>({
      query: () => '/blogs/stats',
      providesTags: ['Blogs'],
    }),

    addEditBlogPost: builder.mutation<any, any>({
      query: (blogData) => {
        const formData = new FormData();

        // Add all fields except file fields to FormData
        Object.entries(blogData).forEach(([key, value]) => {
          if (
            !['featuredImage', 'contentImage', 'authorAvatar'].includes(key) &&
            value !== undefined &&
            value !== null
          ) {
            if (typeof value === 'object') {
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, String(value));
            }
          }
        });

        // Add file fields if they exist and are File objects
        if (blogData.featuredImage instanceof File) {
          formData.append('featuredImage', blogData.featuredImage);
        }
        if (blogData.contentImage instanceof File) {
          formData.append('contentImage', blogData.contentImage);
        }
        if (blogData.authorAvatar instanceof File) {
          formData.append('authorAvatar', blogData.authorAvatar);
        }

        const blogId = blogData.id || blogData._id;

        // Log for debugging
        console.log('FormData contents:');
        formData.forEach((value, key) => {
          console.log(key, value);
        });

        return {
          url: blogId ? `/blogs/${blogId}` : '/blogs',
          method: blogId ? 'PUT' : 'POST',
          body: formData,
        };
      },
      invalidatesTags: (result, error, { id, _id }) => [
        { type: 'Blogs', id: id || _id },
        { type: 'Blogs', id: 'LIST' },
        'BlogPostEditor',
        'FeaturedPost',
      ],
    }),

    deleteBlogPost: builder.mutation<any, string>({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Blogs', id },
        { type: 'Blogs', id: 'LIST' },
        'BlogPostEditor',
        'FeaturedPost',
      ],
    }),

    uploadBlogImage: builder.mutation<any, { image: File; type: string }>({
      query: ({ image, type }) => {
        const formData = new FormData();
        formData.append('image', image);
        formData.append('type', type);
        return {
          url: '/blogs/upload-image',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['BlogPostEditor'],
    }),

    getBlogEditor: builder.query<any, void>({
      query: () => '/blog-editor',
      providesTags: ['BlogPostEditor'],
    }),
  }),
});

export const {
  useGetBusinessPostsQuery,
  useGetAllBlogPostPaginatedQuery,
  useGetFeaturedPostQuery,
  useGetBlogPostByIdQuery,
  useGetRelatedPostsQuery,
  useGetBlogCategoriesQuery,
  useGetBlogStatsQuery,
  useAddEditBlogPostMutation,
  useDeleteBlogPostMutation,
  useUploadBlogImageMutation,
  useGetBlogEditorQuery,
} = blogApi;
