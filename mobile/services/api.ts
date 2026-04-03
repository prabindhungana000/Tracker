import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  // TODO: Add JWT token from secure storage
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // TODO: Handle auth errors
    return Promise.reject(error);
  }
);
