// Job related type definitions
export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
}

export interface Job {
  _id: string;
  title: string;
  department: string;
  location: string;
  employmentType: 'Full-Time' | 'Part-Time' | 'Contract' | 'Internship';
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  salaryRange: string | SalaryRange | null;
  applicationDeadline: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobFilters {
  department: string;
  type: string;
  location: string;
  search: string;
}

export interface JobsResponse {
  jobs: Job[];
  currentPage: number;
  totalPages: number;
  totalJobs: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
