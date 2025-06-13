import React from 'react';
import styles from './SearchBar.module.scss';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
}) => {
  return (
    <div className={styles.search_bar}>
      <div className={styles.search_bar__input_wrapper}>
        <svg
          className={styles.search_bar__icon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={styles.search_bar__input}
        />
        {value && (
          <button onClick={() => onChange('')} className={styles.search_bar__clear} type="button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
