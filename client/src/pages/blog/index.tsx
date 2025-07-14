import React, { useState, useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import styles from './blog.module.scss';
import { IBlogPost } from './blog.types';
import authorAvatar from '../../assets/blog/images/authorAvatar.jpg';
import {
  useGetAllBlogPostPaginatedQuery,
  useGetFeaturedPostQuery,
} from '../../services/utilis/blogApiService';
import { getImageUrl } from '../../utils/envUtils';
import { formatDate } from '../../utils/dateUtils';
import { useToast } from '../../hooks/useToast';
import SEO from '../../components/SEO/SEO';

// Lazy load the donate section for better performance
const BlogDonateSections = React.lazy(
  () => import('../../components/blog/BlogDonateSections/BlogDonateSections')
);

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allPosts, setAllPosts] = useState<IBlogPost[]>([]);
  const postsPerPage = 6;
  const toast = useToast();

  // SEO Configuration
  const seoData = {
    title: 'Blogs - Insights on IT Solutions & Digital Transformation',
    description:
      "Stay updated with the latest insights on IT solutions, digital transformation, cybersecurity, and technology trends. Explore Nimitech IT's expert blog posts and industry knowledge.",
    keywords:
      'IT blogs, digital transformation insights, cybersecurity articles, technology trends, web development tips, digital marketing strategies, cloud solutions, IT consulting, Nimi Tech blog',
    canonical: 'https://nimitechit.com/blogs',
    ogImage: 'https://nimitechit.com/images/blog-og-image.jpg',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Nimi Tech Blog',
      description: 'Expert insights on IT solutions, digital transformation, and technology trends',
      url: 'https://nimitechit.com/blogs',
      publisher: {
        '@type': 'Organization',
        name: 'Nimi Tech',
        url: 'https://nimitechit.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://nimitechit.com/images/logo.png',
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://nimitechit.com/blogs',
      },
    },
  };

  // Framer Motion animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as const,
      },
    },
  };

  const fadeInScale = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as const,
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut' as const,
      },
    },
  };

  // API queries with optimized settings
  const {
    data: blogData,
    isLoading: blogLoading,
    error: blogError,
    refetch: refetchBlogs,
  } = useGetAllBlogPostPaginatedQuery({
    page: currentPage,
    limit: postsPerPage,
  });

  const {
    data: featured,
    isLoading: featuredLoading,
    error: featuredError,
    refetch: refetchFeatured,
  } = useGetFeaturedPostQuery();

  // Handle errors with toast notifications
  useEffect(() => {
    if (blogError) {
      toast.error('Something went wrong.');
    }
  }, [blogError]);

  // useEffect(() => {
  //   if (featuredError) {
  //     toast.error('Something went wrong.');
  //   }
  // }, [featuredError]);

  // Helper function to get unique post ID (handles both _id and id)
  const getPostId = (post: any) => post._id || post.id;

  // Update all posts when new data arrives
  useEffect(() => {
    if (blogData?.posts) {
      if (currentPage === 1) {
        // First page - replace all posts
        setAllPosts(blogData.posts);
      } else {
        // Subsequent pages - append only new posts (avoid duplicates)
        setAllPosts((prev) => {
          const existingIds = new Set(prev.map(getPostId));
          const newPosts = blogData.posts.filter((post: any) => !existingIds.has(getPostId(post)));
          return [...prev, ...newPosts];
        });
      }
    }
  }, [blogData, currentPage]);

  // Data for rendering
  const loading = blogLoading || featuredLoading;
  const hasMorePosts = blogData?.hasNextPage;
  const hasData = featured && allPosts.length > 0;

  const handleLoadMore = async () => {
    if (loading || !hasMorePosts) return;
    setCurrentPage((prev) => prev + 1);
  };

  const handleLoadLess = () => {
    // Reset to first page and show only first page posts
    setCurrentPage(1);
    setAllPosts((prev) => prev.slice(0, postsPerPage));
  };

  const handleRetry = () => {
    refetchBlogs();
    refetchFeatured();
  };

  // Skeleton loader component for blog cards
  const BlogCardSkeleton = () => (
    <motion.article
      className={styles.blogCard}
      variants={cardVariants}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <div className={styles.imageContainer}>
        <Skeleton height={200} style={{ borderRadius: '8px 8px 0 0' }} />
      </div>
      <div className={styles.contentContainer} style={{ padding: '16px', flex: 1 }}>
        <Skeleton height={24} style={{ marginBottom: '12px' }} />
        <Skeleton count={3} height={16} style={{ marginBottom: '8px' }} />
        <div className={styles.metaInfo} style={{ marginTop: 'auto', paddingTop: '16px' }}>
          <Skeleton circle height={32} width={32} style={{ marginRight: '8px' }} />
          <Skeleton width={80} height={16} style={{ marginRight: '8px' }} />
          <Skeleton width={4} height={16} style={{ marginRight: '8px' }} />
          <Skeleton width={100} height={16} />
        </div>
      </div>
    </motion.article>
  );

  // Loading fallback for donate section to prevent layout shifts
  const DonateSectionSkeleton = () => (
    <div
      style={{
        minHeight: '500px',
        padding: '2rem 1rem',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        borderRadius: '12px',
        margin: '2rem 0',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <Skeleton height={48} width={300} style={{ marginBottom: '1rem' }} />
        <Skeleton height={20} width={500} style={{ marginBottom: '2rem' }} />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginTop: '3rem',
          }}
        >
          <div>
            <Skeleton height={200} style={{ borderRadius: '8px', marginBottom: '1rem' }} />
            <Skeleton height={24} style={{ marginBottom: '0.5rem' }} />
            <Skeleton count={2} height={16} />
          </div>
          <div>
            <Skeleton height={200} style={{ borderRadius: '8px', marginBottom: '1rem' }} />
            <Skeleton height={24} style={{ marginBottom: '0.5rem' }} />
            <Skeleton count={2} height={16} />
          </div>
        </div>
      </div>
    </div>
  );

  const renderActionButtons = () => {
    const showLoadLess = currentPage > 1 && allPosts.length > postsPerPage;
    const showLoadMore = hasMorePosts && !loading;

    // Don't show any buttons if we're loading
    if (loading && currentPage > 1) {
      return (
        <div className={styles.actionsContainer}>
          <button className={`${styles.loadMoreButton} ${styles.loading}`} disabled>
            <span className={styles.buttonText}>Loading...</span>
            <div className={styles.spinner} />
          </button>
        </div>
      );
    }

    return (
      <div className={styles.actionsContainer}>
        {/* Load More Button */}
        {showLoadMore && (
          <button
            className={styles.loadMoreButton}
            onClick={handleLoadMore}
            aria-label="Load more posts"
          >
            <span className={styles.buttonText}>Load more posts</span>
          </button>
        )}

        {/* Load Less Button */}
        {showLoadLess && (
          <button
            className={`${styles.loadLessButton} ${styles.loadMoreButton}`}
            onClick={handleLoadLess}
            aria-label="Show fewer posts"
          >
            <span className={styles.buttonText}>Load less</span>
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      <SEO
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        canonical={seoData.canonical}
        ogImage={seoData.ogImage}
        ogUrl={seoData.canonical}
        structuredData={seoData.structuredData}
      />
      <motion.div
        className={styles.blogContainer}
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Featured Post Section */}
        {featuredLoading ? (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInScale}
          >
            <section className={styles.featuredPost} style={{ backgroundColor: '#f0f0f0' }}>
              <div className={styles.featuredContent} style={{ marginBottom: '16px' }}>
                <Skeleton width={120} height={24} style={{ marginBottom: '16px' }} />
                <Skeleton height={48} style={{ marginBottom: '16px' }} />
                <Skeleton count={3} height={16} style={{ marginBottom: '8px' }} />
              </div>
            </section>
          </motion.div>
        ) : (
          featured && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInScale}
            >
              <Link
                to={`/blogs/${featured.id || featured._id}`}
                className={styles.featuredPostLink}
              >
                <section
                  className={styles.featuredPost}
                  style={{ backgroundImage: `url(${getImageUrl(featured.image)})` }}
                >
                  <div className={styles.featuredContent}>
                    <span className={styles.category}>{featured.category}</span>
                    <h1>{featured.title}</h1>
                    <p>{featured.description}</p>
                  </div>
                </section>
              </Link>
            </motion.div>
          )
        )}

        {/* Recent Blog Posts Section */}
        <motion.section
          className={styles.recentPosts}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
        >
          <motion.div className={styles.sectionHeader} variants={fadeInUp}>
            {loading && allPosts.length === 0 ? (
              <Skeleton height={32} width={250} />
            ) : (
              <h2 className={styles.sectionHeaderTitle}>Recent blog posts</h2>
            )}
          </motion.div>

          <motion.div className={styles.postsGrid} variants={staggerContainer}>
            {loading && allPosts.length === 0
              ? // Show skeleton loaders when initially loading
                Array.from({ length: postsPerPage }).map((_, index) => (
                  <BlogCardSkeleton key={`skeleton-${index}`} />
                ))
              : // Show actual posts
                allPosts.map((post: any, index: number) => {
                  const postId = post._id || post.id; // Handle both MongoDB _id and mock data id
                  return (
                    <motion.article
                      key={`${postId}-${index}`} // Ensure unique keys when combining pages
                      className={styles.blogCard}
                      variants={cardVariants}
                      whileHover={{
                        y: -5,
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        transition: { duration: 0.2 },
                      }}
                      style={{
                        animationDelay: `${(index % postsPerPage) * 100}ms`,
                      }}
                    >
                      <Link to={`/blogs/${postId}`} className={styles.blogCardLink}>
                        <div className={styles.imageContainer}>
                          <img src={getImageUrl(post.image)} alt={post.title} loading="lazy" />
                        </div>
                        <div className={styles.contentContainer}>
                          <h3>{post.title}</h3>
                          <p>{post.description}</p>
                          <div className={styles.metaInfo}>
                            <img
                              src={getImageUrl(post.author.avatar) || authorAvatar}
                              alt={post.author.name}
                              className={styles.authorAvatar}
                            />
                            <span>{post.author.name}</span>
                            <span>•</span>
                            <span>{formatDate(post.author.date)}</span>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  );
                })}

            {/* Show skeleton loaders for new posts being loaded */}
            {loading &&
              currentPage > 1 &&
              allPosts.length > 0 &&
              Array.from({ length: postsPerPage }).map((_, index) => (
                <BlogCardSkeleton key={`loading-skeleton-${index}`} />
              ))}
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={fadeInUp}>{renderActionButtons()}</motion.div>
        </motion.section>

        {/* Donation Section */}
        <motion.section
          className={styles.donationSection}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.4,
                ease: 'easeOut' as const,
              },
            },
          }}
          style={{ minHeight: '500px' }} // Reserve space to prevent layout shifts
        >
          <div className={styles.donation}>
            <Suspense fallback={<DonateSectionSkeleton />}>
              <BlogDonateSections />
            </Suspense>
          </div>
        </motion.section>
      </motion.div>
    </>
  );
};

export default Blog;
