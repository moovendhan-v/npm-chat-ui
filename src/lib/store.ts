import { create } from 'zustand';
import { Channel, DirectConversation, Message, User } from '@/types';
import { channelService } from './api/services/channel.service';
import { userService } from './api/services/user.service';

interface ChatState {
  channels: Channel[];
  conversations: DirectConversation[];
  currentUser: User;
  selectedChannelId: string | null;
  selectedConversationId: string | null;
  addMessage: (content: string, channelId?: string, conversationId?: string) => void;
  updateUserStatus: (userId: string, status: User['status']) => void;
  setSelectedChannel: (channelId: string | null) => void;
  setSelectedConversation: (conversationId: string | null) => void;
  initializeCurrentUser: () => Promise<void>;
  fetchChannels: () => Promise<void>;
  fetchUsers: () => Promise<void>;
}

const mockUsers: User[] = [
  {
    id: '1',
    username: 'Jane Cooper',
    email: 'jane@example.com',
    status: 'online',
  }
];

export const useChatStore = create<ChatState>((set) => ({
  channels: [],
  conversations: [],
  selectedChannelId: null,
  // currentUser: userService.getMyDetails('6755b40aa4f6b550fd0e1195'),
  currentUser: null as unknown as User,
  selectedConversationId: null,

  initializeCurrentUser: async () => {
    try {
      // Ensure response data is an array of users
      const response = await userService.getMyDetails('6755b40aa4f6b550fd0e1195');
      console.log('Fetched current user:', response.data);

      // Check if the response data is an array and if so, set the first user
      if (Array.isArray(response.data) && response.data.length > 0) {
        set({ currentUser: response.data[0] });
      } else {
        console.error('No user found in response');
      }
    } catch (error) {
      console.error('Failed to fetch current user:', error);
    }
  },

  fetchChannels: async () => {
    try {
      const response = await channelService.getChannles();
      console.log('Fetched channels:', response.data);

      const channels = response.data.map((channel: any) => ({
        ...channel,
        members: channel.members || [],
      }));

      set({ channels });
    } catch (error) {
      console.error('Failed to fetch channels:', error);
    }
  },

  fetchUsers: async () => {
    try {
      const response = await userService.getAllUsers();
      console.log('Fetched users:', response.data);

      // Transform the response to match the expected structure
      const conversations = response.data.map((user: any) => ({
        id: user.id,
        participants: [
          {
            id: user.id,
            name: user.username,
            email: user.email,
            avatar: `https://api.dicebear.com/5.x/avataaars/svg?seed=${user.username}`,
            status: 'offline', // Default status
          },
        ],
        messages: [],
        lastMessage: null,
      }));

      set({ conversations });
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  },

  addMessage: (content, channelId, conversationId) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content,
      sender: mockUsers[0], // Current user
      timestamp: new Date(),
    };

    set((state) => {

      if (channelId) {
        const updatedChannels = state.channels.map((channel) => {
          if (channel.id === channelId) {
            return {
              ...channel,
              messages: [...channel.messages, newMessage],
            };
          }
          return channel;
        });
        return { channels: updatedChannels };
      }

      if (conversationId) {
        const updatedConversations = state.conversations.map((conversation) => {
          if (conversation.id === conversationId) {
            return {
              ...conversation,
              messages: [...conversation.messages, newMessage],
              lastMessage: newMessage,
            };
          }
          return conversation;
        });
        return { conversations: updatedConversations };
      }

      return state;
    });
  },

  updateUserStatus: (userId, status) => {
    set((state) => {
      const updatedChannels = state.channels.map((channel) => ({
        ...channel,
        members: channel.members.map((member) =>
          member.id === userId ? { ...member, status } : member
        ),
      }));

      const updatedConversations = state.conversations.map((conversation) => {
        if (conversation.participants) {
          return {
            ...conversation,
            participants: conversation.participants.map((participant) =>
              participant.id === userId ? { ...participant, status } : participant
            ),
          };
        }
        return conversation;
      });

      return {
        channels: updatedChannels,
        conversations: updatedConversations,
      };
    });
  },

  setSelectedChannel: (channelId) => set({ selectedChannelId: channelId, selectedConversationId: null }),
  setSelectedConversation: (conversationId) => set({ selectedConversationId: conversationId, selectedChannelId: null }),
}));


// Initialize the current user when the store is created
(async () => {
  const chatStore = useChatStore.getState();
  await chatStore.initializeCurrentUser();
})();