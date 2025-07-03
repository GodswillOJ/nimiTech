import React, { useState, useEffect, lazy } from 'react';
import { Link } from 'react-router-dom';
import styles from './blog.module.scss';
import { blogPosts, featuredPost } from './_partials/BlogPost.data';
import { IBlogPost } from './blog.types';
import authorAvatar from '../../assets/blog/images/authorAvatar.jpg';
import {
  useGetAllBlogPostPaginatedQuery,
  useGetFeaturedPostQuery,
} from '../../services/utilis/blogApiService';

const BlogDonateSections = lazy(
  () => import('../../components/blog/BlogDonateSections/BlogDonateSections')
);

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

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
  } = useGetFeaturedPostQuery();

  // Fallback to mock data if API fails
  const displayedPosts = blogData?.posts || blogPosts.slice(0, postsPerPage);
  const featuredPostData = featured || featuredPost;
  const loading = blogLoading || featuredLoading;
  const hasMorePosts = blogData?.hasNextPage || false;
  const totalPages = blogData?.totalPages || Math.ceil(blogPosts.length / postsPerPage);

  const handleLoadMore = async () => {
    if (loading || !hasMorePosts) return;
    setCurrentPage((prev) => prev + 1);
  };

  const renderLoadMoreButton = () => {
    if (!hasMorePosts) return null;

    return (
      <div className={styles.loadMoreContainer}>
        <button
          className={`${styles.loadMoreButton} ${loading ? styles.loading : ''}`}
          onClick={handleLoadMore}
          disabled={loading}
          aria-label={loading ? 'Loading more posts' : 'Load more posts'}
        >
          <span className={styles.buttonText}>{loading ? 'Loading...' : 'Load more posts'}</span>
          {loading && <div className={styles.spinner} />}
        </button>
      </div>
    );
  };

  return (
    <>
      <div className={styles.blogContainer}>
        {/* Featured Post Section */}
        <section
          className={styles.featuredPost}
          style={{ backgroundImage: `url(${featuredPostData.image})` }}
        >
          <Link to={`/blogs/${featuredPostData.id || featuredPostData._id}`}>
            <div className={styles.featuredContent}>
              <span className={styles.category}>{featuredPostData.category}</span>
              <h1>{featuredPostData.title}</h1>
              <p>{featuredPostData.description}</p>
            </div>
          </Link>
        </section>

        {/* Recent Blog Posts Section */}
        <section className={styles.recentPosts}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionHeaderTitle}>Recent blog posts</h2>
          </div>

          <div className={styles.postsGrid}>
            {displayedPosts.map((post: any, index: number) => {
              const postId = post._id || post.id; // Handle both MongoDB _id and mock data id
              return (
                <article
                  key={postId}
                  className={styles.blogCard}
                  style={{
                    animationDelay: `${(index % postsPerPage) * 100}ms`,
                  }}
                >
                  <Link to={`/blogs/${postId}`} className={styles.blogCardLink}>
                    <div className={styles.imageContainer}>
                      <img src={post.image} alt={post.title} loading="lazy" />
                    </div>
                    <div className={styles.contentContainer}>
                      <h3>{post.title}</h3>
                      <p>{post.description}</p>
                      <div className={styles.metaInfo}>
                        <img
                          src={authorAvatar}
                          alt={post.author.name}
                          className={styles.authorAvatar}
                        />
                        <span>{post.author.name}</span>
                        <span>•</span>
                        <span>{post.author.date}</span>
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className={styles.actionsContainer}>
            {renderLoadMoreButton()}
            {/* {renderViewMoreButton()} */}
          </div>
        </section>
      </div>
      {/* Donation Section */}

      <section className={styles.donationSection}>
        <div className={styles.donation}>
          <BlogDonateSections />
        </div>
      </section>
    </>
  );
};

export default Blog;
