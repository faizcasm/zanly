import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';
import LoadingSpinner from './ui/LoadingSpinner';

const ProtectedRoute = ({ children, requireAuth = true, requireAdmin = false, redirectTo = '/auth/login' }) => {
  const { isAuthenticated, loading, user, isAdmin } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    // Save the attempted location for redirect after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If admin access is required but user is not admin
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  // If user is authenticated but trying to access non-auth pages (like landing or /auth)
  if (!requireAuth && isAuthenticated) {
    // Send admins to /admin and users to /dashboard
    const defaultTarget = isAdmin() ? '/admin' : '/dashboard';
    const from = location.state?.from?.pathname;
    const target = from && !from.startsWith('/auth') && from !== '/' ? from : defaultTarget;
    return <Navigate to={target} replace />;
  }

  return children;
};

export default ProtectedRoute;