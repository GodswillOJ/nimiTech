// API utility functions for careers
import { JobFiltersParams, ApplicationFiltersParams } from '../types/api.types';
import { Job } from '../types/job.types';
import { Application, ApplicationFormData } from '../types/application.types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:10000/api';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Job API functions
export const jobsAPI = {
  // Get all jobs with filters and pagination
  getJobs: async (params: JobFiltersParams = {}) => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.department && params.department !== 'all')
      queryParams.append('department', params.department);
    if (params.type && params.type !== 'all') queryParams.append('type', params.type);
    if (params.location && params.location !== 'all')
      queryParams.append('location', params.location);
    if (params.search) queryParams.append('search', params.search);

    const response = await fetch(`${API_BASE_URL}/careers/jobs?${queryParams}`);
    return handleResponse(response);
  },

  // Get single job by ID
  getJobById: async (id: string): Promise<Job> => {
    const response = await fetch(`${API_BASE_URL}/careers/jobs/${id}`);
    return handleResponse(response);
  },
};

// Application API functions
export const applicationsAPI = {
  // Submit job application
  submitApplication: async (jobId: string, formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/careers/jobs/${jobId}/apply`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse(response);
  },

  // Get all applications (admin only)
  getApplications: async (params: ApplicationFiltersParams = {}) => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.status && params.status !== 'all') queryParams.append('status', params.status);
    if (params.jobId) queryParams.append('jobId', params.jobId);

    const response = await fetch(`${API_BASE_URL}/careers/applications`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return handleResponse(response);
  },

  // Get single application by ID (admin only)
  getApplicationById: async (id: string): Promise<Application> => {
    const response = await fetch(`${API_BASE_URL}/careers/applications/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return handleResponse(response);
  },

  // Update application status (admin only)
  updateApplicationStatus: async (id: string, status: string, notes?: string) => {
    const response = await fetch(`${API_BASE_URL}/careers/applications/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ status, notes }),
    });
    return handleResponse(response);
  },
};
