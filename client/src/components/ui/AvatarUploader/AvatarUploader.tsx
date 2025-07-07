import { FC, useRef, useState } from 'react';
import { useToast } from '../../../hooks/useToast';
import { getImageUrl } from '../../../utils/envUtils';
import styles from './AvatarUploader.module.scss';

interface AvatarUploaderProps {
  avatar: string | null;
  onAvatarChange: (url: string | null) => void;
  onUpload: (file: File) => Promise<void>;
  isUploading?: boolean;
  error?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const AvatarUploader: FC<AvatarUploaderProps> = ({
  avatar,
  onAvatarChange,
  onUpload,
  isUploading = false,
  error,
  size = 'medium',
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const toast = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file type', 'Please select a valid image file');
      return;
    }

    // Validate file size (5MB max for avatar)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large', 'Image size must be less than 5MB');
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewUrl(result);
      onAvatarChange(result); // Update with preview immediately
    };
    reader.readAsDataURL(file);

    try {
      // Upload to server
      await onUpload(file);
      setPreviewUrl(null); // Clear preview since we now have the server URL
    } catch (error) {
      // On error, clear the preview
      setPreviewUrl(null);
      onAvatarChange(avatar); // Revert to original avatar
    }

    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveAvatar = () => {
    onAvatarChange(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  const currentAvatar = previewUrl || avatar;
  const sizeClass = styles[`avatar_uploader--${size}`];

  // Ensure proper URL handling for display
  const displayAvatarUrl =
    currentAvatar && !currentAvatar.startsWith('data:')
      ? currentAvatar.startsWith('http')
        ? currentAvatar
        : getImageUrl(currentAvatar)
      : currentAvatar;

  return (
    <div className={`${styles.avatar_uploader} ${sizeClass} ${className}`}>
      <div className={styles.avatar_container}>
        <div className={styles.avatar}>
          {displayAvatarUrl ? (
            <img
              src={displayAvatarUrl}
              alt="Avatar"
              loading="lazy"
              decoding="async"
              className={styles.avatar_image}
            />
          ) : (
            <div className={styles.avatar_placeholder}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          )}

          {isUploading && (
            <div className={styles.upload_overlay}>
              <div className={styles.spinner}>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="32"
                    strokeLinecap="round"
                    className={styles.spinning_circle}
                  />
                </svg>
              </div>
            </div>
          )}
        </div>

        <div className={styles.controls}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className={styles.file_input}
            id="avatar-upload"
            disabled={isUploading}
          />

          <label
            htmlFor="avatar-upload"
            className={`${styles.upload_btn} ${isUploading ? styles.disabled : ''}`}
          >
            {isUploading ? 'Uploading...' : 'Change Avatar'}
          </label>

          {currentAvatar && !isUploading && (
            <button
              type="button"
              onClick={handleRemoveAvatar}
              className={styles.remove_btn}
              title="Remove avatar"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="3,6 5,6 21,6"></polyline>
                <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
              </svg>
            </button>
          )}
        </div>
      </div>

      {error && <div className={styles.error_message}>{error}</div>}

      <div className={styles.upload_info}>
        <small>Max size: 5MB • Formats: JPG, PNG, GIF</small>
      </div>
    </div>
  );
};
