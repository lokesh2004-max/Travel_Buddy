/**
 * Custom Hook: useRealtimeMessages
 * Manages real-time message subscriptions and CRUD operations
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  read_at: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

interface UseRealtimeMessagesProps {
  matchId: string | null;
}

export const useRealtimeMessages = ({ matchId }: UseRealtimeMessagesProps) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  // Fetch initial messages
  const fetchMessages = useCallback(async () => {
    if (!matchId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('match_id', matchId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load messages',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [matchId, toast]);

  // Send a new message
  const sendMessage = useCallback(
    async (content: string): Promise<boolean> => {
      if (!matchId || !content.trim()) return false;

      setIsSending(true);
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
          throw new Error('You must be logged in to send messages');
        }

        const { error } = await supabase.from('messages').insert({
          match_id: matchId,
          sender_id: userData.user.id,
          content: content.trim(),
        });

        if (error) throw error;
        return true;
      } catch (error: any) {
        console.error('Failed to send message:', error);
        toast({
          title: 'Failed to send',
          description: error.message || 'Could not send message',
          variant: 'destructive',
        });
        return false;
      } finally {
        setIsSending(false);
      }
    },
    [matchId, toast]
  );

  // Mark messages as read
  const markAsRead = useCallback(
    async (messageIds: string[]) => {
      if (!messageIds.length) return;

      try {
        const { error } = await supabase
          .from('messages')
          .update({ read_at: new Date().toISOString() })
          .in('id', messageIds);

        if (error) throw error;
      } catch (error) {
        console.error('Failed to mark messages as read:', error);
      }
    },
    []
  );

  // Set up realtime subscription
  useEffect(() => {
    if (!matchId) return;

    fetchMessages();

    // Subscribe to new messages
    const channel: RealtimeChannel = supabase
      .channel(`messages:${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          const updatedMessage = payload.new as Message;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === updatedMessage.id ? updatedMessage : msg
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId, fetchMessages]);

  return {
    messages,
    isLoading,
    isSending,
    sendMessage,
    markAsRead,
    refetch: fetchMessages,
  };
};
