import React, { useState, useEffect, lazy } from 'react';
import { Link } from 'react-router-dom';
import styles from './blog.module.scss';
import { blogPosts, featuredPost } from './_partials/BlogPost.data';
import { IBlogPost } from './blog.types';
import authorAvatar from '../../assets/blog/images/authorAvatar.jpg';
import donationImage1 from '../../assets/blog/images/donationImage1.jpg';
import donationImage2 from '../../assets/blog/images/donationImage2.jpg';
import { Button } from '../../components/blogCMS/Button/Button';

const GradientCard = lazy(() => import('../../components/blog/GradientCard/GradientCard'));
const DonateSection = lazy(() => import('../../components/blog/DonateSection/DonateSection'));

const Blog = () => {
  const [posts, setPosts] = useState<IBlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    // Initially load the first page of posts
    setPosts(blogPosts.slice(0, postsPerPage));
  }, []);

  const handleLoadMore = () => {
    setLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      const nextPosts = blogPosts.slice(0, (page + 1) * postsPerPage);
      setPosts(nextPosts);
      setPage(page + 1);
      setLoading(false);
    }, 800);
  };

  return (
    <div className={styles.blogContainer}>
      {/* Featured Post Section */}
      <section
        className={styles.featuredPost}
        style={{ backgroundImage: `url(${featuredPost.image})` }}
      >
        {posts.map((post) => (
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
        <h2>Recent blog posts</h2>
        <div className={styles.postsGrid}>
          {posts.map((post) => (
            <article key={post.id} className={styles.blogCard}>
              <Link to={`/blogs/${post.id}`} className={styles.blogCardLink}>
                <div className={styles.imageContainer}>
                  <img src={post.image} alt={post.title} />
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
        {!loading && (
          <div className={styles.viewMoreBtn}>
            <Link to="/blogs" className={styles.viewMoreLink}>
              <Button title="View more" variant="primary" />
            </Link>
          </div>
        )}
        {posts.length < blogPosts.length && (
          <button
            className={`${styles.loadMore} ${loading ? styles.loading : ''}`}
            onClick={handleLoadMore}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load more posts'}
          </button>
        )}
      </section>
      <section className={styles.donation}>
        <GradientCard imageSrc={donationImage2} imagePosition="left" />
        <DonateSection
          images={[donationImage1, donationImage2, donationImage1]}
          onDonateClick={() => window.open('https://www.example.com/donate', '_blank')}
        />
      </section>
    </div>
  );
};

export default Blog;
