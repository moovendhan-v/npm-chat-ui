import { io, Socket } from 'socket.io-client';
import { Message, User } from '@/types';

interface ServerToClientEvents {
  'message:received': (message: Message) => void;
  'user:connected': (user: User) => void;
  'user:disconnected': (user: User) => void;
  'user:list': (users: User[]) => void;
  'typing:update': (data: {
    userId: string;
    channelId?: string;
    conversationId?: string;
    isTyping: boolean;
  }) => void;
}

interface ClientToServerEvents {
  'user:join': (user: User) => void;
  'message:send': (message: Omit<Message, 'id' | 'timestamp'>) => void;
  'typing:start': (data: {
    userId: string;
    channelId?: string;
    conversationId?: string;
  }) => void;
  'typing:stop': (data: {
    userId: string;
    channelId?: string;
    conversationId?: string;
  }) => void;
}

export default class SocketClient {
  private static instance: SocketClient;
  private socket: Socket<ServerToClientEvents, ClientToServerEvents>;

  private constructor() {
    this.socket = io('http://localhost:8085');
    this.setupListeners();
  }

  public static getInstance(): SocketClient {
    if (!SocketClient.instance) {
      SocketClient.instance = new SocketClient();
    }
    return SocketClient.instance;
  }

  private setupListeners() {
    this.socket.on('connect', () => {
      console.log('socket:: Connected to socket server');
    });

    // this.socket.on('disconnect', () => {
    //   console.log('Disconnected from socket server');
    // });
  }

  public joinChat(user: User) {
    this.socket.emit('user:join', user);
  }

  public sendMessage(message: Omit<Message, 'id' | 'timestamp'>) {
    this.socket.emit('message:send', message);
  }

  public startTyping(data: {
    userId: string;
    channelId?: string;
    conversationId?: string;
  }) {
    this.socket.emit('typing:start', data);
  }

  public stopTyping(data: {
    userId: string;
    channelId?: string;
    conversationId?: string;
  }) {
    this.socket.emit('typing:stop', data);
  }

  public onMessageReceived(callback: (message: Message) => void) {
    this.socket.on('message:received', callback);
    return () => this.socket.off('message:received', callback);
  }

  public onUserConnected(callback: (user: User) => void) {
    this.socket.on('user:connected', callback);
    return () => this.socket.off('user:connected', callback);
  }

  public onUserDisconnected(callback: (user: User) => void) {
    this.socket.on('user:disconnected', callback);
    return () => this.socket.off('user:disconnected', callback);
  }

  public onUserListUpdate(callback: (users: User[]) => void) {
    this.socket.on('user:list', callback);
    return () => this.socket.off('user:list', callback);
  }

  public onTypingUpdate(
    callback: (data: {
      userId: string;
      channelId?: string;
      conversationId?: string;
      isTyping: boolean;
    }) => void
  ) {
    this.socket.on('typing:update', callback);
    return () => this.socket.off('typing:update', callback);
  }
}