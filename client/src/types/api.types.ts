// API related type definitions
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  error?: string;
  status: number;
}

export interface FileUploadResponse {
  url: string;
  publicId: string;
  originalName: string;
  size: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface JobFiltersParams extends PaginationParams {
  department?: string;
  type?: string;
  location?: string;
  search?: string;
}

export interface ApplicationFiltersParams extends PaginationParams {
  status?: string;
  jobId?: string;
}
