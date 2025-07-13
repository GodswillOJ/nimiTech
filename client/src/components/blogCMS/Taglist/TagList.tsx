import React from 'react';
import styles from './TagList.module.scss';

interface Tag {
  id: string;
  name: string;
  color?: string;
}

interface TagListProps {
  tags: Tag[];
  maxVisible?: number;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const TagList: React.FC<TagListProps> = ({
  tags,
  maxVisible = 5,
  size = 'small',
  className = '',
}) => {
  const visibleTags = tags.slice(0, maxVisible);
  const remainingCount = tags.length - maxVisible;

  if (tags.length === 0) {
    return null;
  }

  return (
    <div className={`${styles.tagList} ${styles[`tagList--${size}`]} ${className}`}>
      {visibleTags.map((tag) => (
        <span
          key={tag.id}
          className={styles.tag}
          style={{
            backgroundColor: tag.color ? `${tag.color}20` : undefined,
            borderColor: tag.color || undefined,
            color: tag.color || undefined,
          }}
        >
          {tag.name}
        </span>
      ))}
      {remainingCount > 0 && (
        <span className={`${styles.tag} ${styles['tag--more']}`}>+{remainingCount}</span>
      )}
    </div>
  );
};
