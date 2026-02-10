/**
 * Custom Hook: useBuddyMatches
 * Manages buddy match operations and state
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Fallback names for mock buddies without Supabase profiles
const MOCK_BUDDY_NAMES: Record<string, { name: string; location: string }> = {
  'a0000000-0000-0000-0000-000000000001': { name: 'Priya Sharma', location: 'Delhi' },
  'a0000000-0000-0000-0000-000000000002': { name: 'Anmol Verma', location: 'Arunachal Pradesh' },
  'a0000000-0000-0000-0000-000000000003': { name: 'Diksha Upadhyay', location: 'Assam' },
  'a0000000-0000-0000-0000-000000000004': { name: 'Aarav Singh', location: 'Karnal' },
  'a0000000-0000-0000-0000-000000000005': { name: 'Kavya Menon', location: 'Srinagar' },
  'a0000000-0000-0000-0000-000000000006': { name: 'Rohan Kapoor', location: 'Bangalore' },
  'a0000000-0000-0000-0000-000000000007': { name: 'Sneha Reddy', location: 'Hyderabad' },
  'a0000000-0000-0000-0000-000000000008': { name: 'Arjun Malhotra', location: 'Mumbai' },
  'a0000000-0000-0000-0000-000000000009': { name: 'Ishita Bose', location: 'Kolkata' },
  'a0000000-0000-0000-0000-000000000010': { name: 'Vikram Nair', location: 'Kerala' },
  'a0000000-0000-0000-0000-000000000011': { name: 'Aisha Patel', location: 'Goa' },
  'a0000000-0000-0000-0000-000000000012': { name: 'Karan Thakur', location: 'Himachal Pradesh' },
  'a0000000-0000-0000-0000-000000000013': { name: 'Meera Desai', location: 'Pune' },
  'a0000000-0000-0000-0000-000000000014': { name: 'Siddharth Gupta', location: 'Rajasthan' },
  'a0000000-0000-0000-0000-000000000015': { name: 'Tanvi Rao', location: 'Chennai' },
};
export interface BuddyMatch {
  id: string;
  user1_id: string;
  user2_id: string;
  trip_id: string;
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

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setCurrentUserId(data.user?.id || null);
    };
    getUser();
  }, []);

  // Fetch all matches for current user
  const fetchMatches = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setMatches([]);
        return;
      }

      const userId = userData.user.id;

      // Get matches where user is either user1 or user2
      const { data: matchesData, error: matchesError } = await supabase
        .from('buddy_matches')
        .select('*')
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
        .order('updated_at', { ascending: false });

      if (matchesError) throw matchesError;

      // Get buddy profiles for each match
      const matchesWithProfiles: MatchWithProfile[] = await Promise.all(
        (matchesData || []).map(async (match) => {
          const buddyId = match.user1_id === userId ? match.user2_id : match.user1_id;
          
          const { data: profileData } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url, bio, interests, location')
            .eq('id', buddyId)
            .single();

          // Fallback for mock buddies without Supabase profiles
          const mockInfo = MOCK_BUDDY_NAMES[buddyId];
          const buddyProfile = profileData || (mockInfo ? {
            id: buddyId,
            full_name: mockInfo.name,
            avatar_url: null,
            bio: null,
            interests: null,
            location: mockInfo.location,
          } : null);

          const status = match.status as 'pending' | 'accepted' | 'rejected';

          return {
            ...match,
            status,
            buddy_profile: buddyProfile,
          };
        })
      );

      setMatches(matchesWithProfiles);
    } catch (error) {
      console.error('Failed to fetch matches:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your matches',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Create a new match request
  const createMatch = useCallback(
    async (buddyUserId: string, tripId: string): Promise<string | null> => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
          throw new Error('You must be logged in to create a match');
        }

        const { data, error } = await supabase
          .from('buddy_matches')
          .insert({
            user1_id: userData.user.id,
            user2_id: buddyUserId,
            trip_id: tripId,
            status: 'pending',
          })
          .select('id')
          .single();

        if (error) throw error;

        toast({
          title: 'Match Request Sent! 🎉',
          description: 'Waiting for your buddy to accept',
        });

        await fetchMatches();
        return data.id;
      } catch (error: any) {
        console.error('Failed to create match:', error);
        toast({
          title: 'Failed to send request',
          description: error.message || 'Could not create match',
          variant: 'destructive',
        });
        return null;
      }
    },
    [toast, fetchMatches]
  );

  // Accept a match request
  const acceptMatch = useCallback(
    async (matchId: string): Promise<boolean> => {
      try {
        const { error } = await supabase
          .from('buddy_matches')
          .update({ status: 'accepted' })
          .eq('id', matchId);

        if (error) throw error;

        toast({
          title: 'Match Accepted! 🤝',
          description: 'You can now start chatting with your travel buddy',
        });

        await fetchMatches();
        return true;
      } catch (error: any) {
        console.error('Failed to accept match:', error);
        toast({
          title: 'Failed to accept',
          description: error.message || 'Could not accept match',
          variant: 'destructive',
        });
        return false;
      }
    },
    [toast, fetchMatches]
  );

  // Reject a match request
  const rejectMatch = useCallback(
    async (matchId: string): Promise<boolean> => {
      try {
        const { error } = await supabase
          .from('buddy_matches')
          .update({ status: 'rejected' })
          .eq('id', matchId);

        if (error) throw error;

        toast({
          title: 'Match Declined',
          description: 'The match request has been declined',
        });

        await fetchMatches();
        return true;
      } catch (error: any) {
        console.error('Failed to reject match:', error);
        toast({
          title: 'Failed to decline',
          description: error.message || 'Could not decline match',
          variant: 'destructive',
        });
        return false;
      }
    },
    [toast, fetchMatches]
  );

  // Initial fetch
  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return {
    matches,
    isLoading,
    currentUserId,
    createMatch,
    acceptMatch,
    rejectMatch,
    refetch: fetchMatches,
  };
};
