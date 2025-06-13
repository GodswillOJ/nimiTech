import React from 'react';
import {
  PostStatus,
  PostCategory,
} from '../../../pages/blogCMS/BlogEditorDashboard/BlogEditorDashboard.types';
import styles from './FilterComponent.module.scss';

interface IFilterComponent {
  statusFilter: PostStatus | 'all';
  categoryFilter: string;
  categories: PostCategory[];
  sortBy: 'title' | 'createdAt' | 'updatedAt';
  sortOrder: 'asc' | 'desc';
  onStatusChange: (status: PostStatus | 'all') => void;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: 'title' | 'createdAt' | 'updatedAt') => void;
  onSortOrderChange: (order: 'asc' | 'desc') => void;
}

const FilterComponent: React.FC<IFilterComponent> = ({
  statusFilter,
  categoryFilter,
  categories,
  sortBy,
  sortOrder,
  onStatusChange,
  onCategoryChange,
  onSortChange,
  onSortOrderChange,
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: PostStatus.DRAFT, label: 'Draft' },
    { value: PostStatus.PUBLISHED, label: 'Published' },
    { value: PostStatus.SCHEDULED, label: 'Scheduled' },
    { value: PostStatus.ARCHIVED, label: 'Archived' },
  ];

  const sortOptions = [
    { value: 'title', label: 'Title' },
    { value: 'createdAt', label: 'Created Date' },
    { value: 'updatedAt', label: 'Updated Date' },
  ];

  return (
    <div className={styles.filter_bar}>
      <div className={styles.filter_bar__group}>
        <label className={styles.filter_bar__label}>Status</label>
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as PostStatus | 'all')}
          className={styles.filter_bar__select}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.filter_bar__group}>
        <label className={styles.filter_bar__label}>Category</label>
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value)}
          className={styles.filter_bar__select}
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.filter_bar__group}>
        <label className={styles.filter_bar__label}>Sort by</label>
        <div className={styles.filter_bar__sort_wrapper}>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as 'title' | 'createdAt' | 'updatedAt')}
            className={styles.filter_bar__select}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
            className={styles.filter_bar__sort_button}
            title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              {sortOrder === 'asc' ? (
                <path d="M7 10l5-5 5 5M7 14l5-5 5 5" />
              ) : (
                <path d="M7 14l5 5 5-5M7 10l5 5 5-5" />
              )}
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterComponent;
