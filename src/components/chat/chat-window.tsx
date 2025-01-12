import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/lib/api/store/store';
import SocketClient from '@/lib/socket';

interface ChatWindowProps {
  channelId: string | null;
  conversationId: string | null;
}

export function ChatWindow({ channelId, conversationId }: ChatWindowProps) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const { channels, conversations, currentUser, addMessage } = useChatStore();
  const socketClient = SocketClient.getInstance();

  useEffect(() => {
    if (currentUser) {
      // Join chat when component mounts and currentUser is available
      socketClient.joinChat(currentUser);

      // Set up message listener
      const unsubscribeMessage = socketClient.onMessageReceived((message) => {
        addMessage(message.content);
      });

      return () => {
        unsubscribeMessage();
      };
    }
  }, [currentUser]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    addMessage(message.trim(), channelId || undefined, conversationId || undefined);
    setMessage('');
  };

  const getMessages = () => {
    if (channelId) {
      const channel = channels.find(c => c.id === channelId);
      return channel?.messages || [];
    }
    if (conversationId) {
      const conversation = conversations.find(c => c.id === conversationId);
      return conversation?.messages || [];
    }
    return [];
  };

  const messages = getMessages();

  return (
    <div className="flex flex-col h-full">
      <ChatHeader channelId={channelId} conversationId={conversationId} />
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3',
                message.sender.id === currentUser.id && 'justify-end'
              )}
            >
              {message.sender.id !== currentUser.id && (
                <Avatar className="w-8 h-8">
                  <AvatarImage src={message.sender.avatar} />
                  <AvatarFallback>{message.sender.username}</AvatarFallback>
                </Avatar>
              )}
              <div>
                {message.sender.id !== currentUser.id && (
                  <p className="text-sm font-medium mb-1">{message.sender.username}</p>
                )}
                <div
                  className={cn(
                    'rounded-lg p-2 max-w-md',
                    message.sender.id === currentUser.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  {message.content}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              {message.sender.id === currentUser.id && (
                <Avatar className="w-8 h-8">
                  <AvatarImage src={message.sender.avatar} />
                  <AvatarFallback>{message.sender.username}</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button onClick={handleSendMessage}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function ChatHeader({ channelId, conversationId }: ChatWindowProps) {
  const { channels, conversations } = useChatStore();

  const getHeaderInfo = () => {
    if (channelId) {
      const channel = channels.find(c => c.id === channelId);
      return {
        name: `#${channel?.name}`,
        subtitle: `${channel?.members.length} members`,
        avatar: null,
      };
    }
    if (conversationId) {
      const conversation = conversations.find(c => c.id === conversationId);
      const participant = conversation?.participants[1]; // Get the other participant
      return {
        name: participant?.username,
        subtitle: participant?.status,
        avatar: participant?.avatar,
      };
    }
    return { name: 'Select a chat', subtitle: '', avatar: null };
  };

  const { name, subtitle, avatar } = getHeaderInfo();

  return (
    <div className="p-4 border-b">
      <div className="flex items-center">
        {avatar && (
          <Avatar className="w-8 h-8 mr-2">
            <AvatarImage src={avatar} />
            <AvatarFallback>{name?.[0]}</AvatarFallback>
          </Avatar>
        )}
        <div>
          <h3 className="font-semibold">{name}</h3>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}