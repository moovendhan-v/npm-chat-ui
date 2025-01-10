export const API_ENDPOINTS = {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
    },
    CHAT: {
      LIST: '/chats',
      MESSAGES: (chatId: string) => `/chats/${chatId}/messages`,
    },
    CHANNELS: {
      LIST: '/channels',
    },
    USERS: {
      LIST: '/users/all',
    },
  } as const;