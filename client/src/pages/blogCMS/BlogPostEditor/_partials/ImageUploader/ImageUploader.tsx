import { FC, useRef, useState } from 'react';
import { TrashIcon } from '../../../../../assets/blogCMS/icons/TrashIcon';
import { useUploadBlogImageMutation } from '../../../../../services/utilis/blogApiService';
import { useToast } from '../../../../../hooks/useToast';
import styles from './ImageUploader.module.scss';

interface ImageUploaderProps {
  image: string | null;
  onImageChange: (url: string | null) => void;
  error?: string;
}

export const ImageUploader: FC<ImageUploaderProps> = ({ image, onImageChange, error }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadBlogImage] = useUploadBlogImageMutation();
  const toast = useToast();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file type', 'Please select a valid image file');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error('File too large', 'Image size must be less than 8MB');
      return;
    }

    setIsUploading(true);

    try {
      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (e) => onImageChange(e.target?.result as string);
      reader.readAsDataURL(file); // Upload to server
      const result = await uploadBlogImage({ image: file, type: 'featured' }).unwrap();

      if (result.success && result.imageUrl) {
        onImageChange(result.imageUrl);
        toast.success('Image uploaded', 'Featured image uploaded successfully');
      } else if (result.url) {
        // Handle different response format
        onImageChange(result.url);
        toast.success('Image uploaded', 'Featured image uploaded successfully');
      } else {
        throw new Error('Upload failed - no URL returned');
      }
    } catch (error: any) {
      console.error('Image upload error:', error);
      toast.error(
        'Upload failed',
        error?.data?.message || 'Failed to upload image. Please try again.'
      );
      onImageChange(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    onImageChange(null);
    toast.info('Image removed', 'Featured image has been removed');
  };

  return (
    <div className={styles.uploader}>
      <h3 className={styles.uploader__title}>Featured Image</h3>

      {image ? (
        <div className={styles.uploader__preview}>
          <img src={image} alt="Featured" loading="lazy" />
          <button
            className={styles.uploader__remove}
            onClick={handleRemoveImage}
            disabled={isUploading}
          >
            <TrashIcon />
          </button>
        </div>
      ) : (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className={styles.uploader__input}
            disabled={isUploading}
          />
          <div
            className={`${styles.uploader__placeholder} ${isUploading ? styles.uploading : ''} ${error ? styles.error : ''}`}
            onClick={() => !isUploading && fileInputRef.current?.click()}
          >
            <span className={styles.uploader__icon}>{isUploading ? '⏳' : '📸'}</span>
            <p>{isUploading ? 'Uploading...' : 'Click to upload featured image'}</p>
            <small>Max size: 8MB. Formats: JPG, PNG, GIF</small>
          </div>
        </>
      )}
      {error && <div className={styles.uploader__error}>{error}</div>}
    </div>
  );
};
