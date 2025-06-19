import React, { useEffect, useState } from 'react';
import Modal from '../Modal/Modal';
import styles from './DonateSection.module.scss';

interface DonateSectionProps {
  images: string[];
  gofundmeUrl?: string;
}

const DonateSection: React.FC<DonateSectionProps> = ({
  images,
  gofundmeUrl = 'https://gofundme.com/your-campaign', // Default URL, replace with actual
}) => {
  const [animate, setAnimate] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'confirmation' | 'success'>('confirmation');

  useEffect(() => {
    const timeout = setTimeout(() => setAnimate(true), 300);
    return () => clearTimeout(timeout);
  }, []);

  // Check if user returned from GoFundMe (you can customize this logic)
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
    <>
      <section className={styles['donate-section']}>
        <div
          className={`${styles['donate-section__content']} ${
            animate ? styles['donate-section__content--visible'] : ''
          }`}
        >
          <div className={styles['donate-section__text']}>
            Millions of children in Africa face hunger daily. Here, your $1 makes all the
            difference.
            <p className={styles['donate-section__subText']}>
              Join Nimitech IT in turning technology into hope, one nutritious meal at a time.
            </p>
          </div>
          <button onClick={handleDonateClick} className={styles['donate-section__button']}>
            Make a donation
          </button>
        </div>
        <div className={styles['donate-section__bento']}>
          {images.slice(0, 3).map((imgSrc, index) => (
            <div
              key={index}
              className={`${styles['donate-section__image']} ${styles[`donate-section__image--${index + 1}`]}`}
            >
              <img src={imgSrc} alt={`Child ${index + 1}`} loading="eager" />
            </div>
          ))}
        </div>
      </section>

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
    </>
  );
};

export default DonateSection;
