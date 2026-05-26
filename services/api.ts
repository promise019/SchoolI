import AsyncStorage from '@react-native-async-storage/async-storage';

// In Expo, EXPO_PUBLIC_ prefix is required for env vars to be available on the client.
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.25.236:3000/api';

const getHeaders = async (isFormData = false) => {
  const token = await AsyncStorage.getItem('jwt_token');
  const headers: HeadersInit = {};
  
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`; // Typical JWT Bearer format
  }
  
  return headers;
};

// Base request wrapper
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const isFormData = options.body instanceof FormData;
  const headers = await getHeaders(isFormData);
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (error) {
    data = { message: text };
  }

  if (!response.ok) {
    throw {
      status: response.status,
      message: data.message || data.error || 'API request failed',
      data
    };
  }

  return data;
};

// Extracted endpoint methods
export const api = {
  // Auth
  login: (data: any) => apiFetch('/users/login', { method: 'POST', body: JSON.stringify(data) }),
  signup: (data: any) => apiFetch('/users/signup', { method: 'POST', body: JSON.stringify(data) }),
  forgotPassword: (data: any) => apiFetch('/users/forgot-password', { method: 'POST', body: JSON.stringify(data) }),
  checkUser: (studentId: string) => apiFetch(`/users/check/${studentId}`, { method: 'GET' }),
  getProfile: () => apiFetch('/users/profile', { method: 'GET' }),
  
  // Documents
  getDocuments: (studentId: string) => apiFetch(`/documents/${studentId}`, { method: 'GET' }),
  uploadDocument: (data: FormData) => apiFetch('/documents/upload', { method: 'POST', body: data }),
  
  // Queue & Campus
  getQueues: (universityId: string) => 
    apiFetch(`/universities/${universityId}/queues`, { method: 'GET' }),
  
  // Chat & AI
  getChatHistory: (roomId: string) => apiFetch(`/chat/${roomId}`, { method: 'GET' }),
  
  // Notifications
  getNotifications: () => apiFetch('/notifications', { method: 'GET' }),
  markNotificationRead: (notificationId: string) => apiFetch(`/notifications/${notificationId}/read`, { method: 'PUT' }),
};
