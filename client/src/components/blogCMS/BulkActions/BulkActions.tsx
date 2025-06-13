import React, { useState, useRef, useEffect } from 'react';
import styles from './BulkActions.module.scss';
import { PostStatus } from '../../../pages/blogCMS/BlogEditorDashboard/BlogEditorDashboard.types';
import { DeleteIcon, MoreVerticalIcon } from '../../../assets/blogCMS/icons/BulkActionIcons';

interface StatusOption {
  value: PostStatus;
  label: string;
  description: string;
}

interface BulkActionsProps {
  selectedCount: number;
  onDelete: () => void;
  onUpdateStatus: (status: PostStatus) => void;
  onClearSelection: () => void;
}

export const BulkActions: React.FC<BulkActionsProps> = ({
  selectedCount,
  onDelete,
  onUpdateStatus,
  onClearSelection,
}) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const statusOptions: StatusOption[] = [
    {
      value: PostStatus.DRAFT,
      label: 'Mark as Draft',
      description: 'Save as draft for later',
    },
    {
      value: PostStatus.PUBLISHED,
      label: 'Publish',
      description: 'Make posts publicly visible',
    },
    {
      value: PostStatus.SCHEDULED,
      label: 'Schedule',
      description: 'Set future publish date',
    },
    {
      value: PostStatus.ARCHIVED,
      label: 'Archive',
      description: 'Move to archives',
    },
  ];

  useEffect(() => {
    if (!showStatusMenu) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setShowStatusMenu(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowStatusMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showStatusMenu]);

  const handleStatusUpdate = (status: PostStatus): void => {
    onUpdateStatus(status);
    setShowStatusMenu(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, status?: PostStatus): void => {
    const isSpaceOrEnter = e.key === 'Enter' || e.key === ' ';
    if (!isSpaceOrEnter) return;

    e.preventDefault();
    if (status) {
      handleStatusUpdate(status);
    } else {
      setShowStatusMenu(!showStatusMenu);
    }
  };

  return (
    <div className={styles.bulk_actions} role="region" aria-label="Bulk actions">
      <div className={styles.bulk_actions__info}>
        <span className={styles.bulk_actions__count} role="status">
          {selectedCount} {selectedCount === 1 ? 'post' : 'posts'} selected
        </span>
      </div>

      <div className={styles.bulk_actions__controls}>
        <div className={styles.bulk_actions__dropdown}>
          <button
            ref={buttonRef}
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            onKeyDown={(e) => handleKeyDown(e)}
            className={styles.bulk_actions__button}
            aria-haspopup="true"
            aria-expanded={showStatusMenu}
            aria-controls="status-menu"
          >
            <MoreVerticalIcon />
            <span>Update Status</span>
          </button>

          {showStatusMenu && (
            <div ref={menuRef} id="status-menu" className={styles.bulk_actions__menu} role="menu">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleStatusUpdate(option.value)}
                  onKeyDown={(e) => handleKeyDown(e, option.value)}
                  className={styles.bulk_actions__menu_item}
                  role="menuitem"
                  aria-description={option.description}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={onDelete}
          className={`${styles.bulk_actions__button} ${styles.bulk_actions__button_danger}`}
          aria-label={`Delete ${selectedCount} selected ${selectedCount === 1 ? 'post' : 'posts'}`}
        >
          <DeleteIcon />
          <span>Delete</span>
        </button>

        <button
          onClick={onClearSelection}
          className={styles.bulk_actions__button}
          aria-label="Clear all selections"
        >
          Clear Selection
        </button>
      </div>
    </div>
  );
};
