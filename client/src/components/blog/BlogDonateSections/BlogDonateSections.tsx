// DonationSection.tsx
import React, { useState, useEffect } from 'react';
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
  gofundmeUrl = 'https://gofundme.com/your-campaign',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'confirmation' | 'success'>('confirmation');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('donation') === 'success') {
      setModalType('success');
      setIsModalOpen(true);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

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
    <section className={`${styles.donationSection} ${className}`}>
      <div className={styles.donationSection__container}>
        <h2 className={styles.donationSection__title}>{title}</h2>

        <div className={styles.donationSection__content}>
          <div className={styles.donationSection__info}>
            <div className={styles.donationSection__perks}>
              <ul className={styles.donationSection__perksList}>
                {perks.map((perk, index) => (
                  <li key={index} className={styles.donationSection__perkItem}>
                    <span className={styles.donationSection__perkTitle}>{perk.title} –</span>
                    <span className={styles.donationSection__perkDescription}>
                      {perk.description}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.donationSection__stats}>
              {stats.map((stat, index) => (
                <div key={index} className={styles.donationSection__statItem}>
                  <div className={styles.donationSection__statNumber}>{stat.number}</div>
                  <div className={styles.donationSection__statLabel}>{stat.label}</div>
                </div>
              ))}
            </div>

            <div className={styles.donationSection__callToAction}>
              <Button className={styles.donationSection__donateButton} onClick={handleDonateClick}>
                Donate Now
              </Button>
            </div>
          </div>

          <div className={styles.donationSection__imageGrid}>
            {images.map((image, index) => (
              <div key={index} className={styles.donationSection__imageItem}>
                <img
                  src={image}
                  alt={`Donation impact ${index + 1}`}
                  className={styles.donationSection__image}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

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
    </section>
  );
};

export default BlogDonateSections;
