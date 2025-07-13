import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, ArrowLeft } from '../../../assets/blogCMS/icons/AuthIcons';
import { getApiBaseUrl } from '../../../utils/envUtils';
import styles from '../AuthFlow.module.scss';
import verifyStyles from './VerifyOTP.module.scss';

export default function VerifyOTP() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const email = searchParams.get('email') || '';

  useEffect(() => {
    // Auto-focus first input
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    // Start resend timer
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (error) setError('');

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedDigits = pastedData.replace(/\D/g, '').slice(0, 4);

    if (pastedDigits.length === 4) {
      setOtp(pastedDigits.split(''));
      inputRefs.current[3]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpCode = otp.join('');
    if (otpCode.length !== 4) {
      setError('Please enter the complete 4-digit code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp: otpCode }),
      });

      const result = await response.json();

      if (result.success) {
        // Store token securely in sessionStorage with timestamp for expiration
        sessionStorage.setItem('resetToken', result.resetToken);
        sessionStorage.setItem('resetTokenTimestamp', Date.now().toString());

        navigate('/auth/reset-password');
      } else {
        setError(result.message || 'Invalid verification code. Please try again.');
        // Clear OTP and focus first input
        setOtp(['', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0 || isResending) return;

    setIsResending(true);
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
        setResendTimer(60); // 60 seconds cooldown
        setOtp(['', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        setError(result.message || 'Failed to resend code. Please try again.');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToForgotPassword = () => {
    navigate('/auth/forgot-password');
  };

  return (
    <div className={styles.auth}>
      <div className={styles.auth__container}>
        <div className={styles.auth__card}>
          <div className={styles.auth__header}>
            <button
              onClick={handleBackToForgotPassword}
              className={styles.auth__back_button}
              type="button"
            >
              <ArrowLeft className={styles.auth__back_icon} />
            </button>
            <div className={styles.auth__avatar}>
              <Lock className={styles.auth__avatar_icon} />
            </div>
            <h2 className={styles.auth__title}>Enter Verification Code</h2>
            <p className={styles.auth__subtitle}>
              We sent a 4-digit code to
              <br />
              <strong>{email}</strong>
            </p>
          </div>

          <form className={styles.auth__form} onSubmit={handleSubmit}>
            {error && <div className={styles.auth__error}>{error}</div>}

            <div className={verifyStyles.otp_container}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className={verifyStyles.otp_input}
                  disabled={isLoading}
                />
              ))}
            </div>

            <button
              type="submit"
              className={styles.auth__submit}
              disabled={isLoading || otp.join('').length !== 4}
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </button>

            <div className={verifyStyles.resend_section}>
              <p className={verifyStyles.resend_text}>Didn&lsquo;t receive the code?</p>
              <button
                type="button"
                onClick={handleResendCode}
                className={verifyStyles.resend_button}
                disabled={isResending || resendTimer > 0}
              >
                {isResending
                  ? 'Sending...'
                  : resendTimer > 0
                    ? `Resend in ${resendTimer}s`
                    : 'Resend Code'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
