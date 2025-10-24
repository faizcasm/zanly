import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Context Providers
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import { ToastProvider } from './components/ui/Toast';
import { ConfirmDialogProvider } from './components/ui/ConfirmDialog';
import { AuthProvider } from './contexts/AuthContext.jsx';

// Pages
import Home from './pages/landingpage/Home';
import NotFound from './pages/landingpage/NotFound';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/dashboard/Dashboard';
import AdminDashboard from './admin/AdminDashboard';
import ProfilePage from './pages/dashboard/Profile';
import SettingsPage from './pages/dashboard/Settings';

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <LoadingSpinner size="lg" text="Loading..." />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <ConfirmDialogProvider>
            <AuthProvider>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    {/* Public Routes (guarded to bounce authenticated users) */}
                    <Route 
                      path="/" 
                      element={
                        <ProtectedRoute requireAuth={false}>
                          <Home />
                         </ProtectedRoute>
                      } 
                    />
                    
                    {/* Auth Routes - Redirect to dashboard if already authenticated */}
                    <Route 
                      path="/auth/login" 
                      element={
                        <ProtectedRoute requireAuth={false}>
                          <Login />
                         </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/auth/signup" 
                      element={
                        <ProtectedRoute requireAuth={false}>
                          <Signup />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/auth/forgot-password" 
                      element={
                        <ProtectedRoute requireAuth={false}>
                          <ForgotPassword />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/auth/reset-password" 
                      element={
                        <ProtectedRoute requireAuth={false}>
                          <ResetPassword />
                        </ProtectedRoute>
                      } 
                    />

                    {/* Protected User Routes */}
                    <Route 
                      path="/dashboard" 
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/profile" 
                      element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/settings" 
                      element={
                        <ProtectedRoute>
                          <SettingsPage />
                        </ProtectedRoute>
                      } 
                    />

                    {/* Protected Admin Routes */}
                    <Route 
                      path="/admin/*" 
                      element={
                        <ProtectedRoute requireAdmin={true}>
                          <AdminDashboard />
                        </ProtectedRoute>
                      } 
                    />

                    {/* Catch all route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </div>
            </AuthProvider>
          </ConfirmDialogProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
