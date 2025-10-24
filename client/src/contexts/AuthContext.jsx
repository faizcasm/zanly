import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { userAPI } from '../utils/api';
import { useToast } from '../components/ui/Toast';
import { AuthContext } from './AuthContext.js';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication status on app load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getUser();
      if (response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      if (error.response?.status === 401) {
      setUser(null);
      setIsAuthenticated(false);
    }
    else {
      console.error('Auth check failed:', error);
    }
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await userAPI.login(credentials);
      const userData = response.data.user;
      
      setUser(userData);
      setIsAuthenticated(true);
      
      toast.success(
        'Welcome back!', 
        `Successfully logged in as ${userData.name || userData.email}`
      );
      
      // Handle redirects based on user role
      const from = location.state?.from?.pathname || 
        (userData.role === 'ADMIN' ? '/admin' : '/dashboard');
      navigate(from, { replace: true });
      
      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error('Login Failed', message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setLoading(true);
      const response = await userAPI.signup(userData);
      const newUser = response.data.user;
      
      setUser(null);
      setIsAuthenticated(false);
      
      toast.success(
        'Welcome to Zanly!', 
        'Your account has been created successfully'
      );
      
      // Redirect new users to dashboard (users default to USER role)
      navigate('/auth/login', { replace: true });
      
      return { success: true, user: newUser };
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed';
      toast.error('Signup Failed', message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await userAPI.logout();
       navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      toast.info('Logged Out', 'You have been successfully logged out');
      navigate('/', { replace: true });
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const response = await userAPI.updateUser(profileData);
      const updatedUser = response.data.user;
      
      setUser(updatedUser);
      toast.success('Profile Updated', 'Your profile has been updated successfully');
      
      return { success: true, user: updatedUser };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error('Update Failed', message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      await userAPI.forgotPassword({ email });
      toast.success(
        'Otp sended', 
        'Please check your email for otp and password reset instructions'
      );
      navigate('/auth/reset-password')
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send reset email';
      toast.error('Reset Failed', message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (resetData) => {
    try {
      setLoading(true);
      await userAPI.resetPassword(resetData);
      toast.success(
        'Password Reset', 
        'Your password has been reset successfully'
      );
      navigate('/auth/login')
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset failed';
      toast.error('Reset Failed', message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    try {
      setLoading(true);
      await userAPI.deleteAccount();
      setUser(null);
      setIsAuthenticated(false);
      toast.info('Account Deleted', 'Your account has been permanently deleted');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Account deletion failed';
      toast.error('Deletion Failed', message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = () => {
    return user?.role === 'ADMIN';
  };

  const isUser = () => {
    return user?.role === 'USER';
  };

  const value = {
    // State
    user,
    loading,
    isAuthenticated,
    
    // Actions
    login,
    signup,
    logout,
    updateProfile,
    forgotPassword,
    resetPassword,
    deleteAccount,
    checkAuth,
    
    // Helpers
    isAdmin,
    isUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};