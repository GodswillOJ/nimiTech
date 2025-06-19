import { useMemo, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { blogPosts } from '../../_partials/BlogPost.data';
import { BackIcon } from '../../../../assets/blog/icons/BackIcon';
import { NextIcon } from '../../../../assets/blog/icons/NextIcon';
import { Highlights } from '../../../../components/blog/Highlights/Highlights';
import { VideoEmbed } from '../../../../components/blog/VideoEmbed/VideoEmbed';
import styles from './BlogDetails.module.scss';

const BlogDetails = () => {
  const { id } = useParams();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Find the current post from blogPosts data
  const currentPost = useMemo(() => blogPosts.find((post) => post.id.toString() === id), [id]);

  // Get related posts from the same category
  const relatedPosts = useMemo(
    () =>
      currentPost
        ? blogPosts
            .filter(
              (post) =>
                post.id !== currentPost.id &&
                post.category.toLowerCase() === currentPost.category.toLowerCase()
            )
            .slice(0, 6)
        : [],
    [currentPost]
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAllRelated, setShowAllRelated] = useState(false);

  // Calculate how many posts to show
  const postsPerPage = 3;
  const totalPages = Math.ceil(relatedPosts.length / postsPerPage);
  const displayedPosts = showAllRelated
    ? relatedPosts
    : relatedPosts.slice(currentIndex * postsPerPage, (currentIndex + 1) * postsPerPage);

  if (!currentPost) {
    return (
      <div className={styles.blog_view}>
        <main className={styles.blog_view__main}>
          <div className={styles.not_found}>
            <h1 className={styles.not_found__title}>Blog post not found</h1>
            <Link to="/blogs" className={styles.not_found__link}>
              ← Back to blogs
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const handlePageChange = (index: number) => {
    if (index >= 0 && index < totalPages) {
      setCurrentIndex(index);
      const relatedSection = document.querySelector('.related');
      if (relatedSection) {
        relatedSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handlePrevious = () => {
    if (!showAllRelated) {
      handlePageChange(currentIndex - 1);
    } else {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        container.scrollTo({
          left: container.scrollLeft - 320,
          behavior: 'smooth',
        });
      }
    }
  };

  const handleNext = () => {
    if (!showAllRelated) {
      handlePageChange(currentIndex + 1);
    } else {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        container.scrollTo({
          left: container.scrollLeft + 320,
          behavior: 'smooth',
        });
      }
    }
  };

  const toggleViewMore = () => {
    setShowAllRelated(!showAllRelated);
    if (!showAllRelated) {
      setCurrentIndex(0);
    }
  };

  const getYoutubeVideoId = (youtubeUrl: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = youtubeUrl.match(regExp);
    return match && match[2].length === 11 ? match[2] : '';
  };

  return (
    <div className={styles.blog_view}>
      {/* Backlink to blog list */}
      <header className={styles.blog_view__header}>
        <Link to="/blogs" className={styles.blog_view__back_link}>
          <BackIcon className={styles.blog_view__back_icon} />
          Prev
        </Link>
      </header>

      <main className={styles.blog_view__main}>
        <article className={styles.article}>
          <header className={styles.article__header}>
            <div className={styles.article__meta}>
              <div className={styles.article__author}>
                <img
                  src={currentPost.author.avatar}
                  alt={`Avatar of ${currentPost.author.name}`}
                  className={styles.article__author_avatar}
                  width="32"
                  height="32"
                />
                <span className={styles.article__author_name}>{currentPost.author.name}</span>
              </div>
              <time className={styles.article__date}>
                {currentPost.author.date} • {currentPost.readTime}
              </time>
            </div>

            <h1 className={styles.article__title}>{currentPost.title}</h1>

            <p className={styles.article__subtitle}>{currentPost.description}</p>
          </header>

          {/* featured image */}
          <div className={styles.article__featured_image}>
            <img
              src={currentPost.image}
              alt={currentPost.title}
              className={styles.article__image}
              loading="eager"
            />
          </div>

          {/* main content */}
          <div className={styles.article__content}>
            {currentPost?.content?.paragraphs?.map((paragraph, i) => (
              <p key={i} className={styles.article__paragraph}>
                {paragraph?.content}
              </p>
            ))}

            {/* content images */}
            {currentPost.contentImage && currentPost.contentImageTitle && (
              <div className={styles.article__content_image}>
                <img
                  src={currentPost.contentImage}
                  alt={currentPost.contentImageTitle}
                  className={styles.article__contentImage}
                  loading="lazy"
                />
              </div>
            )}

            <Highlights
              title={currentPost?.content?.highlights?.title}
              benefits={currentPost?.content?.highlights?.benefits}
            />
          </div>

          {/* author card */}
          <div className={styles.article__author_card}>
            <div className={styles.article__author_card_avatar}>
              <img
                src={currentPost.author.avatar}
                alt={`Avatar of ${currentPost.author.name}`}
                width="60"
                height="60"
                loading="lazy"
              />
            </div>
            <div className={styles.article__author_card_info}>
              <h4 className={styles.article__author_card_name}>{currentPost.author.name}</h4>
              <p className={styles.article__author_card_bio}>
                {currentPost.author.bio ||
                  'UI/UX Designer passionate about creating intuitive digital experiences'}
              </p>
            </div>
          </div>
        </article>
        {currentPost.youtubeUrl && (
          <div className={styles.article__video_card}>
            <VideoEmbed
              videoId={getYoutubeVideoId(currentPost.youtubeUrl)}
              title={currentPost.title}
            />
          </div>
        )}

        {/* related posts */}
        {relatedPosts.length > 0 && (
          <section className={`${styles.related} related`} aria-labelledby="related-posts-title">
            <header className={styles.related__header}>
              <h2 id="related-posts-title" className={styles.related__title}>
                Related Posts
              </h2>
              <div className={styles.related__navigation}>
                <button
                  className={styles.related__nav_btn}
                  aria-label="Previous posts"
                  onClick={handlePrevious}
                  disabled={!showAllRelated && currentIndex === 0}
                >
                  <BackIcon />
                </button>
                <button
                  className={styles.related__nav_btn}
                  aria-label="Next posts"
                  onClick={handleNext}
                  disabled={!showAllRelated && currentIndex === totalPages - 1}
                >
                  <NextIcon />
                </button>
              </div>
            </header>

            <div className={styles.related__container} ref={scrollContainerRef}>
              <div className={styles.related__grid}>
                {displayedPosts.map((post, index) => (
                  <article key={post.id} className={styles.related__card}>
                    <Link to={`/blogs/${post.id}`} className={styles.related__card_link}>
                      <div className={styles.related__card_image}>
                        <img src={post.image} alt="" loading="lazy" width="280" height="180" />
                      </div>
                      <div className={styles.related__card_content}>
                        <div className={styles.related__card_meta}>
                          <time className={styles.related__card_date}>{post.author.date}</time>
                          <span className={styles.related__card_read_time}>{post.readTime}</span>
                        </div>
                        <h3 className={styles.related__card_title}>{post.title}</h3>
                        <p className={styles.related__card_description}>{post.description}</p>
                        <div className={styles.related__card_author}>
                          <img
                            src={post.author.avatar}
                            alt={`Avatar of ${post.author.name}`}
                            width="24"
                            height="24"
                            loading="eager"
                          />
                          <span className={styles.related__card_author_name}>
                            {post.author.name}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>

            {/* Pagination dots */}
            {!showAllRelated && totalPages > 1 && (
              <div className={styles.related__pagination}>
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    className={`${styles.related__pagination_dot} ${
                      index === currentIndex ? styles.related__pagination_dot__active : ''
                    }`}
                    aria-label={`Go to page ${index + 1}`}
                    onClick={() => handlePageChange(index)}
                  />
                ))}
              </div>
            )}

            {/* View More/View Less Button */}
            {relatedPosts.length > postsPerPage && (
              <div className={styles.related__view_more}>
                <button className={styles.related__view_more_btn} onClick={toggleViewMore}>
                  {showAllRelated
                    ? 'View Less'
                    : `View More (${relatedPosts.length - postsPerPage} more)`}
                </button>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default BlogDetails;
