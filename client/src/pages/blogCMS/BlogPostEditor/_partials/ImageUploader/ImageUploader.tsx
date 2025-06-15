import { FC, useRef } from 'react';
import { TrashIcon } from '../../../../../assets/blogCMS/icons/TrashIcon';
import styles from './ImageUploader.module.scss';

interface ImageUploaderProps {
  image: string | null;
  onImageChange: (url: string | null) => void;
}

export const ImageUploader: FC<ImageUploaderProps> = ({ image, onImageChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => onImageChange(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className={styles.uploader}>
      <h3 className={styles.uploader__title}>Featured Image</h3>

      {image ? (
        <div className={styles.uploader__preview}>
          <img src={image} alt="Featured" loading="lazy" />
          <button className={styles.uploader__remove} onClick={() => onImageChange(null)}>
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
          />
          <div
            className={styles.uploader__placeholder}
            onClick={() => fileInputRef.current?.click()}
          >
            <span className={styles.uploader__icon}>📸</span>
            <p>Click to upload featured image</p>
            <small>Max size: 5MB. Formats: JPG, PNG, GIF</small>
          </div>
        </>
      )}
    </div>
  );
};
