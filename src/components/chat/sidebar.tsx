import { useEffect, useState } from 'react';
import { Hash, Users, Plus, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from '@/components/theme-toggle';
import { useChatStore } from '@/lib/store';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Channel, DirectConversation, MyPorfile } from '@/types';

const DefaultAvatar = "https://cdn.pixabay.com/photo/2021/01/24/20/47/tabby-5946499_1280.jpg";

interface SidebarProps {
  onChannelSelect: (id: string) => void;
  onConversationSelect: (id: string) => void;
  selectedChannelId: string | null;
  selectedConversationId: string | null;
}

export function Sidebar({
  onChannelSelect,
  onConversationSelect,
  selectedChannelId,
  selectedConversationId,
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<'channels' | 'dms'>('channels');

  const {
    fetchChannels,
    fetchUsers,
    initializeCurrentUser,
    conversations,
    channels,
    currentUser,
  } = useChatStore(
    state => ({
      fetchChannels: state.fetchChannels,
      fetchUsers: state.fetchUsers,
      initializeCurrentUser: state.initializeCurrentUser,
      conversations: state.conversations,
      channels: state.channels,
      currentUser: state.currentUser,
    })
  );

  useEffect(() => {
    console.log('Fetching channel and user details...');
    fetchChannels();
    fetchUsers();
    initializeCurrentUser();
  }, [fetchChannels, fetchUsers, initializeCurrentUser]);

  useEffect(() => {
    console.log('conversations:', conversations);
    console.log('channels:', channels);
    console.log('currentUser:', currentUser);
    console.log("username", currentUser?.username);
  }, [conversations, channels, currentUser]);

  return (
    <div className="w-64 border-r bg-muted/50 flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold">Chat App</h2>
        <ThemeToggle />
      </div>

      <div className="p-2 border-b">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={activeTab === 'channels' ? 'secondary' : 'ghost'}
            className="w-full"
            onClick={() => setActiveTab('channels')}
          >
            <Hash className="w-4 h-4 mr-2" />
            Channels
          </Button>
          <Button
            variant={activeTab === 'dms' ? 'secondary' : 'ghost'}
            className="w-full"
            onClick={() => setActiveTab('dms')}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Messages
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        {activeTab === 'channels' ? (
          <div className="p-2">
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-sm font-medium">Channels</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-6 h-6">
                    <Plus className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Create Channel</TooltipContent>
              </Tooltip>
            </div>
            <ChannelList
              channels={channels}
              selectedId={selectedChannelId}
              onSelect={onChannelSelect}
            />
          </div>
        ) : (
          <div className="p-2">
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-sm font-medium">Direct Messages</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-6 h-6">
                    <Plus className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>New Message</TooltipContent>
              </Tooltip>
            </div>
            <DirectMessagesList
              conversations={conversations}
              selectedId={selectedConversationId}
              onSelect={onConversationSelect}
            />
          </div>
        )}
      </ScrollArea>

      <div className="p-1 border-t mt-auto">
        {currentUser ? <UserProfile user={currentUser} /> : <Badge variant="default"> Loading</Badge>}
      </div>
    </div>
  );
}

function ChannelList({ channels, selectedId, onSelect }: { channels: Channel[], selectedId: string | null, onSelect: (id: string) => void }) {
  return (
    <div className="space-y-1">
      {channels.map((channel) => (
        <Button
          key={channel.id}
          variant={selectedId === channel.id ? 'secondary' : 'ghost'}
          className={cn(
            'w-full flex justify-between',
            selectedId === channel.id && 'bg-muted'
          )}
          onClick={() => onSelect(channel.id)}
        >
          {/* <Hash className="w-4 h-4 mr-2" /> */}
          {channel.name} <Badge variant="default"> {channel.participantCount}</Badge>

          {channel.type === 'private' && (
            <span className="ml-auto">
              <Users className="w-3 h-3" />
            </span>
          )}
        </Button>
      ))}
    </div>
  );
}

function DirectMessagesList({ conversations, selectedId, onSelect }: { conversations: DirectConversation[], selectedId: string | null, onSelect: (id: string) => void }) {
  const { currentUser } = useChatStore();

  return (
    <div className="space-y-1">
      {conversations.map((conversation) => {
        const otherParticipant = conversation.participants.find(p => p.id !== currentUser.id);
        console.log("otherParticipant", otherParticipant);
        if (!otherParticipant) return null;

        return (
          <Button
            key={conversation.id}
            variant={selectedId === conversation.id ? 'secondary' : 'ghost'}
            className={cn(
              'w-full justify-start',
              selectedId === conversation.id && 'bg-muted'
            )}
            onClick={() => onSelect(conversation.id)}
          >
            <Avatar className="w-6 h-6 mr-2">
              <AvatarImage src={otherParticipant.avatar} />
              <AvatarFallback>{otherParticipant?.name}</AvatarFallback>
            </Avatar>
            {otherParticipant?.name}
            <span className={cn(
              'w-2 h-2 rounded-full ml-auto',
              otherParticipant.status === 'online' ? 'bg-green-500' :
                otherParticipant.status === 'away' ? 'bg-yellow-500' : 'bg-gray-300'
            )} />
          </Button>
        );
      })}
    </div>
  );

  // return (
  //   <div className="space-y-1">
  //     {conversations.map((conversation) => {
  //       const otherParticipant = conversation.participants.find(p => p.id !== currentUser.id);
  //       if (!otherParticipant) return null;

  //       return (
  //         <Button
  //           key={conversation.id}
  //           variant={selectedId === conversation.id ? 'secondary' : 'ghost'}
  //           className={cn(
  //             'w-full justify-start',
  //             selectedId === conversation.id && 'bg-muted'
  //           )}
  //           onClick={() => onSelect(conversation.id)}
  //         >
  //           <Avatar className="w-6 h-6 mr-2">
  //             <AvatarImage src={otherParticipant.avatar} />
  //             <AvatarFallback>{otherParticipant.name[0]}</AvatarFallback>
  //           </Avatar>
  //           {otherParticipant.name}
  //           <span className={cn(
  //             'w-2 h-2 rounded-full ml-auto',
  //             otherParticipant.status === 'online' ? 'bg-green-500' :
  //             otherParticipant.status === 'away' ? 'bg-yellow-500' : 'bg-gray-300'
  //           )} />
  //         </Button>
  //       );
  //     })}
  //   </div>
  // );
}


function UserProfile({ user }: { user: MyPorfile }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
      <Avatar className="w-10 h-10">
        <AvatarImage src={user?.avatar || DefaultAvatar} />
        <AvatarFallback className="text-sm">
          {user?.username?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">{user?.username}</p>
        <p className="text-xs text-muted-foreground capitalize">{user?.status || 'offline'}</p>
      </div>
    </div>
  );
}