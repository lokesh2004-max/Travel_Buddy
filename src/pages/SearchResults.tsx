import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowLeft, Users, Calendar, TrendingUp, X, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface Trip {
  id: number;
  destination: string;
  description: string;
  emoji: string;
  duration: string;
  groupSize: string;
  price: string;
  rating: number;
  tags: string[];
  imageUrl: string;
  details: string;
  highlights: string[];
}

const allTrips: Trip[] = [
  {
    id: 1,
    destination: "Goa Beach Paradise",
    description: "Explore pristine beaches, vibrant nightlife, and Portuguese heritage.",
    emoji: "🏖️",
    duration: "5 Days",
    groupSize: "6-8 people",
    price: "₹8,999",
    rating: 4.8,
    tags: ["Beach", "Party", "Adventure"],
    imageUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
    details: "Embark on an unforgettable journey to Goa, where golden sands meet azure waters. This carefully curated 5-day experience takes you through the best beaches including Baga, Calangute, and Palolem. Enjoy water sports, beach parties, and explore the Portuguese-influenced architecture of Old Goa. Experience the vibrant nightlife, savor delicious seafood, and immerse yourself in the laid-back Goan culture.",
    highlights: ["Water Sports", "Beach Parties", "Portuguese Heritage Sites", "Seafood Delicacies", "Sunset Cruises"]
  },
  {
    id: 2,
    destination: "Kashmir Valley Trek",
    description: "Experience breathtaking mountain views, Dal Lake houseboats, and Mughal gardens.",
    emoji: "🏔️",
    duration: "7 Days",
    groupSize: "5-7 people",
    price: "₹12,999",
    rating: 4.9,
    tags: ["Mountains", "Trekking", "Nature"],
    imageUrl: "https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800&q=80",
    details: "Discover the paradise on earth with this comprehensive Kashmir tour. Stay in traditional houseboats on Dal Lake, explore the stunning Mughal gardens, and trek through breathtaking valleys. Visit Gulmarg, Pahalgam, and Sonamarg while experiencing the warm hospitality of Kashmiri people. This journey offers perfect blend of adventure, nature, and cultural immersion.",
    highlights: ["Dal Lake Shikara Ride", "Mughal Gardens", "Gulmarg Gondola", "Pahalgam Trek", "Traditional Kashmiri Cuisine"]
  },
  {
    id: 3,
    destination: "Kerala Backwaters",
    description: "Cruise through serene backwaters, visit tea plantations, and enjoy Ayurvedic treatments.",
    emoji: "🌴",
    duration: "6 Days",
    groupSize: "4-6 people",
    price: "₹10,499",
    rating: 4.7,
    tags: ["Nature", "Relaxation", "Culture"],
    imageUrl: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80",
    details: "Experience the tranquil beauty of Kerala's backwaters on a traditional houseboat cruise. Visit lush tea plantations in Munnar, witness the majestic Athirappilly waterfalls, and indulge in authentic Ayurvedic spa treatments. Explore the rich cultural heritage through Kathakali performances and temple visits. This journey through God's Own Country promises complete rejuvenation.",
    highlights: ["Houseboat Cruise", "Tea Plantation Tour", "Ayurvedic Spa", "Kathakali Performance", "Cochin Fort Walk"]
  },
  {
    id: 4,
    destination: "Rajasthan Heritage Tour",
    description: "Discover majestic forts, colorful markets, and royal palaces.",
    emoji: "🏰",
    duration: "8 Days",
    groupSize: "6-10 people",
    price: "₹14,999",
    rating: 4.9,
    tags: ["Heritage", "Culture", "History"],
    imageUrl: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80",
    details: "Step into the land of maharajas and explore Rajasthan's magnificent heritage. Visit the iconic Amber Fort in Jaipur, Mehrangarh Fort in Jodhpur, and the romantic Lake Palace in Udaipur. Shop in colorful bazaars, witness folk performances, and stay in heritage hotels. This tour covers the golden triangle of Rajasthan - Jaipur, Jodhpur, and Udaipur.",
    highlights: ["Amber Fort", "City Palace Udaipur", "Desert Safari", "Traditional Folk Dance", "Heritage Hotel Stay"]
  },
  {
    id: 5,
    destination: "Himachal Adventure",
    description: "Paragliding in Bir, trekking in Triund, and camping under starlit skies.",
    emoji: "⛰️",
    duration: "6 Days",
    groupSize: "5-8 people",
    price: "₹11,499",
    rating: 4.8,
    tags: ["Adventure", "Mountains", "Camping"],
    imageUrl: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80",
    details: "Adventure awaits in the scenic landscapes of Himachal Pradesh. Experience the thrill of paragliding in Bir-Billing, trek to the beautiful Triund hilltop, and camp under a blanket of stars. Visit the charming town of Manali, explore ancient monasteries in Dharamshala, and raft through the rapids of River Beas. Perfect for adrenaline junkies and nature lovers.",
    highlights: ["Paragliding in Bir", "Triund Trek", "River Rafting", "Monastery Visits", "Mountain Camping"]
  },
  {
    id: 6,
    destination: "Northeast Explorer",
    description: "Journey through Meghalaya's living root bridges, Assam's tea gardens, and Sikkim's monasteries.",
    emoji: "🌿",
    duration: "10 Days",
    groupSize: "6-8 people",
    price: "₹16,999",
    rating: 4.9,
    tags: ["Nature", "Culture", "Off-beat"],
    imageUrl: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80",
    details: "Explore the unexplored beauty of Northeast India. Walk across the living root bridges of Cherrapunji, cruise through the mighty Brahmaputra, visit ancient Buddhist monasteries in Sikkim, and witness the rich biodiversity of Kaziranga National Park. Experience diverse cultures, taste unique cuisines, and discover the hidden gems of this enchanting region.",
    highlights: ["Living Root Bridges", "Kaziranga Safari", "Brahmaputra Cruise", "Rumtek Monastery", "Shillong Culture"]
  },
  {
    id: 7,
    destination: "Goa Adventure Retreat",
    description: "Water sports, beach camping, and sunrise yoga sessions by the Arabian Sea.",
    emoji: "🏄",
    duration: "4 Days",
    groupSize: "6-10 people",
    price: "₹7,499",
    rating: 4.6,
    tags: ["Beach", "Adventure", "Wellness"],
    imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
    details: "Combine adventure with wellness in this unique Goa experience. Start your days with sunrise yoga on the beach, followed by thrilling water sports including jet skiing, parasailing, and kayaking. Camp under the stars on pristine beaches, enjoy beach bonfires, and participate in guided meditation sessions. Perfect for those seeking adventure and inner peace.",
    highlights: ["Beach Yoga", "Water Sports", "Beach Camping", "Meditation Sessions", "Bonfire Nights"]
  },
  {
    id: 8,
    destination: "Kashmir Winter Wonderland",
    description: "Skiing in Gulmarg, snow trekking, and cozy stays in traditional Kashmiri homes.",
    emoji: "❄️",
    duration: "7 Days",
    groupSize: "4-6 people",
    price: "₹15,499",
    rating: 4.9,
    tags: ["Winter", "Adventure", "Mountains"],
    imageUrl: "https://images.unsplash.com/photo-1551582045-6ec9c11d8697?w=800&q=80",
    details: "Experience the magical winter wonderland of Kashmir. Learn skiing or snowboarding in the world-famous slopes of Gulmarg, enjoy gondola rides with panoramic snow-covered views, and trek through snow-laden valleys. Stay in warm traditional Kashmiri homes, savor hot kahwa tea, and witness the breathtaking beauty of frozen Dal Lake.",
    highlights: ["Skiing in Gulmarg", "Gondola Ride", "Snow Trekking", "Traditional Kashmiri Stay", "Frozen Dal Lake"]
  },
  {
    id: 9,
    destination: "Kerala Wildlife Safari",
    description: "Spot elephants, tigers, and exotic birds in Periyar and Wayanad wildlife sanctuaries.",
    emoji: "🐘",
    duration: "5 Days",
    groupSize: "4-8 people",
    price: "₹9,999",
    rating: 4.7,
    tags: ["Wildlife", "Nature", "Photography"],
    imageUrl: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800&q=80",
    details: "Embark on a thrilling wildlife adventure through Kerala's pristine forests. Safari through Periyar Tiger Reserve and Wayanad Wildlife Sanctuary to spot elephants, tigers, leopards, and exotic bird species. Stay in eco-friendly jungle resorts, take guided nature walks, and learn about conservation efforts. Ideal for wildlife enthusiasts and photography lovers.",
    highlights: ["Tiger Reserve Safari", "Elephant Encounters", "Bird Watching", "Nature Walks", "Jungle Lodge Stay"]
  }
];

const popularDestinations = [
  { name: "Goa", emoji: "🏖️", trips: 15 },
  { name: "Kashmir", emoji: "🏔️", trips: 8 },
  { name: "Kerala", emoji: "🌴", trips: 12 },
  { name: "Rajasthan", emoji: "🏰", trips: 10 },
  { name: "Himachal", emoji: "⛰️", trips: 14 }
];

const SearchResults = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const query = searchParams.get('query') || '';

  const openModal = (trip: Trip) => {
    setSelectedTrip(trip);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedTrip(null), 200);
  };

  // Function to highlight matching keywords
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <>
        {parts.map((part, index) => 
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={index} className="bg-yellow-200 text-gray-900 px-1 rounded">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  useEffect(() => {
    if (query.trim()) {
      const results = allTrips.filter(trip => 
        trip.destination.toLowerCase().includes(query.toLowerCase()) ||
        trip.description.toLowerCase().includes(query.toLowerCase()) ||
        trip.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredTrips(results);
    } else {
      setFilteredTrips(allTrips);
    }
  }, [query]);

  const handleSearch = (newQuery: string) => {
    if (newQuery.trim()) {
      setSearchParams({ query: newQuery });
    }
  };

  const handleDestinationClick = (destination: string) => {
    setSearchParams({ query: destination });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link to="/" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
              <ArrowLeft size={20} />
              <span className="font-medium">Back to Home</span>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="text-2xl">🌍</div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Travel Buddy
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                defaultValue={query}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(e.currentTarget.value);
                  }
                }}
                placeholder="Search destinations, activities, or experiences..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
              />
            </div>
            <Button
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling?.querySelector('input');
                if (input) handleSearch(input.value);
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Search size={20} className="mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Popular Destinations - Show when no query or no results */}
        {(!query || filteredTrips.length === 0) && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="text-blue-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-800">Popular Destinations</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {popularDestinations.map((dest, index) => (
                <button
                  key={index}
                  onClick={() => handleDestinationClick(dest.name)}
                  className="bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100 group"
                >
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                    {dest.emoji}
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">{dest.name}</h3>
                  <p className="text-xs text-gray-500">{dest.trips} trips</p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {query ? `Search Results for "${query}"` : 'All Travel Destinations'}
          </h1>
          <p className="text-gray-600">
            Found {filteredTrips.length} {filteredTrips.length === 1 ? 'trip' : 'trips'} matching your search
          </p>
        </div>

        {filteredTrips.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <Card key={trip.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white/80 backdrop-blur-sm border-0">
                {/* Image Banner */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={trip.imageUrl} 
                    alt={trip.destination}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <Badge className="absolute top-4 right-4 bg-white/95 text-gray-800 border-0 backdrop-blur-sm">
                    <Star size={14} className="mr-1 fill-yellow-400 text-yellow-400" />
                    {trip.rating}
                  </Badge>
                </div>

                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-800">
                    {highlightText(trip.destination, query)}
                  </CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed mt-2">
                    {highlightText(trip.description, query)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar size={16} className="mr-2 text-blue-600" />
                      {trip.duration}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users size={16} className="mr-2 text-purple-600" />
                      {trip.groupSize}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin size={16} className="mr-2 text-green-600" />
                      Starting from <span className="font-semibold ml-1">{trip.price}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {trip.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button 
                    onClick={() => openModal(trip)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No trips found</h2>
            <p className="text-gray-600 mb-6">
              We couldn't find any trips matching "{query}". Try searching for different destinations or activities.
            </p>
            <Button
              onClick={() => setSearchParams({})}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              View All Trips
            </Button>
          </div>
        )}
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0">
          {selectedTrip && (
            <div className="relative">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-50 bg-white/95 backdrop-blur-sm hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
              >
                <X size={20} className="text-gray-700" />
              </button>

              {/* Large Image */}
              <div className="relative h-72 md:h-96 overflow-hidden">
                <img 
                  src={selectedTrip.imageUrl} 
                  alt={selectedTrip.destination}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {selectedTrip.destination}
                  </h2>
                  <div className="flex items-center gap-4 text-white/90">
                    <div className="flex items-center gap-1">
                      <Star size={18} className="fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{selectedTrip.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>{selectedTrip.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      <span>{selectedTrip.groupSize}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">About This Trip</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedTrip.details}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Highlights</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTrip.highlights.map((highlight, index) => (
                      <Badge 
                        key={index} 
                        className="bg-gradient-to-r from-blue-100 to-purple-100 text-gray-800 border-0 px-4 py-2 text-sm"
                      >
                        ✓ {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Trip Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTrip.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="px-3 py-1">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <div>
                    <p className="text-sm text-gray-500">Starting from</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {selectedTrip.price}
                    </p>
                  </div>
                  <Button 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-6 text-lg"
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SearchResults;
