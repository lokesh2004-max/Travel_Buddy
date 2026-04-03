/**
 * Custom Hook: useBuddyMatches
 * Manages buddy match operations and state.
 * Matches are between logged-in user (user_id) and dummy buddies (buddy_id).
 * All matches are auto-accepted since buddies are dummy data.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BuddyMatch {
  id: string;
  user_id: string;
  buddy_id: string | null;
  status: 'accepted';
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

      // Batch fetch all buddies in ONE query (fixes N+1)
      const buddyIds = (matchesData || [])
        .map(m => m.buddy_id)
        .filter(Boolean) as string[];

      let buddyMap: Record<string, MatchWithProfile['buddy_profile']> = {};

      if (buddyIds.length > 0) {
        const { data: buddiesData } = await supabase
          .from('buddies')
          .select('id, full_name, avatar_url, bio, interests, location')
          .in('id', buddyIds);

        if (buddiesData) {
          buddiesData.forEach(b => {
            buddyMap[b.id] = {
              id: b.id,
              full_name: b.full_name,
              avatar_url: b.avatar_url,
              bio: b.bio,
              interests: b.interests as string[] | null,
              location: b.location,
            };
          });
        }
      }

      const matchesWithProfiles: MatchWithProfile[] = (matchesData || []).map(match => ({
        ...match,
        status: match.status as 'accepted',
        buddy_profile: match.buddy_id ? buddyMap[match.buddy_id] || null : null,
      }));

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

        // Auto-accept since buddies are dummy data
        const { data, error } = await supabase
          .from('buddy_matches')
          .insert({ user_id: userData.user.id, buddy_id: buddyId, status: 'accepted' })
          .select('id')
          .single();

        if (error) throw error;

        toast({ title: 'Buddy Matched! 🎉', description: 'You can now start chatting with your travel buddy' });
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

  useEffect(() => { fetchMatches(); }, [fetchMatches]);

  return { matches, isLoading, currentUserId, createMatch, refetch: fetchMatches };
};
