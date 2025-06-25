import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../../components/admin/ProtectedRoute/ProtectedRoute';
import AdminAuth from '../../components/admin/AdminAuth/AdminAuth';
import BlogEditor from '../../components/blog/BlogEditor/BlogEditor';
import BlogList from '../../components/admin/BlogList/BlogList';
import NewsletterManager from '../../components/admin/NewsletterManager/NewsletterManager';
import AdminProfile from '../../components/admin/AdminProfile/AdminProfile';

import './AdminDashboard.scss';
import { clearAuthToken } from '../../services/utilis/authUtils';
import {
  useGetAdminProfileQuery,
  useLogoutAdminMutation,
} from '../../services/utilis/adminApiService';

const AdminDashboard: React.FC = () => {
  const { data: profile } = useGetAdminProfileQuery({});
  const [logoutAdmin] = useLogoutAdminMutation();

  const handleLogout = async () => {
    try {
      await logoutAdmin({}).unwrap();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthToken();
      window.location.href = '/admin/login';
    }
  };

  return (
    <Routes>
      <Route path="/login" element={<AdminAuth mode="login" />} />
      <Route path="/register" element={<AdminAuth mode="register" />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <div className="admin-dashboard">
              <header className="admin-header">
                <div className="admin-header__content">
                  <h1>Admin Dashboard</h1>
                  <div className="admin-header__user">
                    <span>Welcome, {profile?.data?.admin?.firstName}</span>
                    <button onClick={handleLogout} className="logout-btn">
                      Logout
                    </button>
                  </div>
                </div>
              </header>

              <main className="admin-main">
                <div className="admin-sidebar">
                  <nav className="admin-nav">
                    <a href="/admin/dashboard/blogs" className="nav-item">
                      📝 Manage Blogs
                    </a>
                    <a href="/admin/dashboard/create-blog" className="nav-item">
                      ➕ Create Blog
                    </a>
                    <a href="/admin/dashboard/newsletter" className="nav-item">
                      📧 Newsletter
                    </a>
                    <a href="/admin/dashboard/profile" className="nav-item">
                      👤 Profile
                    </a>
                  </nav>
                </div>

                <div className="admin-content">
                  <Routes>
                    <Route index element={<AdminOverview />} />
                    <Route path="create-blog" element={<BlogEditor />} />
                    <Route path="edit-blog/:id" element={<BlogEditor />} />
                    <Route path="blogs" element={<BlogList />} />
                    <Route path="newsletter" element={<NewsletterManager />} />
                    <Route path="profile" element={<AdminProfile />} />
                    <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                  </Routes>
                </div>
              </main>
            </div>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
};

// Simple overview component
const AdminOverview: React.FC = () => {
  const { data: profileResponse } = useGetAdminProfileQuery(undefined);
  const admin = profileResponse?.data?.admin;

  return (
    <div className="admin-overview">
      <div className="welcome-section">
        <h2>Welcome back, {admin?.firstName || 'Admin'}!</h2>
        <p>Manage your blog content and newsletter subscribers from this dashboard.</p>
      </div>

      <div className="overview-cards">
        <div className="overview-card">
          <div className="card-icon">📝</div>
          <h3>Blog Management</h3>
          <p>Create, edit, and manage your blog posts</p>
          <div className="card-actions">
            <a href="/admin/dashboard/create-blog" className="btn btn--primary">
              Create New Post
            </a>
            <a href="/admin/dashboard/blogs" className="btn btn--secondary">
              Manage Posts
            </a>
          </div>
        </div>

        <div className="overview-card">
          <div className="card-icon">📧</div>
          <h3>Newsletter</h3>
          <p>View and manage newsletter subscribers</p>
          <div className="card-actions">
            <a href="/admin/dashboard/newsletter" className="btn btn--primary">
              View Subscribers
            </a>
          </div>
        </div>

        <div className="overview-card">
          <div className="card-icon">👤</div>
          <h3>Profile Settings</h3>
          <p>Update your profile and account settings</p>
          <div className="card-actions">
            <a href="/admin/dashboard/profile" className="btn btn--primary">
              Edit Profile
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
