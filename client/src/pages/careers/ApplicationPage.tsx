import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGetJobByIdQuery } from '../../services/utilis/careerApiService';
import ApplicationForm from '../../components/careers/ApplicationForm/ApplicationForm';
import styles from './ApplicationPage.module.scss';

const ApplicationPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: job,
    error,
    isLoading,
  } = useGetJobByIdQuery(id!, {
    skip: !id,
  });

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Loading application form...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className={styles.notFoundContainer}>
        <h2>Job Not Found</h2>
        <p>
          The job posting you&apos;re trying to apply for doesn&apos;t exist or is no longer
          available.
        </p>
        <Link to="/careers" className={styles.backButton}>
          ← Back to Careers
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.applicationPage}>
      {/* Header */}
      <section className={styles.headerSection}>
        <div className={styles.container}>
          <nav className={styles.breadcrumb}>
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/careers">Careers</Link>
            <span>/</span>
            <Link to={`/careers/${job._id}`}>{job.title}</Link>
            <span>/</span>
            <span>Apply</span>
          </nav>
        </div>
      </section>

      <div className={styles.container}>
        <div className={styles.content}>
          {/* Job Summary */}
          <div className={styles.jobSummary}>
            <div className={styles.jobHeader}>
              <h1>Apply for {job.title}</h1>
              <div className={styles.jobMeta}>
                <span className={styles.company}>Nimitech</span>
                <span className={styles.location}>{job.location}</span>
                <span className={styles.type}>{job.employmentType}</span>
              </div>
            </div>

            <div className={styles.jobDescription}>
              <p>{job.description}</p>
            </div>

            <Link to={`/careers/${job._id}`} className={styles.viewJobButton}>
              ← View Full Job Description
            </Link>
          </div>

          {/* Application Form */}
          <div className={styles.formContainer}>
            <ApplicationForm job={job} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationPage;
