import axiosInstance from '../axios';
import { API_ENDPOINTS } from '../endpoints';

export const chatService = {
  getChats: () => 
    axiosInstance.get(API_ENDPOINTS.CHAT.LIST),
  getMessages: (chatId: string) =>
    axiosInstance.get(API_ENDPOINTS.CHAT.MESSAGES(chatId)),
};