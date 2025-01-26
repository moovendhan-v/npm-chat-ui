import axiosInstance from '../axios';
import { API_ENDPOINTS } from '../endpoints';
import { AxiosResponse } from 'axios';
import { User } from '@/types';

export const userService = {
  getAllUsers: () => 
    axiosInstance.get(API_ENDPOINTS.USERS.LIST),
  getMyDetails: (userId: string): Promise<AxiosResponse<User>> => 
    axiosInstance.get<User>(API_ENDPOINTS.USERS.ME(userId)),
};