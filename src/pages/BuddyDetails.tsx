import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Mail, MapPin, Star, Heart, Calendar, Users, Globe, Languages, Plane, CheckCircle2 } from 'lucide-react';
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
    favoriteDestinations: ['Goa', 'Gangtok', 'Kerala', 'Rajasthan'],
    nextTrip: 'Planning a trip to Thailand in December',
    travelStyle: buddy.interests.includes('Luxury Hotels') ? 'Luxury Explorer' : 
                buddy.interests.includes('Hostels') ? 'Budget Backpacker' : 
                buddy.interests.includes('Camping') ? 'Nature Adventurer' : 'Cultural Explorer',
    languages: ['English', 'Hindi'],
    about: `I'm passionate about discovering new cultures, trying authentic local cuisines, and creating unforgettable memories with fellow travelers. Whether it's watching a sunrise from a mountain peak or getting lost in a bustling local market, I believe the best adventures happen when you step out of your comfort zone with great company!`
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header with Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/buddy-match')}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Matches
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <Card className="card-shadow border-0 sticky top-8 animate-fade-in">
              <CardContent className="p-6">
                {/* Profile Image */}
                <div className="flex flex-col items-center text-center mb-6">
                  <Avatar className="h-32 w-32 mb-4 text-6xl border-4 border-primary/20">
                    <AvatarFallback className="text-6xl bg-gradient-to-br from-primary to-accent">
                      {buddy.image}
                    </AvatarFallback>
                  </Avatar>
                  <h1 className="text-2xl font-bold mb-1">{buddy.name}</h1>
                  <p className="text-muted-foreground mb-3">{buddy.age} years old</p>
                  <Badge className="bg-success/10 text-success border-success/20 hover:bg-success/20">
                    <Star className="h-4 w-4 mr-1 fill-success" />
                    {buddy.matchPercentage}% Match
                  </Badge>
                </div>

                <Separator className="my-6" />

                {/* Quick Info List */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="font-medium truncate">{buddy.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Member Since</p>
                      <p className="font-medium">{additionalInfo.joinedDate}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Plane className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Trips Completed</p>
                      <p className="font-medium">{additionalInfo.completedTrips} adventures</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Heart className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Travel Style</p>
                      <p className="font-medium">{additionalInfo.travelStyle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Languages className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Languages</p>
                      <p className="font-medium">{additionalInfo.languages.join(', ')}</p>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Contact Button */}
                <Button 
                  onClick={handleEmailClick}
                  className="w-full ocean-gradient hover:opacity-90 glow-effect"
                  size="lg"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <Card className="card-shadow border-0 animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  About {buddy.name.split(' ')[0]}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">{buddy.bio}</p>
                <p className="text-muted-foreground leading-relaxed">{additionalInfo.about}</p>
              </CardContent>
            </Card>

            {/* Why You Match */}
            <Card className="card-shadow border-0 bg-gradient-to-br from-success/5 to-success/10 animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-success">
                  <CheckCircle2 className="h-5 w-5" />
                  Why You're Perfect Travel Partners
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {buddy.matchReasons.map((reason, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 bg-background/60 rounded-lg backdrop-blur-sm">
                      <Star className="h-5 w-5 text-success flex-shrink-0 mt-0.5 fill-success" />
                      <span className="flex-1">{reason}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Interests & Hobbies */}
            <Card className="card-shadow border-0 animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Interests & Hobbies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {buddy.interests.map((interest, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="px-4 py-2 text-sm bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 transition-all"
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Favorite Destinations */}
            <Card className="card-shadow border-0 animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Favorite Destinations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid md:grid-cols-2 gap-3">
                  {additionalInfo.favoriteDestinations.map((destination, index) => (
                    <li 
                      key={index} 
                      className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium">{destination}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Next Adventure */}
            <Card className="card-shadow border-0 bg-gradient-to-br from-accent/10 to-accent/5 animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-accent">
                  <Plane className="h-5 w-5" />
                  Next Adventure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{additionalInfo.nextTrip}</p>
              </CardContent>
            </Card>

            {/* CTA Section */}
            <Card className="card-shadow border-0 ocean-gradient text-white animate-fade-in">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-2">Ready to Connect?</h3>
                <p className="mb-4 text-white/90">
                  Start planning your next adventure with {buddy.name.split(' ')[0]}!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    onClick={() => navigate('/destination-recommendations')}
                    size="lg"
                    variant="secondary"
                    className="bg-white text-primary hover:bg-white/90"
                  >
                    <Plane className="h-4 w-4 mr-2" />
                    Find Destinations
                  </Button>
                  <Button 
                    onClick={handleEmailClick}
                    size="lg"
                    variant="outline"
                    className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuddyDetails;
