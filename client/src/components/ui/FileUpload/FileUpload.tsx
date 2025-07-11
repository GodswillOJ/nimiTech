import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import styles from './FileUpload.module.scss';

interface FileUploadProps {
  accept: string;
  maxSize: number;
  onUpload: (file: File) => void;
  label: string;
  required?: boolean;
  error?: string;
  uploaded?: boolean;
  fileName?: string;
  fileSize?: number;
  onRemove?: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  accept,
  maxSize,
  onUpload,
  label,
  required = false,
  error,
  uploaded = false,
  fileName,
  fileSize,
  onRemove,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize) {
      return `File size must be less than ${formatFileSize(maxSize)}`;
    }

    // Check file type
    const acceptedTypes = accept.split(',').map((type) => type.trim());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const mimeType = file.type;

    const isValidType = acceptedTypes.some((type) => {
      if (type.startsWith('.')) {
        return type === fileExtension;
      }
      return mimeType.match(type.replace('*', '.*'));
    });

    if (!isValidType) {
      return `Invalid file type. Accepted types: ${accept}`;
    }

    return null;
  };

  const handleFileSelect = (file: File) => {
    const error = validateFile(file);
    if (error) {
      alert(error);
      return;
    }
    onUpload(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const getFileIcon = () => {
    if (accept.includes('.pdf')) return '📄';
    if (accept.includes('.doc') || accept.includes('.docx')) return '📝';
    return '📎';
  };

  return (
    <div className={styles.fileUpload}>
      <label className={styles.fileUpload__label}>
        {label} {required && <span className={styles.required}>*</span>}
      </label>

      {!uploaded ? (
        <div
          className={`${styles.fileUpload__zone} ${
            isDragOver ? styles['fileUpload--dragover'] : ''
          } ${error ? styles['fileUpload--error'] : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className={styles.fileUpload__input}
          />

          <div className={styles.fileUpload__icon}>{getFileIcon()}</div>

          <div className={styles.fileUpload__text}>
            Drop your {label.toLowerCase()} here or{' '}
            <span className={styles.fileUpload__link}>browse</span>
          </div>

          <div className={styles.fileUpload__subtext}>
            Max file size: {formatFileSize(maxSize)}. Accepted formats: {accept}
          </div>
        </div>
      ) : (
        <div className={`${styles.fileUpload__preview} ${styles['fileUpload--success']}`}>
          <div className={styles.fileUpload__previewItem}>
            <div className={styles.fileUpload__previewIcon}>{getFileIcon()}</div>
            <div className={styles.fileUpload__previewDetails}>
              <div className={styles.fileUpload__previewName}>{fileName}</div>
              <div className={styles.fileUpload__previewSize}>
                {fileSize && formatFileSize(fileSize)}
              </div>
            </div>
            {onRemove && (
              <button type="button" onClick={onRemove} className={styles.fileUpload__previewRemove}>
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {error && <div className={styles.fileUpload__error}>{error}</div>}
    </div>
  );
};

export default FileUpload;
