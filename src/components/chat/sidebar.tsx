import { useEffect, useState } from 'react';
import { Hash, Users, Plus, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from '@/components/theme-toggle';
import { useChatStore } from '@/lib/store';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Channel, DirectConversation, User } from '@/types';

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
  const { channels, conversations, currentUser, fetchChannels, fetchUsers } = useChatStore();

  // Fetch channels when the Sidebar component mounts
  useEffect(() => {
    console.log('Fetching Channle an user details...');
    fetchChannels();
    fetchUsers();
    console.log("conversations ::", conversations);
    console.log("channels ::", channels);
    console.log("currentUser ::", currentUser);
  }, [fetchChannels, fetchUsers]);

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

      <div className="p-4 border-t mt-auto">
        <UserProfile user={currentUser} />
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
              <AvatarFallback>{otherParticipant?.username[0]}</AvatarFallback>
            </Avatar>
            {otherParticipant?.username}
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

function UserProfile({ user }: { user: User }) {
  return (
    <div className="flex items-center">
      <Avatar className="w-8 h-8 mr-2">
        <AvatarImage src={user?.avatar} />
        <AvatarFallback>{user?.username[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="text-sm font-medium">{user?.username}</p>
        <p className="text-xs text-muted-foreground">{user?.status}</p>
      </div>
    </div>
  );
}
