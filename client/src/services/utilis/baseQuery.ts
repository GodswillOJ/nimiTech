import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { clearAuthStatus } from './authUtils';
import { blogPosts, featuredPost } from '../../pages/blog/_partials/BlogPost.data';
import { getApiBaseUrl } from '../../utils/envUtils';

export const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:10000/api' : getApiBaseUrl(),
  credentials: 'include',
  prepareHeaders: (headers, { endpoint }) => {
    headers.set('X-Requested-With', 'XMLHttpRequest');
    // Don't set Content-Type for FormData requests (let browser set it with boundary)
    if (endpoint !== 'addEditBlogPost' && endpoint !== 'uploadBlogImage') {
      headers.set('Content-Type', 'application/json');
    }
    return headers;
  },
});

export const secureBaseQuery = async (args: any, api: any, extraOptions: any) => {
  const result = await baseQueryWithAuth(args, api, extraOptions);

  if (result.error?.status === 401) {
    clearAuthStatus();
    window.dispatchEvent(
      new CustomEvent('auth:sessionExpired', { detail: { redirectTo: '/auth' } })
    );
  }

  if (result.error?.status === 429) {
    console.warn('Rate limit exceeded');
  }

  if (result.error && typeof args === 'string' && args.includes('/blogs')) {
    return handleBlogMockData(args);
  }

  return result;
};

const isMatchingId = (post: any, id: string) => {
  return post.id === id;
};
const findBlogById = (id: string) => {
  return blogPosts.find((post) => post.id === id);
};

const handleBlogMockData = (args: any) => {
  // Parse the URL to get pathname and search params
  const url = new URL(args, 'https://nimitechit.com'); // Base URL needed for URL constructor
  const pathname = url.pathname;
  const searchParams = url.searchParams;

  // Handle different blog endpoints with mock data
  if (pathname === '/blogs/featured') {
    return { data: featuredPost };
  }

  if (pathname === '/blogs' && searchParams.toString()) {
    // Parse pagination parameters
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let filteredPosts = [...blogPosts];

    // Apply category filter
    if (category && category !== 'all') {
      filteredPosts = filteredPosts.filter(
        (post) => post.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Apply search filter
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredPosts = filteredPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm) ||
          post.description.toLowerCase().includes(searchTerm)
      );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    return {
      data: {
        posts: paginatedPosts,
        currentPage: page,
        totalPages: Math.ceil(filteredPosts.length / limit),
        totalPosts: filteredPosts.length,
        hasNextPage: endIndex < filteredPosts.length,
        hasPrevPage: page > 1,
      },
    };
  }

  if (pathname.startsWith('/blogs/') && pathname.endsWith('/related')) {
    // Extract blog ID from pathname like /blogs/{id}/related
    const pathParts = pathname.split('/');
    const id = pathParts[2]; // /blogs/{id}/related -> pathParts[2] is the id

    if (id) {
      const relatedPosts = blogPosts.filter((post) => !isMatchingId(post, id)).slice(0, 3);
      return { data: relatedPosts };
    }
  }

  if (pathname.startsWith('/blogs/') && !pathname.includes('/related')) {
    // Extract blog ID from pathname like /blogs/{id}
    const pathParts = pathname.split('/');
    const id = pathParts[2]; // /blogs/{id} -> pathParts[2] is the id

    if (id && id !== 'categories' && id !== 'stats') {
      const blog = findBlogById(id);
      return { data: blog || featuredPost }; // Fallback to featuredPost if nothing found
    }
  }

  if (pathname === '/blogs/categories') {
    const categories = Array.from(new Set(blogPosts.map((post) => post.category)));
    return { data: categories };
  }

  if (pathname === '/blogs/stats') {
    return {
      data: {
        totalPosts: blogPosts.length,
        totalCategories: Array.from(new Set(blogPosts.map((post) => post.category))).length,
        publishedPosts: blogPosts.filter((post) => post.status === 'published').length,
        draftPosts: blogPosts.filter((post) => post.status === 'draft').length,
      },
    };
  }

  return { data: blogPosts };
};
