export const API_ENDPOINTS = {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
    },
    CHAT: {
      LIST: '/chats',
      MESSAGES: (chatId: string) => `/chats/private/678475566c6d59a6245184de/messages`, // Update this duynamically
    },
    CHANNELS: {
      LIST: '/channels/all',
    },
    USERS: {
      LIST: '/users/all',
      ME: (userId: string) => `/users?id=${userId}`
    },
  } as const;