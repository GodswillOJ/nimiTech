import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useLoginAdminMutation,
  useRegisterAdminMutation,
} from '../../../services/utilis/adminApiService';
import { setAuthToken } from '../../../services/utilis/authUtils';
import ModalComp from '../../blog/Modal/Modal';
import './AdminAuth.scss';

interface AdminAuthProps {
  mode?: 'login' | 'register';
  onSuccess?: () => void;
}

const AdminAuth: React.FC<AdminAuthProps> = ({ mode = 'login', onSuccess }) => {
  const [isLoginMode, setIsLoginMode] = useState(mode === 'login');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    firstName: '',
    lastName: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();
  const [loginAdmin, { isLoading: isLoggingIn }] = useLoginAdminMutation();
  const [registerAdmin, { isLoading: isRegistering }] = useRegisterAdminMutation();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isLoginMode) {
      const passwordError = validatePassword(formData.password);
      if (passwordError) newErrors.password = passwordError;
    }

    if (!isLoginMode) {
      if (!formData.username) newErrors.username = 'Username is required';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (isLoginMode) {
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
          onSuccess?.();
          // Navigate to dashboard on successful login
          navigate('/admin/dashboard');
        }
      } else {
        const result = await registerAdmin({
          email: formData.email,
          password: formData.password,
          username: formData.username,
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
      console.error('Authentication error:', error);
      setErrors({
        general: error?.data?.message || 'Authentication failed. Please try again.',
      });
    }
  };

  const handleAutoSignIn = () => {
    const pendingToken = sessionStorage.getItem('pendingAuthToken');
    if (pendingToken) {
      setAuthToken(true); // Set authentication status to true
      sessionStorage.removeItem('pendingAuthToken');
      onSuccess?.();
      navigate('/admin/dashboard');
    }
    setShowSuccessModal(false);
  };

  const handleManualSignIn = () => {
    sessionStorage.removeItem('pendingAuthToken');
    setShowSuccessModal(false);
    setRegistrationSuccess(false);
    setIsLoginMode(true);
    setFormData({
      email: '',
      password: '',
      username: '',
      firstName: '',
      lastName: '',
      confirmPassword: '',
    });
  };

  return (
    <div className="admin-auth">
      <div className="admin-auth__container">
        <div className="admin-auth__header">
          <h1>{isLoginMode ? 'Welcome Back, Sign in' : 'Create an Account'}</h1>
          <p>{isLoginMode ? 'Sign in to access the admin dashboard' : 'Create an admin account'}</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-auth__form">
          {errors.general && (
            <div className="admin-auth__error admin-auth__error--general">{errors.general}</div>
          )}

          {!isLoginMode && (
            <>
              <div className="admin-auth__row">
                <div className="admin-auth__field">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={errors.firstName ? 'error' : ''}
                    disabled={isRegistering}
                  />
                  {errors.firstName && <div className="admin-auth__error">{errors.firstName}</div>}
                </div>

                <div className="admin-auth__field">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={errors.lastName ? 'error' : ''}
                    disabled={isRegistering}
                  />
                  {errors.lastName && <div className="admin-auth__error">{errors.lastName}</div>}
                </div>
              </div>

              <div className="admin-auth__field">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className={errors.username ? 'error' : ''}
                  disabled={isRegistering}
                />
                {errors.username && <div className="admin-auth__error">{errors.username}</div>}
              </div>
            </>
          )}

          <div className="admin-auth__field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={errors.email ? 'error' : ''}
              disabled={isLoggingIn || isRegistering}
            />
            {errors.email && <div className="admin-auth__error">{errors.email}</div>}
          </div>

          <div className="admin-auth__field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={errors.password ? 'error' : ''}
              disabled={isLoggingIn || isRegistering}
            />
            {errors.password && <div className="admin-auth__error">{errors.password}</div>}
          </div>

          {!isLoginMode && (
            <div className="admin-auth__field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={errors.confirmPassword ? 'error' : ''}
                disabled={isRegistering}
              />
              {errors.confirmPassword && (
                <div className="admin-auth__error">{errors.confirmPassword}</div>
              )}
            </div>
          )}

          <button
            type="submit"
            className="admin-auth__submit"
            disabled={isLoggingIn || isRegistering}
          >
            {isLoggingIn || isRegistering
              ? 'Please wait...'
              : isLoginMode
                ? 'Sign In'
                : 'Create Account'}
          </button>
        </form>

        <div className="admin-auth__footer">
          <p>
            {isLoginMode ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              className="admin-auth__switch"
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setErrors({});
                setFormData({
                  email: '',
                  password: '',
                  username: '',
                  firstName: '',
                  lastName: '',
                  confirmPassword: '',
                });
              }}
            >
              {isLoginMode ? 'Register here' : 'Sign in here'}
            </button>
          </p>
        </div>
      </div>

      {/* Success Modal for Account Creation */}
      <ModalComp
        isOpen={showSuccessModal && registrationSuccess}
        onClose={() => setShowSuccessModal(false)}
        type="success"
        title="Account Created Successfully!"
        content={`Welcome ${formData.firstName}! Your admin account has been created successfully.`}
        primaryButtonText="Sign In"
        // secondaryButtonText="Sign In Manually"
        showSecondaryButton={true}
        onPrimaryAction={handleManualSignIn}
        // onSecondaryAction={handleManualSignIn}
      />
    </div>
  );
};

export default AdminAuth;
