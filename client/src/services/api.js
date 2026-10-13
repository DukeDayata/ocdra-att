import axios from 'axios';

const getApiBaseUrl = () => {
  // When running locally in development, connect to local backend on port 5000
  if (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ) {
    if (import.meta.env.VITE_API_BASE_URL && !import.meta.env.VITE_API_BASE_URL.includes('onrender.com')) {
      return import.meta.env.VITE_API_BASE_URL;
    }
    return 'http://localhost:5000/api';
  }
  return import.meta.env.VITE_API_BASE_URL || 'https://ocdra-att.onrender.com/api';
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('att_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unified error messages
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred';
    return Promise.reject(new Error(message));
  }
);

// Auth API Endpoints
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  changePassword: (data) => api.post('/auth/change-password', data)
};

// ATT API Endpoints
export const attApi = {
  create: (data) => api.post('/att', data),
  getAll: (params) => api.get('/att', { params }),
  getStats: () => api.get('/att/stats'),
  getByRef: (refNo) => api.get(`/att/reference/${refNo}`),
  getById: (id) => api.get(`/att/${id}`),
  update: (id, data) => api.put(`/att/${id}`, data),
  updateStatus: (id, status, remarks) => api.patch(`/att/${id}/status`, { status, remarks }),
  archive: (id) => api.patch(`/att/${id}/archive`)
};

// Personnel API Endpoints
export const personnelApi = {
  getAll: (params) => api.get('/personnel', { params }),
  create: (data) => api.post('/personnel', data),
  getById: (id) => api.get(`/personnel/${id}`),
  update: (id, data) => api.put(`/personnel/${id}`, data),
  toggleStatus: (id) => api.patch(`/personnel/${id}/status`)
};

// Approver API Endpoints
export const approverApi = {
  getAll: (params) => api.get('/approvers', { params }),
  create: (data) => api.post('/approvers', data),
  getById: (id) => api.get(`/approvers/${id}`),
  update: (id, data) => api.put(`/approvers/${id}`, data),
  toggleStatus: (id) => api.patch(`/approvers/${id}/status`)
};

export default api;
