import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ArrowLeft, MapPin, CheckCircle, MessageCircle, Loader2, Star, Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBookingStore } from '@/store/bookingStore';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  calculateCompatibility,
  type UserAnswers,
  type BuddyProfile,
} from '@/utils/matchingEngine';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface RealBuddy {
  id: string;
  name: string;
  location: string;
  bio: string;
  interests: string[];
  avatar_url: string | null;
  // quiz preference fields
  travel_style: string | null;
  budget: string | null;
  accommodation: string | null;
  group_size: string | null;
  destination_type: string | null;
  // computed
  matchPercentage: number;
  matchReasons: string[];
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getScoreBand(score: number): { label: string; className: string } {
  if (score >= 75) return { label: 'Excellent Match', className: 'bg-success/15 text-success border-success/30' };
  if (score >= 50) return { label: 'Good Match',      className: 'bg-primary/15 text-primary border-primary/30' };
  if (score >= 25) return { label: 'Fair Match',      className: 'bg-warning/15 text-warning border-warning/30' };
  return              { label: 'Low Match',           className: 'bg-muted text-muted-foreground border-border' };
}

function getBarColor(score: number): string {
  if (score >= 75) return 'bg-success';
  if (score >= 50) return 'bg-primary';
  if (score >= 25) return 'bg-warning';
  return 'bg-muted-foreground';
}

/** Map quiz_answers row → UserAnswers for the engine */
function toUserAnswers(row: {
  travel_style: string | null;
  budget: string | null;
  accommodation: string | null;
  group_size: string | null;
  destination_type: string | null;
}): UserAnswers {
  return {
    travel_style:     row.travel_style     ?? undefined,
    budget:           row.budget           ?? undefined,
    accommodation:    row.accommodation    ?? undefined,
    group_size:       row.group_size       ?? undefined,
    destination_type: row.destination_type ?? undefined,
  };
}

// ─── Component ─────────────────────────────────────────────────────────────────

const BuddyMatch = () => {
  const navigate  = useNavigate();
  const { toast } = useToast();
  const { setSelectedBuddy, quizAnswers, setQuizAnswers } = useBookingStore();

  const [matches,  setMatches]  = useState<RealBuddy[]>([]);
  const [showAll,  setShowAll]  = useState(false);
  const [loading,  setLoading]  = useState(true);
  const [selecting, setSelecting] = useState<string | null>(null);

  useEffect(() => {
    loadAndScore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Main data-loading function ─────────────────────────────────────────────
  const loadAndScore = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // 1. Load current user's quiz answers (Supabase is source of truth)
      let myAnswers: UserAnswers | null = null;

      if (user) {
        const { data: myRow } = await supabase
          .from('quiz_answers')
          .select('travel_style, budget, accommodation, group_size, destination_type')
          .eq('user_id', user.id)
          .maybeSingle();

        if (myRow) {
          myAnswers = toUserAnswers(myRow);
          // Keep Zustand in sync for downstream pages
          setQuizAnswers({
            travel_style:     myAnswers.travel_style,
            budget:           myAnswers.budget,
            accommodation:    myAnswers.accommodation,
            group_size:       myAnswers.group_size,
            destination_type: myAnswers.destination_type,
          });
        }
      }

      // Fallback: Zustand store (e.g. user not logged in / first visit)
      if (!myAnswers) {
        if (!quizAnswers || Object.keys(quizAnswers).length === 0) {
          navigate('/queera');
          return;
        }
        myAnswers = quizAnswers as UserAnswers;
      }

      // 2. Fetch all OTHER users: profiles joined with quiz_answers
      //    We do two queries and join in JS to stay within Supabase free-tier limits.
      const excludeId = user?.id ?? 'no-user';

      const [profilesRes, quizRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, full_name, bio, location, interests, avatar_url')
          .neq('id', excludeId),
        supabase
          .from('quiz_answers')
          .select('user_id, travel_style, budget, accommodation, group_size, destination_type')
          .neq('user_id', excludeId),
      ]);

      if (profilesRes.error) throw profilesRes.error;
      if (quizRes.error)     throw quizRes.error;

      const profiles   = profilesRes.data ?? [];
      const quizRows   = quizRes.data ?? [];

      // Build a map: user_id → quiz row
      const quizByUserId = new Map(quizRows.map(r => [r.user_id, r]));

      // 3. Build buddy objects (only users who have completed the quiz)
      const buddyCandidates: RealBuddy[] = [];

      for (const p of profiles) {
        const quiz = quizByUserId.get(p.id);
        if (!quiz) continue; // skip users who haven't taken the quiz

        const buddyProfile: BuddyProfile = {
          travel_style:     quiz.travel_style     ?? undefined,
          budget:           quiz.budget           ?? undefined,
          accommodation:    quiz.accommodation    ?? undefined,
          group_size:       quiz.group_size       ?? undefined,
          destination_type: quiz.destination_type ?? undefined,
          interests:        (p.interests as string[]) ?? [],
        };

        const { score, reasons } = calculateCompatibility(myAnswers!, buddyProfile);

        buddyCandidates.push({
          id:            p.id,
          name:          p.full_name || 'Anonymous Traveler',
          location:      p.location  || 'Unknown',
          bio:           p.bio       || 'No bio yet.',
          interests:     (p.interests as string[]) || [],
          avatar_url:    p.avatar_url,
          travel_style:  quiz.travel_style,
          budget:        quiz.budget,
          accommodation: quiz.accommodation,
          group_size:    quiz.group_size,
          destination_type: quiz.destination_type,
          matchPercentage: score,
          matchReasons:    reasons,
        });
      }

      // 4. Sort descending; keep top 10
      buddyCandidates.sort((a, b) => b.matchPercentage - a.matchPercentage);
      setMatches(buddyCandidates.slice(0, 10));

    } catch (err) {
      console.error('[BuddyMatch] Error:', err);
      toast({
        title: 'Could not load matches',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // ── Select a buddy ─────────────────────────────────────────────────────────
  const handleSelectBuddy = async (buddy: RealBuddy) => {
    setSelecting(buddy.id);
    try {
      // Store for BuddyDetails page
      localStorage.setItem('selectedBuddy', JSON.stringify(buddy));
      setSelectedBuddy({
        id:              buddy.id,
        name:            buddy.name,
        image:           buddy.avatar_url || '🧑',
        age:             0,
        location:        buddy.location,
        bio:             buddy.bio,
        interests:       buddy.interests,
        matchPercentage: buddy.matchPercentage,
      });

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Check for existing match to avoid duplicates
        const { data: existing } = await supabase
          .from('buddy_matches')
          .select('id')
          .eq('user1_id', user.id)
          .eq('user2_id', buddy.id)
          .maybeSingle();

        if (!existing) {
          const { error } = await supabase.from('buddy_matches').insert({
            user1_id: user.id,
            user2_id: buddy.id,
            trip_id:  'general',
            status:   'pending',
          });
          if (error) throw error;
        }

        toast({
          title: `Request sent to ${buddy.name}! 🎉`,
          description: `${buddy.matchPercentage}% compatibility — check Messages to chat`,
        });
      }

      navigate('/buddy-details');
    } catch (err) {
      console.error('[BuddyMatch] Select error:', err);
      toast({ title: 'Failed to select buddy', variant: 'destructive' });
    } finally {
      setSelecting(null);
    }
  };

  const visibleMatches = showAll ? matches : matches.slice(0, 4);
  const bestMatchId    = matches[0]?.id;

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Finding your travel matches…</p>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-8">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Header */}
        <div className="text-center mb-10 animate-slide-in-up relative">
          <Button
            variant="ghost"
            onClick={() => navigate('/queera')}
            className="absolute top-0 left-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quiz
          </Button>

          <h1 className="text-4xl md:text-5xl font-bold mb-3 pt-8">
            Your Perfect Travel
            <span className="block ocean-gradient bg-clip-text text-transparent">
              Buddy Matches! 🎯
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            {matches.length > 0
              ? `Scored by our Compatibility Engine — ${matches.length} real user${matches.length !== 1 ? 's' : ''} matched`
              : 'Scored by our Compatibility Engine — no randomness, just real alignment.'}
          </p>
        </div>

        {/* No real users yet — helpful empty state */}
        {matches.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">
              <Users className="h-16 w-16 mx-auto text-muted-foreground/40" />
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-foreground">No matches yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              You're among the first users! Matches will appear here as more people sign up and complete the quiz.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate('/queera')}
              className="border-primary text-primary hover:bg-primary/5"
            >
              Retake Quiz
            </Button>
          </div>
        )}

        {/* Matches Grid */}
        {matches.length > 0 && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleMatches.map((buddy, index) => {
                const band      = getScoreBand(buddy.matchPercentage);
                const barColor  = getBarColor(buddy.matchPercentage);
                const isBest    = buddy.id === bestMatchId;
                const initials  = buddy.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

                return (
                  <Card
                    key={buddy.id}
                    className={`card-hover card-shadow border flex flex-col animate-bounce-in ${
                      isBest ? 'border-primary/50 ring-2 ring-primary/20' : 'border-border/50'
                    }`}
                    style={{ animationDelay: `${index * 0.08}s` }}
                  >
                    <CardHeader className="text-center pb-3">
                      {/* Best Match badge */}
                      {isBest && (
                        <div className="flex justify-center mb-2">
                          <Badge className="bg-primary/15 text-primary border-primary/30 gap-1 text-xs px-3">
                            <Star className="h-3 w-3 fill-primary" />
                            Best Match
                          </Badge>
                        </div>
                      )}

                      {/* Avatar */}
                      <div className="relative mx-auto mb-3 w-fit">
                        <Avatar className="h-16 w-16 text-2xl">
                          <AvatarImage src={buddy.avatar_url || ''} alt={buddy.name} />
                          <AvatarFallback className="ocean-gradient text-white text-lg font-bold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <Badge
                          className={`absolute -top-2 -right-4 text-xs border ${band.className}`}
                        >
                          {buddy.matchPercentage}%
                        </Badge>
                      </div>

                      <CardTitle className="text-lg leading-snug">{buddy.name}</CardTitle>

                      <div className="flex items-center justify-center text-muted-foreground text-sm gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {buddy.location}
                      </div>

                      <Badge variant="outline" className={`mx-auto mt-1 text-xs ${band.className}`}>
                        {band.label}
                      </Badge>
                    </CardHeader>

                    <CardContent className="pt-0 flex flex-col gap-4 flex-1">
                      <p className="text-sm text-muted-foreground line-clamp-2">{buddy.bio}</p>

                      {/* Compatibility bar */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-semibold text-foreground">Compatibility</span>
                          <span className="text-xs font-bold text-foreground">{buddy.matchPercentage}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                            style={{ width: `${buddy.matchPercentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Match reasons */}
                      <div>
                        <p className="text-xs font-semibold mb-1.5 text-success uppercase tracking-wide">
                          Why you match
                        </p>
                        <ul className="space-y-1">
                          {buddy.matchReasons.map((reason, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                              <CheckCircle className="h-3.5 w-3.5 mt-0.5 shrink-0 text-success" />
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Interests */}
                      {buddy.interests.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {buddy.interests.slice(0, 3).map((interest, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">{interest}</Badge>
                          ))}
                          {buddy.interests.length > 3 && (
                            <Badge variant="outline" className="text-xs text-muted-foreground">
                              +{buddy.interests.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 mt-auto">
                        <Button
                          onClick={() => handleSelectBuddy(buddy)}
                          disabled={selecting === buddy.id}
                          className="flex-1 ocean-gradient hover:opacity-90 text-sm"
                        >
                          {selecting === buddy.id ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          )}
                          Select Buddy
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={(e) => { e.stopPropagation(); navigate('/messages'); }}
                          aria-label={`Message ${buddy.name}`}
                          className="border-primary text-primary hover:bg-primary/10"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {!showAll && matches.length > 4 && (
              <div className="text-center mt-8">
                <Button
                  onClick={() => setShowAll(true)}
                  size="lg"
                  className="ocean-gradient hover:opacity-90 px-8"
                >
                  See More Buddies ({matches.length - 4} more)
                </Button>
              </div>
            )}
          </>
        )}

        {/* Retake quiz */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            onClick={() => navigate('/queera')}
            className="border-primary text-primary hover:bg-primary/5"
          >
            Retake Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BuddyMatch;
