import React, { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import styles from './GradientCard.module.scss';

interface GradientCardProps {
  imageSrc?: string;
  imagePosition?: 'left' | 'right';
  gofundmeUrl?: string;
}

const GradientCard: React.FC<GradientCardProps> = ({
  imageSrc,
  imagePosition = 'right',
  gofundmeUrl = 'https://gofund.me/a95d2b08',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'confirmation' | 'success'>('confirmation');
  const isLeft = imagePosition === 'left';

  const containerClass = `${styles['gradient-card']} ${
    isLeft ? styles['gradient-card--image-left'] : styles['gradient-card--image-right']
  }`;

  const fadeClass = isLeft
    ? styles['gradient-card__fade-right']
    : styles['gradient-card__fade-left'];

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('donation') === 'success') {
      setModalType('success');
      setIsModalOpen(true);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleCardClick = () => {
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
      <div className={containerClass} onClick={handleCardClick} style={{ cursor: 'pointer' }}>
        <div className={styles['gradient-card__text-content']}>Change a life now</div>

        {imageSrc && (
          <div className={styles['gradient-card__image-wrapper']}>
            <img src={imageSrc} alt="Donate Visual" loading="eager" />
            <div className={fadeClass} />
          </div>
        )}
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
    </>
  );
};

export default GradientCard;
