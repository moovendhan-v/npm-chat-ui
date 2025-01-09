import axiosInstance from '../axios';
import { API_ENDPOINTS } from '../endpoints';

export const channelService = {
  getChannles: () => 
    axiosInstance.get(API_ENDPOINTS.CHANNELS.LIST),
};