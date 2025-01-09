import { Channel, DirectConversation, Message, User } from '@/types';
import { create } from 'zustand';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Jane Cooper',
    email: 'jane@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop',
    status: 'online',
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150&h=150&auto=format&fit=crop',
    status: 'offline',
  },
  {
    id: '3',
    name: 'Alice Smith',
    email: 'alice@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&h=150&auto=format&fit=crop',
    status: 'away',
  },
];

const initialChannels: Channel[] = [
  {
    id: '1',
    name: 'general',
    description: 'General discussions',
    type: 'public',
    members: mockUsers,
    messages: [],
  },
  {
    id: '2',
    name: 'random',
    description: 'Random chat',
    type: 'public',
    members: mockUsers,
    messages: [],
  },
  {
    id: '3',
    name: 'team-chat',
    description: 'Private team discussions',
    type: 'private',
    members: [mockUsers[0], mockUsers[1]],
    messages: [],
  },
];

const initialConversations: DirectConversation[] = [
  {
    id: '1',
    participants: [mockUsers[0], mockUsers[1]],
    messages: [],
  },
  {
    id: '2',
    participants: [mockUsers[0], mockUsers[2]],
    messages: [],
  },
];

// Generate initial mock messages
const generateMockMessages = (count: number, users: User[]): Message[] => {
  const messages: Message[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const sender = users[Math.floor(Math.random() * users.length)];
    messages.push({
      id: `msg-${i}`,
      content: `This is test message ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
      sender,
      timestamp: new Date(now.getTime() - (count - i) * 1000 * 60 * 5), // 5 minutes apart
    });
  }

  return messages;
};

// Add initial messages
initialChannels.forEach(channel => {
  channel.messages = generateMockMessages(10, channel.members);
});

initialConversations.forEach(conversation => {
  conversation.messages = generateMockMessages(8, conversation.participants);
  conversation.lastMessage = conversation.messages[conversation.messages.length - 1];
});

// Create store for managing chat state
interface ChatStore {
  channels: Channel[];
  conversations: DirectConversation[];
  currentUser: User;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>, channelId?: string, conversationId?: string) => void;
  updateUserStatus: (userId: string, status: User['status']) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  channels: initialChannels,
  conversations: initialConversations,
  currentUser: mockUsers[0], // Default to first user

  addMessage: (message, channelId, conversationId) => {
    const newMessage: Message = {
      ...message,
      id: `msg-${Date.now()}`,
      timestamp: new Date(),
    };

    set((state) => {
      if (channelId) {
        const updatedChannels = state.channels.map(channel => {
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
        const updatedConversations = state.conversations.map(conversation => {
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
      // Update user status in channels
      const updatedChannels = state.channels.map(channel => ({
        ...channel,
        members: channel.members.map(member =>
          member.id === userId ? { ...member, status } : member
        ),
      }));

      // Update user status in conversations
      const updatedConversations = state.conversations.map(conversation => ({
        ...conversation,
        participants: conversation.participants.map(participant =>
          participant.id === userId ? { ...participant, status } : participant
        ),
      }));

      return {
        channels: updatedChannels,
        conversations: updatedConversations,
      };
    });
  },
}));