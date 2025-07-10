import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
import BlogDonateSections from '../../components/blog/BlogDonateSections/BlogDonateSections';

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allPosts, setAllPosts] = useState<IBlogPost[]>([]);
  const postsPerPage = 6;
  const toast = useToast();

  // API queries
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

  useEffect(() => {
    if (featuredError) {
      toast.error('Something went wrong.');
    }
  }, [featuredError]);

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
      <div className={styles.blogContainer}>
        {/* Featured Post Section */}
        {featured && (
          <Link to={`/blogs/${featured.id || featured._id}`} className={styles.featuredPostLink}>
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
        )}

        {/* Recent Blog Posts Section */}
        <section className={styles.recentPosts}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionHeaderTitle}>Recent blog posts</h2>
          </div>

          <div className={styles.postsGrid}>
            {allPosts.map((post: any, index: number) => {
              const postId = post._id || post.id; // Handle both MongoDB _id and mock data id
              return (
                <article
                  key={`${postId}-${index}`} // Ensure unique keys when combining pages
                  className={styles.blogCard}
                  style={{
                    animationDelay: `${(index % postsPerPage) * 50}ms`,
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
                </article>
              );
            })}
          </div>

          {/* Action Buttons */}
          {renderActionButtons()}
        </section>
        {/* Donation Section */}
        <section className={styles.donationSection}>
          <div className={styles.donation}>
            <BlogDonateSections />
          </div>
        </section>
      </div>
    </>
  );
};

export default Blog;
