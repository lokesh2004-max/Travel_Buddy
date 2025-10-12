import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ArrowLeft, MapPin, Star, Clock, Users, DollarSign, Sparkles, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import destination images
import goaImage from '@/assets/goa-beach.jpg';
import manaliImage from '@/assets/manali-mountains.jpg';
import jaipurImage from '@/assets/jaipur-palace.jpg';
import rishikeshImage from '@/assets/rishikesh-ganges.jpg';
import keralaImage from '@/assets/kerala-backwaters.jpg';
import ladakhImage from '@/assets/ladakh-lake.jpg';
import udaipurImage from '@/assets/udaipur-palace.jpg';
import andamanImage from '@/assets/andaman-beach.jpg';
import varanasiImage from '@/assets/varanasi-ghats.jpg';
import hampiImage from '@/assets/hampi-ruins.jpg';
import mumbaiImage from '@/assets/mumbai-gateway.jpg';
import spitiImage from '@/assets/spiti-valley.jpg';

// Destination interface with all required details
interface Destination {
  id: string;
  name: string;
  emoji: string;
  description: string;
  famousPlaces: string[];
  culturalHighlights: string[];
  approximateCost: string;
  costValue: number; // For filtering: 1=budget, 2=mid, 3=luxury
  duration: string;
  durationDays: number;
  groupSize: string[];
  tripHighlights: string[];
  tags: string[];
  imageUrl: string;
  rating: number;
  travelStyle: string[]; // adventure, relaxation, culture, nightlife
  accommodationType: string[]; // hostel, hotel, airbnb, camping
  destinationType: string[]; // beach, mountains, cities, nature
}

const DestinationRecommendations = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [selectedBuddy, setSelectedBuddy] = useState<any>(null);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Comprehensive Indian destinations data
  const allDestinations: Destination[] = [
    {
      id: '1',
      name: 'Goa',
      emoji: '🏖️',
      description: 'The beach paradise of India, famous for its Portuguese heritage, stunning coastline, vibrant nightlife, and laid-back vibe. Perfect for beach lovers and party enthusiasts.',
      famousPlaces: ['Baga Beach', 'Fort Aguada', 'Basilica of Bom Jesus', 'Dudhsagar Falls', 'Anjuna Flea Market'],
      culturalHighlights: ['Portuguese architecture', 'Goan cuisine', 'Carnival festival', 'Shigmo festival', 'Traditional feni liquor'],
      approximateCost: '₹15,000 - ₹25,000',
      costValue: 2,
      duration: '4-5 Days',
      durationDays: 4,
      groupSize: ['Solo', 'Small', 'Medium', 'Large'],
      tripHighlights: ['Beach hopping', 'Water sports', 'Beach parties', 'Portuguese forts', 'Seafood delicacies'],
      tags: ['Beach', 'Nightlife', 'Adventure', 'Culture', 'Food'],
      imageUrl: goaImage,
      rating: 4.7,
      travelStyle: ['relaxation', 'nightlife', 'adventure'],
      accommodationType: ['hostel', 'hotel', 'airbnb'],
      destinationType: ['beach']
    },
    {
      id: '2',
      name: 'Manali',
      emoji: '🏔️',
      description: 'A high-altitude Himalayan resort town famous for trekking, skiing, and stunning mountain views. Perfect for adventure seekers and nature lovers.',
      famousPlaces: ['Solang Valley', 'Rohtang Pass', 'Hadimba Temple', 'Old Manali', 'Jogini Waterfall'],
      culturalHighlights: ['Tibetan monasteries', 'Himachali culture', 'Local handicrafts', 'Mountain festivals', 'Traditional cuisine'],
      approximateCost: '₹20,000 - ₹35,000',
      costValue: 2,
      duration: '5-6 Days',
      durationDays: 5,
      groupSize: ['Solo', 'Small', 'Medium'],
      tripHighlights: ['Trekking', 'Paragliding', 'Snow activities', 'Camping', 'Mountain biking'],
      tags: ['Mountains', 'Adventure', 'Nature', 'Trekking', 'Camping'],
      imageUrl: manaliImage,
      rating: 4.8,
      travelStyle: ['adventure'],
      accommodationType: ['hotel', 'camping', 'airbnb'],
      destinationType: ['mountains', 'nature']
    },
    {
      id: '3',
      name: 'Jaipur',
      emoji: '🏰',
      description: 'The Pink City of India, rich in royal heritage, magnificent forts, palaces, and vibrant bazaars. A cultural treasure trove for history enthusiasts.',
      famousPlaces: ['Amber Fort', 'Hawa Mahal', 'City Palace', 'Jantar Mantar', 'Nahargarh Fort'],
      culturalHighlights: ['Rajasthani architecture', 'Traditional handicrafts', 'Folk music & dance', 'Royal cuisine', 'Textile heritage'],
      approximateCost: '₹12,000 - ₹22,000',
      costValue: 2,
      duration: '3-4 Days',
      durationDays: 3,
      groupSize: ['Solo', 'Small', 'Medium', 'Large'],
      tripHighlights: ['Palace tours', 'Heritage walks', 'Shopping in bazaars', 'Rajasthani cuisine', 'Cultural shows'],
      tags: ['Culture', 'Heritage', 'Cities', 'Shopping', 'Food'],
      imageUrl: jaipurImage,
      rating: 4.6,
      travelStyle: ['culture'],
      accommodationType: ['hotel', 'airbnb'],
      destinationType: ['cities']
    },
    {
      id: '4',
      name: 'Rishikesh',
      emoji: '🧘',
      description: 'The Yoga Capital of the World, nestled in the Himalayas beside the Ganges. Perfect for spiritual seekers, adventure enthusiasts, and wellness travelers.',
      famousPlaces: ['Laxman Jhula', 'Ram Jhula', 'Beatles Ashram', 'Triveni Ghat', 'Neer Garh Waterfall'],
      culturalHighlights: ['Yoga & meditation centers', 'Ganga Aarti', 'Ashram culture', 'Spiritual retreats', 'Ayurvedic treatments'],
      approximateCost: '₹10,000 - ₹20,000',
      costValue: 1,
      duration: '3-4 Days',
      durationDays: 3,
      groupSize: ['Solo', 'Small', 'Medium'],
      tripHighlights: ['River rafting', 'Bungee jumping', 'Yoga retreats', 'Camping by Ganges', 'Trekking'],
      tags: ['Adventure', 'Nature', 'Relaxation', 'Camping', 'Mountains'],
      imageUrl: rishikeshImage,
      rating: 4.7,
      travelStyle: ['adventure', 'relaxation'],
      accommodationType: ['hostel', 'camping', 'hotel'],
      destinationType: ['mountains', 'nature']
    },
    {
      id: '5',
      name: 'Kerala Backwaters',
      emoji: '🛶',
      description: 'A network of tranquil lagoons, lakes, and canals lined with palm trees. Experience houseboat cruises, Ayurveda, and serene natural beauty.',
      famousPlaces: ['Alleppey', 'Kumarakom', 'Vembanad Lake', 'Munroe Island', 'Marari Beach'],
      culturalHighlights: ['Houseboat stays', 'Kathakali dance', 'Kerala cuisine', 'Ayurvedic treatments', 'Snake boat races'],
      approximateCost: '₹25,000 - ₹40,000',
      costValue: 3,
      duration: '4-5 Days',
      durationDays: 4,
      groupSize: ['Small', 'Medium'],
      tripHighlights: ['Houseboat cruise', 'Ayurvedic spa', 'Village tours', 'Seafood delicacies', 'Beach relaxation'],
      tags: ['Nature', 'Relaxation', 'Beach', 'Luxury', 'Culture'],
      imageUrl: keralaImage,
      rating: 4.9,
      travelStyle: ['relaxation'],
      accommodationType: ['hotel', 'airbnb'],
      destinationType: ['nature', 'beach']
    },
    {
      id: '6',
      name: 'Ladakh',
      emoji: '⛰️',
      description: 'The Land of High Passes, offering dramatic landscapes, Buddhist monasteries, and thrilling road trips. A bucket-list destination for adventure lovers.',
      famousPlaces: ['Pangong Lake', 'Nubra Valley', 'Khardung La Pass', 'Thiksey Monastery', 'Magnetic Hill'],
      culturalHighlights: ['Buddhist culture', 'Tibetan monasteries', 'Local festivals', 'Traditional crafts', 'Apricot orchards'],
      approximateCost: '₹35,000 - ₹50,000',
      costValue: 3,
      duration: '6-7 Days',
      durationDays: 6,
      groupSize: ['Small', 'Medium'],
      tripHighlights: ['Bike trips', 'Lake camping', 'Monastery visits', 'High-altitude trekking', 'Stargazing'],
      tags: ['Adventure', 'Mountains', 'Nature', 'Camping', 'Trekking'],
      imageUrl: ladakhImage,
      rating: 4.9,
      travelStyle: ['adventure'],
      accommodationType: ['hotel', 'camping'],
      destinationType: ['mountains', 'nature']
    },
    {
      id: '7',
      name: 'Udaipur',
      emoji: '🕌',
      description: 'The City of Lakes, known for its romantic palaces, lakeside views, and regal heritage. Perfect for luxury travelers and culture enthusiasts.',
      famousPlaces: ['City Palace', 'Lake Pichola', 'Jag Mandir', 'Saheliyon Ki Bari', 'Fateh Sagar Lake'],
      culturalHighlights: ['Royal architecture', 'Miniature paintings', 'Folk performances', 'Rajasthani cuisine', 'Mewar heritage'],
      approximateCost: '₹18,000 - ₹35,000',
      costValue: 3,
      duration: '3-4 Days',
      durationDays: 3,
      groupSize: ['Solo', 'Small', 'Medium'],
      tripHighlights: ['Palace tours', 'Boat rides', 'Rooftop dining', 'Heritage hotels', 'Shopping'],
      tags: ['Culture', 'Luxury', 'Heritage', 'Cities', 'Relaxation'],
      imageUrl: udaipurImage,
      rating: 4.8,
      travelStyle: ['culture', 'relaxation'],
      accommodationType: ['hotel'],
      destinationType: ['cities']
    },
    {
      id: '8',
      name: 'Andaman & Nicobar Islands',
      emoji: '🏝️',
      description: 'Tropical paradise with pristine beaches, coral reefs, and crystal-clear waters. Ideal for beach lovers, divers, and adventure seekers.',
      famousPlaces: ['Radhanagar Beach', 'Cellular Jail', 'Neil Island', 'Ross Island', 'Havelock Island'],
      culturalHighlights: ['Tribal heritage', 'Marine life', 'Colonial history', 'Island culture', 'Seafood cuisine'],
      approximateCost: '₹35,000 - ₹55,000',
      costValue: 3,
      duration: '5-6 Days',
      durationDays: 5,
      groupSize: ['Small', 'Medium'],
      tripHighlights: ['Scuba diving', 'Snorkeling', 'Beach hopping', 'Water sports', 'Island camping'],
      tags: ['Beach', 'Adventure', 'Nature', 'Luxury', 'Islands'],
      imageUrl: andamanImage,
      rating: 4.8,
      travelStyle: ['adventure', 'relaxation'],
      accommodationType: ['hotel', 'airbnb'],
      destinationType: ['beach', 'nature']
    },
    {
      id: '9',
      name: 'Varanasi',
      emoji: '🕉️',
      description: 'The spiritual capital of India, one of the oldest living cities. Experience ancient rituals, ghats, temples, and profound spirituality.',
      famousPlaces: ['Dashashwamedh Ghat', 'Kashi Vishwanath Temple', 'Assi Ghat', 'Sarnath', 'Manikarnika Ghat'],
      culturalHighlights: ['Ganga Aarti', 'Temple rituals', 'Classical music', 'Silk weaving', 'Street food'],
      approximateCost: '₹10,000 - ₹18,000',
      costValue: 1,
      duration: '2-3 Days',
      durationDays: 2,
      groupSize: ['Solo', 'Small', 'Medium'],
      tripHighlights: ['Boat rides at sunrise', 'Temple visits', 'Cultural performances', 'Food tours', 'Photography'],
      tags: ['Culture', 'Heritage', 'Cities', 'Food', 'Spiritual'],
      imageUrl: varanasiImage,
      rating: 4.5,
      travelStyle: ['culture'],
      accommodationType: ['hostel', 'hotel'],
      destinationType: ['cities']
    },
    {
      id: '10',
      name: 'Hampi',
      emoji: '🏛️',
      description: 'Ancient ruins of the Vijayanagara Empire, a UNESCO World Heritage Site. Perfect for history buffs and architecture lovers.',
      famousPlaces: ['Virupaksha Temple', 'Vittala Temple', 'Stone Chariot', 'Lotus Mahal', 'Elephant Stables'],
      culturalHighlights: ['Ancient architecture', 'Stone sculptures', 'Boulder landscapes', 'Temple festivals', 'Handicrafts'],
      approximateCost: '₹12,000 - ₹20,000',
      costValue: 1,
      duration: '2-3 Days',
      durationDays: 2,
      groupSize: ['Solo', 'Small', 'Medium'],
      tripHighlights: ['Temple exploration', 'Boulder climbing', 'Sunset views', 'Heritage walks', 'Photography'],
      tags: ['Culture', 'Heritage', 'Nature', 'Adventure', 'Budget'],
      imageUrl: hampiImage,
      rating: 4.7,
      travelStyle: ['culture', 'adventure'],
      accommodationType: ['hostel', 'hotel'],
      destinationType: ['nature']
    },
    {
      id: '11',
      name: 'Mumbai',
      emoji: '🌆',
      description: 'The City of Dreams, India\'s financial capital with Bollywood glamour, colonial architecture, and vibrant nightlife.',
      famousPlaces: ['Gateway of India', 'Marine Drive', 'Elephanta Caves', 'Colaba Causeway', 'Bandra-Worli Sea Link'],
      culturalHighlights: ['Bollywood culture', 'Street food', 'Art galleries', 'Colonial buildings', 'Dabbawala system'],
      approximateCost: '₹15,000 - ₹30,000',
      costValue: 2,
      duration: '3-4 Days',
      durationDays: 3,
      groupSize: ['Solo', 'Small', 'Medium', 'Large'],
      tripHighlights: ['City tours', 'Food walks', 'Nightlife', 'Shopping', 'Beach visits'],
      tags: ['Cities', 'Nightlife', 'Food', 'Culture', 'Beach'],
      imageUrl: mumbaiImage,
      rating: 4.5,
      travelStyle: ['nightlife', 'culture'],
      accommodationType: ['hostel', 'hotel', 'airbnb'],
      destinationType: ['cities', 'beach']
    },
    {
      id: '12',
      name: 'Spiti Valley',
      emoji: '🏔️',
      description: 'A cold desert mountain valley in the Himalayas, known for its stark beauty, ancient monasteries, and off-beat adventure.',
      famousPlaces: ['Key Monastery', 'Chandratal Lake', 'Dhankar Monastery', 'Pin Valley National Park', 'Tabo Monastery'],
      culturalHighlights: ['Buddhist monasteries', 'Tibetan culture', 'Local festivals', 'Traditional villages', 'Handicrafts'],
      approximateCost: '₹30,000 - ₹45,000',
      costValue: 2,
      duration: '7-8 Days',
      durationDays: 7,
      groupSize: ['Small', 'Medium'],
      tripHighlights: ['High-altitude trekking', 'Camping', 'Monastery visits', 'Village homestays', 'Stargazing'],
      tags: ['Adventure', 'Mountains', 'Nature', 'Camping', 'Offbeat'],
      imageUrl: spitiImage,
      rating: 4.9,
      travelStyle: ['adventure'],
      accommodationType: ['camping', 'hotel'],
      destinationType: ['mountains', 'nature']
    }
  ];

  useEffect(() => {
    // Retrieve quiz answers and selected buddy from localStorage
    const answers = localStorage.getItem('queeraAnswers');
    const buddy = localStorage.getItem('selectedBuddy');

    if (!answers || !buddy) {
      // If missing data, redirect to quiz
      navigate('/queera');
      return;
    }

    const parsedAnswers = JSON.parse(answers);
    const parsedBuddy = JSON.parse(buddy);

    setUserAnswers(parsedAnswers);
    setSelectedBuddy(parsedBuddy);

    // Calculate and rank destinations
    rankDestinations(parsedAnswers, parsedBuddy);
  }, [navigate]);

  /**
   * Scoring algorithm to rank destinations based on user and buddy preferences
   * Returns a compatibility score out of 100
   */
  const calculateCompatibilityScore = (
    destination: Destination,
    userAnswers: Record<string, string>,
    buddy: any
  ): number => {
    let score = 0;

    // Travel Style Match (25 points)
    if (destination.travelStyle.includes(userAnswers.travel_style)) {
      score += 15;
    }
    // Buddy's travel style inference from interests
    if (
      (buddy.interests.includes('Hiking') && destination.travelStyle.includes('adventure')) ||
      (buddy.interests.includes('Spas') && destination.travelStyle.includes('relaxation')) ||
      (buddy.interests.includes('Museums') && destination.travelStyle.includes('culture')) ||
      (buddy.interests.includes('Nightlife') && destination.travelStyle.includes('nightlife'))
    ) {
      score += 10;
    }

    // Budget Match (20 points)
    const budgetMap: Record<string, number> = {
      budget: 1,
      'mid-range': 2,
      luxury: 3,
      flexible: 2,
    };
    const userBudgetLevel = budgetMap[userAnswers.budget] || 2;
    const budgetDiff = Math.abs(destination.costValue - userBudgetLevel);
    if (budgetDiff === 0) {
      score += 20;
    } else if (budgetDiff === 1) {
      score += 10;
    }

    // Accommodation Match (15 points)
    if (destination.accommodationType.includes(userAnswers.accommodation)) {
      score += 10;
    }
    if (
      (buddy.interests.includes('Hostels') && destination.accommodationType.includes('hostel')) ||
      (buddy.interests.includes('Luxury Hotels') && destination.accommodationType.includes('hotel')) ||
      (buddy.interests.includes('Camping') && destination.accommodationType.includes('camping'))
    ) {
      score += 5;
    }

    // Group Size Match (15 points)
    if (destination.groupSize.includes(userAnswers.group_size)) {
      score += 15;
    }

    // Destination Type Match (15 points)
    if (destination.destinationType.includes(userAnswers.destination_type)) {
      score += 15;
    }

    // Bonus: If tags match buddy interests (10 points)
    const matchingInterests = buddy.interests.filter((interest: string) =>
      destination.tags.some((tag) => tag.toLowerCase().includes(interest.toLowerCase()))
    );
    score += Math.min(matchingInterests.length * 5, 10);

    return Math.min(score, 100); // Cap at 100
  };

  const rankDestinations = (userAnswers: Record<string, string>, buddy: any) => {
    // Score each destination
    const scoredDestinations = allDestinations.map((destination) => ({
      ...destination,
      compatibilityScore: calculateCompatibilityScore(destination, userAnswers, buddy),
    }));

    // Sort by compatibility score (highest first)
    const rankedDestinations = scoredDestinations.sort(
      (a, b) => b.compatibilityScore - a.compatibilityScore
    );

    setDestinations(rankedDestinations);
  };

  const handleDestinationClick = (destination: Destination) => {
    setSelectedDestination(destination);
    setIsModalOpen(true);
  };

  const handleBookNow = () => {
    // Store selected destination and navigate to planning page
    if (selectedDestination) {
      localStorage.setItem('selectedDestination', JSON.stringify(selectedDestination));
      // Navigate to trip planning page (you can create this next)
      navigate('/trip-planning');
    }
  };

  // Check if destination is a perfect match (score >= 80)
  const isPerfectMatch = (destination: any) => {
    return destination.compatibilityScore >= 80;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => navigate('/buddy-details')}
            className="absolute top-8 left-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Recommended Destinations
            <span className="block ocean-gradient bg-clip-text text-transparent mt-2">
              For You & {selectedBuddy?.name?.split(' ')[0]} ✨
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Handpicked destinations matching both your travel vibes!
          </p>
        </div>

        {/* Destinations Grid */}
        {destinations.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((destination: any, index) => (
              <Card
                key={destination.id}
                className="card-hover card-shadow border-0 overflow-hidden cursor-pointer animate-bounce-in relative"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleDestinationClick(destination)}
              >
                {/* Perfect Match Badge */}
                {isPerfectMatch(destination) && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg animate-pulse">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Perfect Match with {selectedBuddy?.name?.split(' ')[0]}!
                    </Badge>
                  </div>
                )}

                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={destination.imageUrl}
                    alt={destination.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                        {destination.emoji} {destination.name}
                      </h3>
                      <div className="flex items-center gap-1 bg-white/90 px-2 py-1 rounded-full">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-semibold">{destination.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <CardContent className="pt-4">
                  {/* Match Score */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-success">
                        Compatibility Score
                      </span>
                      <span className="text-sm font-bold text-success">
                        {destination.compatibilityScore}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${destination.compatibilityScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {destination.description}
                  </p>

                  {/* Key Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <DollarSign className="h-4 w-4 mr-2 text-primary" />
                      <span className="font-semibold">{destination.approximateCost}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-primary" />
                      <span>{destination.duration}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2 text-primary" />
                      <span>{destination.groupSize.join(', ')} Groups</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {destination.tags.slice(0, 4).map((tag: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* View Details Button */}
                  <Button className="w-full ocean-gradient hover:opacity-90" onClick={() => handleDestinationClick(destination)}>
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-xl text-muted-foreground">
              Finding perfect destinations for you...
            </p>
          </div>
        )}
      </div>

      {/* Destination Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedDestination && (
            <>
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold flex items-center gap-2">
                  {selectedDestination.emoji} {selectedDestination.name}
                </DialogTitle>
                <DialogDescription className="text-base">
                  {selectedDestination.description}
                </DialogDescription>
              </DialogHeader>

              {/* Image */}
              <div className="relative h-64 rounded-lg overflow-hidden">
                <img
                  src={selectedDestination.imageUrl}
                  alt={selectedDestination.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Match Badge */}
              {isPerfectMatch(selectedDestination) && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-lg p-4 flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-yellow-600" />
                  <div>
                    <p className="font-bold text-yellow-800">
                      Perfect Match with {selectedBuddy?.name}!
                    </p>
                    <p className="text-sm text-yellow-700">
                      This destination matches both your preferences perfectly
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {/* Famous Places */}
                <div>
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Famous Tourist Places
                  </h3>
                  <ul className="grid grid-cols-2 gap-2">
                    {selectedDestination.famousPlaces.map((place, idx) => (
                      <li key={idx} className="text-sm flex items-start">
                        <span className="mr-2">•</span>
                        {place}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cultural Highlights */}
                <div>
                  <h3 className="font-bold text-lg mb-2">Cultural & Heritage Highlights</h3>
                  <ul className="grid grid-cols-2 gap-2">
                    {selectedDestination.culturalHighlights.map((highlight, idx) => (
                      <li key={idx} className="text-sm flex items-start">
                        <span className="mr-2">•</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Trip Highlights */}
                <div>
                  <h3 className="font-bold text-lg mb-2">Trip Highlights</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedDestination.tripHighlights.map((highlight, idx) => (
                      <Badge key={idx} variant="outline" className="text-sm">
                        ✨ {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Trip Details */}
                <div className="grid grid-cols-3 gap-4 bg-muted/50 rounded-lg p-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="font-bold">{selectedDestination.approximateCost}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-bold">{selectedDestination.duration}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Group Size</p>
                    <p className="font-bold">{selectedDestination.groupSize.join(', ')}</p>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h3 className="font-bold text-lg mb-2">Trip Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedDestination.tags.map((tag, idx) => (
                      <Badge key={idx} className="ocean-gradient">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Book Now Button */}
                <Button
                  size="lg"
                  className="w-full ocean-gradient hover:opacity-90 text-lg"
                  onClick={handleBookNow}
                >
                  Book This Trip Now
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DestinationRecommendations;
