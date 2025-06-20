import React, { useState, useEffect, lazy } from 'react';
import { Link } from 'react-router-dom';
import styles from './blog.module.scss';
import { blogPosts, featuredPost } from './_partials/BlogPost.data';
import { IBlogPost } from './blog.types';
import authorAvatar from '../../assets/blog/images/authorAvatar.jpg';
import donationImage1 from '../../assets/blog/images/donationImage1.webp';
import donationImage5 from '../../assets/blog/images/donationImage5.jpg';
import donationImage4 from '../../assets/blog/images/donationImage4.jpg';
import { Button } from '../../components/blogCMS/Button/Button';

const GradientCard = lazy(() => import('../../components/blog/GradientCard/GradientCard'));
const DonateSection = lazy(() => import('../../components/blog/DonateSection/DonateSection'));

const Blog = () => {
  const [displayedPosts, setDisplayedPosts] = useState<IBlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const postsPerPage = 6;

  useEffect(() => {
    const initialPosts = blogPosts.slice(0, postsPerPage);
    setDisplayedPosts(initialPosts);
    setHasMorePosts(blogPosts.length > postsPerPage);
  }, []);

  const handleLoadMore = async () => {
    if (loading || !hasMorePosts) return;

    setLoading(true);

    // Simulate API call with smooth loading
    await new Promise((resolve) => setTimeout(resolve, 10));

    const nextPage = currentPage + 1;
    const startIndex = 0;
    const endIndex = nextPage * postsPerPage;
    const newPosts = blogPosts.slice(startIndex, endIndex);

    setDisplayedPosts(newPosts);
    setCurrentPage(nextPage);
    setHasMorePosts(endIndex < blogPosts.length);
    setLoading(false);
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

  const renderViewMoreButton = () => {
    if (hasMorePosts || displayedPosts.length < blogPosts.length) {
      return (
        <div className={styles.viewMoreContainer}>
          <Link to="/blogs" className={styles.viewMoreLink}>
            <Button title={`View all ${blogPosts.length} posts`} variant="primary" />
          </Link>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.blogContainer}>
      {/* Featured Post Section */}
      <section
        className={styles.featuredPost}
        style={{ backgroundImage: `url(${featuredPost.image})` }}
      >
        {displayedPosts.map((post: any) => (
          <Link to={`/blogs/${post.id}`} key={post.id}>
            <div className={styles.featuredContent} key={post.id}>
              <span className={styles.category}>{featuredPost.category}</span>
              <h1>{featuredPost.title}</h1>
              <p>{featuredPost.description}</p>
            </div>
          </Link>
        ))}
      </section>

      {/* Recent Blog Posts Section */}
      <section className={styles.recentPosts}>
        <div className={styles.sectionHeader}>
          <h2>Recent blog posts</h2>
          {/* <span className={styles.postCount}>
            Showing {displayedPosts.length} of {blogPosts.length} posts
          </span> */}
        </div>

        <div className={styles.postsGrid}>
          {displayedPosts.map((post, index) => (
            <article
              key={post.id}
              className={styles.blogCard}
              style={{
                animationDelay: `${(index % postsPerPage) * 100}ms`,
              }}
            >
              <Link to={`/blogs/${post.id}`} className={styles.blogCardLink}>
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
          ))}
        </div>

        {/* Action Buttons */}
        <div className={styles.actionsContainer}>
          {renderLoadMoreButton()}
          {renderViewMoreButton()}
        </div>
      </section>

      {/* Donation Section */}
      <section className={styles.donation}>
        <GradientCard imageSrc={donationImage5} imagePosition="left" />
        <DonateSection images={[donationImage1, donationImage4, donationImage5]} />
      </section>
    </div>
  );
};

export default Blog;
