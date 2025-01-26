import { useState } from 'react';
import { Sidebar } from './sidebar';
import { ChatWindow } from './chat-window';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/lib/api/store/store';

export function ChatLayout() {

  const {
    fetchChatMessage,
  } = useChatStore(
    state => ({
      fetchChatMessage: state.fetchChatMessage,
    })
  );

  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  const handleChannelSelect = (channelId: string) => {
    setSelectedChannelId(channelId);
    setSelectedConversationId(null); // Clear conversation when selecting channel
  };

  const handleConversationSelect = (conversationId: string, chatid: string) => {
    fetchChatMessage(chatid);
    setSelectedConversationId(conversationId);
    setSelectedChannelId(null); // Clear channel when selecting conversation
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        onChannelSelect={handleChannelSelect}
        onConversationSelect={handleConversationSelect}
        selectedChannelId={selectedChannelId}
        selectedConversationId={selectedConversationId}
      />
      <main className={cn("flex-1 flex flex-col")}>
        <ChatWindow
          channelId={selectedChannelId}
          conversationId={selectedConversationId}
        />
      </main>
    </div>
  );
}