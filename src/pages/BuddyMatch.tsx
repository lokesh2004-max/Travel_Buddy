import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Star, Mail } from 'lucide-react';
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

const BuddyMatch = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<TravelBuddy[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    // Get user answers from localStorage
    const answers = localStorage.getItem('queeraAnswers');
    if (!answers) {
      navigate('/queera');
      return;
    }
    
    const parsedAnswers = JSON.parse(answers);
    setUserAnswers(parsedAnswers);
    
    // Generate matches based on answers (mock data for demo)
    generateMatches(parsedAnswers);
  }, [navigate]);

  const generateMatches = (answers: Record<string, string>) => {
    // Mock travel buddies with different personalities
    const buddies: TravelBuddy[] = [
      {
        id: '1',
        name: 'Sarah Chen',
        image: '👩‍🦰',
        age: 24,
        location: 'San Francisco, CA',
        bio: 'Adventure seeker and culture enthusiast who loves exploring hidden gems and trying local cuisines!',
        interests: ['Photography', 'Hiking', 'Food Tours', 'Museums'],
        matchPercentage: 0,
        matchReasons: [],
        email: 'sarah.chen@email.com'
      },
      {
        id: '2',
        name: 'Alex Rivera',
        image: '👨‍🏫',
        age: 26,
        location: 'Austin, TX',
        bio: 'Budget traveler and backpacker who believes the best adventures come from spontaneous decisions.',
        interests: ['Backpacking', 'Hostels', 'Street Food', 'Local Music'],
        matchPercentage: 0,
        matchReasons: [],
        email: 'alex.rivera@email.com'
      },
      {
        id: '3',
        name: 'Emma Thompson',
        image: '👩‍💼',
        age: 28,
        location: 'New York, NY',
        bio: 'Luxury traveler who enjoys fine dining, spa retreats, and creating Instagram-worthy memories.',
        interests: ['Luxury Hotels', 'Fine Dining', 'Shopping', 'Spas'],
        matchPercentage: 0,
        matchReasons: [],
        email: 'emma.thompson@email.com'
      },
      {
        id: '4',
        name: 'Jake Martinez',
        image: '🧑‍🎤',
        age: 23,
        location: 'Miami, FL',
        bio: 'Nightlife enthusiast and party lover who knows the best clubs in every city!',
        interests: ['Nightlife', 'Beach Parties', 'Festivals', 'Dancing'],
        matchPercentage: 0,
        matchReasons: [],
        email: 'jake.martinez@email.com'
      },
      {
        id: '5',
        name: 'Maya Patel',
        image: '👩‍🎨',
        age: 25,
        location: 'Seattle, WA',
        bio: 'Nature lover and outdoor enthusiast who prefers camping under the stars to city hotels.',
        interests: ['Camping', 'Rock Climbing', 'National Parks', 'Stargazing'],
        matchPercentage: 0,
        matchReasons: [],
        email: 'maya.patel@email.com'
      }
    ];

    // Calculate match percentages and reasons based on user answers
    const matchedBuddies = buddies.map(buddy => {
      let matchPercentage = 0;
      const matchReasons: string[] = [];

      // Travel style matching
      if (answers.travel_style === 'adventure' && buddy.interests.includes('Hiking')) {
        matchPercentage += 25;
        matchReasons.push('Both love adventure and outdoor activities');
      }
      if (answers.travel_style === 'culture' && buddy.interests.includes('Museums')) {
        matchPercentage += 25;
        matchReasons.push('Shared passion for culture and history');
      }
      if (answers.travel_style === 'relaxation' && buddy.interests.includes('Spas')) {
        matchPercentage += 25;
        matchReasons.push('Both prefer relaxing and luxury experiences');
      }
      if (answers.travel_style === 'nightlife' && buddy.interests.includes('Nightlife')) {
        matchPercentage += 25;
        matchReasons.push('Both love nightlife and party scenes');
      }

      // Budget matching
      if (answers.budget === 'budget' && buddy.interests.includes('Hostels')) {
        matchPercentage += 20;
        matchReasons.push('Similar budget-conscious travel style');
      }
      if (answers.budget === 'luxury' && buddy.interests.includes('Luxury Hotels')) {
        matchPercentage += 20;
        matchReasons.push('Both enjoy luxury travel experiences');
      }

      // Accommodation matching
      if (answers.accommodation === 'camping' && buddy.interests.includes('Camping')) {
        matchPercentage += 20;
        matchReasons.push('Both love outdoor camping adventures');
      }
      if (answers.accommodation === 'hotel' && buddy.interests.includes('Fine Dining')) {
        matchPercentage += 20;
        matchReasons.push('Both prefer comfortable hotel stays');
      }

      // Add some randomness for variety
      matchPercentage += Math.floor(Math.random() * 15);
      
      if (matchReasons.length === 0) {
        matchReasons.push('Compatible travel personalities');
      }

      return {
        ...buddy,
        matchPercentage: Math.min(matchPercentage, 98), // Cap at 98%
        matchReasons
      };
    });

    // Sort by match percentage
    const sortedMatches = matchedBuddies.sort((a, b) => b.matchPercentage - a.matchPercentage);
    setMatches(sortedMatches);
  };

  const handleSelectBuddy = (buddy: TravelBuddy) => {
    localStorage.setItem('selectedBuddy', JSON.stringify(buddy));
    navigate('/buddy-details');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-in-up">
          <Button
            variant="ghost"
            onClick={() => navigate('/queera')}
            className="absolute top-8 left-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quiz
          </Button>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Your Perfect Travel
            <span className="block ocean-gradient bg-clip-text text-transparent">
              Buddy Matches! 🎯
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            We found amazing travel companions who share your vibe!
          </p>
        </div>

        {/* Matches Grid */}
        {matches.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((buddy, index) => (
              <Card 
                key={buddy.id} 
                className="card-hover card-shadow border-0 animate-bounce-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="text-center pb-4">
                  <div className="relative mx-auto mb-4">
                    <div className="text-6xl mb-2">{buddy.image}</div>
                    <Badge 
                      className="absolute -top-2 -right-2 bg-success text-success-foreground"
                    >
                      {buddy.matchPercentage}% Match
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{buddy.name}, {buddy.age}</CardTitle>
                  <div className="flex items-center justify-center text-muted-foreground text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    {buddy.location}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {buddy.bio}
                  </p>
                  
                  {/* Match Reasons */}
                  <div className="mb-4">
                    <p className="text-sm font-semibold mb-2 text-success">Why you match:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {buddy.matchReasons.map((reason, idx) => (
                        <li key={idx} className="flex items-start">
                          <Star className="h-3 w-3 mr-1 mt-0.5 text-success" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Interests */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {buddy.interests.slice(0, 3).map((interest, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => handleSelectBuddy(buddy)}
                    className="w-full ocean-gradient hover:opacity-90"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Select Buddy
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-xl text-muted-foreground">Finding your perfect matches...</p>
          </div>
        )}
        
        {/* Retake Quiz Button */}
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