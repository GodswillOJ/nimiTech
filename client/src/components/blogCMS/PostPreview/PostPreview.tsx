import React, { useEffect } from 'react';
import styles from './PostPreview.module.scss';
import { Post } from '@/pages/blogCMS/BlogEditorDashboard/BlogEditorDashboard.types';

interface PostPreviewProps {
  post: Post;
  onClose: () => void;
  onEdit: () => void;
}

export const PostPreview: React.FC<PostPreviewProps> = ({ post, onClose, onEdit }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return '#10b981';
      case 'draft':
        return '#6b7280';
      case 'scheduled':
        return '#f59e0b';
      case 'archived':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className={styles.post_preview}>
      <div className={styles.post_preview__backdrop} onClick={onClose} />

      <div className={styles.post_preview__modal}>
        <header className={styles.post_preview__header}>
          <div className={styles.post_preview__title_section}>
            <h2 className={styles.post_preview__title}>{post.title}</h2>
            <div className={styles.post_preview__meta}>
              <span
                className={styles.post_preview__status}
                style={{ backgroundColor: getStatusColor(post.status) }}
              >
                {post.status}
              </span>
              <span className={styles.post_preview__author}>by {post.author}</span>
              <span className={styles.post_preview__date}>{formatDate(post.updatedAt)}</span>
            </div>
          </div>

          <div className={styles.post_preview__actions}>
            <button onClick={onEdit} className={styles.post_preview__edit_button}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
              Edit
            </button>

            <button onClick={onClose} className={styles.post_preview__close_button}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </header>

        <div className={styles.post_preview__content}>
          {post.featuredImage && (
            <div className={styles.post_preview__image}>
              <img src={post.featuredImage} alt={post.title} />
            </div>
          )}

          {post.excerpt && (
            <div className={styles.post_preview__excerpt}>
              <h3>Excerpt</h3>
              <p>{post.excerpt}</p>
            </div>
          )}

          <div className={styles.post_preview__body}>
            <div
              className={styles.post_preview__content_html}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className={styles.post_preview__tags}>
              <h4>Tags</h4>
              <div className={styles.post_preview__tag_list}>
                {post.tags.map((tag, index) => (
                  <span key={index} className={styles.post_preview__tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
