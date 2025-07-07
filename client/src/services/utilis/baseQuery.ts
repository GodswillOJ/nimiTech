import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { clearAuthStatus } from './authUtils';
import { getApiBaseUrl } from '../../utils/envUtils';

export const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: getApiBaseUrl(),
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

  // Remove mockData fallback - let errors propagate to components for proper error handling
  return result;
};
