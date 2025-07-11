import React from 'react';
import { useMediaQuery } from '@mui/material';
import styles from './LogoSlider.module.scss';
import { businessImages } from '../../../assets/images.js';

const LogoSlider = React.memo(() => {
  const isSmallScreen = useMediaQuery('(max-width:768px)');
  const isMediumScreen = useMediaQuery('(max-width:900px)');

  const logos = [
    {
      src: businessImages.logoCharima,
      alt: 'logoCharima',
      name: 'logoCharima',
    },
    {
      src: businessImages.logoThatch,
      alt: 'logoThatch',
      name: 'logoThatch',
    },
    {
      src: businessImages.logoMolin,
      alt: 'logoMolin',
      name: 'logoMolin',
    },
    {
      src: businessImages.logoShopos2,
      alt: 'logoShopos2',
      name: 'logoShopos2',
    },
    {
      src: businessImages.logoTracxn,
      alt: 'logoTracxn',
      name: 'logoTracxn',
    },
    {
      src: businessImages.logoAltSchool,
      alt: 'logoAltSchool',
      name: 'logoAltSchool',
    },
    {
      src: businessImages.logoLuminous,
      alt: 'logoLuminous',
      name: 'logoLuminous',
    },
    {
      src: businessImages.logoUlesson,
      alt: 'logoUlesson',
      name: 'logoUlesson',
    },
  ];

  // Triple logos for seamless infinite scroll
  const tripleLogos = [...logos, ...logos, ...logos];

  return (
    <div className={styles.logoSliderSection}>
      {/* <div className={styles.logoSliderHeader}>
        <h2 className={styles.logoSliderTitle}>Trusted by Industry Leaders</h2>
        <p className={styles.logoSliderSubtitle}>
          We partner with the world&apos;s leading technology companies to deliver exceptional
          solutions
        </p>
      </div> */}

      <div className={styles.logos}>
        <div className={styles.logosSlide}>
          {tripleLogos.map((logo, index) => (
            <img
              key={`${logo.name}-${index}`}
              src={logo.src}
              alt={logo.alt}
              className={styles.logoImage}
              loading="lazy" // Lazy load for better LCP
              decoding="async" // Async decoding for better performance
              width="120" // Fixed width to prevent layout shift
              height="60" // Fixed height to prevent layout shift
            />
          ))}
        </div>
      </div>
    </div>
  );
});

LogoSlider.displayName = 'LogoSlider';

export default LogoSlider;
