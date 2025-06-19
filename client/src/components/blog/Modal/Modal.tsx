import React from 'react';
import styles from './Modal.module.scss';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'confirmation' | 'success';
  title: string;
  content: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  showSecondaryButton?: boolean;
}

const ModalComp: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  type,
  title,
  content,
  primaryButtonText = 'Confirm',
  secondaryButtonText = 'Cancel',
  onPrimaryAction,
  onSecondaryAction,
  showSecondaryButton = true,
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handlePrimaryClick = () => {
    if (onPrimaryAction) {
      onPrimaryAction();
    }
    if (type === 'success') {
      onClose();
    }
  };

  const handleSecondaryClick = () => {
    if (onSecondaryAction) {
      onSecondaryAction();
    } else {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        {type === 'success' && (
          <div className={styles.successIcon}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="10" fill="#10B981" />
              <path
                d="M8.5 12.5l2 2 4.5-4.5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}

        <h2 className={styles.modalTitle}>{title}</h2>
        <p className={styles.modalText}>{content}</p>

        <div className={styles.modalActions}>
          {showSecondaryButton && type === 'confirmation' && (
            <button className={styles.secondaryButton} onClick={handleSecondaryClick}>
              {secondaryButtonText}
            </button>
          )}
          <button
            className={`${styles.primaryButton} ${type === 'success' ? styles.successButton : ''}`}
            onClick={handlePrimaryClick}
          >
            {primaryButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalComp;
