import React from 'react';
import { Button } from '../Button/Button';
import styles from './ConfirmDialog.module.scss';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'primary' | 'secondary' | 'danger';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <h2 id="dialog-title" className={styles.dialog__title}>
          {title}
        </h2>

        <p className={styles.dialog__message}>{message}</p>

        <div className={styles.dialog__actions}>
          <Button onClick={onCancel} variant="secondary" title={cancelText} />
          <Button onClick={onConfirm} variant={variant} title={confirmText} />
        </div>
      </div>
    </div>
  );
};
export default ConfirmDialog;
