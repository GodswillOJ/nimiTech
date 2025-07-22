import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  useGetAllApplicationsQuery,
  useUpdateApplicationStatusMutation,
} from '../../../services/utilis/careerApiService';
import { useToast } from '../../../hooks/useToast';
import styles from './ApplicationsManager.module.scss';

interface Application {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  experience: string;
  message?: string;
  resumeUrl: string;
  coverLetterUrl?: string;
  status: 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired';
  createdAt: string;
  updatedAt: string;
  job: {
    _id: string;
    title: string;
    department: string;
  };
}

const ApplicationsManager: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || 'all',
    jobId: searchParams.get('jobId') || 'all',
  });
  const { showToast } = useToast();

  const {
    data: applicationsData,
    error,
    isLoading,
    refetch,
  } = useGetAllApplicationsQuery({
    page: currentPage,
    limit: 10,
    ...(filters.status !== 'all' && { status: filters.status }),
    ...(filters.jobId !== 'all' && { jobId: filters.jobId }),
  });

  const [updateApplicationStatus] = useUpdateApplicationStatusMutation();

  const applications = applicationsData?.applications || [];
  const totalPages = Math.ceil((applicationsData?.total || 0) / 10);

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      pending: styles.statusPending,
      reviewing: styles.statusReviewing,
      shortlisted: styles.statusShortlisted,
      rejected: styles.statusRejected,
      hired: styles.statusHired,
    };

    const statusLabels = {
      pending: 'Pending',
      reviewing: 'Reviewing',
      shortlisted: 'Shortlisted',
      rejected: 'Rejected',
      hired: 'Hired',
    };

    return (
      <span
        className={`${styles.statusBadge} ${statusClasses[status as keyof typeof statusClasses]}`}
      >
        {statusLabels[status as keyof typeof statusLabels]}
      </span>
    );
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setCurrentPage(1); // Reset to first page when filtering

    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    if (value === 'all') {
      newParams.delete(filterType);
    } else {
      newParams.set(filterType, value);
    }
    setSearchParams(newParams);
  };

  const formatExperience = (experience: string) => {
    const expMap: { [key: string]: string } = {
      entry: '0-1 years',
      junior: '1-3 years',
      mid: '3-5 years',
      senior: '5-8 years',
      lead: '8+ years',
    };
    return expMap[experience] || experience;
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: Application['status']) => {
    try {
      await updateApplicationStatus({
        id: applicationId,
        status: newStatus,
      }).unwrap();

      showToast('success', 'Application status updated successfully!');
      refetch();
    } catch (error) {
      console.error('Error updating application status:', error);
      showToast('error', 'Failed to update application status. Please try again.');
    }
  };

  const handleDownloadResume = async (resumeUrl: string, applicantName: string) => {
    try {
      const response = await fetch(resumeUrl, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download resume');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${applicantName.replace(/\s+/g, '_')}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showToast('success', 'Resume downloaded successfully!');
    } catch (error) {
      console.error('Error downloading resume:', error);
      showToast('error', 'Failed to download resume. Please try again.');
    }
  };

  const handleDownloadCoverLetter = async (coverLetterUrl: string, applicantName: string) => {
    try {
      const response = await fetch(coverLetterUrl, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download cover letter');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${applicantName.replace(/\s+/g, '_')}_Cover_Letter.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showToast('success', 'Cover letter downloaded successfully!');
    } catch (error) {
      console.error('Error downloading cover letter:', error);
      showToast('error', 'Failed to download cover letter. Please try again.');
    }
  };

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error Loading Applications</h2>
        <p>There was an error loading the applications. Please try again.</p>
        <button onClick={() => refetch()} className={styles.retryButton}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={styles.applicationsContainer}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Applications Management</h1>
          <p>Review and manage job applications</p>
        </div>
        <div className={styles.headerStats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{applicationsData?.total || 0}</span>
            <span className={styles.statLabel}>Total Applications</span>
          </div>
        </div>
      </div>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewing">Reviewing</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="rejected">Rejected</option>
            <option value="hired">Hired</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="jobId">Job:</label>
          <select
            id="jobId"
            value={filters.jobId}
            onChange={(e) => handleFilterChange('jobId', e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Jobs</option>
            {/* This would be populated with actual jobs from an API call */}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
          <p>Loading applications...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className={styles.emptyState}>
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
          </svg>
          <h3>No applications found</h3>
          <p>
            No applications match your current filters or no applications have been submitted yet.
          </p>
        </div>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.applicationsTable}>
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Job Position</th>
                  <th>Experience</th>
                  <th>Status</th>
                  <th>Applied Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application: Application) => (
                  <tr key={application._id}>
                    <td className={styles.applicantInfo}>
                      <div className={styles.applicantName}>
                        {application.firstName} {application.lastName}
                      </div>
                      <div className={styles.applicantEmail}>{application.email}</div>
                      <div className={styles.applicantPhone}>{application.phone}</div>
                    </td>
                    <td className={styles.jobInfo}>
                      <div className={styles.jobTitle}>
                        <Link to={`/careers/${application.job._id}`} className={styles.jobLink}>
                          {application.job.title}
                        </Link>
                      </div>
                      <div className={styles.jobDepartment}>{application.job.department}</div>
                    </td>
                    <td>{formatExperience(application.experience)}</td>
                    <td>{getStatusBadge(application.status)}</td>
                    <td>{new Date(application.createdAt).toLocaleDateString()}</td>
                    <td className={styles.actions}>
                      <Link
                        to={`/dashboard/applications/${application._id}`}
                        className={styles.actionButton}
                        title="View Details"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </Link>

                      {application.resumeUrl && (
                        <button
                          onClick={() =>
                            handleDownloadResume(
                              application.resumeUrl,
                              `${application.firstName} ${application.lastName}`
                            )
                          }
                          className={styles.actionButton}
                          title="Download Resume"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7,10 12,15 17,10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                        </button>
                      )}

                      {application.coverLetterUrl && (
                        <button
                          onClick={() =>
                            handleDownloadCoverLetter(
                              application.coverLetterUrl!,
                              `${application.firstName} ${application.lastName}`
                            )
                          }
                          className={styles.actionButton}
                          title="Download Cover Letter"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14,2 14,8 20,8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                          </svg>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={styles.paginationButton}
              >
                Previous
              </button>

              <span className={styles.paginationInfo}>
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={styles.paginationButton}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ApplicationsManager;
