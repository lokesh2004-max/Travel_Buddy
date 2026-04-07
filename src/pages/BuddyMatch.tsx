import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  email: string | null;
  location: string;
  bio: string;
  interests: string[];
  avatar_url: string | null;
  travel_style: string | null;
  budget: string | null;
  accommodation: string | null;
  group_size: string | null;
  destination_type: string | null;
  matchPercentage: number;
  matchReasons: string[];
  confidence: number;
}

function getConfidenceBadge(confidence: number): { label: string; className: string } | null {
  if (confidence >= 0.8) return { label: 'High Confidence', className: 'bg-success/15 text-success border-success/30' };
  if (confidence >= 0.5) return { label: 'Moderate Match', className: 'bg-primary/15 text-primary border-primary/30' };
  if (confidence >= 0.3) return { label: 'Low Confidence', className: 'bg-warning/15 text-warning border-warning/30' };
  return null;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getScoreBand(score: number): { label: string; className: string } {
  if (score >= 75) return { label: 'Excellent Match', className: 'bg-success/15 text-success border-success/30' };
  if (score >= 50) return { label: 'Good Match',      className: 'bg-primary/15 text-primary border-primary/30' };
  if (score >= 25) return { label: 'Fair Match',      className: 'bg-warning/15 text-warning border-warning/30' };
  return              { label: 'Low Match',           className: 'bg-muted text-muted-foreground border-border' };
}


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
  const [requestedIds, setRequestedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadAndScore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAndScore = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      let myAnswers: UserAnswers | null = null;

      if (user) {
        const [quizRes, requestsRes] = await Promise.all([
          supabase.from('quiz_answers')
            .select('travel_style, budget, accommodation, group_size, destination_type')
            .eq('user_id', user.id)
            .maybeSingle(),
          supabase.from('buddy_matches')
            .select('buddy_id')
            .eq('user_id', user.id),
        ]);

        if (quizRes.data) {
          myAnswers = toUserAnswers(quizRes.data);
          setQuizAnswers({
            travel_style:     myAnswers.travel_style,
            budget:           myAnswers.budget,
            accommodation:    myAnswers.accommodation,
            group_size:       myAnswers.group_size,
            destination_type: myAnswers.destination_type,
          });
        }

        if (requestsRes.data) {
          setRequestedIds(new Set(requestsRes.data.map(r => r.buddy_id).filter(Boolean) as string[]));
        }
      }

      if (!myAnswers) {
        if (!quizAnswers || Object.keys(quizAnswers).length === 0) {
          navigate('/queera');
          return;
        }
        myAnswers = quizAnswers as UserAnswers;
      }

      const { data: buddiesData, error: buddiesError } = await supabase
        .from('buddies')
        .select('id, full_name, age, email, location, bio, interests, avatar_url, travel_style, budget, accommodation, group_size, destination_type');

      if (buddiesError) throw buddiesError;

      const allBuddies = buddiesData ?? [];
      if (allBuddies.length === 0) { setMatches([]); return; }

      const buddyCandidates: RealBuddy[] = allBuddies.map(b => {
        const buddyProfile: BuddyProfile = {
          travel_style:     b.travel_style     ?? undefined,
          budget:           b.budget           ?? undefined,
          accommodation:    b.accommodation    ?? undefined,
          group_size:       b.group_size       ?? undefined,
          destination_type: b.destination_type ?? undefined,
          interests:        (b.interests as string[]) ?? [],
        };

        const { score, reasons, confidence } = calculateCompatibility(myAnswers!, buddyProfile);

        return {
          id:               b.id,
          name:             b.full_name || 'Anonymous Traveler',
          email:            b.email ?? null,
          location:         b.location  || 'Unknown',
          bio:              b.bio       || 'No bio yet.',
          interests:        (b.interests as string[]) || [],
          avatar_url:       b.avatar_url ?? null,
          travel_style:     b.travel_style,
          budget:           b.budget,
          accommodation:    b.accommodation,
          group_size:       b.group_size,
          destination_type: b.destination_type,
          matchPercentage:  score,
          matchReasons:     reasons,
          confidence:       confidence ?? 0.5,
        };
      });

      buddyCandidates.sort((a, b) =>
        (b.matchPercentage * (b.confidence ?? 0.5)) - (a.matchPercentage * (a.confidence ?? 0.5))
      );
      setMatches(buddyCandidates.slice(0, 10));
    } catch (err) {
      console.error('[BuddyMatch] Error:', err);
      toast({ title: 'Could not load matches', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBuddy = async (buddy: RealBuddy) => {
    setSelecting(buddy.id);
    try {
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
        // Duplicate check
        const { data: existing } = await supabase
          .from('buddy_matches')
          .select('id')
          .eq('user_id', user.id)
          .eq('buddy_id', buddy.id)
          .maybeSingle();

        if (existing) {
          toast({ title: 'Already Matched ✅', description: `You've already matched with ${buddy.name}.` });
        } else {
          // Auto-accept since buddies are dummy data
          const { error } = await supabase.from('buddy_matches').insert({
            user_id: user.id,
            buddy_id: buddy.id,
            status: 'accepted',
          });
          if (error) throw error;

          // Insert notification with proper error handling
          try {
            await supabase.from('notifications').insert({
              user_id: user.id,
              title: 'Buddy Matched!',
              message: `You matched with ${buddy.name} (${buddy.matchPercentage}% compatibility). Start chatting now!`,
            });
          } catch (notifError) {
            console.warn('Notification insert failed:', notifError);
          }

          setRequestedIds(prev => new Set(prev).add(buddy.id));

          toast({
            title: `Matched with ${buddy.name}! 🎉`,
            description: `${buddy.matchPercentage}% compatibility — head to Messages to chat`,
          });
        }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-8">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Header */}
        <div className="text-center mb-10 animate-slide-in-up relative">
          <Button variant="ghost" onClick={() => navigate('/queera')} className="absolute top-0 left-0">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Quiz
          </Button>

          <h1 className="text-4xl md:text-5xl font-bold mb-3 pt-8">
            Your Perfect Travel
            <span className="block ocean-gradient bg-clip-text text-transparent">Buddy Matches! 🎯</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            {matches.length > 0
              ? `Scored by our Compatibility Engine — ${matches.length} buddies matched`
              : 'Scored by our Compatibility Engine — no randomness, just real alignment.'}
          </p>
        </div>

        {/* Empty state */}
        {matches.length === 0 && (
          <div className="text-center py-16">
            <Users className="h-16 w-16 mx-auto text-muted-foreground/40 mb-4" />
            <h2 className="text-2xl font-semibold mb-2 text-foreground">No travel buddies available yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              The buddy pool is empty. Check back soon or retake the quiz to update your preferences.
            </p>
            <Button variant="outline" onClick={() => navigate('/queera')} className="border-primary text-primary hover:bg-primary/5">
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
                const isBest    = buddy.id === bestMatchId;
                const initials  = buddy.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                const alreadyRequested = requestedIds.has(buddy.id);

                return (
                  <Card
                    key={buddy.id}
                    className={`card-hover card-shadow border flex flex-col animate-bounce-in ${
                      isBest ? 'border-primary/50 ring-2 ring-primary/20' : 'border-border/50'
                    }`}
                    style={{ animationDelay: `${index * 0.08}s` }}
                  >
                    <CardHeader className="text-center pb-3">
                      {isBest && (
                        <div className="flex justify-center mb-2">
                          <Badge className="bg-primary/15 text-primary border-primary/30 gap-1 text-xs px-3">
                            <Star className="h-3 w-3 fill-primary" /> Best Match
                          </Badge>
                        </div>
                      )}

                      <div className="relative mx-auto mb-3 w-fit">
                        <Avatar className="h-16 w-16 text-2xl">
                          <AvatarImage src={buddy.avatar_url || ''} alt={buddy.name} />
                          <AvatarFallback className="ocean-gradient text-white text-lg font-bold">{initials}</AvatarFallback>
                        </Avatar>
                        <Badge className={`absolute -top-2 -right-4 text-xs border ${band.className}`}>
                          {buddy.matchPercentage}%
                        </Badge>
                      </div>

                      <CardTitle className="text-lg leading-snug">{buddy.name}</CardTitle>
                      <div className="flex items-center justify-center text-muted-foreground text-sm gap-1">
                        <MapPin className="h-3.5 w-3.5" /> {buddy.location}
                      </div>
                      <Badge variant="outline" className={`mx-auto mt-1 text-xs ${band.className}`}>{band.label}</Badge>
                      {(() => {
                        const cb = getConfidenceBadge(buddy.confidence);
                        return cb ? <Badge variant="outline" className={`mx-auto mt-1 text-xs ${cb.className}`}>{cb.label}</Badge> : null;
                      })()}
                    </CardHeader>

                    <CardContent className="pt-0 flex flex-col gap-4 flex-1">
                      <p className="text-sm text-muted-foreground line-clamp-2">{buddy.bio}</p>


                      {/* Match reasons */}
                      <div>
                        <p className="text-xs font-semibold mb-1.5 text-success uppercase tracking-wide">Why you match</p>
                        <ul className="space-y-1">
                          {buddy.matchReasons.map((reason, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                              <CheckCircle className="h-3.5 w-3.5 mt-0.5 shrink-0 text-success" /> {reason}
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
                            <Badge variant="outline" className="text-xs text-muted-foreground">+{buddy.interests.length - 3}</Badge>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 mt-auto">
                        <Button
                          onClick={() => handleSelectBuddy(buddy)}
                          disabled={selecting === buddy.id || alreadyRequested}
                          className="flex-1 ocean-gradient hover:opacity-90 text-sm"
                        >
                          {selecting === buddy.id ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          )}
                          {alreadyRequested ? 'Already Matched' : 'Match Buddy'}
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
                <Button onClick={() => setShowAll(true)} size="lg" className="ocean-gradient hover:opacity-90 px-8">
                  See More Buddies ({matches.length - 4} more)
                </Button>
              </div>
            )}
          </>
        )}

        {/* Retake quiz */}
        <div className="text-center mt-12">
          <Button variant="outline" onClick={() => navigate('/queera')} className="border-primary text-primary hover:bg-primary/5">
            🔄 Retake Quiz for Better Matches
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BuddyMatch;
