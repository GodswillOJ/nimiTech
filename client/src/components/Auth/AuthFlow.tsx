import React, { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock } from '../../assets/blogCMS/icons/AuthIcons';
import styles from './AuthFlow.module.scss';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function AuthFlow() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignIn) {
      console.log('Sign in:', { email: formData.email, password: formData.password });
    } else {
      console.log('Register:', formData);
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
  };

  return (
    <div className={styles.auth}>
      <div className={styles.auth__container}>
        {/* Card Container */}
        <div className={styles.auth__card}>
          {/* Header */}
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

          {/* Form */}
          <div className={styles.auth__form}>
            {/* Name Fields (Register only) */}
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
                    required={!isSignIn}
                  />
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
                    required={!isSignIn}
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className={styles.auth__input_wrapper}>
              <Mail className={styles.auth__input_icon} />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className={styles.auth__input}
                required
              />
            </div>

            {/* Password Field */}
            <div className={styles.auth__input_wrapper}>
              <Lock className={styles.auth__input_icon} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className={styles.auth__input}
                required
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
            </div>

            {/* Confirm Password Field (Register only) */}
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
                  required={!isSignIn}
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
              </div>
            )}

            {/* Remember Me & Forgot Password (Sign in only) */}
            {isSignIn && (
              <div className={styles.auth__options}>
                <button
                  onClick={() => setRememberMe(!rememberMe)}
                  className={styles.auth__remember_me}
                  type="button"
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

            {/* Submit Button */}
            <button onClick={handleSubmit} className={styles.auth__submit}>
              {isSignIn ? 'Sign in' : 'Register'}
            </button>

            {/* Toggle Mode */}
            <div className={styles.auth__toggle_mode}>
              <button type="button" onClick={toggleMode} className={styles.auth__toggle_link}>
                {isSignIn ? 'Register' : 'Sign in'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
