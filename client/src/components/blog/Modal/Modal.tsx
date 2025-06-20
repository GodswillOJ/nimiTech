import React from 'react';
import styles from './Modal.module.scss';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'confirmation' | 'success';
  title?: string;
  content?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  showSecondaryButton?: boolean;
  customContent?: React.ReactNode;
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
  customContent,
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

        {customContent ? (
          customContent
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default ModalComp;
