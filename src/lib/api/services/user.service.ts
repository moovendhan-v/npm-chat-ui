import axiosInstance from '../axios';
import { API_ENDPOINTS } from '../endpoints';

export const userService = {
  getAllUsers: () => 
    axiosInstance.get(API_ENDPOINTS.USERS.LIST),
};