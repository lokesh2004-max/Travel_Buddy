import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Star, Mail, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBookingStore } from '@/store/bookingStore';

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
  const { setSelectedBuddy } = useBookingStore();
  const [matches, setMatches] = useState<TravelBuddy[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showAll, setShowAll] = useState(false);

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
        name: 'Priya Sharma',
        image: '👩‍🦰',
        age: 24,
        location: 'Delhi',
        bio: 'Adventure seeker and culture enthusiast who loves exploring hidden gems and trying local cuisines!',
        interests: ['Photography', 'Hiking', 'Food Tours', 'Museums'],
        matchPercentage: 0,
        matchReasons: [],
        email: 'priya.sharma@email.com'
      },
      {
        id: '2',
        name: 'Anmol Verma',
        image: '👨‍🏫',
        age: 26,
        location: 'Arunachal Pradesh',
        bio: 'Budget traveler and backpacker who believes the best adventures come from spontaneous decisions.',
        interests: ['Backpacking', 'Hostels', 'Street Food', 'Local Music'],
        matchPercentage: 0,
        matchReasons: [],
        email: 'anmol.verma@email.com'
      },
      {
        id: '3',
        name: 'Diksha Upadhyay',
        image: '👩‍💼',
        age: 28,
        location: 'Assam',
        bio: 'Luxury traveler who enjoys fine dining, spa retreats, and creating Instagram-worthy memories.',
        interests: ['Luxury Hotels', 'Fine Dining', 'Shopping', 'Spas'],
        matchPercentage: 0,
        matchReasons: [],
        email: 'diksha.upadhyay@email.com'
      },
      {
        id: '4',
        name: 'Aarav Singh',
        image: '🧑‍🎤',
        age: 23,
        location: 'Karnal',
        bio: 'Nightlife enthusiast and party lover who knows the best clubs in every city!',
        interests: ['Nightlife', 'Beach Parties', 'Festivals', 'Dancing'],
        matchPercentage: 0,
        matchReasons: [],
        email: 'aarav.singh@email.com'
      },
      {
        id: '5',
        name: 'Kavya Menon',
        image: '👩‍🎨',
        age: 25,
        location: 'Srinagar',
        bio: 'Nature lover and outdoor enthusiast who prefers camping under the stars to city hotels.',
        interests: ['Camping', 'Rock Climbing', 'National Parks', 'Stargazing'],
        matchPercentage: 0,
        matchReasons: [],
        email: 'kavya.menon@email.com'
      },
      {
        id: '6',
        name: 'Rohan Kapoor',
        image: '👨‍💻',
        age: 27,
        location: 'Bangalore',
        bio: 'Tech-savvy traveler who loves digital nomad lifestyle and working from exotic locations.',
        interests: ['Co-working Spaces', 'Cafes', 'Photography', 'Hiking'],
        matchPercentage: 0,
        matchReasons: [],
        email: 'rohan.kapoor@email.com'
      },
      {
        id: '7',
        name: 'Sneha Reddy',
        image: '👩‍🔬',
        age: 29,
        location: 'Hyderabad',
        bio: 'History buff and archaeology enthusiast who explores ancient ruins and heritage sites.',
        interests: ['Museums', 'Heritage Sites', 'Local Guides', 'Photography'],
        matchPercentage: 0,
        matchReasons: [],
        email: 'sneha.reddy@email.com'
      },
      {
        id: '8',
        name: 'Arjun Malhotra',
        image: '👨‍🍳',
        age: 30,
        location: 'Mumbai',
        bio: 'Foodie traveler on a mission to taste every street food delicacy across India!',
        interests: ['Street Food', 'Food Tours', 'Cooking Classes', 'Local Markets'],
        matchPercentage: 0,
        matchReasons: [],
        email: 'arjun.malhotra@email.com'
      },
      {
        id: '9',
        name: 'Ishita Bose',
        image: '👩‍🎓',
        age: 22,
        location: 'Kolkata',
        bio: 'Student traveler who loves budget stays, making friends in hostels, and collecting stories.',
        interests: ['Hostels', 'Backpacking', 'Meeting Locals', 'Cultural Exchange'],
        matchPercentage: 0,
        matchReasons: [],
        email: 'ishita.bose@email.com'
      },
      {
        id: '10',
        name: 'Vikram Nair',
        image: '👨‍✈️',
        age: 31,
        location: 'Kerala',
        bio: 'Frequent flyer and hotel connoisseur who values comfort and premium travel experiences.',
        interests: ['Luxury Hotels', 'Business Class', 'Fine Dining', 'Airport Lounges'],
        matchPercentage: 0,
        matchReasons: [],
        email: 'vikram.nair@email.com'
      },
      {
        id: '11',
        name: 'Aisha Patel',
        image: '👩‍🎤',
        age: 26,
        location: 'Goa',
        bio: 'Beach lover and water sports enthusiast who lives for sunset parties and ocean adventures.',
        interests: ['Beach Parties', 'Surfing', 'Diving', 'Festivals'],
        matchPercentage: 0,
        matchReasons: [],
        email: 'aisha.patel@email.com'
      },
      {
        id: '12',
        name: 'Karan Thakur',
        image: '👨‍🎨',
        age: 28,
        location: 'Himachal Pradesh',
        bio: 'Mountain enthusiast and trekker who finds peace in the Himalayas and loves adventure sports.',
        interests: ['Trekking', 'Camping', 'Rock Climbing', 'Mountain Biking'],
        matchPercentage: 0,
        matchReasons: [],
        email: 'karan.thakur@email.com'
      },
      {
        id: '13',
        name: 'Meera Desai',
        image: '👩‍⚕️',
        age: 33,
        location: 'Pune',
        bio: 'Wellness traveler seeking yoga retreats, meditation centers, and spiritual experiences.',
        interests: ['Yoga', 'Meditation', 'Spas', 'Wellness Retreats'],
        matchPercentage: 0,
        matchReasons: [],
        email: 'meera.desai@email.com'
      },
      {
        id: '14',
        name: 'Siddharth Gupta',
        image: '👨‍🎬',
        age: 25,
        location: 'Rajasthan',
        bio: 'Photography enthusiast capturing stunning landscapes and vibrant cultural festivals.',
        interests: ['Photography', 'Festivals', 'Heritage Sites', 'Local Culture'],
        matchPercentage: 0,
        matchReasons: [],
        email: 'siddharth.gupta@email.com'
      },
      {
        id: '15',
        name: 'Tanvi Rao',
        image: '👩‍🏫',
        age: 24,
        location: 'Chennai',
        bio: 'Solo female traveler empowering others to explore the world safely and confidently.',
        interests: ['Solo Travel', 'Hostels', 'Women Groups', 'Cultural Tours'],
        matchPercentage: 0,
        matchReasons: [],
        email: 'tanvi.rao@email.com'
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
    // Save to both localStorage and Zustand store
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
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(showAll ? matches : matches.slice(0, 4)).map((buddy, index) => (
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
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleSelectBuddy(buddy)}
                      className="flex-1 ocean-gradient hover:opacity-90"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Select Buddy
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/messages');
                      }}
                      aria-label={`Message ${buddy.name}`}
                      className="border-primary text-primary hover:bg-primary/10"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              ))}
            </div>
            
            {/* See More Buddies Button */}
            {!showAll && matches.length > 4 && (
              <div className="text-center mt-8 animate-fade-in">
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
