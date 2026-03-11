import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, MapPin, CheckCircle, MessageCircle, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBookingStore } from '@/store/bookingStore';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  calculateCompatibility,
  inferBuddyProfile,
  type UserAnswers,
} from '@/utils/matchingEngine';

// ─── Types ───────────────────────────────────────────────────────────────────

interface TravelBuddy {
  id: string;
  name: string;
  image: string;
  age: number;
  location: string;
  bio: string;
  interests: string[];
  matchPercentage: number;
  matchReasons: string[];
  email: string;
}

// ─── Static buddy pool ────────────────────────────────────────────────────────
// Each buddy has an `interests` array; the engine infers categorical fields
// automatically via `inferBuddyProfile`.

const BUDDY_POOL: Omit<TravelBuddy, 'matchPercentage' | 'matchReasons'>[] = [
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    name: 'Priya Sharma',
    image: '👩‍🦰',
    age: 24,
    location: 'Delhi',
    bio: 'Adventure seeker and culture enthusiast who loves exploring hidden gems and trying local cuisines!',
    interests: ['Photography', 'Hiking', 'Food Tours', 'Museums'],
    email: 'priya.sharma@email.com',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000002',
    name: 'Anmol Verma',
    image: '👨‍🏫',
    age: 26,
    location: 'Arunachal Pradesh',
    bio: 'Budget traveler and backpacker who believes the best adventures come from spontaneous decisions.',
    interests: ['Backpacking', 'Hostels', 'Street Food', 'Local Music'],
    email: 'anmol.verma@email.com',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000003',
    name: 'Diksha Upadhyay',
    image: '👩‍💼',
    age: 28,
    location: 'Assam',
    bio: 'Luxury traveler who enjoys fine dining, spa retreats, and creating Instagram-worthy memories.',
    interests: ['Luxury Hotels', 'Fine Dining', 'Shopping', 'Spas'],
    email: 'diksha.upadhyay@email.com',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000004',
    name: 'Aarav Singh',
    image: '🧑‍🎤',
    age: 23,
    location: 'Karnal',
    bio: 'Nightlife enthusiast and party lover who knows the best clubs in every city!',
    interests: ['Nightlife', 'Beach Parties', 'Festivals', 'Dancing'],
    email: 'aarav.singh@email.com',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000005',
    name: 'Kavya Menon',
    image: '👩‍🎨',
    age: 25,
    location: 'Srinagar',
    bio: 'Nature lover and outdoor enthusiast who prefers camping under the stars to city hotels.',
    interests: ['Camping', 'Rock Climbing', 'National Parks', 'Stargazing'],
    email: 'kavya.menon@email.com',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000006',
    name: 'Rohan Kapoor',
    image: '👨‍💻',
    age: 27,
    location: 'Bangalore',
    bio: 'Tech-savvy traveler who loves digital nomad lifestyle and working from exotic locations.',
    interests: ['Co-working Spaces', 'Cafes', 'Photography', 'Hiking'],
    email: 'rohan.kapoor@email.com',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000007',
    name: 'Sneha Reddy',
    image: '👩‍🔬',
    age: 29,
    location: 'Hyderabad',
    bio: 'History buff and archaeology enthusiast who explores ancient ruins and heritage sites.',
    interests: ['Museums', 'Heritage Sites', 'Local Guides', 'Photography'],
    email: 'sneha.reddy@email.com',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000008',
    name: 'Arjun Malhotra',
    image: '👨‍🍳',
    age: 30,
    location: 'Mumbai',
    bio: 'Foodie traveler on a mission to taste every street food delicacy across India!',
    interests: ['Street Food', 'Food Tours', 'Cooking Classes', 'Local Markets'],
    email: 'arjun.malhotra@email.com',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000009',
    name: 'Ishita Bose',
    image: '👩‍🎓',
    age: 22,
    location: 'Kolkata',
    bio: 'Student traveler who loves budget stays, making friends in hostels, and collecting stories.',
    interests: ['Hostels', 'Backpacking', 'Meeting Locals', 'Cultural Exchange'],
    email: 'ishita.bose@email.com',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000010',
    name: 'Vikram Nair',
    image: '👨‍✈️',
    age: 31,
    location: 'Kerala',
    bio: 'Frequent flyer and hotel connoisseur who values comfort and premium travel experiences.',
    interests: ['Luxury Hotels', 'Business Class', 'Fine Dining', 'Airport Lounges'],
    email: 'vikram.nair@email.com',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000011',
    name: 'Aisha Patel',
    image: '👩‍🎤',
    age: 26,
    location: 'Goa',
    bio: 'Beach lover and water sports enthusiast who lives for sunset parties and ocean adventures.',
    interests: ['Beach Parties', 'Surfing', 'Diving', 'Festivals'],
    email: 'aisha.patel@email.com',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000012',
    name: 'Karan Thakur',
    image: '👨‍🎨',
    age: 28,
    location: 'Himachal Pradesh',
    bio: 'Mountain enthusiast and trekker who finds peace in the Himalayas and loves adventure sports.',
    interests: ['Trekking', 'Camping', 'Rock Climbing', 'Mountain Biking'],
    email: 'karan.thakur@email.com',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000013',
    name: 'Meera Desai',
    image: '👩‍⚕️',
    age: 33,
    location: 'Pune',
    bio: 'Wellness traveler seeking yoga retreats, meditation centers, and spiritual experiences.',
    interests: ['Yoga', 'Meditation', 'Spas', 'Wellness Retreats'],
    email: 'meera.desai@email.com',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000014',
    name: 'Siddharth Gupta',
    image: '👨‍🎬',
    age: 25,
    location: 'Rajasthan',
    bio: 'Photography enthusiast capturing stunning landscapes and vibrant cultural festivals.',
    interests: ['Photography', 'Festivals', 'Heritage Sites', 'Local Culture'],
    email: 'siddharth.gupta@email.com',
  },
  {
    id: 'a0000000-0000-0000-0000-000000000015',
    name: 'Tanvi Rao',
    image: '👩‍🏫',
    age: 24,
    location: 'Chennai',
    bio: 'Solo female traveler empowering others to explore the world safely and confidently.',
    interests: ['Solo Travel', 'Hostels', 'Women Groups', 'Cultural Tours'],
    email: 'tanvi.rao@email.com',
  },
];

// ─── Score band helper ────────────────────────────────────────────────────────

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

// ─── Component ────────────────────────────────────────────────────────────────

const BuddyMatch = () => {
  const navigate  = useNavigate();
  const { toast } = useToast();
  const { setSelectedBuddy, quizAnswers } = useBookingStore();

  const [matches,  setMatches]  = useState<TravelBuddy[]>([]);
  const [showAll,  setShowAll]  = useState(false);

  // ── Score all buddies deterministically on mount ──────────────────────────
  useEffect(() => {
    if (!quizAnswers || Object.keys(quizAnswers).length === 0) {
      navigate('/queera');
      return;
    }
    computeMatches(quizAnswers as UserAnswers);
  }, [navigate, quizAnswers]);

  const computeMatches = (answers: UserAnswers) => {
    const scored: TravelBuddy[] = BUDDY_POOL.map(buddy => {
      const buddyProfile = inferBuddyProfile(buddy.interests);
      const { score, reasons } = calculateCompatibility(answers, buddyProfile);
      return { ...buddy, matchPercentage: score, matchReasons: reasons };
    });

    scored.sort((a, b) => b.matchPercentage - a.matchPercentage);
    setMatches(scored);
  };

  // ── Select buddy handler ──────────────────────────────────────────────────
  const handleSelectBuddy = async (buddy: TravelBuddy) => {
    localStorage.setItem('selectedBuddy', JSON.stringify(buddy));
    setSelectedBuddy({
      id: buddy.id,
      name: buddy.name,
      image: buddy.image,
      age: buddy.age,
      location: buddy.location,
      bio: buddy.bio,
      interests: buddy.interests,
      matchPercentage: buddy.matchPercentage,
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase.from('buddy_matches').insert({
        user1_id: user.id,
        user2_id: buddy.id,
        trip_id: 'general',
        status: 'accepted',
      });
      if (error) {
        console.error('Error creating buddy match:', error);
      } else {
        toast({ title: `Matched with ${buddy.name}! 🎉`, description: 'You can now chat in Messages' });
      }
    }

    navigate('/buddy-details');
  };

  const visibleMatches = showAll ? matches : matches.slice(0, 4);

  // ─── Render ───────────────────────────────────────────────────────────────
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
            Scored by our Compatibility Engine — no randomness, just real alignment.
          </p>
        </div>

        {/* Matches Grid */}
        {matches.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleMatches.map((buddy, index) => {
                const band    = getScoreBand(buddy.matchPercentage);
                const barColor = getBarColor(buddy.matchPercentage);

                return (
                  <Card
                    key={buddy.id}
                    className="card-hover card-shadow border border-border/50 animate-bounce-in flex flex-col"
                    style={{ animationDelay: `${index * 0.08}s` }}
                  >
                    <CardHeader className="text-center pb-3">
                      {/* Avatar + score badge */}
                      <div className="relative mx-auto mb-3">
                        <div className="text-6xl leading-none">{buddy.image}</div>
                        <Badge
                          className={`absolute -top-2 -right-4 text-xs border ${band.className}`}
                        >
                          {buddy.matchPercentage}%
                        </Badge>
                      </div>

                      <CardTitle className="text-lg leading-snug">
                        {buddy.name}, {buddy.age}
                      </CardTitle>

                      <div className="flex items-center justify-center text-muted-foreground text-sm gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {buddy.location}
                      </div>

                      {/* Band label */}
                      <Badge variant="outline" className={`mx-auto mt-1 text-xs ${band.className}`}>
                        {band.label}
                      </Badge>
                    </CardHeader>

                    <CardContent className="pt-0 flex flex-col gap-4 flex-1">
                      {/* Bio */}
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {buddy.bio}
                      </p>

                      {/* Compatibility bar */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-semibold text-foreground">Compatibility</span>
                          <span className="text-xs font-bold text-foreground">{buddy.matchPercentage}%</span>
                        </div>
                        {/* Custom colored bar using a relative div since shadcn Progress is single-color */}
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
                      <div className="flex flex-wrap gap-1">
                        {buddy.interests.slice(0, 3).map((interest, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                        {buddy.interests.length > 3 && (
                          <Badge variant="outline" className="text-xs text-muted-foreground">
                            +{buddy.interests.length - 3}
                          </Badge>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-auto">
                        <Button
                          onClick={() => handleSelectBuddy(buddy)}
                          className="flex-1 ocean-gradient hover:opacity-90 text-sm"
                        >
                          <Mail className="h-4 w-4 mr-2" />
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

            {/* See more */}
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
        ) : (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-xl text-muted-foreground">Calculating your matches…</p>
          </div>
        )}

        {/* Retake */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            onClick={() => navigate('/queera')}
            className="border-primary text-primary hover:bg-primary/5"
          >
            Want different matches? Retake the quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BuddyMatch;
