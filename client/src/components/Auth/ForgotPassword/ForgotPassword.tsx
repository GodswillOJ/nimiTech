import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft } from '../../../assets/blogCMS/icons/AuthIcons';
import { getApiBaseUrl } from '../../../utils/envUtils';
import styles from '../AuthFlow.module.scss';
import ModalComp from '../../blog/Modal/Modal';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (result.success) {
        setShowSuccessModal(true);
      } else {
        setError(result.message || 'Failed to send reset code. Please try again.');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const handleSuccessConfirm = () => {
    setShowSuccessModal(false);
    navigate(`/auth/verify-otp?email=${encodeURIComponent(email)}`);
  };

  const handleBackToLogin = () => {
    navigate('/auth');
  };

  return (
    <>
      <div className={styles.auth}>
        <div className={styles.auth__container}>
          <div className={styles.auth__card}>
            <div className={styles.auth__header}>
              <button
                onClick={handleBackToLogin}
                className={styles.auth__back_button}
                type="button"
              >
                <ArrowLeft className={styles.auth__back_icon} />
              </button>
              <div className={styles.auth__avatar}>
                <Mail className={styles.auth__avatar_icon} />
              </div>
              <h2 className={styles.auth__title}>Forgot Password</h2>
              <p className={styles.auth__subtitle}>
                Enter your email address and we&apos;ll send you a 4-digit verification code to
                reset your password.
              </p>
            </div>

            <form className={styles.auth__form} onSubmit={handleSubmit}>
              {error && <div className={styles.auth__error}>{error}</div>}

              <div className={styles.auth__input_wrapper}>
                <Mail className={styles.auth__input_icon} />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={handleInputChange}
                  className={styles.auth__input}
                  disabled={isLoading}
                />
              </div>

              <button type="submit" className={styles.auth__submit} disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Verification Code'}
              </button>

              <div className={styles.auth__toggle_mode}>
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className={styles.auth__toggle_link}
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <ModalComp
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        type="success"
        title="Verification Code Sent!"
        content={`We've sent a 4-digit verification code to ${email}. Please check your email and enter the code on the next screen.`}
        primaryButtonText="Continue"
        onPrimaryAction={handleSuccessConfirm}
      />
    </>
  );
}
