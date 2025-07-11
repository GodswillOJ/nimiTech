import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  useGetApplicationByIdQuery,
  useUpdateApplicationStatusMutation,
} from '../../../services/utilis/careerApiService';
import { useToast } from '../../../hooks/useToast';
import styles from './ApplicationDetail.module.scss';

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
    type: string;
    location: string;
  };
  notes?: string;
}

const ApplicationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [notes, setNotes] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const { data: application, error, isLoading, refetch } = useGetApplicationByIdQuery(id!);

  const [updateApplicationStatus] = useUpdateApplicationStatusMutation();

  const handleStatusUpdate = async (newStatus: Application['status']) => {
    if (!application) return;

    setIsUpdatingStatus(true);
    try {
      await updateApplicationStatus({
        id: application._id,
        status: newStatus,
        notes: notes.trim() || undefined,
      }).unwrap();

      showToast('success', 'Application status updated successfully!');
      refetch();
      setNotes('');
    } catch (error) {
      console.error('Error updating application status:', error);
      showToast('error', 'Failed to update application status. Please try again.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

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

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Loading application details...</p>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error Loading Application</h2>
        <p>There was an error loading the application details. Please try again.</p>
        <button onClick={() => navigate('/dashboard/applications')} className={styles.backButton}>
          Back to Applications
        </button>
      </div>
    );
  }

  return (
    <div className={styles.applicationDetail}>
      <div className={styles.header}>
        <div className={styles.breadcrumb}>
          <Link to="/dashboard/applications">Applications</Link>
          <span>›</span>
          <span>
            {application.firstName} {application.lastName}
          </span>
        </div>
        <h1>Application Details</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.mainContent}>
          {/* Applicant Information */}
          <div className={styles.section}>
            <h2>Applicant Information</h2>
            <div className={styles.applicantCard}>
              <div className={styles.applicantHeader}>
                <div className={styles.applicantName}>
                  {application.firstName} {application.lastName}
                </div>
                {getStatusBadge(application.status)}
              </div>

              <div className={styles.applicantDetails}>
                <div className={styles.detail}>
                  <span className={styles.label}>Email:</span>
                  <a href={`mailto:${application.email}`} className={styles.value}>
                    {application.email}
                  </a>
                </div>
                <div className={styles.detail}>
                  <span className={styles.label}>Phone:</span>
                  <a href={`tel:${application.phone}`} className={styles.value}>
                    {application.phone}
                  </a>
                </div>
                <div className={styles.detail}>
                  <span className={styles.label}>Experience:</span>
                  <span className={styles.value}>{formatExperience(application.experience)}</span>
                </div>
                <div className={styles.detail}>
                  <span className={styles.label}>Applied:</span>
                  <span className={styles.value}>
                    {new Date(application.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Job Information */}
          <div className={styles.section}>
            <h2>Job Information</h2>
            <div className={styles.jobCard}>
              <div className={styles.jobHeader}>
                <Link to={`/careers/${application.job._id}`} className={styles.jobTitle}>
                  {application.job.title}
                </Link>
              </div>
              <div className={styles.jobMeta}>
                <span className={styles.jobDepartment}>{application.job.department}</span>
                <span className={styles.jobType}>{application.job.type}</span>
                <span className={styles.jobLocation}>{application.job.location}</span>
              </div>
            </div>
          </div>

          {/* Application Message */}
          {application.message && (
            <div className={styles.section}>
              <h2>Cover Message</h2>
              <div className={styles.messageCard}>
                <p>{application.message}</p>
              </div>
            </div>
          )}

          {/* Files */}
          <div className={styles.section}>
            <h2>Attachments</h2>
            <div className={styles.filesCard}>
              <div className={styles.fileItem}>
                <div className={styles.fileInfo}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14,2 14,8 20,8" />
                  </svg>
                  <span>Resume</span>
                </div>
                <a
                  href={application.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.downloadButton}
                >
                  Download
                </a>
              </div>

              {application.coverLetterUrl && (
                <div className={styles.fileItem}>
                  <div className={styles.fileInfo}>
                    <svg
                      width="20"
                      height="20"
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
                    <span>Cover Letter</span>
                  </div>
                  <a
                    href={application.coverLetterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.downloadButton}
                  >
                    Download
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Previous Notes */}
          {application.notes && (
            <div className={styles.section}>
              <h2>Previous Notes</h2>
              <div className={styles.notesCard}>
                <p>{application.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Status Update Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.statusUpdateCard}>
            <h3>Update Status</h3>

            <div className={styles.currentStatus}>
              <span className={styles.label}>Current Status:</span>
              {getStatusBadge(application.status)}
            </div>

            <div className={styles.statusActions}>
              <button
                onClick={() => handleStatusUpdate('reviewing')}
                disabled={isUpdatingStatus || application.status === 'reviewing'}
                className={`${styles.statusButton} ${styles.statusReviewing}`}
              >
                Mark as Reviewing
              </button>

              <button
                onClick={() => handleStatusUpdate('shortlisted')}
                disabled={isUpdatingStatus || application.status === 'shortlisted'}
                className={`${styles.statusButton} ${styles.statusShortlisted}`}
              >
                Shortlist
              </button>

              <button
                onClick={() => handleStatusUpdate('hired')}
                disabled={isUpdatingStatus || application.status === 'hired'}
                className={`${styles.statusButton} ${styles.statusHired}`}
              >
                Mark as Hired
              </button>

              <button
                onClick={() => handleStatusUpdate('rejected')}
                disabled={isUpdatingStatus || application.status === 'rejected'}
                className={`${styles.statusButton} ${styles.statusRejected}`}
              >
                Reject
              </button>
            </div>

            <div className={styles.notesSection}>
              <label htmlFor="notes">Add Notes (Optional):</label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this application..."
                rows={4}
              />
            </div>
          </div>

          <div className={styles.quickActions}>
            <h3>Quick Actions</h3>
            <a
              href={`mailto:${application.email}?subject=Re: Application for ${application.job.title}`}
              className={styles.actionButton}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Send Email
            </a>

            <a href={`tel:${application.phone}`} className={styles.actionButton}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              Call Candidate
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;
