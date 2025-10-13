import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TravelBuddySwipeCard from '@/components/TravelBuddySwipeCard';
import { useBookingStore } from '@/store/bookingStore';
import { useToast } from '@/hooks/use-toast';
import ProgressBar from '@/components/ProgressBar';

const BOOKING_STEPS = [
  { number: 1, name: 'Search', description: 'Find trips' },
  { number: 2, name: 'Login', description: 'Sign in' },
  { number: 3, name: 'Quiz', description: 'Preferences' },
  { number: 4, name: 'Buddy', description: 'Find match' },
  { number: 5, name: 'Book', description: 'Confirm' },
];

// Mock data for travel buddies
const mockBuddies = [
  {
    id: '1',
    name: 'Alex Thompson',
    image: '🧑',
    age: 28,
    location: 'San Francisco, CA',
    bio: 'Adventure seeker and culture enthusiast. Love exploring hidden gems and trying local cuisine!',
    interests: ['Hiking', 'Photography', 'Street Food', 'Cultural Tours', 'Beach Volleyball'],
    matchPercentage: 95,
  },
  {
    id: '2',
    name: 'Maya Patel',
    image: '👩',
    age: 26,
    location: 'Mumbai, India',
    bio: 'Digital nomad with a passion for sustainable travel. Always up for an adventure!',
    interests: ['Yoga', 'Meditation', 'Backpacking', 'Wildlife', 'Local Markets', 'Vegetarian Food'],
    matchPercentage: 88,
  },
  {
    id: '3',
    name: 'Jordan Lee',
    image: '🧑‍🦱',
    age: 30,
    location: 'Seoul, South Korea',
    bio: 'Foodie and K-pop fan exploring the world one city at a time.',
    interests: ['Food Tours', 'Nightlife', 'Music Festivals', 'Urban Exploration', 'Coffee Shops'],
    matchPercentage: 92,
  },
  {
    id: '4',
    name: 'Sofia Rodriguez',
    image: '👩‍🦰',
    age: 27,
    location: 'Barcelona, Spain',
    bio: 'Beach lover and adventure sports enthusiast. Let\'s catch some waves!',
    interests: ['Surfing', 'Scuba Diving', 'Beach Parties', 'Sailing', 'Snorkeling'],
    matchPercentage: 85,
  },
  {
    id: '5',
    name: 'Chris Johnson',
    image: '🧔',
    age: 32,
    location: 'Vancouver, Canada',
    bio: 'Mountain lover and wilderness explorer. Always planning the next summit.',
    interests: ['Mountain Climbing', 'Camping', 'Trail Running', 'Nature Photography', 'Stargazing'],
    matchPercentage: 90,
  },
  {
    id: '6',
    name: 'Emma Wilson',
    image: '👱‍♀️',
    age: 25,
    location: 'London, UK',
    bio: 'History buff and art enthusiast. Museums by day, pubs by night!',
    interests: ['Museums', 'Art Galleries', 'Historic Sites', 'Architecture', 'Theater'],
    matchPercentage: 87,
  },
];

const SwipeMatch = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setSelectedBuddy, setCurrentStep, selectedTrip } = useBookingStore();
  const [buddies, setBuddies] = useState(mockBuddies);
  const [connectedBuddies, setConnectedBuddies] = useState<typeof mockBuddies>([]);

  React.useEffect(() => {
    setCurrentStep(4);
  }, [setCurrentStep]);

  const handleSwipeRight = (buddy: typeof mockBuddies[0]) => {
    setConnectedBuddies(prev => [...prev, buddy]);
    setSelectedBuddy(buddy as any);
    toast({
      title: `Connected with ${buddy.name}! 🎉`,
      description: `${buddy.matchPercentage}% match`,
    });
    
    if (selectedTrip) {
      setTimeout(() => navigate('/booking'), 1000);
    }
  };

  const handleSwipeLeft = (buddy: typeof mockBuddies[0]) => {
    console.log(`Skipped ${buddy.name}`);
  };

  const handleAllSwipedComplete = () => {
    console.log('All buddies reviewed!');
  };

  const handleReset = () => {
    setBuddies([...mockBuddies]);
    setConnectedBuddies([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <ProgressBar currentStep={4} steps={BOOKING_STEPS} />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/buddy-match')}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <Button
            variant="outline"
            onClick={handleReset}
            className="border-primary text-primary hover:bg-primary/10"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Find Your Travel Buddy
          </h1>
          <p className="text-muted-foreground text-lg">
            Swipe right to connect, swipe left to skip
          </p>
        </div>

        {/* Swipe Card Component */}
        <div className="mb-24">
          <TravelBuddySwipeCard
            buddies={buddies}
            onSwipeRight={handleSwipeRight}
            onSwipeLeft={handleSwipeLeft}
            onAllSwipedComplete={handleAllSwipedComplete}
          />
        </div>

        {/* Connected Buddies Counter */}
        {connectedBuddies.length > 0 && (
          <div className="text-center">
            <div className="inline-block bg-success/10 text-success px-6 py-3 rounded-full border border-success/20">
              <span className="font-semibold">
                🎉 {connectedBuddies.length} {connectedBuddies.length === 1 ? 'Connection' : 'Connections'} Made!
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SwipeMatch;
