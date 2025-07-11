import { configureStore } from '@reduxjs/toolkit';
import { api } from '../services/api';
import { blogApi } from '../services/utilis/blogApiService';
import { adminApi } from '../services/utilis/adminApiService';
import { newsletterApi } from '../services/utilis/newsletterApiService';
import { careerApi } from '../services/utilis/careerApiService';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer, // for getBusinessPosts
    [blogApi.reducerPath]: blogApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [newsletterApi.reducerPath]: newsletterApi.reducer,
    [careerApi.reducerPath]: careerApi.reducer,
    // other reducers here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(api.middleware)
      .concat(blogApi.middleware)
      .concat(adminApi.middleware)
      .concat(newsletterApi.middleware)
      .concat(careerApi.middleware),
});
