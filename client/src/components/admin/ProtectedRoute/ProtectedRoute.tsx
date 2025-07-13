import React from 'react';
import { useGetAdminProfileQuery } from '../../../services/utilis/adminApiService';
import { Navigate, useLocation } from 'react-router-dom';
import Loader from '../../../components/blog/SuspenseLoader/Loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole = 'admin' }) => {
  const location = useLocation();
  const token = localStorage.getItem('adminToken');

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Use the profile query to verify the token is valid
  const { data: profile, isLoading, error } = useGetAdminProfileQuery({});

  if (isLoading) {
    return (
      <div className="protected-route-loading">
        <Loader />
      </div>
    );
  }

  // If error or no profile, redirect to login
  if (error || !profile?.success) {
    localStorage.removeItem('adminToken');
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Check role if specified
  if (
    requiredRole &&
    profile.data.admin.role !== requiredRole &&
    profile.data.admin.role !== 'super_admin'
  ) {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You don&apos;t have permission to access this page.</p>
        <p>Required role: {requiredRole}</p>
        <p>Your role: {profile.data.admin.role}</p>
      </div>
    );
  }

  // If everything is good, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
