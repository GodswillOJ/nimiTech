import { useMemo, useState, useRef, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { blogPosts } from '../../_partials/BlogPost.data';
import { BackIcon } from '../../../../assets/blog/icons/BackIcon';
import { NextIcon } from '../../../../assets/blog/icons/NextIcon';
import { Highlights } from '../../../../components/blog/Highlights/Highlights';
import { VideoEmbed } from '../../../../components/blog/VideoEmbed/VideoEmbed';
import Newsletter from '../../../../components/blog/Modal/NewsLetter/Newsletter';
import SocialMediaStack from '../../../../components/blog/SocialMediaStack/SocialMediaStack';
import {
  shouldShowNewsletterModal,
  markNewsletterModalShown,
} from '../../../../utils/newsletterUtils';
import {
  useGetBlogPostByIdQuery,
  useGetRelatedPostsQuery,
} from '../../../../services/utilis/blogApiService';
import styles from './BlogDetails.module.scss';
import Loader from '../../../../components/blog/SuspenseLoader/Loader';
import { getImageUrl } from '../../../../utils/envUtils';
import { formatBlogDate } from '../../../../utils/dateUtils';

const BlogDetails = () => {
  const { id } = useParams();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);

  // API queries
  const {
    data: currentPost,
    isLoading: postLoading,
    error: postError,
  } = useGetBlogPostByIdQuery(id!, { skip: !id });

  const {
    data: relatedPostsData,
    isLoading: relatedLoading,
    error: relatedError,
  } = useGetRelatedPostsQuery({ id: id!, limit: 6 }, { skip: !id });

  // Fallback to mock data if API fails
  const post = currentPost || blogPosts.find((post) => post.id.toString() === id);
  const relatedPosts =
    relatedPostsData ||
    (post
      ? blogPosts
          .filter(
            (mockPost) =>
              mockPost.id !== post.id &&
              mockPost.category.toLowerCase() === post.category.toLowerCase()
          )
          .slice(0, 6)
      : []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAllRelated, setShowAllRelated] = useState(false);
  const postsPerPage = 3;
  const totalPages = Math.ceil(relatedPosts.length / postsPerPage);
  const displayedPosts = showAllRelated
    ? relatedPosts
    : relatedPosts.slice(currentIndex * postsPerPage, (currentIndex + 1) * postsPerPage);

  useEffect(() => {
    // Check if we should show the newsletter modal
    if (!shouldShowNewsletterModal()) {
      return; // Don't set up modal triggers if user shouldn't see it
    }

    const timeout = setTimeout(() => {
      const handleScroll = () => {
        if (window.scrollY >= window.innerHeight / 4) {
          setShowNewsletterModal(true);
          markNewsletterModalShown();
          window.removeEventListener('scroll', handleScroll);
        }
      };
      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, 12000);

    return () => clearTimeout(timeout);
  }, []);

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

  if (postLoading) {
    return (
      <div className={styles.blog_view}>
        <main className={styles.blog_view__main}>
          <div className={styles.loading}>
            <Loader />
          </div>
        </main>
      </div>
    );
  }

  if (!post) {
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

  return (
    <div className={styles.blog_view}>
      <Newsletter
        isOpen={showNewsletterModal}
        onClose={() => setShowNewsletterModal(false)}
        onSuccess={() => {
          // Modal will handle marking user as subscribed
          setShowNewsletterModal(false);
        }}
        onDismiss={() => {
          // Modal will handle marking as dismissed
          setShowNewsletterModal(false);
        }}
      />
      <header className={styles.blog_view__header}>
        <Link to="/blogs" className={styles.blog_view__back_link}>
          <BackIcon className={styles.blog_view__back_icon} />
          Back to Blogs
        </Link>
      </header>

      <main className={styles.blog_view__main}>
        <article className={styles.article}>
          <header className={styles.article__header}>
            <div className={styles.article__meta}>
              <div className={styles.article__author}>
                <img
                  src={getImageUrl(post.author.avatar)}
                  alt={`Avatar of ${post.author.name}`}
                  className={styles.article__author_avatar}
                  width="32"
                  height="32"
                />
                <span className={styles.article__author_name}>{post.author.name}</span>
              </div>
              <time className={styles.article__date}>
                {formatBlogDate(post.author.date, post.readTime)}
              </time>
            </div>

            <h1 className={styles.article__title}>{post.title}</h1>
            <p className={styles.article__subtitle}>{post.description}</p>
          </header>

          <div className={styles.article__featured_image}>
            <img
              src={getImageUrl(post.image)}
              alt={post.title}
              className={styles.article__image}
              loading="eager"
            />
          </div>

          <div className={styles.article__content}>
            {post?.content?.paragraphs?.map((paragraph: any, i: any) => {
              if (paragraph.type === 'text') {
                return (
                  <p key={i} className={styles.article__paragraph}>
                    {paragraph.content}
                  </p>
                );
              } else if (paragraph.type === 'quote') {
                return (
                  <blockquote key={i} className={styles.article__quote}>
                    <p>{paragraph.content}</p>
                  </blockquote>
                );
              }
              return null;
            })}

            {post.contentImage && post.contentImageTitle && (
              <div className={styles.article__content_image}>
                <img
                  src={getImageUrl(post.contentImage)}
                  alt={post.contentImageTitle}
                  className={styles.article__contentImage}
                  loading="lazy"
                />
              </div>
            )}

            <Highlights
              title={post?.content?.highlights?.title}
              benefits={post?.content?.highlights?.benefits}
            />
          </div>

          <div className={styles.article__author_card}>
            <div className={styles.article__author_card_avatar}>
              <img
                src={getImageUrl(post.author.avatar)}
                alt={`Avatar of ${post.author.name}`}
                width="60"
                height="60"
                loading="lazy"
              />
            </div>
            <div className={styles.article__author_card_info}>
              <h4 className={styles.article__author_card_name}>{post.author.name}</h4>
              <p className={styles.article__author_card_bio}>
                {post.author.bio ||
                  'UI/UX Designer passionate about creating intuitive digital experiences'}
              </p>
            </div>
          </div>
        </article>

        {post.youtubeUrl && (
          <div className={styles.article__video_card}>
            <VideoEmbed videoId={getYoutubeVideoId(post.youtubeUrl)} title={post.title} />
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
                {displayedPosts.map((post: any, index: any) => {
                  const postId = post._id || post.id; // Handle both MongoDB _id and mock data id
                  return (
                    <article key={postId} className={styles.related__card}>
                      <Link to={`/blogs/${postId}`} className={styles.related__card_link}>
                        <div className={styles.related__card_image}>
                          <img
                            src={getImageUrl(post.image)}
                            alt=""
                            loading="lazy"
                            width="280"
                            height="180"
                          />
                        </div>
                        <div className={styles.related__card_content}>
                          <div className={styles.related__card_meta}>
                            <time className={styles.related__card_date}>
                              {formatBlogDate(post.author.date, post.readTime)}
                            </time>
                          </div>
                          <h3 className={styles.related__card_title}>{post.title}</h3>
                          <p className={styles.related__card_description}>{post.description}</p>
                          <div className={styles.related__card_author}>
                            <img
                              src={getImageUrl(post.author.avatar)}
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
                  );
                })}
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

      {/* Social Media Stack */}
      <SocialMediaStack key={id} autoShowDelay={2000} position="top-right" />
    </div>
  );
};

export default BlogDetails;
