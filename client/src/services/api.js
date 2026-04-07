import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Interceptor to inject token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Category Services
export const getCategories = () => api.get('/categories');
export const createCategory = (data) => api.post('/categories', data);

// Admin Category Services
export const getAdminCategories = () => api.get('/categories/all');
export const approveCategory = (id) => api.put(`/categories/${id}/approve`);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// Service Services
export const getServices = (params) => api.get('/services', { params });
export const getMyServices = () => api.get('/services/mine');
export const getServiceById = (id) => api.get(`/services/${id}`);
export const createService = (data) => api.post('/services', data);
export const updateService = (id, data) => api.put(`/services/${id}`, data);
export const deleteService = (id) => api.delete(`/services/${id}`);

// Booking Services
export const getMyBookings = () => api.get('/bookings/my-bookings');
export const createBooking = (data) => api.post('/bookings', data);
export const completeBooking = (id) => api.patch(`/bookings/${id}/complete`);

// Message Services
export const getMessages = () => api.get('/messages');
export const sendMessage = (data) => api.post('/messages', data);
export const replyMessage = (id, data) => api.put(`/messages/${id}/reply`, data);
export const updateMessageStatus = (id, data) => api.patch(`/messages/${id}/status`, data);

// Feedback Services
export const createFeedback = (serviceId, data) => api.post(`/feedbacks/${serviceId}`, data);
export const getProviderFeedbacks = () => api.get('/feedbacks/provider');
export const getMyReviews = () => api.get('/feedbacks/my-reviews');
export const getServiceFeedbacks = (serviceId) => api.get(`/feedbacks/service/${serviceId}`);
export default api;
