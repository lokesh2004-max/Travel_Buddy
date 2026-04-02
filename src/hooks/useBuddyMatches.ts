/**
 * Custom Hook: useBuddyMatches
 * Manages buddy match operations and state.
 * Matches are between logged-in user (user_id) and dummy buddies (buddy_id).
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BuddyMatch {
  id: string;
  user_id: string;
  buddy_id: string | null;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface MatchWithProfile extends BuddyMatch {
  buddy_profile: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    bio: string | null;
    interests: string[] | null;
    location: string | null;
  } | null;
}

export const useBuddyMatches = () => {
  const { toast } = useToast();
  const [matches, setMatches] = useState<MatchWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setCurrentUserId(data.user?.id || null);
    };
    getUser();
  }, []);

  const fetchMatches = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) { setMatches([]); return; }

      const userId = userData.user.id;

      const { data: matchesData, error: matchesError } = await supabase
        .from('buddy_matches')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (matchesError) throw matchesError;

      // Fetch buddy info from buddies table (not profiles)
      const matchesWithProfiles: MatchWithProfile[] = await Promise.all(
        (matchesData || []).map(async (match) => {
          const buddyId = match.buddy_id;
          let buddyProfile: MatchWithProfile['buddy_profile'] = null;

          if (buddyId) {
            const { data: buddyData } = await supabase
              .from('buddies')
              .select('id, full_name, avatar_url, bio, interests, location')
              .eq('id', buddyId)
              .single();

            if (buddyData) {
              buddyProfile = {
                id: buddyData.id,
                full_name: buddyData.full_name,
                avatar_url: buddyData.avatar_url,
                bio: buddyData.bio,
                interests: buddyData.interests as string[] | null,
                location: buddyData.location,
              };
            }
          }

          return {
            ...match,
            status: match.status as 'pending' | 'accepted' | 'rejected',
            buddy_profile: buddyProfile,
          };
        })
      );

      setMatches(matchesWithProfiles);
    } catch (error) {
      console.error('Failed to fetch matches:', error);
      toast({ title: 'Error', description: 'Failed to load your matches', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const createMatch = useCallback(
    async (buddyId: string): Promise<string | null> => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error('You must be logged in');

        // Duplicate check
        const { data: existing } = await supabase
          .from('buddy_matches')
          .select('id')
          .eq('user_id', userData.user.id)
          .eq('buddy_id', buddyId)
          .maybeSingle();

        if (existing) {
          toast({ title: 'Already Requested', description: 'You have already sent a request to this buddy.' });
          return existing.id;
        }

        const { data, error } = await supabase
          .from('buddy_matches')
          .insert({ user_id: userData.user.id, buddy_id: buddyId, status: 'pending' })
          .select('id')
          .single();

        if (error) throw error;

        toast({ title: 'Match Request Sent! 🎉', description: 'Waiting for your buddy to accept' });
        await fetchMatches();
        return data.id;
      } catch (error: any) {
        console.error('Failed to create match:', error);
        toast({ title: 'Failed to send request', description: error.message || 'Could not create match', variant: 'destructive' });
        return null;
      }
    },
    [toast, fetchMatches]
  );

  const acceptMatch = useCallback(
    async (matchId: string): Promise<boolean> => {
      try {
        const { error } = await supabase.from('buddy_matches').update({ status: 'accepted' }).eq('id', matchId);
        if (error) throw error;
        toast({ title: 'Match Accepted! 🤝', description: 'You can now start chatting with your travel buddy' });
        await fetchMatches();
        return true;
      } catch (error: any) {
        console.error('Failed to accept match:', error);
        toast({ title: 'Failed to accept', description: error.message, variant: 'destructive' });
        return false;
      }
    },
    [toast, fetchMatches]
  );

  const rejectMatch = useCallback(
    async (matchId: string): Promise<boolean> => {
      try {
        const { error } = await supabase.from('buddy_matches').update({ status: 'rejected' }).eq('id', matchId);
        if (error) throw error;
        toast({ title: 'Match Declined', description: 'The match request has been declined' });
        await fetchMatches();
        return true;
      } catch (error: any) {
        console.error('Failed to reject match:', error);
        toast({ title: 'Failed to decline', description: error.message, variant: 'destructive' });
        return false;
      }
    },
    [toast, fetchMatches]
  );

  useEffect(() => { fetchMatches(); }, [fetchMatches]);

  return { matches, isLoading, currentUserId, createMatch, acceptMatch, rejectMatch, refetch: fetchMatches };
};
