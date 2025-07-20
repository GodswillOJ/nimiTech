import { createApi } from '@reduxjs/toolkit/query/react';
import { secureBaseQuery } from './baseQuery';

export const careerApi = createApi({
  reducerPath: 'careerApi',
  baseQuery: secureBaseQuery,
  tagTypes: ['Jobs', 'Applications'],
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

    // Get all jobs for admin (includes all statuses: active, draft, closed, etc.)
    getAllJobsAdmin: builder.query<
      any,
      {
        page?: number;
        limit?: number;
        department?: string;
        type?: string;
        location?: string;
        search?: string;
        status?: string;
        includeInactive?: boolean;
      }
    >({
      query: ({
        page = 1,
        limit = 10,
        department,
        type,
        location,
        search,
        status,
        includeInactive = true,
      } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          includeInactive: includeInactive.toString(),
          ...(department && department !== 'all' && { department }),
          ...(type && type !== 'all' && { type }),
          ...(location && location !== 'all' && { location }),
          ...(search && { search }),
          ...(status && status !== 'all' && { status }),
        });
        return `/careers/admin/jobs?${params.toString()}`;
      },
      providesTags: (result) =>
        result?.jobs
          ? [
              ...result.jobs.map(({ _id }: any) => ({
                type: 'Jobs' as const,
                id: _id,
              })),
              { type: 'Jobs', id: 'ADMIN_LIST' },
            ]
          : [{ type: 'Jobs', id: 'ADMIN_LIST' }],
    }),

    // Get single job by ID
    getJobById: builder.query<any, string>({
      query: (id) => `/careers/jobs/${id}`,
      providesTags: (result, error, id) => [{ type: 'Jobs', id }],
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
          resumeUrl: string;
          coverLetterUrl?: string;
          city?: string;
          stateCountry?: string;
          portfolio?: string;
          workExperience?: string;
          startDate?: string;
          salaryExpectations?: string;
          authorizedUS?: string;
          sponsorship?: string;
          contractOpen?: string;
        };
      }
    >({
      query: ({ jobId, applicationData }) => {
        // Validate required fields
        if (!applicationData.resumeUrl) {
          throw new Error('Resume is required.');
        }
        if (!applicationData.authorizedUS || !applicationData.authorizedUS.trim()) {
          throw new Error('Authorization to work in US is required.');
        }
        if (!applicationData.city || !applicationData.city.trim()) {
          throw new Error('City is required.');
        }
        if (!applicationData.stateCountry || !applicationData.stateCountry.trim()) {
          throw new Error('State/Country is required.');
        }

        return {
          url: `/careers/jobs/${jobId}/apply`,
          method: 'POST',
          body: applicationData,
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
    }),

    // Get application statistics by job (admin only)
    getApplicationStatsByJob: builder.query<any, string>({
      query: (jobId) => `/careers/jobs/${jobId}/stats`,
      providesTags: (result, error, jobId) => [
        { type: 'Jobs', id: jobId },
        { type: 'Applications', id: `job-${jobId}` },
      ],
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
      query: (jobId) => ({
        url: `/careers/jobs/${jobId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Jobs', id: 'LIST' }],
    }),

    // Upload resume file
    uploadResume: builder.mutation<any, { resume: File }>({
      query: ({ resume }) => {
        const formData = new FormData();
        formData.append('resume', resume);
        return {
          url: '/careers/upload-resume',
          method: 'POST',
          body: formData,
        };
      },
    }),

    // Upload cover letter file
    uploadCoverLetter: builder.mutation<any, { coverLetter: File }>({
      query: ({ coverLetter }) => {
        const formData = new FormData();
        formData.append('coverLetter', coverLetter);
        return {
          url: '/careers/upload-cover-letter',
          method: 'POST',
          body: formData,
        };
      },
    }),

    // Delete resume file
    deleteResume: builder.mutation<any, { filename: string }>({
      query: ({ filename }) => ({
        url: `/careers/delete-resume/${filename}`,
        method: 'DELETE',
      }),
    }),

    // Delete cover letter file
    deleteCoverLetter: builder.mutation<any, { filename: string }>({
      query: ({ filename }) => ({
        url: `/careers/delete-cover-letter/${filename}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetAllJobsQuery,
  useGetAllJobsAdminQuery,
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
  useUploadResumeMutation,
  useUploadCoverLetterMutation,
  useDeleteResumeMutation,
  useDeleteCoverLetterMutation,
} = careerApi;
