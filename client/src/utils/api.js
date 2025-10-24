import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token if needed
api.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors globally
// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     // Handle common errors here
//     if (error.response?.status === 401) {
//       // Handle unauthorized access
//       window.location.href = '/auth/login';
//     }
//     return Promise.reject(error);
//   }
// );

// User API
export const userAPI = {
  // Auth
  signup: (data) => api.post('/user/signup', data),
  login: (data) => api.post('/user/signin', data),
  logout: () => api.get('/user/signout'),
  getUser: () => api.get('/user/get'),
  updateUser: (data) => api.put('/user/update', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteAccount: () => api.delete('/user/delete'),
  forgotPassword: (data) => api.post('/user/forgotpassword', data),
  resetPassword: (data) => api.post('/user/resetpassword', data),
  changePassword: (data) => api.put('/user/changepassword', data),
};

// Student API
export const studentAPI = {
  // Materials
  getMaterials: (params) => api.get('/user/materials', { params }),
  searchMaterials: (params) => api.get('/user/search', { params }),
  filterMaterials: (params) => api.get('/user/filter', { params }),
  uploadMaterial: (data) => api.post('/user/upload', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// Bookmark API
export const bookmarkAPI = {
  getBookmarks: () => api.get('/bookmark/get'),
  addBookmark: (data) => api.post('/bookmark/add', data),
  removeBookmark: (materialId) => api.delete(`/bookmark/${materialId}`),
};

// Admin API
export const adminAPI = {
  // Users
  getAllUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/user/${id}`),
  updateUser: (id, data) => api.put(`/admin/user/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/user/${id}`),
  changeUserRole: (id, data) => api.patch(`/admin/user/${id}/role`, data),
  
  // Materials
  getAllMaterials: (params) => api.get('/admin/materials', { params }),
  getMaterialById: (id) => api.get(`/admin/material/${id}`),
  approveMaterial: (id) => api.patch(`/admin/material/${id}/approve`),
  rejectMaterial: (id) => api.patch(`/admin/material/${id}/reject`),
  
  // Notifications
  addNotification: (data) => api.post('/admin/notification/add', data),
  getNotifications: () => api.get('/app/notifications'),
  cleanupNotifications: () => api.delete('/admin/notification/remove'),
};

// Feedback API
export const feedbackAPI = {
  getFeedback: () => api.get('/feedback/get'),
  submitFeedback: (data) => api.post('/feedback/submit', data),
  deleteFeedback: (id) => api.delete(`/feedback/delete/${id}`),
};

// AI API
export const aiAPI = {
  chat: (data) => api.post('/zanlyai', data),
};

// App API (general)
export const appAPI = {
  getNotifications: () => api.get('/app/notifications'),
};

export default api;