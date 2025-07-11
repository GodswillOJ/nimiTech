import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './BlogDonateSections.module.scss';
import { Button } from '../../../components/blogCMS/Button/Button';
import Modal from '../Modal/Modal';

// Import donation images from assets
import donationImage2 from '../../../assets/blog/images/donationImage2.jpg';
import donationImage4 from '../../../assets/blog/images/donationImage4.jpg';
import donationImage5 from '../../../assets/blog/images/donationImage5.jpg';
import donationImage6 from '../../../assets/blog/images/donationImage6.jpg';
import donationImage1 from '../../../assets/blog/images/donationImage1.jpg';

interface StatItem {
  number: string;
  label: string;
}

interface PerkItem {
  title: string;
  description: string;
}

interface DonationSectionProps {
  title?: string;
  perks?: PerkItem[];
  stats?: StatItem[];
  images?: string[];
  className?: string;
  gofundmeUrl?: string;
}

const defaultPerks: PerkItem[] = [
  {
    title: 'Verified Partners',
    description: 'Work directly with trusted organizations serving African communities.',
  },
  {
    title: '100% Transparency',
    description: 'Track your impact with detailed reports on how donations help children.',
  },
  {
    title: 'Monthly Support',
    description: 'Join our monthly giving program to provide consistent aid to families.',
  },
];

const defaultStats: StatItem[] = [
  { number: '15,000+', label: 'Children Helped' },
  { number: '25+', label: 'African Communities' },
];

const donationImages: string[] = [
  donationImage2,
  donationImage4,
  donationImage5,
  donationImage6,
  donationImage1,
];

export const BlogDonateSections: React.FC<DonationSectionProps> = ({
  title = '',
  perks = defaultPerks,
  stats = defaultStats,
  images = donationImages,
  className = '',
  gofundmeUrl = 'https://gofund.me/a95d2b08',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'confirmation' | 'success'>('confirmation');

  // Optimized Framer Motion animation variants for faster loading
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
        delayChildren: 0,
      },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut' as const,
      },
    },
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut' as const,
      },
    },
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut' as const,
      },
    },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut' as const,
      },
    },
  };

  const imageStagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut' as const,
      },
    },
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('donation') === 'success') {
      setModalType('success');
      setIsModalOpen(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Preload critical images for better performance
    images.slice(0, 3).forEach((imageSrc) => {
      const img = new Image();
      img.src = imageSrc;
    });
  }, [images]);

  const handleDonateClick = () => {
    setModalType('confirmation');
    setIsModalOpen(true);
  };

  const handleConfirmDonation = () => {
    // Redirect to GoFundMe with return URL
    const returnUrl = `${window.location.origin}${window.location.pathname}?donation=success`;
    const gofundmeWithReturn = `${gofundmeUrl}?utm_source=website&return_url=${encodeURIComponent(returnUrl)}`;
    window.open(gofundmeWithReturn, '_blank');
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  return (
    <motion.section
      className={`${styles.donationSection} ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
    >
      <motion.div className={styles.donationSection__container} variants={fadeInUp}>
        <motion.h2 className={styles.donationSection__title} variants={fadeInUp}>
          Help Feed Hungry Kids in Africa — Support Nimitech&apos;s Fight Against Malnutrition.
        </motion.h2>

        <motion.div className={styles.donationSection__content} variants={containerVariants}>
          <motion.div className={styles.donationSection__info} variants={fadeInLeft}>
            <motion.div className={styles.donationSection__perks} variants={containerVariants}>
              <motion.ul className={styles.donationSection__perksList} variants={containerVariants}>
                {perks.map((perk, index) => (
                  <motion.li
                    key={index}
                    className={styles.donationSection__perkItem}
                    variants={fadeInUp}
                    whileHover={{
                      x: 5,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <span className={styles.donationSection__perkTitle}>{perk.title} –</span>
                    <span className={styles.donationSection__perkDescription}>
                      {perk.description}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

            <motion.div className={styles.donationSection__stats} variants={containerVariants}>
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className={styles.donationSection__statItem}
                  variants={scaleIn}
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.2 },
                  }}
                >
                  <div className={styles.donationSection__statNumber}>{stat.number}</div>
                  <div className={styles.donationSection__statLabel}>{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div className={styles.donationSection__callToAction} variants={scaleIn}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  className={styles.donationSection__donateButton}
                  onClick={handleDonateClick}
                >
                  Donate Now
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div className={styles.donationSection__imageGrid} variants={imageStagger}>
            {images.map((image, index) => (
              <motion.div
                key={index}
                className={styles.donationSection__imageItem}
                variants={imageVariants}
                whileHover={{
                  scale: 1.05,
                  zIndex: 10,
                  transition: { duration: 0.3 },
                }}
              >
                <img
                  src={image}
                  alt={`Donation impact ${index + 1}`}
                  className={styles.donationSection__image}
                  loading="lazy"
                  style={{
                    willChange: 'transform',
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        type={modalType}
        title={modalType === 'confirmation' ? 'Confirm Your Donation' : 'Thank You!'}
        content={
          modalType === 'confirmation'
            ? 'You will be redirected to GoFundMe to complete your donation. Every contribution helps provide nutritious meals to children in need.'
            : 'Your generous donation will help provide nutritious meals to children in Africa. Thank you for making a difference!'
        }
        primaryButtonText={modalType === 'confirmation' ? 'Continue to GoFundMe' : 'Close'}
        secondaryButtonText="Cancel"
        onPrimaryAction={modalType === 'confirmation' ? handleConfirmDonation : undefined}
        showSecondaryButton={modalType === 'confirmation'}
      />
    </motion.section>
  );
};

export default BlogDonateSections;
