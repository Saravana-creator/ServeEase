import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Interceptor to inject token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Category Services
export const getCategories = () => api.get('/categories');
export const createCategory = (data) => api.post('/categories', data);

// Admin Category Services
export const getAdminCategories = () => api.get('/categories/all');
export const approveCategory = (id) => api.put(`/categories/${id}/approve`);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// Service Services
export const getServices = (params) => api.get('/services', { params });
export const getServiceById = (id) => api.get(`/services/${id}`);
export const createService = (data) => api.post('/services', data);
export const updateService = (id, data) => api.put(`/services/${id}`, data);
export const deleteService = (id) => api.delete(`/services/${id}`);

export default api;
