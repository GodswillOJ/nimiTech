import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowLeft } from '../../../assets/blogCMS/icons/AuthIcons';
import { getApiBaseUrl } from '../../../utils/envUtils';
import { encryptData } from '../../../services/utilis/authUtils';
import styles from '../AuthFlow.module.scss';
import ModalComp from '../../blog/Modal/Modal';

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get token from sessionStorage (more secure) or fallback to URL parameter
  const resetToken = sessionStorage.getItem('resetToken') || searchParams.get('token') || '';

  // Clear token from sessionStorage on component mount for security
  useEffect(() => {
    if (sessionStorage.getItem('resetToken')) {
      sessionStorage.removeItem('resetToken');
    }
  }, []);

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) return 'Password must be at least 8 characters long';
    if (!hasUpperCase) return 'Password must contain at least one uppercase letter';
    if (!hasLowerCase) return 'Password must contain at least one lowercase letter';
    if (!hasNumbers) return 'Password must contain at least one number';
    if (!hasSpecialChar) return 'Password must contain at least one special character';
    return null;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordError = validatePassword(formData.password);
      if (passwordError) newErrors.password = passwordError;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const baseUrl = getApiBaseUrl();

      // Encrypt the password data for security
      const encryptedPayload = encryptData({
        token: resetToken,
        password: formData.password,
      });

      if (!encryptedPayload) {
        setErrors({
          general: 'Failed to secure data. Please try again.',
        });
        setIsLoading(false);
        return;
      }

      console.log('Sending encrypted payload:', { encryptedData: encryptedPayload });

      const response = await fetch(`${baseUrl}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          encryptedData: encryptedPayload,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setShowSuccessModal(true);
      } else {
        setErrors({
          general: result.message || 'Failed to reset password. Please try again.',
        });
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setErrors({
        general: 'Network error. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessConfirm = () => {
    setShowSuccessModal(false);
    navigate('/auth');
  };

  const handleBackToVerify = () => {
    navigate('/auth/verify-otp');
  };

  // Check if we have a valid token
  if (!resetToken) {
    return (
      <div className={styles.auth}>
        <div className={styles.auth__container}>
          <div className={styles.auth__card}>
            <div className={styles.auth__header}>
              <div className={styles.auth__avatar}>
                <Lock className={styles.auth__avatar_icon} />
              </div>
              <h2 className={styles.auth__title}>Invalid Reset Link</h2>
              <p className={styles.auth__subtitle}>
                This password reset link is invalid or has expired. Please request a new one.
              </p>
            </div>
            <div className={styles.auth__form}>
              <button
                onClick={() => navigate('/auth/forgot-password')}
                className={styles.auth__submit}
              >
                Request New Reset Link
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.auth}>
        <div className={styles.auth__container}>
          <div className={styles.auth__card}>
            <div className={styles.auth__header}>
              <button
                onClick={handleBackToVerify}
                className={styles.auth__back_button}
                type="button"
              >
                <ArrowLeft className={styles.auth__back_icon} />
              </button>
              <div className={styles.auth__avatar}>
                <Lock className={styles.auth__avatar_icon} />
              </div>
              <h2 className={styles.auth__title}>Reset Your Password</h2>
              <p className={styles.auth__subtitle}>
                Create a new secure password for your account.
              </p>
            </div>

            <form className={styles.auth__form} onSubmit={handleSubmit}>
              {errors.general && <div className={styles.auth__error}>{errors.general}</div>}

              <div className={styles.auth__input_wrapper}>
                <Lock className={styles.auth__input_icon} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="New password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={styles.auth__input}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.auth__toggle_password}
                >
                  {showPassword ? (
                    <EyeOff className={styles.auth__eye_icon} />
                  ) : (
                    <Eye className={styles.auth__eye_icon} />
                  )}
                </button>
                {errors.password && <div className={styles.auth__error}>{errors.password}</div>}
              </div>

              <div className={styles.auth__input_wrapper}>
                <Lock className={styles.auth__input_icon} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={styles.auth__input}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={styles.auth__toggle_password}
                >
                  {showConfirmPassword ? (
                    <EyeOff className={styles.auth__eye_icon} />
                  ) : (
                    <Eye className={styles.auth__eye_icon} />
                  )}
                </button>
                {errors.confirmPassword && (
                  <div className={styles.auth__error}>{errors.confirmPassword}</div>
                )}
              </div>

              <button type="submit" className={styles.auth__submit} disabled={isLoading}>
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <ModalComp
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        type="success"
        title="Password Reset Successful!"
        content="Your password has been reset successfully. You can now sign in with your new password."
        primaryButtonText="Go to Sign In"
        onPrimaryAction={handleSuccessConfirm}
      />
    </>
  );
}
