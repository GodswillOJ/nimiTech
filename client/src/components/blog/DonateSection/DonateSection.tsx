import React, { useEffect, useState } from 'react';
import styles from './DonateSection.module.scss';

interface DonateSectionProps {
  images: string[];
  onDonateClick?: () => void;
}

const DonateSection: React.FC<DonateSectionProps> = ({ images, onDonateClick }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimate(true), 300);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section className={styles['donate-section']}>
      <div
        className={`${styles['donate-section__content']} ${
          animate ? styles['donate-section__content--visible'] : ''
        }`}
      >
        <p className={styles['donate-section__text']}>
          Millions of children in Africa face hunger daily. Here, your $1 makes all the difference.
          <p className={styles['donate-section__subText']}>
            Join Nimitech IT in turning technology into hope, one nutritious meal at a time.
          </p>
        </p>
        <button onClick={onDonateClick} className={styles['donate-section__button']}>
          Donate
        </button>
      </div>
      <div className={styles['donate-section__bento']}>
        {images.slice(0, 3).map((imgSrc, index) => (
          <div
            key={index}
            className={`${styles['donate-section__image']} ${styles[`donate-section__image--${index + 1}`]}`}
          >
            <img src={imgSrc} alt={`Child ${index + 1}`} loading="lazy" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default DonateSection;
