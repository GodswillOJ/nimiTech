import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import styles from './Newsletter.module.scss';
import { useSubscribeToNewsletterMutation } from '../../../../services/utilis/newsletterApiService';
import {
  markUserSubscribed,
  markNewsletterModalDismissed,
} from '../../../../utils/newsletterUtils';
import { useToast } from '../../../../hooks/useToast';

export interface NewsletterProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onDismiss?: () => void;
}

const Newsletter: React.FC<NewsletterProps> = ({ isOpen, onClose, onSuccess, onDismiss }) => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; firstName?: string }>({});

  const [subscribeToNewsletter, { isLoading: isSubmitting }] = useSubscribeToNewsletterMutation();
  const toast = useToast();

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

  const validateFirstName = (firstName: string) => {
    if (!firstName || firstName.trim().length < 2)
      return 'First name must be at least 2 characters';
    return null;
  };

  const handleSubmit = async () => {
    const emailError = validateEmail(email);
    const firstNameError = validateFirstName(firstName);

    if (emailError || firstNameError) {
      setErrors({
        email: emailError || undefined,
        firstName: firstNameError || undefined,
      });
      return;
    }

    setErrors({});
    try {
      const result = await subscribeToNewsletter({
        firstName: firstName.trim(),
        email: email.trim().toLowerCase(),
        subscriptionSource: 'modal',
      }).unwrap();

      // Mark user as subscribed in localStorage
      markUserSubscribed(email.trim().toLowerCase());

      setShowThankYou(true);
      toast.success('Successfully subscribed!', 'Welcome to our newsletter community!');
      onSuccess?.();
    } catch (error: any) {
      console.error('Newsletter subscription error:', error);

      let errorMessage = 'Subscription failed. Please try again.';

      if (error?.data?.message) {
        errorMessage = error.data.message;
        // If user is already subscribed, mark them as such
        if (error.data.message.includes('already subscribed')) {
          markUserSubscribed(email.trim().toLowerCase());
          toast.info('Already subscribed', 'You are already part of our newsletter community!');
          return;
        }
      }

      setErrors({
        email: errorMessage,
      });
      toast.error('Subscription failed', errorMessage);
    }
  };

  const handleClose = () => {
    setEmail('');
    setFirstName('');
    setErrors({});
    setShowThankYou(false);

    // Mark modal as dismissed if user closed without subscribing
    if (!showThankYou) {
      markNewsletterModalDismissed();
      onDismiss?.();
    }

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
          type="text"
          className={`${styles.newsletter__input} ${errors.firstName ? styles['newsletter__input--error'] : ''}`}
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isSubmitting}
        />
        {errors.firstName && <p className={styles.newsletter__error}>{errors.firstName}</p>}
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
