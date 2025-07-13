import React from 'react';
import styles from './AuthorAvatar.module.scss';

interface Author {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

interface AuthorAvatarProps {
  author: Author;
  size?: 'small' | 'medium' | 'large';
  showName?: boolean;
  className?: string;
}

const AuthorAvatar: React.FC<AuthorAvatarProps> = ({
  author,
  size = 'medium',
  showName = true,
  className = '',
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`${styles.author} ${styles[`author--${size}`]} ${className}`}>
      <div className={styles.author__avatar}>
        {author.avatar ? (
          <img src={author.avatar} alt={author.name} className={styles.author__image} />
        ) : (
          <span className={styles.author__initials}>{getInitials(author.name)}</span>
        )}
      </div>
      {showName && (
        <div className={styles.author__info}>
          <span className={styles.author__name}>{author.name}</span>
          {author.email && size !== 'small' && (
            <span className={styles.author__email}>{author.email}</span>
          )}
        </div>
      )}
    </div>
  );
};
export default AuthorAvatar;
