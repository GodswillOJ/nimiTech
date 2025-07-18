import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useGetAllJobsQuery } from '../../services/utilis/careerApiService';
import { businessImages } from 'assets/images';
import { Job } from '../../types/job.types';
import styles from './Careers.module.scss';
import SEO from '../../components/SEO/SEO';
import Loader from '../../components/blog/SuspenseLoader/Loader';
import useMediaQuery from '@mui/material/useMediaQuery';

const Careers = () => {
  const isSmallScreen = useMediaQuery('(max-width:768px)');
  const [filters, setFilters] = useState({
    department: 'all',
    type: 'all',
    location: 'all',
    search: '',
  });
  // Add pagination state
  const [page, setPage] = useState(1);

  // SEO Configuration
  const seoData = {
    title: 'Careers - Join Our Team of IT Innovation Experts',
    description:
      'Explore exciting career opportunities at Nimitech IT. Join our team of technology experts and be part of driving digital transformation. Discover open positions in IT, development, marketing, and more.',
    keywords:
      'careers, IT jobs, technology careers, software developer jobs, digital marketing careers, cybersecurity jobs, remote work, Nimi Tech careers',
    canonical: 'https://nimitechit.com/careers',
    ogImage: 'https://nimitechit.com/images/careers-og-image.jpg',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      hiringOrganization: {
        '@type': 'Organization',
        name: 'Nimi Tech',
        sameAs: 'https://nimitechit.com',
      },
      jobLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'US',
        },
      },
    },
  };

  // Use RTK Query to fetch jobs with filters and pagination
  const {
    data: jobsResponse,
    error,
    isLoading,
    refetch,
  } = useGetAllJobsQuery({
    page,
    limit: 10, // Show 10 jobs per page
    department: filters.department !== 'all' ? filters.department : undefined,
    type: filters.type !== 'all' ? filters.type : undefined,
    location: filters.location !== 'all' ? filters.location : undefined,
    search: filters.search || undefined,
  });

  const jobs = jobsResponse?.jobs || [];
  const totalJobs = jobsResponse?.totalJobs || 0;
  const totalPages = Math.ceil(totalJobs / 10);

  // Extract unique values for filters from all jobs (without filters applied)
  const { data: allJobsResponse } = useGetAllJobsQuery({ limit: 100 }); // Get all jobs for filter options

  const allJobs = allJobsResponse?.jobs || [];

  // Memoized filter options
  const { departments, jobTypes, locations } = useMemo(() => {
    const uniqueDepartments = Array.from(
      new Set(allJobs.map((job: Job) => job.department))
    ) as string[];
    const uniqueTypes = Array.from(
      new Set(allJobs.map((job: Job) => job.employmentType))
    ) as string[];
    const uniqueLocations = Array.from(
      new Set(allJobs.map((job: Job) => job.location))
    ) as string[];

    return {
      departments: uniqueDepartments.sort(),
      jobTypes: uniqueTypes.sort(),
      locations: uniqueLocations.sort(),
    };
  }, [allJobs]);

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  // Helper functions to get unique filter options
  const getDepartments = () => departments;
  const getJobTypes = () => jobTypes;
  const getLocations = () => locations;

  const clearFilters = () => {
    setFilters({
      department: 'all',
      type: 'all',
      location: 'all',
      search: '',
    });
  };

  // Pagination handler
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <Loader />
      </div>
    );
  }

  return (
    <div className={styles.careersPage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <video
            src="/videos/nimiVid.mp4"
            autoPlay
            muted
            loop
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          <div
            style={{
              position: 'absolute',
              top: '60%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: '#fff',
              textAlign: 'center',
              padding: '0 16px',
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            <h2 style={{ fontSize: isSmallScreen ? '2rem' : '3rem', marginBottom: '1rem' }}>
              Careers | Nimitech IT
            </h2>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className={styles.container}>
        {/* Mission Section */}
        <section className={styles.missionSection}>
          <div className={styles.missionContent}>
            <div className={styles.missionText}>
              <h2>Meet the team work behind our success</h2>
              <p>
                We value authentic creativity and curiosity. As if our work is about our stories,
                creativity, and problem-solving capabilities.
              </p>
            </div>
            <div className={styles.missionImage}>
              <img src={businessImages.Success__} alt="Team meeting" />
            </div>
          </div>
        </section>

        {/* Job Listings Section */}
        <section className={styles.jobsSection}>
          <div className={styles.sectionHeader}>
            <h2>Currently open positions</h2>
            <div className={styles.jobCount}>
              {jobs.length} {jobs.length === 1 ? 'position' : 'positions'} available
            </div>
          </div>

          {/* Filters */}
          <div className={styles.filtersContainer}>
            <div className={styles.searchFilter}>
              <input
                type="text"
                placeholder="Search positions..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.selectFilters}>
              <select
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">All Departments</option>
                {getDepartments().map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>

              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">All Types</option>
                {getJobTypes().map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <select
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">All Locations</option>
                {getLocations().map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>

              {(filters.department !== 'all' ||
                filters.type !== 'all' ||
                filters.location !== 'all' ||
                filters.search) && (
                <button onClick={clearFilters} className={styles.clearFilters}>
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Job Cards */}
          <div className={styles.jobsGrid}>
            {jobs.length > 0 ? (
              <>
                {jobs.map((job: Job) => (
                  <div key={job._id} className={styles.jobCard}>
                    <div className={styles.jobHeader}>
                      <div className={styles.jobTitle}>
                        <h3>{job.title}</h3>
                        <div className={styles.jobMeta}>
                          <span className={styles.jobType}>{job.employmentType}</span>
                          <span className={styles.jobLocation}>{job.location}</span>
                        </div>
                      </div>
                      <div className={styles.jobDepartment}>{job.department}</div>
                    </div>

                    <div className={styles.jobContent}>
                      <p className={styles.jobDescription}>
                        {job.description.length > 150
                          ? `${job.description.substring(0, 150)}...`
                          : job.description}
                      </p>

                      <div className={styles.jobSkills}>
                        {(job.requirements || [])
                          .slice(0, 4)
                          .map((skill: string, index: number) => (
                            <span key={index} className={styles.skillTag}>
                              {skill}
                            </span>
                          ))}
                        {(job.requirements || []).length > 4 && (
                          <span className={styles.skillTag}>
                            +{(job.requirements || []).length - 4} more
                          </span>
                        )}
                      </div>

                      {job.salaryRange && (
                        <div className={styles.salaryRange}>
                          {typeof job.salaryRange === 'string'
                            ? job.salaryRange
                            : `${job.salaryRange.currency} ${job.salaryRange.min?.toLocaleString()} - ${job.salaryRange.max?.toLocaleString()}`}
                        </div>
                      )}
                    </div>

                    <div className={styles.jobFooter}>
                      <div className={styles.jobExperience}>Entry Level</div>
                      <Link to={`/careers/${job._id}`} className={styles.applyButton}>
                        Apply →
                      </Link>
                    </div>
                  </div>
                ))}
                {/* Pagination Bar */}
                <div
                  className={styles.paginationBar}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '10px',
                    margin: '40px 0 0 0',
                    flexWrap: 'wrap',
                  }}
                >
                  <button
                    className={styles.pageButton}
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    style={{
                      padding: '8px 18px',
                      borderRadius: '20px',
                      border: 'none',
                      background: page === 1 ? '#eee' : 'linear-gradient(90deg,#88199a,#764ba2)',
                      color: page === 1 ? '#aaa' : '#fff',
                      fontWeight: 600,
                      cursor: page === 1 ? 'not-allowed' : 'pointer',
                      boxShadow: page === 1 ? 'none' : '0 2px 12px #764ba233',
                      transition: 'all 0.2s',
                    }}
                  >
                    ← Prev
                  </button>
                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      className={styles.pageButton}
                      onClick={() => handlePageChange(p)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '50%',
                        border: 'none',
                        background:
                          p === page ? 'linear-gradient(90deg,#88199a,#764ba2)' : '#f3eaff',
                        color: p === page ? '#fff' : '#88199a',
                        fontWeight: p === page ? 700 : 500,
                        boxShadow: p === page ? '0 2px 12px #764ba233' : 'none',
                        cursor: p === page ? 'default' : 'pointer',
                        margin: '0 2px',
                        transition: 'all 0.2s',
                        outline: p === page ? '2px solid #764ba2' : 'none',
                      }}
                      disabled={p === page}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    className={styles.pageButton}
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    style={{
                      padding: '8px 18px',
                      borderRadius: '20px',
                      border: 'none',
                      background:
                        page === totalPages ? '#eee' : 'linear-gradient(90deg,#88199a,#764ba2)',
                      color: page === totalPages ? '#aaa' : '#fff',
                      fontWeight: 600,
                      cursor: page === totalPages ? 'not-allowed' : 'pointer',
                      boxShadow: page === totalPages ? 'none' : '0 2px 12px #764ba233',
                      transition: 'all 0.2s',
                    }}
                  >
                    Next →
                  </button>
                </div>
              </>
            ) : (
              <div className={styles.noJobs}>
                <h3>No positions found</h3>
                <p>Try adjusting your filters or check back later for new opportunities.</p>
                <button onClick={clearFilters} className={styles.clearFiltersButton}>
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Company Info Section */}
        {/* <section className={styles.companySection}>
          <div className={styles.companySectionContent}>
            <h2>Trusted by 1100+ of the world&apos;s most popular companies</h2>
            <div className={styles.companiesGrid}>
              <div className={styles.companyLogo}>Travono</div>
              <div className={styles.companyLogo}>Maestro</div>
              <div className={styles.companyLogo}>Whoolio</div>
              <div className={styles.companyLogo}>Voomier</div>
              <div className={styles.companyLogo}>Maestro</div>
            </div>
          </div>
        </section> */}
      </div>
    </div>
  );
};

export default Careers;
