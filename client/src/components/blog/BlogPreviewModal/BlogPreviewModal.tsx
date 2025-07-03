import React from 'react';
import { IContent } from '../../../pages/blog/blog.types';
import { VideoEmbed } from '../VideoEmbed/VideoEmbed';
import { Highlights } from '../Highlights/Highlights';
import styles from './BlogPreviewModal.module.scss';

interface BlogPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  formData: {
    title: string;
    excerpt?: string;
    category: string;
    author: any;
    content?: IContent;
    youtubeUrl?: string;
    tags?: string[] | string;
  };
  featuredImage?: string | null;
  contentImage?: string | null;
  authorAvatar?: string | null;
  readingTime: string;
  isLoading?: boolean;
}

export const BlogPreviewModal: React.FC<BlogPreviewModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  featuredImage,
  contentImage,
  authorAvatar,
  readingTime,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const getImageUrl = (imagePath?: string | null) => {
    if (!imagePath) return '/api/placeholder/400/300';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:10000${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
  };

  const formatDate = (date?: string) => {
    return new Date(date || Date.now()).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const processedTags =
    typeof formData.tags === 'string'
      ? formData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      : formData.tags || [];

  return (
    <div className={styles.modal__overlay} onClick={onClose}>
      <div className={styles.modal__content} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modal__header}>
          <h2>Blog Post Preview</h2>
          <button className={styles.modal__close} onClick={onClose}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className={styles.modal__body}>
          <div className={styles.preview__container}>
            {/* Header Section */}
            <div className={styles.preview__header}>
              <div className={styles.preview__breadcrumb}>
                <span>Blog</span> → <span>{formData.category}</span>
              </div>

              <h1 className={styles.preview__title}>{formData.title}</h1>

              {formData.excerpt && <p className={styles.preview__excerpt}>{formData.excerpt}</p>}

              {/* Meta Information */}
              <div className={styles.preview__meta}>
                <div className={styles.preview__author}>
                  {authorAvatar && (
                    <img
                      src={getImageUrl(authorAvatar)}
                      alt={
                        typeof formData.author === 'object' ? formData.author.name : formData.author
                      }
                      className={styles.preview__author_avatar}
                    />
                  )}
                  <div className={styles.preview__author_info}>
                    <span className={styles.preview__author_name}>
                      {typeof formData.author === 'object' ? formData.author.name : formData.author}
                    </span>
                    <span className={styles.preview__author_bio}>
                      {typeof formData.author === 'object'
                        ? formData.author.bio
                        : 'Blog Administrator'}
                    </span>
                  </div>
                </div>

                <div className={styles.preview__post_meta}>
                  <span className={styles.preview__date}>{formatDate()}</span>
                  <span className={styles.preview__reading_time}>{readingTime}</span>
                  <span className={styles.preview__category}>{formData.category}</span>
                </div>
              </div>

              {/* Tags */}
              {processedTags.length > 0 && (
                <div className={styles.preview__tags}>
                  {processedTags.map((tag, index) => (
                    <span key={index} className={styles.preview__tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Subtitle */}
            {formData.content?.subtitle && (
              <h2 className={styles.preview__subtitle}>{formData.content.subtitle}</h2>
            )}

            {/* Featured Image */}
            {featuredImage && (
              <div className={styles.preview__featured_image}>
                <img src={getImageUrl(featuredImage)} alt={formData.title} />
              </div>
            )}

            {/* Content */}
            <div className={styles.preview__content}>
              {/* Content Image */}
              {contentImage && (
                <div className={styles.preview__content_image}>
                  <img src={getImageUrl(contentImage)} alt="Content" />
                </div>
              )}

              {/* Paragraphs */}
              {formData.content?.paragraphs && formData.content.paragraphs.length > 0 && (
                <div className={styles.preview__paragraphs}>
                  {formData.content.paragraphs.map((paragraph, index) => (
                    <div key={index} className={styles.preview__paragraph}>
                      {paragraph.type === 'quote' ? (
                        <blockquote className={styles.preview__quote}>
                          {paragraph.content}
                        </blockquote>
                      ) : (
                        <p>{paragraph.content}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Highlights */}
              {formData.content?.highlights &&
                (formData.content.highlights.title ||
                  (formData.content.highlights.benefits &&
                    formData.content.highlights.benefits.length > 0)) && (
                  <div className={styles.preview__highlights}>
                    <Highlights
                      title={formData.content.highlights.title}
                      benefits={formData.content.highlights.benefits}
                    />
                  </div>
                )}

              {/* YouTube Video */}
              {formData.youtubeUrl && (
                <div className={styles.preview__video}>
                  <VideoEmbed
                    videoId={
                      formData.youtubeUrl.includes('youtube.com')
                        ? formData.youtubeUrl.split('v=')[1]?.split('&')[0] || ''
                        : formData.youtubeUrl.includes('youtu.be')
                          ? formData.youtubeUrl.split('youtu.be/')[1]?.split('?')[0] || ''
                          : formData.youtubeUrl
                    }
                    title={formData.title}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.modal__footer}>
          <button className={styles.btn__secondary} onClick={onClose} disabled={isLoading}>
            Edit More
          </button>
          <button className={styles.btn__primary} onClick={onSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <svg className={styles.spinner} width="16" height="16" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    opacity="0.25"
                  />
                  <path
                    d="M12 2a10 10 0 0 1 10 10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                </svg>
                Saving...
              </>
            ) : (
              'Save & Publish'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
