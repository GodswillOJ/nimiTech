import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGetJobByIdQuery, useGetAllJobsQuery } from '../../services/utilis/careerApiService';
import ApplicationForm from '../../components/careers/ApplicationForm/ApplicationForm';
import logo from '../../assets/NimiTechLogo1.png';
import styles from './JobDetail.module.scss';
import { useToast } from '../../hooks/useToast';
import Loader from '../../components/blog/SuspenseLoader/Loader';

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const { showToast } = useToast();

  // Use RTK Query to fetch job data
  const {
    data: job,
    error,
    isLoading,
  } = useGetJobByIdQuery(id!, {
    skip: !id, // Skip query if no ID is provided
  });

  // Fetch other jobs for the "Other Open Positions" section
  const { data: otherJobsData, isLoading: isLoadingOtherJobs } = useGetAllJobsQuery({
    limit: 3, // Only get 3 jobs for the similar jobs section
  });

  useEffect(() => {
    // Check if we should show the application form on desktop
    const checkScreenSize = () => {
      setShowApplicationForm(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleApplyClick = () => {
    if (window.innerWidth < 1024) {
      // On mobile/tablet, navigate to a separate application page
      navigate(`/careers/${id}/apply`);
    } else {
      // On desktop, scroll to application form
      const formElement = document.getElementById('application-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <Loader />
      </div>
    );
  }

  if (error) {
    showToast('error', 'Something went wrong');
  }

  if (!job) {
    return (
      <div className={styles.notFoundContainer}>
        <h2>Job Not Found</h2>
        <p>The job posting you&apos;re looking for doesn&apos;t exist or is no longer available.</p>
        <Link to="/careers" className={styles.backButton}>
          ← Back to Careers
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.jobDetailPage}>
      {/* Header */}

      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          {/* Job Details */}
          <div className={styles.jobContent}>
            <div className={styles.jobHeader}>
              <div className={styles.companyInfo}>
                <div className={styles.companyLogo}>
                  <img src={logo} alt="Nimtech Logo" style={{ width: '100px', height: 'auto' }} />
                </div>
                <div className={styles.companyDetails}>
                  <h1>{job.title}</h1>
                  <div className={styles.jobMeta}>
                    <span className={styles.company}>Nimitech</span>
                    <span className={styles.location}>{job.location}</span>
                    <span className={styles.type}>{job.employmentType}</span>
                  </div>
                </div>
              </div>
              <button onClick={handleApplyClick} className={styles.applyButton}>
                Apply for this job
              </button>
            </div>

            <div className={styles.jobDetails}>
              <div className={styles.jobTags}>
                <span className={styles.tag}>{job.department}</span>
                <span className={styles.tag}>Entry Level</span>
                {job.salaryRange && (
                  <span className={styles.salaryTag}>
                    {typeof job.salaryRange === 'string'
                      ? job.salaryRange
                      : `${job.salaryRange.currency} ${job.salaryRange.min?.toLocaleString()} - ${job.salaryRange.max?.toLocaleString()}`}
                  </span>
                )}
              </div>

              <div className={styles.section}>
                <h2>Job Description</h2>
                <p>{job.description}</p>
              </div>

              <div className={styles.section}>
                <h2>Responsibilities</h2>
                <ul>
                  {job.responsibilities.map((responsibility: string, index: number) => (
                    <li key={index}>{responsibility}</li>
                  ))}
                </ul>
              </div>

              <div className={styles.section}>
                <h2>Requirements</h2>
                <ul>
                  {job.requirements.map((requirement: string, index: number) => (
                    <li key={index}>{requirement}</li>
                  ))}
                </ul>
              </div>

              {job.benefits && job.benefits.length > 0 && (
                <div className={styles.section}>
                  <h2>Benefits</h2>
                  <ul>
                    {job.benefits.map((benefit: string, index: number) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className={styles.section}>
                <h2>Required Skills</h2>
                <div className={styles.skillsGrid}>
                  {job.requirements.slice(0, 6).map((skill: string, index: number) => (
                    <span key={index} className={styles.skillTag}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {job.applicationDeadline && (
                <div className={styles.deadlineSection}>
                  <h3>Application Deadline</h3>
                  <p>{new Date(job.applicationDeadline).toLocaleDateString()}</p>
                </div>
              )}

              <div className={styles.applySection}>
                <h2>Ready to apply?</h2>
                <p>Submit your application and join our team at Nimitech!</p>
                <button onClick={handleApplyClick} className={styles.applyButtonLarge}>
                  Apply Now
                </button>
              </div>
            </div>
          </div>

          {/* Application Form - Desktop Only */}
          {showApplicationForm && (
            <div className={styles.applicationFormContainer} id="application-form">
              <ApplicationForm job={job} />
            </div>
          )}
        </div>

        {/* Similar Jobs Section */}
        <section className={styles.similarJobsSection}>
          <h2>Other Open Positions</h2>
          <div className={styles.similarJobsGrid}>
            {isLoadingOtherJobs ? (
              <div className={styles.loadingContainer}>
                <div className={styles.loader}></div>
                <p>Loading other positions...</p>
              </div>
            ) : otherJobsData?.jobs && otherJobsData.jobs.length > 0 ? (
              otherJobsData.jobs
                .filter((otherJob: any) => otherJob._id !== id) // Exclude current job
                .slice(0, 3) // Limit to 3 jobs
                .map((otherJob: any) => (
                  <div key={otherJob._id} className={styles.similarJobCard}>
                    <h3>{otherJob.title}</h3>
                    <p>
                      {otherJob.department} • {otherJob.location} • {otherJob.type}
                    </p>
                    <Link to={`/careers/${otherJob._id}`} className={styles.viewJobButton}>
                      View Job
                    </Link>
                  </div>
                ))
            ) : (
              <div className={styles.noJobsMessage}>
                <p>No other positions available at the moment.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default JobDetail;
