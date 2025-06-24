import React, { useState, useCallback, useRef, ReactNode } from 'react';
import { useUploadBlogImageMutation } from '../../../services/utilis/blogApiService';

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
  type: 'featuredImage' | 'contentImage' | 'authorAvatar' | 'image';
  maxFileSize?: number; // in MB
  acceptedFormats?: string[];
  className?: string;
  disabled?: boolean;
  currentImageUrl?: string;
  showPreview?: boolean;
}

interface UploadError {
  status?: string | number;
  data?: {
    message?: string;
    error?: string;
  };
  message?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUploaded,
  type,
  maxFileSize = 5, // 5MB default
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  className = '',
  disabled = false,
  currentImageUrl,
  showPreview = true,
}) => {
  const [uploadImage, { isLoading, error }] = useUploadBlogImageMutation();
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      // Check file type
      if (!acceptedFormats.includes(file.type)) {
        return `Please select a valid image format: ${acceptedFormats.map((format) => format.split('/')[1]).join(', ')}`;
      }

      // Check file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxFileSize) {
        return `File size must be less than ${maxFileSize}MB`;
      }

      return null;
    },
    [acceptedFormats, maxFileSize]
  );

  const processFile = useCallback(
    async (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        console.error('File validation failed:', validationError);
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreviewUrl(e.target.result as string);
        }
      };
      reader.onerror = () => {
        console.error('Failed to read file for preview');
      };
      reader.readAsDataURL(file);

      try {
        const result = await uploadImage({ image: file, type }).unwrap();

        if (result?.imageUrl) {
          onImageUploaded(result.imageUrl);
        } else {
          console.error('No image URL returned from upload');
        }
      } catch (uploadError) {
        console.error('Failed to upload image:', uploadError);
        // Reset preview on upload failure
        setPreviewUrl(currentImageUrl || null);
      }
    },
    [uploadImage, type, onImageUploaded, validateFile, currentImageUrl]
  );

  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      await processFile(file);

      // Reset input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [processFile]
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (!disabled && !isLoading) {
        setDragOver(true);
      }
    },
    [disabled, isLoading]
  );

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(
    async (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setDragOver(false);

      if (disabled || isLoading) return;

      const files = Array.from(event.dataTransfer.files);
      const imageFile = files.find((file) => file.type.startsWith('image/'));

      if (imageFile) {
        await processFile(imageFile);
      }
    },
    [disabled, isLoading, processFile]
  );

  const handleClick = useCallback(() => {
    if (!disabled && !isLoading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled, isLoading]);

  const formatTypeName = useCallback((type: string): string => {
    return type
      .replace(/([A-Z])/g, ' $1')
      .toLowerCase()
      .trim();
  }, []);

  const getErrorMessage = useCallback((error: unknown): React.ReactNode => {
    if (typeof error === 'string') return error;

    const uploadError = error as UploadError;
    if (uploadError?.data?.message) return String(uploadError.data.message);
    if (uploadError?.data?.error) return String(uploadError.data.error);
    if (uploadError?.message) return String(uploadError.message);

    return 'Upload failed. Please try again.';
  }, []);

  const getAcceptString = useCallback(() => {
    return acceptedFormats.join(',');
  }, [acceptedFormats]);

  return (
    <div className={`image-upload ${className}`}>
      <div
        className={`upload-area ${dragOver ? 'drag-over' : ''} ${disabled || isLoading ? 'disabled' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={`Upload ${formatTypeName(type)}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={getAcceptString()}
          onChange={handleFileSelect}
          disabled={disabled || isLoading}
          id={`image-upload-${type}`}
          style={{ display: 'none' }}
          aria-hidden="true"
        />

        <div className="upload-content">
          {isLoading ? (
            <div className="upload-loading">
              <div className="spinner" />
              <span>Uploading...</span>
            </div>
          ) : (
            <>
              <div className="upload-icon">📁</div>
              <div className="upload-text">
                <span className="primary-text">Click to upload {formatTypeName(type)}</span>
                <span className="secondary-text">or drag and drop</span>
                <span className="format-text">
                  {acceptedFormats.map((format) => format.split('/')[1].toUpperCase()).join(', ')}{' '}
                  up to {maxFileSize}MB
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {showPreview && previewUrl && (
        <div className="preview">
          <img
            src={previewUrl}
            alt={`${formatTypeName(type)} preview`}
            style={{
              maxWidth: '200px',
              maxHeight: '200px',
              objectFit: 'cover',
              borderRadius: '4px',
            }}
            onError={() => {
              console.error('Failed to load preview image');
              setPreviewUrl(null);
            }}
          />
          {previewUrl !== currentImageUrl && <div className="preview-badge">New</div>}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
