import React from 'react';
import { useMediaQuery } from '@mui/material';
import styles from './TestimonialsSlider.module.scss';

const TestimonialsSlider = ({ testimonials }) => {
  const isSmallScreen = useMediaQuery('(max-width:768px)');
  const isMediumScreen = useMediaQuery('(max-width:900px)');

  // Triple testimonials for seamless infinite scroll
  const tripleTestimonials = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section className={styles.testimonialsSection}>
      <div className={styles.testimonialsHeader}>
        <span className={styles.testimonialsLabel}>Client Reviews</span>
        <h2 className={styles.testimonialsTitle}>
          Don&lsquo;t take our word for it!
          <br />
          <span className={styles.testimonialsSubtitle}>Hear it from our partners.</span>
        </h2>
      </div>

      <div className={styles.testimonialsContainer}>
        <div className={styles.testimonialsSlide}>
          {tripleTestimonials.map((testimonial, index) => (
            <div key={`${testimonial.name}-${index}`} className={styles.testimonialCard}>
              {/* Quote Icon */}
              <div className={styles.quoteIcon}>&quot;</div>

              {/* Profile Section */}
              <div className={styles.profileSection}>
                <div className={styles.profileInitial}>
                  {testimonial.name.charAt(0).toUpperCase()}
                </div>
                <div className={styles.profileInfo}>
                  <h4 className={styles.profileName}>{testimonial.name}</h4>
                  <p className={styles.profileRole}>{testimonial.course}</p>
                </div>
              </div>

              {/* Review Text */}
              <p className={styles.reviewText}>&quot;{testimonial.review}&quot;</p>

              {/* Rating Stars */}
              <div className={styles.ratingStars}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={styles.star}>
                    ★
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSlider;
