import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import BlogPostEditor from '../blogCMS/BlogPostEditor/BlogPostEditor';
import BlogListTable from '../../components/admin/BlogList/BlogListTable';
import NewsletterManager from '../../components/admin/NewsletterManager/NewsletterManager';
import { AvatarUploader } from '../../components/ui/AvatarUploader/AvatarUploader';
import { useToast } from '../../hooks/useToast';
import { isAuthenticated, clearAuthToken } from '../../services/utilis/authUtils';
import { getImageUrl } from '../../utils/envUtils';
import { useGetBlogStatsQuery } from '../../services/utilis/blogApiService';
import {
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation,
  useUploadAdminAvatarMutation,
  useLogoutAdminMutation,
} from '../../services/utilis/adminApiService';
import styles from './UserDashboard.module.scss';

// Icons
const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="9" />
    <rect x="14" y="3" width="7" height="5" />
    <rect x="14" y="12" width="7" height="9" />
    <rect x="3" y="16" width="7" height="5" />
  </svg>
);

const PostsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10,9 9,9 8,9" />
  </svg>
);

const CreateIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const DraftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10,9 9,9 8,9" />
    <path d="M8 13h8" strokeDasharray="2,2" />
  </svg>
);

const PublishIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16,17 21,12 16,7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const NewsletterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
};

// Profile/Admin Header Component
const AdminProfileHeader: React.FC = React.memo(() => {
  const { data: profile } = useGetAdminProfileQuery({});
  const [isEditing, setIsEditing] = useState(false);
  const [updateAdminProfile] = useUpdateAdminProfileMutation();
  const [uploadAdminAvatar] = useUploadAdminAvatarMutation();
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const toast = useToast();

  const [editData, setEditData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    avatar: null as string | null,
  });

  const adminData = useMemo(
    () => ({
      name: `${profile?.data?.admin?.firstName} ${profile?.data?.admin?.lastName}` || 'Admin',
      email: profile?.data?.admin?.email || 'admin@nimitech.com',
      avatar: profile?.data?.admin?.avatar || null,
      firstName: profile?.data?.admin?.firstName || '',
      lastName: profile?.data?.admin?.lastName || '',
      bio: profile?.data?.admin?.bio || '',
    }),
    [profile]
  );

  // Initialize edit data when profile loads
  useEffect(() => {
    if (profile?.data?.admin) {
      const admin = profile.data.admin;
      setEditData({
        firstName: admin.firstName || '',
        lastName: admin.lastName || '',
        bio: admin.bio || '',
        avatar: admin.avatar || null,
      });
    }
  }, [profile]);

  const handleAvatarUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file type', 'Please select a valid image file');
      throw new Error('Invalid file type');
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large', 'Image size must be less than 5MB');
      throw new Error('File too large');
    }

    setIsUploadingAvatar(true);

    try {
      console.log('Uploading admin avatar:', {
        name: file.name,
        size: file.size,
        type: file.type,
      });

      const result = await uploadAdminAvatar({ avatar: file }).unwrap();

      console.log('Avatar upload result:', result);

      // Check multiple possible response formats (similar to BlogPostEditor)
      if (result.success && result.avatarUrl) {
        setEditData((prev) => ({ ...prev, avatar: result.avatarUrl }));
        toast.success('Avatar uploaded', 'Avatar uploaded successfully');
        return result.avatarUrl;
      } else if (result.url) {
        setEditData((prev) => ({ ...prev, avatar: result.url }));
        toast.success('Avatar uploaded', 'Avatar uploaded successfully');
        return result.url;
      } else if (result.data?.avatarUrl) {
        setEditData((prev) => ({ ...prev, avatar: result.data.avatarUrl }));
        toast.success('Avatar uploaded', 'Avatar uploaded successfully');
        return result.data.avatarUrl;
      } else {
        console.error('Unexpected response format:', result);
        throw new Error('Upload failed - no valid URL returned');
      }
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      console.error('Error details:', {
        status: error?.status,
        data: error?.data,
        message: error?.message,
      });

      let errorMessage = 'Failed to upload avatar. Please try again.';

      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error('Upload failed', errorMessage);
      throw error; // Re-throw for AvatarUploader to handle
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleAvatarChange = (url: string | null) => {
    setEditData((prev) => ({ ...prev, avatar: url }));
  };

  // Handle avatar removal
  const handleAvatarRemove = () => {
    setEditData((prev) => ({ ...prev, avatar: null }));
  };

  const handleSave = async () => {
    try {
      const result = await updateAdminProfile({
        firstName: editData.firstName,
        lastName: editData.lastName,
        bio: editData.bio,
        avatar: editData.avatar,
      }).unwrap();

      if (result.success) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
      }
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error('Update failed', error?.data?.message || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    // Reset to original data
    setEditData({
      firstName: adminData.firstName,
      lastName: adminData.lastName,
      bio: adminData.bio,
      avatar: adminData.avatar,
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className={styles.admin__profile_edit}>
        <AvatarUploader
          avatar={editData.avatar}
          onAvatarChange={handleAvatarChange}
          onUpload={handleAvatarUpload}
          isUploading={isUploadingAvatar}
          size="large"
          className={styles.admin__avatar_uploader}
        />

        <div className={styles.admin__form}>
          <div className={styles.admin__field}>
            <input
              type="text"
              placeholder="First Name"
              value={editData.firstName}
              onChange={(e) => setEditData((prev) => ({ ...prev, firstName: e.target.value }))}
              className={styles.admin__input}
            />
          </div>
          <div className={styles.admin__field}>
            <input
              type="text"
              placeholder="Last Name"
              value={editData.lastName}
              onChange={(e) => setEditData((prev) => ({ ...prev, lastName: e.target.value }))}
              className={styles.admin__input}
            />
          </div>
          <div className={styles.admin__field}>
            <textarea
              placeholder="Bio"
              value={editData.bio}
              onChange={(e) => setEditData((prev) => ({ ...prev, bio: e.target.value }))}
              className={styles.admin__textarea}
              rows={3}
            />
          </div>
          <div className={styles.admin__actions}>
            <button
              onClick={handleSave}
              className={styles.admin__save_btn}
              disabled={isUploadingAvatar}
            >
              {isUploadingAvatar ? 'Uploading...' : 'Save Changes'}
            </button>
            <button
              onClick={handleCancel}
              className={styles.admin__cancel_btn}
              disabled={isUploadingAvatar}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.admin__profile}>
      <div className={styles.admin__avatar}>
        {adminData.avatar ? (
          <img
            src={
              adminData.avatar.startsWith('http') ? adminData.avatar : getImageUrl(adminData.avatar)
            }
            alt={adminData.name}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className={styles.admin__avatar_placeholder}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        )}
      </div>
      <div className={styles.admin__info}>
        <h3 className={styles.admin__name}>{adminData.name}</h3>
        <p className={styles.admin__email}>{adminData.email}</p>
        {adminData.bio && <p className={styles.admin__bio}>{adminData.bio}</p>}
      </div>
      {/* <button
        onClick={() => setIsEditing(true)}
        className={styles.admin__edit_btn}
        title="Edit Profile"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
          <path d="m15 5 4 4" />
        </svg>
      </button> */}
    </div>
  );
});

AdminProfileHeader.displayName = 'AdminProfileHeader';

const DashboardOverview: React.FC = () => {
  const { data: blogStats, isLoading: statsLoading } = useGetBlogStatsQuery();

  return (
    <div className={styles.overview} style={{ margin: '10px 30px' }}>
      <AdminProfileHeader />

      <div className={styles.overview__header}>
        <h1>Welcome to Nimitech&apos;s Blog Dashboard</h1>
        <p>Manage your blog posts and content from here.</p>
      </div>

      <div className={styles.overview__stats}>
        <div className={styles.stat__card}>
          <div className={styles.stat__icon}>
            <PostsIcon />
          </div>
          <div className={styles.stat__content}>
            <h3>Total Posts</h3>
            <p className={styles.stat__number}>
              {statsLoading ? '...' : blogStats?.totalBlogs || 0}
            </p>
          </div>
        </div>

        <div className={styles.stat__card}>
          <div className={styles.stat__icon}>
            <PublishIcon />
          </div>
          <div className={styles.stat__content}>
            <h3>Published Posts</h3>
            <p className={styles.stat__number}>
              {statsLoading ? '...' : blogStats?.publishedBlogs || 0}
            </p>
          </div>
        </div>

        <div className={styles.stat__card}>
          <div className={styles.stat__icon}>
            <DraftIcon />
          </div>
          <div className={styles.stat__content}>
            <h3>Draft Posts</h3>
            <p className={styles.stat__number}>
              {statsLoading ? '...' : blogStats?.draftBlogs || 0}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.quick__actions}>
        <h2>Quick Actions</h2>
        <div className={styles.action__buttons}>
          <Link to="/dashboard/create" className={styles.action__button}>
            <CreateIcon />
            <span>Create New Post</span>
          </Link>
          <Link to="/dashboard/posts" className={styles.action__button}>
            <PostsIcon />
            <span>Manage Posts</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

const UserDashboard: React.FC = () => {
  const location = useLocation();
  const toast = useToast();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [logoutAdmin] = useLogoutAdminMutation();

  const handleLogout = useCallback(async () => {
    console.log('Logout button clicked'); // Debug log
    try {
      // Call the logout API endpoint
      await logoutAdmin(undefined).unwrap();
      // Clear local authentication status
      clearAuthToken();
      toast.success('Logged out successfully');
      // Redirect to auth page
      window.location.href = '/auth';
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, clear local state and redirect
      clearAuthToken();
      toast.error('Logout completed');
      window.location.href = '/auth';
    }
  }, [logoutAdmin, toast]);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const navItems = useMemo(
    () => [
      { path: '/dashboard', icon: <DashboardIcon />, label: 'Dashboard', exact: true },
      { path: '/dashboard/posts', icon: <PostsIcon />, label: 'All Posts' },
      { path: '/dashboard/create', icon: <CreateIcon />, label: 'Create Post' },
      { path: '/dashboard/newsletter', icon: <NewsletterIcon />, label: 'Newsletter' },
    ],
    []
  );

  return (
    <ProtectedRoute>
      <div className={styles.dashboard}>
        {/* Sidebar */}
        <aside
          className={`${styles.sidebar} ${sidebarCollapsed ? styles['sidebar--collapsed'] : ''}`}
        >
          <div className={styles.sidebar__header}>
            <h2 className={styles.sidebar__title}>Blog Dashboard</h2>
            <button
              className={styles.sidebar__toggle}
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>

          <nav className={styles.sidebar__nav}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.nav__item} ${
                  (item.exact && location.pathname === item.path) ||
                  (!item.exact && location.pathname.startsWith(item.path))
                    ? styles['nav__item--active']
                    : ''
                }`}
                title={item.label}
              >
                <span className={styles.nav__icon}>{item.icon}</span>
                <span className={styles.nav__label}>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className={styles.sidebar__footer}>
            <button
              onClick={handleLogout}
              className={styles.logout__button}
              title="Logout"
              style={{ display: 'flex' }} // Force display for debugging
            >
              <LogoutIcon />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Sidebar Overlay for mobile */}
        {!sidebarCollapsed && <div className={styles.sidebar__overlay} onClick={toggleSidebar} />}

        {/* Main Content */}
        <main className={`${styles.main} ${sidebarCollapsed ? styles['main--collapsed'] : ''}`}>
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/posts" element={<BlogListTable />} />
            <Route path="/create" element={<BlogPostEditor />} />
            <Route path="/edit/:id" element={<BlogPostEditor />} />
            <Route path="/newsletter" element={<NewsletterManager />} />
          </Routes>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default UserDashboard;
