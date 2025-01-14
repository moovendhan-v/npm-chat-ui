import { create } from 'zustand';
import { Channel, DirectConversation, Message, User } from '@/types';
import { channelService } from '../services/channel.service';
import { userService } from '../services/user.service';
import { chatService } from '../services/chat.service';

interface ChatState {
  channels: Channel[];
  conversations: DirectConversation[];
  currentUser: User;
  selectedChannelId: string | null;
  selectedConversationId: string | null;
  onlineUsers: User[];
  typingUsers: {
    userId: string;
    channelId?: string;
    conversationId?: string;
  }[];
  addMessage: (content: string, channelId?: string, conversationId?: string) => void;
  updateUserStatus: (userId: string, status: User['status']) => void;
  setSelectedChannel: (channelId: string | null) => void;
  setSelectedConversation: (conversationId: string | null) => void;
  initializeCurrentUser: () => Promise<void>;
  fetchChannels: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  fetchChatMessage: (chatId: string) => Promise<void>; // Updated to accept chatId
  addTypingUser: (data: {
    userId: string;
    channelId?: string;
    conversationId?: string;
  }) => void;
  removeTypingUser: (data: {
    userId: string;
    channelId?: string;
    conversationId?: string;
  }) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  channels: [],
  conversations: [],
  selectedChannelId: null,
  currentUser: null as unknown as User,
  selectedConversationId: null,
  onlineUsers: [],
  typingUsers: [],

  initializeCurrentUser: async () => {
    try {
      // Ensure response data is an array of users
      const response = await userService.getMyDetails('6755b40aa4f6b550fd0e1195');
      console.log('Fetched current user:', response.data);

      // Check if the response data is an array and if so, set the first user
      if (Array.isArray(response.data) && response.data.length > 0) {
        const user = response.data[0];
        const DefaultAvatar = "https://cdn.pixabay.com/photo/2021/01/24/20/47/tabby-5946499_1280.jpg";
        set({ currentUser: { ...user, avatar: user?.avatar || DefaultAvatar } });
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
            username: user.username,
            email: user.email,
            avatar: `https://api.dicebear.com/5.x/avataaars/svg?seed=${user.username}`,
            status: 'offline', // Default status
          },
        ],
        messages: [],
        lastMessage: null,
      }));

      console.log('Transformed users:', conversations);

      set({ conversations });
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  },

  addMessage: (content, channelId, conversationId) => {

    set((state) => {

      const { currentUser } = state;

      // Validate if currentUser is defined
      if (!currentUser) {
        console.error("Cannot send message: currentUser is not defined.");
        return state;
      }

      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        content,
        sender: currentUser, // Current user
        timestamp: new Date(),
      };

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

  fetchChatMessage: async (chatId: string) => {
    try {
      const response = await chatService.getMessages(chatId);
      console.log('Fetched messages:', response.data);
  
      const messages = response.data.map((message: any) => ({
        id: message.id,
        content: message.content,
        sender: message.sender,
        timestamp: new Date(message.createdAt),
      }));
  
      set((state) => {
        // Find the conversation or channel associated with the chatId
        const updatedConversations = state.conversations.map((conversation) =>
          conversation.id === chatId
            ? { ...conversation, messages }
            : conversation
        );
  
        return { conversations: updatedConversations };
      });
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
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

  addTypingUser: (data) =>
    set((state) => ({
      typingUsers: [...state.typingUsers, data],
    })),

  removeTypingUser: (data) =>
    set((state) => ({
      typingUsers: state.typingUsers.filter(
        (user) =>
          user.userId !== data.userId ||
          user.channelId !== data.channelId ||
          user.conversationId !== data.conversationId
      ),
    })),
}));


// Initialize the current user when the store is created
// (async () => {
//   const chatStore = useChatStore.getState();
//   await chatStore.initializeCurrentUser();
// })();