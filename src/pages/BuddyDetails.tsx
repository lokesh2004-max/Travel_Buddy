import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, MapPin, Star, Heart, Calendar, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

const BuddyDetails = () => {
  const navigate = useNavigate();
  const [buddy, setBuddy] = useState<TravelBuddy | null>(null);

  useEffect(() => {
    // Get selected buddy from localStorage
    const selectedBuddy = localStorage.getItem('selectedBuddy');
    if (!selectedBuddy) {
      navigate('/buddy-match');
      return;
    }
    
    setBuddy(JSON.parse(selectedBuddy));
  }, [navigate]);

  const handleEmailClick = () => {
    if (buddy) {
      const subject = encodeURIComponent(`Travel Buddy Connection - Let's Explore Together! 🌍`);
      const body = encodeURIComponent(`Hi ${buddy.name.split(' ')[0]},

I found you through Travel Buddy and we're a ${buddy.matchPercentage}% match! I'd love to connect and potentially plan some amazing adventures together.

Looking forward to hearing from you!

Best regards,
Your Travel Buddy Match`);
      
      window.location.href = `mailto:${buddy.email}?subject=${subject}&body=${body}`;
    }
  };

  if (!buddy) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-xl text-muted-foreground">Loading buddy details...</p>
        </div>
      </div>
    );
  }

  // Mock additional data for the detailed view
  const additionalInfo = {
    joinedDate: 'March 2024',
    completedTrips: Math.floor(Math.random() * 15) + 3,
    favoriteDestinations: ['Bali, Indonesia', 'Tokyo, Japan', 'Barcelona, Spain', 'Costa Rica'],
    nextTrip: 'Planning a trip to Thailand in December',
    travelStyle: buddy.interests.includes('Luxury Hotels') ? 'Luxury Explorer' : 
                buddy.interests.includes('Hostels') ? 'Budget Backpacker' : 
                buddy.interests.includes('Camping') ? 'Nature Adventurer' : 'Cultural Explorer',
    languages: ['English', 'Spanish'],
    about: `I'm passionate about discovering new cultures, trying authentic local cuisines, and creating unforgettable memories with fellow travelers. Whether it's watching a sunrise from a mountain peak or getting lost in a bustling local market, I believe the best adventures happen when you step out of your comfort zone with great company!`
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <Button
          variant="ghost"
          onClick={() => navigate('/buddy-match')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Matches
        </Button>

        {/* Main Profile Card */}
        <Card className="card-shadow border-0 mb-8 animate-bounce-in">
          <CardContent className="p-0">
            {/* Hero Section */}
            <div className="ocean-gradient rounded-t-lg p-8 text-white text-center">
              <div className="text-8xl mb-4">{buddy.image}</div>
              <h1 className="text-3xl font-bold mb-2">{buddy.name}, {buddy.age}</h1>
              <div className="flex items-center justify-center mb-4">
                <MapPin className="h-5 w-5 mr-2" />
                {buddy.location}
              </div>
              <Badge className="bg-white/20 text-white border-white/30 text-lg px-4 py-2">
                <Star className="h-5 w-5 mr-2" />
                {buddy.matchPercentage}% Match
              </Badge>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Quick Stats */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div className="font-semibold">Joined</div>
                  <div className="text-muted-foreground">{additionalInfo.joinedDate}</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div className="font-semibold">Trips Completed</div>
                  <div className="text-muted-foreground">{additionalInfo.completedTrips}</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <div className="font-semibold">Travel Style</div>
                  <div className="text-muted-foreground">{additionalInfo.travelStyle}</div>
                </div>
              </div>

              {/* About Section */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4">About {buddy.name.split(' ')[0]}</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">{buddy.bio}</p>
                <p className="text-muted-foreground leading-relaxed">{additionalInfo.about}</p>
              </div>

              {/* Why You Match */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-success">
                  Why You're Perfect Travel Partners
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {buddy.matchReasons.map((reason, index) => (
                    <div key={index} className="flex items-start p-4 bg-success/5 rounded-lg">
                      <Star className="h-5 w-5 text-success mr-3 mt-0.5" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interests & Hobbies */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4">Interests & Hobbies</h3>
                <div className="flex flex-wrap gap-2">
                  {buddy.interests.map((interest, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Favorite Destinations */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4">Favorite Destinations</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {additionalInfo.favoriteDestinations.map((destination, index) => (
                    <div key={index} className="flex items-center p-3 bg-muted/50 rounded-lg">
                      <MapPin className="h-4 w-4 text-primary mr-2" />
                      {destination}
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Adventure */}
              <div className="mb-8 p-6 bg-accent/10 rounded-lg">
                <h3 className="text-xl font-semibold mb-2 text-accent">Next Adventure</h3>
                <p className="text-muted-foreground">{additionalInfo.nextTrip}</p>
              </div>

              {/* Contact Button */}
              <div className="text-center">
                <Button 
                  onClick={handleEmailClick}
                  size="lg"
                  className="ocean-gradient hover:opacity-90 px-8 py-4 text-lg glow-effect"
                >
                  <Mail className="h-5 w-5 mr-3" />
                  Send Email to {buddy.name.split(' ')[0]}
                </Button>
                <p className="text-sm text-muted-foreground mt-3">
                  This will open your default email app with a pre-written message
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to Matches */}
        <div className="text-center">
          <Button 
            variant="outline"
            onClick={() => navigate('/buddy-match')}
            className="border-primary text-primary hover:bg-primary/5"
          >
            View More Matches
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BuddyDetails;