import { createApi } from '@reduxjs/toolkit/query/react';
import { secureBaseQuery } from './baseQuery';

export const careerApi = createApi({
  reducerPath: 'careerApi',
  baseQuery: secureBaseQuery,
  tagTypes: ['Jobs', 'Applications'],
  // Global cache settings
  keepUnusedDataFor: 300, // Keep unused data for 5 minutes by default
  refetchOnMountOrArgChange: 300, // Refetch if data is older than 5 minutes
  endpoints: (builder) => ({
    // Get all active jobs with pagination and filters
    getAllJobs: builder.query<
      any,
      {
        page?: number;
        limit?: number;
        department?: string;
        type?: string;
        location?: string;
        search?: string;
      }
    >({
      query: ({ page = 1, limit = 10, department, type, location, search } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(department && department !== 'all' && { department }),
          ...(type && type !== 'all' && { type }),
          ...(location && location !== 'all' && { location }),
          ...(search && { search }),
        });
        return `/careers/jobs?${params.toString()}`;
      },
      keepUnusedDataFor: 300, // Job list - keep for 5 minutes (matches server cache)
      providesTags: (result) =>
        result?.jobs
          ? [
              ...result.jobs.map(({ _id }: any) => ({
                type: 'Jobs' as const,
                id: _id,
              })),
              { type: 'Jobs', id: 'LIST' },
            ]
          : [{ type: 'Jobs', id: 'LIST' }],
    }),

    // Get single job by ID
    getJobById: builder.query<any, string>({
      query: (id) => `/careers/jobs/${id}`,
      providesTags: (result, error, id) => [{ type: 'Jobs', id }],
      keepUnusedDataFor: 1800, // Individual jobs - keep for 30 minutes (matches server cache)
    }),

    // Submit job application
    submitApplication: builder.mutation<
      any,
      {
        jobId: string;
        applicationData: {
          firstName: string;
          lastName: string;
          email: string;
          phone: string;
          message?: string;
          experience: string;
          resume: File;
          coverLetter?: File;
        };
      }
    >({
      query: ({ jobId, applicationData }) => {
        const formData = new FormData();

        // Add text fields
        formData.append('firstName', applicationData.firstName);
        formData.append('lastName', applicationData.lastName);
        formData.append('email', applicationData.email);
        formData.append('phone', applicationData.phone);
        formData.append('experience', applicationData.experience);

        if (applicationData.message) {
          formData.append('message', applicationData.message);
        }

        // Add file fields
        formData.append('resume', applicationData.resume);

        if (applicationData.coverLetter) {
          formData.append('coverLetter', applicationData.coverLetter);
        }

        return {
          url: `/careers/jobs/${jobId}/apply`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: (result, error, { jobId }) => [
        { type: 'Jobs', id: jobId },
        { type: 'Applications', id: 'LIST' },
      ],
    }),

    // Get all applications for admin (with pagination and filters)
    getAllApplications: builder.query<
      any,
      {
        page?: number;
        limit?: number;
        status?: string;
        jobId?: string;
      }
    >({
      query: ({ page = 1, limit = 10, status, jobId } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(status && status !== 'all' && { status }),
          ...(jobId && { jobId }),
        });
        return `/careers/applications?${params.toString()}`;
      },
      keepUnusedDataFor: 300, // Application list - keep for 5 minutes
      providesTags: (result) =>
        result?.applications
          ? [
              ...result.applications.map(({ _id }: any) => ({
                type: 'Applications' as const,
                id: _id,
              })),
              { type: 'Applications', id: 'LIST' },
            ]
          : [{ type: 'Applications', id: 'LIST' }],
    }),

    // Get single application by ID
    getApplicationById: builder.query<any, string>({
      query: (id) => `/careers/applications/${id}`,
      providesTags: (result, error, id) => [{ type: 'Applications', id }],
      keepUnusedDataFor: 300, // Individual applications - keep for 5 minutes
    }),

    // Update application status (admin only)
    updateApplicationStatus: builder.mutation<
      any,
      {
        id: string;
        status: 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired';
        notes?: string;
      }
    >({
      query: ({ id, status, notes }) => ({
        url: `/careers/applications/${id}/status`,
        method: 'PUT',
        body: { status, notes },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Applications', id },
        { type: 'Applications', id: 'LIST' },
      ],
    }),

    // Get job statistics (admin only)
    getJobStats: builder.query<any, void>({
      query: () => '/careers/stats',
      providesTags: ['Jobs'],
      keepUnusedDataFor: 300, // Stats change frequently - keep for 5 minutes
    }),

    // Get application statistics by job (admin only)
    getApplicationStatsByJob: builder.query<any, string>({
      query: (jobId) => `/careers/jobs/${jobId}/stats`,
      providesTags: (result, error, jobId) => [
        { type: 'Jobs', id: jobId },
        { type: 'Applications', id: `job-${jobId}` },
      ],
      keepUnusedDataFor: 300, // Job-specific stats - keep for 5 minutes
    }),

    // Create new job (admin only)
    createJob: builder.mutation<any, any>({
      query: (jobData) => ({
        url: '/careers/jobs',
        method: 'POST',
        body: jobData,
      }),
      invalidatesTags: [{ type: 'Jobs', id: 'LIST' }],
    }),

    // Update job (admin only)
    updateJob: builder.mutation<any, { id: string; jobData: any }>({
      query: ({ id, jobData }) => ({
        url: `/careers/jobs/${id}`,
        method: 'PUT',
        body: jobData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Jobs', id },
        { type: 'Jobs', id: 'LIST' },
      ],
    }),

    // Delete job (admin only)
    deleteJob: builder.mutation<any, string>({
      query: (id) => ({
        url: `/careers/jobs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Jobs', id },
        { type: 'Jobs', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetAllJobsQuery,
  useGetJobByIdQuery,
  useSubmitApplicationMutation,
  useGetAllApplicationsQuery,
  useGetApplicationByIdQuery,
  useUpdateApplicationStatusMutation,
  useGetJobStatsQuery,
  useGetApplicationStatsByJobQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
} = careerApi;
