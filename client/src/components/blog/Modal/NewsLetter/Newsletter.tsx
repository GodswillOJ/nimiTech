import React, { useState } from 'react';
import Modal from '../Modal';
import styles from './Newsletter.module.scss';

export interface NewsletterProps {
  isOpen: boolean;
  onClose: () => void;
}

const Newsletter: React.FC<NewsletterProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});

  const tempEmailDomains = [
    '10minutemail.com',
    'tempmail.org',
    'guerrillamail.com',
    'mailinator.com',
    'yopmail.com',
    'temp-mail.org',
    'getairmail.com',
    'sharklasers.com',
    'throwaway.email',
    'maildrop.cc',
    'trashmail.com',
    'dispostable.com',
    'emailondeck.com',
    'mohmal.com',
    'mytrashmail.com',
  ];

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    const domain = email.split('@')[1]?.toLowerCase();
    if (tempEmailDomains.includes(domain)) return 'Temporary email addresses are not allowed';
    return null;
  };

  const handleSubmit = () => {
    const emailError = validateEmail(email);
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowThankYou(true);
    }, 1500);
  };

  const handleClose = () => {
    setEmail('');
    setErrors({});
    setShowThankYou(false);
    setIsSubmitting(false);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSubmitting) handleSubmit();
  };

  if (showThankYou) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        type="success"
        title="Welcome Aboard! 🎉"
        content="Thank you for subscribing to our newsletter! You'll start receiving our latest content and exclusive insights in your inbox soon."
        primaryButtonText="Continue Reading"
        showSecondaryButton={false}
      />
    );
  }

  const content = (
    <div className={styles.newsletter}>
      <div className={styles.newsletter__icon}>
        <svg
          width="56"
          height="56"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            stroke="#6366f1"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2 className={styles.newsletter__title}>Subscribe to Our Newsletter</h2>
      <p className={styles.newsletter__text}>
        Get the latest insights, tips, and updates delivered straight to your inbox. Join our
        community of readers and never miss out on valuable content!
      </p>
      <div className={styles.newsletter__form}>
        <input
          type="email"
          className={`${styles.newsletter__input} ${errors.email ? styles['newsletter__input--error'] : ''}`}
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isSubmitting}
        />
        <button
          className={styles.newsletter__submit}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? <div className={styles.newsletter__spinner}></div> : 'Subscribe'}
        </button>
      </div>
      {errors.email && <p className={styles.newsletter__error}>{errors.email}</p>}
      {/* <div className={styles.newsletter__features}>
        <div className={styles.newsletter__feature}>
          <span className={styles.newsletter__check}>✓</span> Weekly curated content
        </div>
        <div className={styles.newsletter__feature}>
          <span className={styles.newsletter__check}>✓</span> Exclusive insights & tips
        </div>
        <div className={styles.newsletter__feature}>
          <span className={styles.newsletter__check}>✓</span> Unsubscribe anytime
        </div>
      </div> */}
      <p className={styles.newsletter__disclaimer}>
        We respect your privacy. No spam, just valuable content.
      </p>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={handleClose} type="confirmation" customContent={content} />
  );
};

export default Newsletter;
