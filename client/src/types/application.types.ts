// Application related type definitions
export interface Application {
  _id: string;
  jobId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string | null;
  portfolio: string | null;
  startDate: Date | null;
  message: string | null;
  resumeUrl: string;
  coverLetterUrl: string | null;
  experience: '0-2 years' | '3-5 years' | '+5 years';
  applicationStatus:
    | 'submitted'
    | 'under-review'
    | 'shortlisted'
    | 'interview'
    | 'rejected'
    | 'hired';
  referenceNumber: string;
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  workExperience: string | null;
  salaryExpectations: string | null;
  authorizedUS: string;
  sponsorship: string;
  contractOpen: string;
  stateCountry: string | null;
}

export interface ApplicationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  portfolio: string;
  startDate: string;
  message: string;
  resume: File | null;
  coverLetter: File | null;
  experience: '0-2 years' | '3-5 years' | '+5 years';
  contractOpen: string;
  stateCountry: string;
  workExperience: string;
  salaryExpectations: string;
  authorizedUS: string;
  sponsorship: string;
  resumeUrl: string;
  coverLetterUrl: string;
}

export interface ApplicationSubmissionResponse {
  message: string;
  applicationId: string;
}

export interface ApplicationsResponse {
  applications: Application[];
  currentPage: number;
  totalPages: number;
  totalApplications: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
