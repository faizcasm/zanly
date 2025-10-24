import { useState, useEffect } from 'react';
import { 
  userAPI, 
  studentAPI, 
  bookmarkAPI, 
  adminAPI, 
  aiAPI, 
  appAPI 
} from '../utils/api';

// Generic hook for API calls
export const useApi = (apiCall, dependencies = [], options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { immediate = true } = options;

  const execute = async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall(...args);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, dependencies);

  return { data, loading, error, execute, setData };
};

// Hook for managing user data
export const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userAPI.getUser();
      setUser(response.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch user data');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userData) => {
    try {
      setLoading(true);
      const response = await userAPI.updateUser(userData);
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await userAPI.logout();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token"); // or check cookie if you store it there
  if (token) {
    fetchUser();
  } else {
    setLoading(false); // not logged in, stop spinner
    setUser(null);     // clear user state
  }
  }, []);

  return { 
    user, 
    loading, 
    error, 
    fetchUser, 
    updateUser, 
    logout, 
    setUser 
  };
};

// Hook for managing materials
export const useMaterials = (initialParams = {}) => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  const fetchMaterials = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await studentAPI.getMaterials({ ...initialParams, ...params });
      setMaterials(response.data.materials || []);
      setPagination({
        page: response.data.page || 1,
        totalPages: response.data.totalPages || 1,
        total: response.data.total || 0,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch materials');
    } finally {
      setLoading(false);
    }
  };

  const searchMaterials = async (query, params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await studentAPI.searchMaterials({ q: query, ...params });
      setMaterials(response.data.materials || []);
      setPagination({
        page: response.data.page || 1,
        totalPages: response.data.totalPages || 1,
        total: response.data.total || 0,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search materials');
    } finally {
      setLoading(false);
    }
  };

  const filterMaterials = async (filters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await studentAPI.filterMaterials(filters);
      setMaterials(response.data.materials || []);
      setPagination({
        page: response.data.page || 1,
        totalPages: response.data.totalPages || 1,
        total: response.data.total || 0,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to filter materials');
    } finally {
      setLoading(false);
    }
  };

  const uploadMaterial = async (materialData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await studentAPI.uploadMaterial(materialData);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload material');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  return {
    materials,
    loading,
    error,
    pagination,
    fetchMaterials,
    searchMaterials,
    filterMaterials,
    uploadMaterial,
    setMaterials,
  };
};

// Hook for managing bookmarks
export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookmarkAPI.getBookmarks();
      setBookmarks(response.data.bookmarks || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bookmarks');
    } finally {
      setLoading(false);
    }
  };

  const addBookmark = async (materialId) => {
    try {
      setError(null);
      await bookmarkAPI.addBookmark({ materialId });
      await fetchBookmarks(); // Refresh bookmarks
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add bookmark');
      throw err;
    }
  };

  const removeBookmark = async (materialId) => {
    try {
      setError(null);
      await bookmarkAPI.removeBookmark(materialId);
      setBookmarks(prev => prev.filter(bookmark => bookmark.material.id !== materialId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove bookmark');
      throw err;
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  return {
    bookmarks,
    loading,
    error,
    fetchBookmarks,
    addBookmark,
    removeBookmark,
  };
};

// Hook for managing notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await appAPI.getNotifications();
      setNotifications(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    loading,
    error,
    fetchNotifications,
    setNotifications,
  };
};

// Hook for AI chat functionality
export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async (prompt) => {
    try {
      setLoading(true);
      setError(null);
      const response = await aiAPI.chat({ prompt });
      return response.data.reply;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    sendMessage,
  };
};

// Admin-specific hooks
export const useAdminUsers = (initialParams = {}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  const fetchUsers = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getAllUsers({ ...initialParams, ...params });
      setUsers(response.data.users || []);
      setPagination({
        page: response.data.page || 1,
        totalPages: response.data.totalPages || 1,
        total: response.data.total || 0,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    try {
      setError(null);
      await adminAPI.deleteUser(userId);
      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
      throw err;
    }
  };

  const updateUserRole = async (userId, role) => {
    try {
      setError(null);
      await adminAPI.changeUserRole(userId, { role });
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role } : user
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user role');
      throw err;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    pagination,
    fetchUsers,
    deleteUser,
    updateUserRole,
    setUsers,
  };
};

export const useAdminMaterials = (initialParams = {}) => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  const fetchMaterials = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getAllMaterials({ ...initialParams, ...params });
      setMaterials(response.data.materials || []);
      setPagination({
        page: response.data.page || 1,
        totalPages: response.data.totalPages || 1,
        total: response.data.total || 0,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch materials');
    } finally {
      setLoading(false);
    }
  };

  const approveMaterial = async (materialId) => {
    try {
      setError(null);
      await adminAPI.approveMaterial(materialId);
      setMaterials(prev => prev.map(material => 
        material.id === materialId ? { ...material, status: 'APPROVED' } : material
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve material');
      throw err;
    }
  };

  const rejectMaterial = async (materialId) => {
    try {
      setError(null);
      await adminAPI.rejectMaterial(materialId);
      setMaterials(prev => prev.map(material => 
        material.id === materialId ? { ...material, status: 'REJECTED' } : material
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject material');
      throw err;
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  return {
    materials,
    loading,
    error,
    pagination,
    fetchMaterials,
    approveMaterial,
    rejectMaterial,
    setMaterials,
  };
};

// Hook for debounced values
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};