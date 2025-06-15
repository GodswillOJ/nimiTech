import React from 'react';
import styles from './GradientCard.module.scss';

interface GradientCardProps {
  imageSrc?: string;
  imagePosition?: 'left' | 'right';
}

const GradientCard: React.FC<GradientCardProps> = ({ imageSrc, imagePosition = 'right' }) => {
  const isLeft = imagePosition === 'left';

  const containerClass = `${styles['gradient-card']} ${
    isLeft ? styles['gradient-card--image-left'] : styles['gradient-card--image-right']
  }`;

  const fadeClass = isLeft
    ? styles['gradient-card__fade-right']
    : styles['gradient-card__fade-left'];

  return (
    <div className={containerClass}>
      <div className={styles['gradient-card__text-content']}>Donate with Us</div>

      {imageSrc && (
        <div className={styles['gradient-card__image-wrapper']}>
          <img src={imageSrc} alt="Donate Visual" />
          <div className={fadeClass} />
        </div>
      )}
    </div>
  );
};

export default GradientCard;
