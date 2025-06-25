import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock } from '../../assets/blogCMS/icons/AuthIcons';
import styles from './AuthFlow.module.scss';
import {
  useLoginAdminMutation,
  useRegisterAdminMutation,
} from '../../services/utilis/adminApiService';
import { setAuthToken } from '../../services/utilis/authUtils';
import ModalComp from '../blog/Modal/Modal';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  userName?: string;
}

export default function AuthFlow() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();
  const [loginAdmin, { isLoading: isLoggingIn }] = useLoginAdminMutation();
  const [registerAdmin, { isLoading: isRegistering }] = useRegisterAdminMutation();

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isSignIn) {
      const passwordError = validatePassword(formData.password);
      if (passwordError) newErrors.password = passwordError;
    }

    if (!isSignIn) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
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

    try {
      if (isSignIn) {
        const result = await loginAdmin({
          email: formData.email,
          password: formData.password,
        }).unwrap();

        if (result.success) {
          // Use csrfToken as the auth token
          const token = result.csrfToken || result.data?.token;
          if (token) {
            setAuthToken(true); // Set authentication status to true
          }
          // Navigate to dashboard on successful login
          navigate('/admin/dashboard');
        }
      } else {
        const result = await registerAdmin({
          email: formData.email,
          password: formData.password,
          username: formData.email.split('@')[0],
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: 'admin',
        }).unwrap();

        if (result.success) {
          // Show success modal instead of immediate redirect
          setRegistrationSuccess(true);
          setShowSuccessModal(true);

          // Store the token temporarily for auto-signin option
          const token = result.csrfToken || result.data?.token;
          if (token) {
            sessionStorage.setItem('pendingAuthToken', token);
          }
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setErrors({
        general: error?.data?.message || 'Authentication failed. Try again.',
      });
    }
  };

  const toggleMode = () => {
    setIsSignIn(!isSignIn);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    setErrors({});
    setShowSuccessModal(false);
    setRegistrationSuccess(false);
  };

  const handleAutoSignIn = () => {
    const pendingToken = sessionStorage.getItem('pendingAuthToken');
    if (pendingToken) {
      setAuthToken(true); // Set authentication status to true
      sessionStorage.removeItem('pendingAuthToken');
      navigate('/admin/dashboard');
    }
    setShowSuccessModal(false);
  };

  const handleManualSignIn = () => {
    sessionStorage.removeItem('pendingAuthToken');
    setShowSuccessModal(false);
    setRegistrationSuccess(false);
    setIsSignIn(true);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  return (
    <>
      <div className={styles.auth}>
        <div className={styles.auth__container}>
          <div className={styles.auth__card}>
            <div className={styles.auth__header}>
              <div className={styles.auth__avatar}>
                <User className={styles.auth__avatar_icon} />
              </div>
              <div className={styles.auth__tabs}>
                <button
                  onClick={() => setIsSignIn(true)}
                  className={`${styles.auth__tab} ${isSignIn ? styles['auth__tab--active'] : ''}`}
                >
                  Sign in
                </button>
                <button
                  onClick={() => setIsSignIn(false)}
                  className={`${styles.auth__tab} ${!isSignIn ? styles['auth__tab--active'] : ''}`}
                >
                  Register
                </button>
              </div>
            </div>

            <form className={styles.auth__form} onSubmit={handleSubmit}>
              {errors.general && <div className={styles.auth__error}>{errors.general}</div>}

              {!isSignIn && (
                <div className={styles.auth__name_fields}>
                  <div className={styles.auth__input_wrapper}>
                    <User className={styles.auth__input_icon} />
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={styles.auth__input}
                    />
                    {errors.firstName && (
                      <div className={styles.auth__error}>{errors.firstName}</div>
                    )}
                  </div>
                  <div className={styles.auth__input_wrapper}>
                    <User className={styles.auth__input_icon} />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={styles.auth__input}
                    />
                    {errors.lastName && <div className={styles.auth__error}>{errors.lastName}</div>}
                  </div>
                </div>
              )}

              <div className={styles.auth__input_wrapper}>
                <Mail className={styles.auth__input_icon} />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={styles.auth__input}
                />
                {errors.email && <div className={styles.auth__error}>{errors.email}</div>}
              </div>

              <div className={styles.auth__input_wrapper}>
                <Lock className={styles.auth__input_icon} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={styles.auth__input}
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

              {!isSignIn && (
                <div className={styles.auth__input_wrapper}>
                  <Lock className={styles.auth__input_icon} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={styles.auth__input}
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
              )}

              {isSignIn && (
                <div className={styles.auth__options}>
                  <button
                    type="button"
                    className={styles.auth__remember_me}
                    onClick={() => setRememberMe(!rememberMe)}
                  >
                    <div
                      className={`${styles.auth__checkbox} ${rememberMe ? styles['auth__checkbox--checked'] : ''}`}
                    >
                      {rememberMe && <div className={styles.auth__checkbox_dot}></div>}
                    </div>
                    <span className={styles.auth__remember_text}>Remember me</span>
                  </button>
                  <button type="button" className={styles.auth__forgot_password}>
                    I forgot password
                  </button>
                </div>
              )}

              <button
                type="submit"
                className={styles.auth__submit}
                disabled={isLoggingIn || isRegistering}
              >
                {isLoggingIn || isRegistering
                  ? 'Please wait...'
                  : isSignIn
                    ? 'Sign in'
                    : 'Register'}
              </button>

              <div className={styles.auth__toggle_mode}>
                <button type="button" onClick={toggleMode} className={styles.auth__toggle_link}>
                  {isSignIn ? 'Register' : 'Sign in'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal for Account Creation */}
      <ModalComp
        isOpen={showSuccessModal && registrationSuccess}
        onClose={() => setShowSuccessModal(false)}
        type="success"
        title="Account Created Successfully!"
        content={`Welcome ${formData.firstName}! Your admin account has been created successfully.`}
        primaryButtonText="Sign In Automatically"
        secondaryButtonText="Sign In Manually"
        showSecondaryButton={true}
        onPrimaryAction={handleAutoSignIn}
        onSecondaryAction={handleManualSignIn}
      />
    </>
  );
}
