import React, { useState } from 'react';
import { CheckmarkIcon, DropdownArrowIcon } from '../../../assets/blogCMS/icons/StatusIcons';
import styles from './StatusBadge.module.scss';
import { PostStatus } from '../../../pages/blogCMS/_partials/BlogTableComponent/BlogTableComp.types';

interface IStatusBadge {
  status: PostStatus;
  onClick?: (status: PostStatus) => void;
  interactive?: boolean;
  className?: string;
}

const statusConfig: Record<PostStatus, { label: string; color: string; icon: string }> = {
  [PostStatus.DRAFT]: {
    label: 'Draft',
    color: 'yellow',
    icon: '✏️',
  },
  [PostStatus.PUBLISHED]: {
    label: 'Published',
    color: 'green',
    icon: '✅',
  },
  [PostStatus.SCHEDULED]: {
    label: 'Scheduled',
    color: 'blue',
    icon: '⏰',
  },
  [PostStatus.ARCHIVED]: {
    label: 'Archived',
    color: 'gray',
    icon: '📦',
  },
};

const statusOptions: PostStatus[] = [
  PostStatus.DRAFT,
  PostStatus.PUBLISHED,
  PostStatus.SCHEDULED,
  PostStatus.ARCHIVED,
];

export const StatusBadge: React.FC<IStatusBadge> = ({
  status,
  onClick,
  interactive = false,
  className = '',
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const config = statusConfig[status];

  const handleStatusChange = (newStatus: PostStatus) => {
    if (onClick) {
      onClick(newStatus);
    }
    setIsDropdownOpen(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (interactive) {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const handleBlur = () => {
    setTimeout(() => setIsDropdownOpen(false), 150);
  };

  if (!interactive) {
    return (
      <span className={`${styles.badge} ${styles[`badge__${config.color}`]} ${className}`}>
        <span className={styles.badge__icon}>{config.icon}</span>
        <span className={styles.badge__label}>{config.label}</span>
      </span>
    );
  }

  return (
    <div className={styles.status__wrapper}>
      <button
        className={`${styles.badge} ${styles[`badge__${config.color}`]} ${styles.badge__interactive} ${className}`}
        onClick={handleClick}
        onBlur={handleBlur}
        aria-haspopup="listbox"
        aria-expanded={isDropdownOpen}
      >
        <span className={styles.badge__icon}>{config.icon}</span>
        <span className={styles.badge__label}>{config.label}</span>
        <DropdownArrowIcon />
      </button>

      {isDropdownOpen && (
        <div className={styles.dropdown}>
          <div className={styles.dropdown__content}>
            {statusOptions.map((option) => {
              const optionConfig = statusConfig[option];
              return (
                <button
                  key={option}
                  className={`${styles.dropdown__item} ${
                    option === status ? styles.dropdown__item__active : ''
                  }`}
                  onClick={() => handleStatusChange(option)}
                >
                  <span className={styles.dropdown__icon}>{optionConfig.icon}</span>
                  <span className={styles.dropdown__label}>{optionConfig.label}</span>
                  {option === status && <CheckmarkIcon />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
