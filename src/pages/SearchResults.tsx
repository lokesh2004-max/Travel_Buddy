import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowLeft, Users, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
}

const allTrips: Trip[] = [
  {
    id: 1,
    destination: "Goa Beach Paradise",
    description: "Explore pristine beaches, vibrant nightlife, and Portuguese heritage. Perfect for beach lovers and party enthusiasts.",
    emoji: "🏖️",
    duration: "5 Days",
    groupSize: "6-8 people",
    price: "₹8,999",
    rating: 4.8,
    tags: ["Beach", "Party", "Adventure"]
  },
  {
    id: 2,
    destination: "Kashmir Valley Trek",
    description: "Experience breathtaking mountain views, Dal Lake houseboats, and Mughal gardens in the paradise on earth.",
    emoji: "🏔️",
    duration: "7 Days",
    groupSize: "5-7 people",
    price: "₹12,999",
    rating: 4.9,
    tags: ["Mountains", "Trekking", "Nature"]
  },
  {
    id: 3,
    destination: "Kerala Backwaters",
    description: "Cruise through serene backwaters, visit tea plantations, and enjoy Ayurvedic treatments in God's Own Country.",
    emoji: "🌴",
    duration: "6 Days",
    groupSize: "4-6 people",
    price: "₹10,499",
    rating: 4.7,
    tags: ["Nature", "Relaxation", "Culture"]
  },
  {
    id: 4,
    destination: "Rajasthan Heritage Tour",
    description: "Discover majestic forts, colorful markets, and royal palaces in the land of maharajas.",
    emoji: "🏰",
    duration: "8 Days",
    groupSize: "6-10 people",
    price: "₹14,999",
    rating: 4.9,
    tags: ["Heritage", "Culture", "History"]
  },
  {
    id: 5,
    destination: "Himachal Adventure",
    description: "Paragliding in Bir, trekking in Triund, and camping under starlit skies in the Himalayas.",
    emoji: "⛰️",
    duration: "6 Days",
    groupSize: "5-8 people",
    price: "₹11,499",
    rating: 4.8,
    tags: ["Adventure", "Mountains", "Camping"]
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
    tags: ["Nature", "Culture", "Off-beat"]
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
    tags: ["Beach", "Adventure", "Wellness"]
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
    tags: ["Winter", "Adventure", "Mountains"]
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
    tags: ["Wildlife", "Nature", "Photography"]
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
  const query = searchParams.get('query') || '';

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
              <Card key={trip.id} className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white/80 backdrop-blur-sm border-0">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-5xl">{trip.emoji}</div>
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                      ⭐ {trip.rating}
                    </Badge>
                  </div>
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
                      Starting from {trip.price}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {trip.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
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
    </div>
  );
};

export default SearchResults;
