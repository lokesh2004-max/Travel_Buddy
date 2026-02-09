/**
 * ChatMessage Component
 * Renders a single chat message bubble
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';

interface ChatMessageProps {
  content: string;
  createdAt: string;
  isOwnMessage: boolean;
  isRead: boolean;
  senderName?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  createdAt,
  isOwnMessage,
  isRead,
  senderName,
}) => {
  const formattedTime = format(new Date(createdAt), 'h:mm a');

  return (
    <div
      className={cn(
        'flex flex-col max-w-[75%] mb-3',
        isOwnMessage ? 'ml-auto items-end' : 'mr-auto items-start'
      )}
    >
      {/* Sender name for received messages */}
      {!isOwnMessage && senderName && (
        <span className="text-xs text-muted-foreground mb-1 px-2">
          {senderName}
        </span>
      )}

      {/* Message bubble */}
      <div
        className={cn(
          'px-4 py-2 rounded-2xl break-words',
          isOwnMessage
            ? 'bg-primary text-primary-foreground rounded-br-md'
            : 'bg-muted text-foreground rounded-bl-md'
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{content}</p>
      </div>

      {/* Timestamp and read status */}
      <div className="flex items-center gap-1 mt-1 px-2">
        <span className="text-xs text-muted-foreground">{formattedTime}</span>
        {isOwnMessage && (
          <span className="text-muted-foreground">
            {isRead ? (
              <CheckCheck className="h-3 w-3 text-primary" />
            ) : (
              <Check className="h-3 w-3" />
            )}
          </span>
        )}
      </div>
    </div>
  );
};
