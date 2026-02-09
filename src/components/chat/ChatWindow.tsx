/**
 * ChatWindow Component
 * Main chat interface with messages and input
 */

import React, { useEffect, useRef } from 'react';
import { useRealtimeMessages } from '@/hooks/useRealtimeMessages';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, MessageCircle } from 'lucide-react';

interface ChatWindowProps {
  matchId: string;
  currentUserId: string;
  buddyName: string;
  buddyAvatar?: string | null;
  onBack?: () => void;
  isMatchAccepted: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  matchId,
  currentUserId,
  buddyName,
  buddyAvatar,
  onBack,
  isMatchAccepted,
}) => {
  const { messages, isLoading, isSending, sendMessage, markAsRead } =
    useRealtimeMessages({ matchId });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark unread messages as read
  useEffect(() => {
    const unreadMessages = messages
      .filter((msg) => msg.sender_id !== currentUserId && !msg.read_at)
      .map((msg) => msg.id);

    if (unreadMessages.length > 0) {
      markAsRead(unreadMessages);
    }
  }, [messages, currentUserId, markAsRead]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="flex flex-col h-[600px] max-h-[80vh]">
      {/* Chat Header */}
      <CardHeader className="flex-shrink-0 border-b py-3">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="h-8 w-8"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <Avatar className="h-10 w-10">
            <AvatarImage src={buddyAvatar || undefined} alt={buddyName} />
            <AvatarFallback>{getInitials(buddyName)}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-lg font-semibold">{buddyName}</CardTitle>
        </div>
      </CardHeader>

      {/* Messages Area */}
      <CardContent className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          // Loading skeleton
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}
              >
                <Skeleton className="h-12 w-48 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No messages yet</p>
            <p className="text-sm text-muted-foreground">
              Start the conversation with your travel buddy!
            </p>
          </div>
        ) : (
          // Messages list
          <>
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                content={msg.content}
                createdAt={msg.created_at}
                isOwnMessage={msg.sender_id === currentUserId}
                isRead={!!msg.read_at}
                senderName={msg.sender_id !== currentUserId ? buddyName : undefined}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </CardContent>

      {/* Chat Input */}
      {isMatchAccepted ? (
        <ChatInput
          onSend={sendMessage}
          isSending={isSending}
          placeholder={`Message ${buddyName}...`}
        />
      ) : (
        <div className="p-4 border-t bg-muted/50 text-center">
          <p className="text-sm text-muted-foreground">
            ⏳ Waiting for match to be accepted before you can chat
          </p>
        </div>
      )}
    </Card>
  );
};
