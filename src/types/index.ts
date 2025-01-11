export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  status?: 'online' | 'offline' | 'away';
}

export interface Message {
  id: string;
  content: string;
  sender: User;
  timestamp: Date;
  channelId?: string;
  conversationId?: string;
}

export interface Channel {
  id: string;
  name: string;
  description?: string;
  type: 'public' | 'private';
  members: User[];
  participantCount: number;
  messages: Message[];
}

export interface DirectConversation {
  id: string;
  participants: User[];
  messages: Message[];
  lastMessage?: Message;
}