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
      LIST: '/channels/all',
    },
    USERS: {
      LIST: '/users/all',
      ME: (userId: string) => `/users?id=${userId}`
    },
  } as const;