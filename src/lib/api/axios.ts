import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: import.meta.env.VITE_API_BASE_URL,
  baseURL: "http://54.198.78.129:8085", // TODO: Handle this dynamically from the json or env file
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'x-user-id': '6755b674b862ab615b4eecc4',
    'x-api-key': 'pkK11BosNhgqTZwJ4UvyGJF3UcGPNsWl4EkOPeENuX1Qyj+kOVromKesOz1DMBFY',
    'x-role': 'admin', // TODO: Update this dont use this for production ready code     
  },
});

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       // Handle token refresh or logout
//       localStorage.removeItem('token');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;