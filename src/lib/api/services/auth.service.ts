import axiosInstance from '../axios';
import { API_ENDPOINTS } from '../endpoints';
import type { ApiResponse } from '../types';

interface LoginCredentials {
  email: string;
  password: string;
}

export const authService = {
  login: (credentials: LoginCredentials) =>
    axiosInstance.post<ApiResponse<{ token: string }>>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    ),
};