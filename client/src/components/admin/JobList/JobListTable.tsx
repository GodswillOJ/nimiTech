import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  useGetAllJobsAdminQuery,
  useDeleteJobMutation,
} from '../../../services/utilis/careerApiService';
import { useToast } from '../../../hooks/useToast';
import styles from './JobListTable.module.scss';
import ModalComp from '../../../components/blog/Modal/Modal';

interface Job {
  _id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  salaryRange?:
    | {
        min: number;
        max: number;
        currency: string;
      }
    | string;
}

const JobListTable: React.FC = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    department: 'all',
    type: 'all',
    location: 'all',
    status: 'all',
  });
  const { showToast } = useToast();

  const [deleteJob] = useDeleteJobMutation();

  const {
    data: jobsData,
    error,
    isLoading,
    refetch,
  } = useGetAllJobsAdminQuery({
    page: currentPage,
    limit: 10,
    includeInactive: true,
    ...(filters.department !== 'all' && { department: filters.department }),
    ...(filters.type !== 'all' && { type: filters.type }),
    ...(filters.location !== 'all' && { location: filters.location }),
    ...(filters?.status !== 'all' && { status: filters.status }),
  });

  const jobs = jobsData?.jobs || [];
  const totalPages = Math.ceil((jobsData?.total || 0) / 10);

  const formatSalary = (salaryRange: Job['salaryRange']) => {
    if (!salaryRange) return 'Not specified';

    if (typeof salaryRange === 'string') {
      return salaryRange;
    }

    return `${salaryRange.currency}${salaryRange.min.toLocaleString()} - ${salaryRange.currency}${salaryRange.max.toLocaleString()}`;
  };

  const getStatusBadge = (isActive?: boolean) => {
    // Convert boolean isActive to status string
    const status = isActive === true ? 'active' : isActive === false ? 'closed' : 'draft';

    const statusClasses = {
      active: styles.statusActive,
      closed: styles.statusClosed,
      draft: styles.statusDraft,
    };

    return (
      <span className={`${styles.statusBadge} ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleClearFilters = () => {
    setFilters({
      department: 'all',
      type: 'all',
      location: 'all',
      status: 'all',
    });
    setCurrentPage(1);
  };

  const hasActiveFilters = Object.values(filters).some((filter) => filter !== 'all');

  const handleDeleteJob = async () => {
    if (!jobToDelete) return;
    try {
      await deleteJob(jobToDelete).unwrap();
      showToast('success', 'Job deleted successfully');
      refetch();
    } catch (error) {
      showToast('error', 'Failed to delete job');
    } finally {
      setShowDeleteModal(false);
      setJobToDelete(null);
    }
  };

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error Loading Jobs</h2>
        <p>There was an error loading the jobs. Please try again.</p>
        <button onClick={() => refetch()} className={styles.retryButton}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={styles.jobListContainer}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Job Management</h1>
          <p>Manage job postings and track applications</p>
        </div>
        <Link to="/dashboard/jobs/create" className={styles.createButton}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          Create New Job
        </Link>
      </div>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label htmlFor="department">Department:</label>
          <select
            id="department"
            value={filters.department}
            onChange={(e) => handleFilterChange('department', e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
            <option value="Operations">Operations</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="type">Type:</label>
          <select
            id="type"
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Types</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="location">Location:</label>
          <select
            id="location"
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Locations</option>
            <option value="Remote">Remote</option>
            <option value="New York">New York</option>
            <option value="San Francisco">San Francisco</option>
            <option value="Los Angeles">Los Angeles</option>
            <option value="Chicago">Chicago</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            value={filters?.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className={styles.clearFiltersButton}
            title="Clear all filters"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Clear Filters
          </button>
        )}
      </div>

      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
          <p>Loading jobs...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className={styles.emptyState}>
          <h3>No jobs found</h3>
          <p>No jobs match your current filters or you haven&apos;t created any jobs yet.</p>
          <Link to="/dashboard/jobs/create" className={styles.createButton}>
            Create Your First Job
          </Link>
        </div>
      ) : (
        <>
          <div className={styles.tableContainer}>
            <table className={styles.jobTable}>
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Department</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Salary Range</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job: Job) => (
                  <tr key={job._id}>
                    <td className={styles.jobTitle}>
                      <Link to={`/careers/${job._id}`} className={styles.jobTitleLink}>
                        {job.title}
                      </Link>
                    </td>
                    <td>{job.department}</td>
                    <td>{job.type}</td>
                    <td>{job.location}</td>
                    <td>{formatSalary(job.salaryRange)}</td>
                    <td>{getStatusBadge(job?.isActive)}</td>
                    <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                    <td className={styles.actions}>
                      <div className={styles.actionButtons}>
                        <Link
                          to={`/dashboard/jobs/edit/${job._id}`}
                          className="btn btn--icon btn--secondary"
                          title="Edit Job"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </Link>
                        <Link
                          to={`/careers/${job._id}`}
                          className="btn btn--icon btn--primary"
                          title="View Job"
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
                        <Link
                          to={`/dashboard/applications?jobId=${job._id}`}
                          className="btn btn--icon btn--info"
                          title="View Applications"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                            <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                          </svg>
                        </Link>
                        <button
                          className="btn btn--icon btn--outline-danger"
                          title="Delete Job"
                          onClick={() => {
                            setJobToDelete(job._id);
                            setShowDeleteModal(true);
                          }}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m5 0V4a2 2 0 0 1 2 2h2a2 2 0 0 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                          </svg>
                        </button>
                      </div>
                      {showDeleteModal && (
                        <ModalComp
                          isOpen={showDeleteModal}
                          onClose={() => setShowDeleteModal(false)}
                          type="confirmation"
                          title="Delete Job Posting"
                          content="Are you sure you want to delete this job posting? This action cannot be undone."
                          primaryButtonText="Delete"
                          secondaryButtonText="Cancel"
                          onPrimaryAction={handleDeleteJob}
                          onSecondaryAction={() => setShowDeleteModal(false)}
                          showSecondaryButton={true}
                        />
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

export default JobListTable;
