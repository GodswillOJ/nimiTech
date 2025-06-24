import React, { useState, useEffect } from 'react';

import './AdminProfile.scss';
import {
  useChangeAdminPasswordMutation,
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation,
} from '../../../services/utilis/adminApiService';
import Loader from '../../../components/blog/SuspenseLoader/Loader';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface AdminProfileProps {
  className?: string;
}

const AdminProfile: React.FC<AdminProfileProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    role: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const {
    data: profileResponse,
    isLoading: isLoadingProfile,
    error: profileError,
  } = useGetAdminProfileQuery(undefined);

  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateAdminProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangeAdminPasswordMutation();

  useEffect(() => {
    if (profileResponse?.data?.admin) {
      const admin = profileResponse.data.admin;
      setProfileData({
        firstName: admin.firstName || '',
        lastName: admin.lastName || '',
        username: admin.username || '',
        email: admin.email || '',
        role: admin.role || '',
      });
    }
  }, [profileResponse]);

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

  const handleProfileInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
    if (profileErrors[field]) {
      setProfileErrors((prev) => ({ ...prev, [field]: '' }));
    }
    if (successMessage) setSuccessMessage('');
  };

  const handlePasswordInputChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
    if (passwordErrors[field]) {
      setPasswordErrors((prev) => ({ ...prev, [field]: '' }));
    }
    if (successMessage) setSuccessMessage('');
  };

  const validateProfileForm = () => {
    const newErrors: Record<string, string> = {};

    if (!profileData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!profileData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!profileData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(profileData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setProfileErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors: Record<string, string> = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else {
      const passwordError = validatePassword(passwordData.newPassword);
      if (passwordError) newErrors.newPassword = passwordError;
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateProfileForm()) return;

    try {
      const result = await updateProfile({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        username: profileData.username,
        email: profileData.email,
      }).unwrap();

      if (result.success) {
        setSuccessMessage('Profile updated successfully!');
        setProfileErrors({});
      }
    } catch (error: any) {
      console.error('Profile update error:', error);
      setProfileErrors({
        general: error?.data?.message || 'Failed to update profile. Please try again.',
      });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswordForm()) return;

    try {
      const result = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }).unwrap();

      if (result.success) {
        setSuccessMessage('Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setPasswordErrors({});
      }
    } catch (error: any) {
      console.error('Password change error:', error);
      setPasswordErrors({
        general: error?.data?.message || 'Failed to change password. Please try again.',
      });
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="admin-profile">
        <div className="admin-profile__loading">
          <Loader />
        </div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="admin-profile">
        <div className="admin-profile__error">
          <p>Failed to load profile</p>
          <button onClick={() => window.location.reload()} className="btn btn--primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-profile">
      <div className="admin-profile__header">
        <h2>Admin Profile</h2>
      </div>

      {successMessage && <div className="admin-profile__success">{successMessage}</div>}

      <div className="admin-profile__tabs">
        <button
          onClick={() => setActiveTab('profile')}
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
        >
          Profile Information
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
        >
          Change Password
        </button>
      </div>

      <div className="admin-profile__content">
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="profile-form">
            <h3>Profile Information</h3>

            {profileErrors.general && (
              <div className="form-error form-error--general">{profileErrors.general}</div>
            )}

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  value={profileData.firstName}
                  onChange={(e) => handleProfileInputChange('firstName', e.target.value)}
                  className={profileErrors.firstName ? 'error' : ''}
                  disabled={isUpdatingProfile}
                />
                {profileErrors.firstName && (
                  <div className="form-error">{profileErrors.firstName}</div>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  value={profileData.lastName}
                  onChange={(e) => handleProfileInputChange('lastName', e.target.value)}
                  className={profileErrors.lastName ? 'error' : ''}
                  disabled={isUpdatingProfile}
                />
                {profileErrors.lastName && (
                  <div className="form-error">{profileErrors.lastName}</div>
                )}
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={profileData.username}
                onChange={(e) => handleProfileInputChange('username', e.target.value)}
                className={profileErrors.username ? 'error' : ''}
                disabled={isUpdatingProfile}
              />
              {profileErrors.username && <div className="form-error">{profileErrors.username}</div>}
            </div>

            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={profileData.email}
                onChange={(e) => handleProfileInputChange('email', e.target.value)}
                className={profileErrors.email ? 'error' : ''}
                disabled={isUpdatingProfile}
              />
              {profileErrors.email && <div className="form-error">{profileErrors.email}</div>}
            </div>

            <div className="form-field">
              <label htmlFor="role">Role</label>
              <input type="text" id="role" value={profileData.role} disabled className="readonly" />
              <small className="form-help">Role cannot be changed</small>
            </div>

            <div className="form-actions">
              <button type="submit" disabled={isUpdatingProfile} className="btn btn--primary">
                {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        )}

        {activeTab === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="password-form">
            <h3>Change Password</h3>

            {passwordErrors.general && (
              <div className="form-error form-error--general">{passwordErrors.general}</div>
            )}

            <div className="form-field">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                value={passwordData.currentPassword}
                onChange={(e) => handlePasswordInputChange('currentPassword', e.target.value)}
                className={passwordErrors.currentPassword ? 'error' : ''}
                disabled={isChangingPassword}
              />
              {passwordErrors.currentPassword && (
                <div className="form-error">{passwordErrors.currentPassword}</div>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={passwordData.newPassword}
                onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)}
                className={passwordErrors.newPassword ? 'error' : ''}
                disabled={isChangingPassword}
              />
              {passwordErrors.newPassword && (
                <div className="form-error">{passwordErrors.newPassword}</div>
              )}
              <small className="form-help">
                Must be at least 8 characters with uppercase, lowercase, number, and special
                character
              </small>
            </div>

            <div className="form-field">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={(e) => handlePasswordInputChange('confirmPassword', e.target.value)}
                className={passwordErrors.confirmPassword ? 'error' : ''}
                disabled={isChangingPassword}
              />
              {passwordErrors.confirmPassword && (
                <div className="form-error">{passwordErrors.confirmPassword}</div>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" disabled={isChangingPassword} className="btn btn--primary">
                {isChangingPassword ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;
