import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Users, Shield, Star, Menu, X, Phone, Mail, Globe, ChevronDown, Play } from 'lucide-react';
import { AuthModal } from '@/components/AuthModal';

const Home = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search-results?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Mumbai",
      text: "Found my perfect travel companion through Travel Buddy. Our Goa trip was absolutely amazing!",
      rating: 5,
      image: "👩‍💼"
    },
    {
      name: "Rahul Verma", 
      location: "Delhi",
      text: "Safe, verified travelers and incredible experiences. Highly recommend for solo travelers!",
      rating: 5,
      image: "👨‍💻"
    },
    {
      name: "Sneha Patel",
      location: "Bangalore",
      text: "The 24/7 support gave me confidence to explore new places with new friends.",
      rating: 5,
      image: "👩‍🎓"
    }
  ];

  const destinations = [
    { name: "Rajasthan", imageUrl: "https://static.vecteezy.com/system/resources/previews/011/084/232/large_2x/full-picture-of-hawa-mahal-of-rajasthan-photo.jpg", trips: 45 },
    { name: "Kashmir", imageUrl: "https://img.veenaworld.com/wp-content/uploads/2023/01/shutterstock_2044050407-scaled.jpg", trips: 32 },
    { name: "Kerala", imageUrl: "https://www.keralatourism.org/images/enchanting_kerala/large/kerala_backwaters20210519115242_754_1.jpg", trips: 38 },
    { name: "Goa", imageUrl: "https://www.holidify.com/images/bgImages/GOA.jpg", trips: 56 },
    { name: "Himachal", imageUrl: "https://www.tourmyindia.com/states/himachal/image/himachal-pradesh-banner1.webp", trips: 41 },
    { name: "Northeast", imageUrl: "https://www.holidify.com/images/bgImages/TAWANG.jpg", trips: 23 }
  ];

  const faqs = [
    {
      question: "What is the concept of finding a travel buddy?",
      answer: "Travel Buddy connects you with verified travelers who share similar interests and travel plans. Our TripLeaders organize group trips where you can join and meet like-minded companions."
    },
    {
      question: "How many people will I travel with?",
      answer: "Most of our group trips include 4-8 travel buddies, creating an intimate yet social experience that's perfect for making lasting friendships."
    },
    {
      question: "How about my safety traveling with Travel Buddy?",
      answer: "Safety is our top priority. All members are ID verified, and we provide 24/7 support throughout your journey. Our TripLeaders are experienced and trained in group management."
    },
    {
      question: "What's included in the trip cost?",
      answer: "Trip costs typically include accommodation, transportation, guided tours, and some meals. Each trip listing provides detailed information about what's included and excluded."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMenuOpen(false);
  };


  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-lg z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="text-2xl">🌍</div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Travel Buddy
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-8">
              <button onClick={() => scrollToSection('home')} className="text-gray-700 hover:text-blue-600 transition-all duration-200 font-medium">
                Home
              </button>
              <button onClick={() => scrollToSection('why')} className="text-gray-700 hover:text-blue-600 transition-all duration-200 font-medium">
                Why Us
              </button>
              <button onClick={() => scrollToSection('how')} className="text-gray-700 hover:text-blue-600 transition-all duration-200 font-medium">
                How It Works
              </button>
              <button onClick={() => scrollToSection('destinations')} className="text-gray-700 hover:text-blue-600 transition-all duration-200 font-medium">
                Destinations
              </button>
              <button onClick={() => scrollToSection('faq')} className="text-gray-700 hover:text-blue-600 transition-all duration-200 font-medium">
                FAQ
              </button>
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Join Now
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-200 bg-white/95 backdrop-blur-md">
              <div className="flex flex-col space-y-4">
                <button onClick={() => scrollToSection('home')} className="text-left text-gray-700 hover:text-blue-600 py-2">Home</button>
                <button onClick={() => scrollToSection('why')} className="text-left text-gray-700 hover:text-blue-600 py-2">Why Us</button>
                <button onClick={() => scrollToSection('how')} className="text-left text-gray-700 hover:text-blue-600 py-2">How It Works</button>
                <button onClick={() => scrollToSection('destinations')} className="text-left text-gray-700 hover:text-blue-600 py-2">Destinations</button>
                <button onClick={() => scrollToSection('faq')} className="text-left text-gray-700 hover:text-blue-600 py-2">FAQ</button>
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-semibold w-full"
                >
                  Join Now
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Discover.
              </span>
              <br />
              <span className="text-gray-800">Find. Enjoy.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Connect with verified travel companions across India. 
              Turn your solo adventures into shared memories.
            </p>
            
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Where do you want to explore?"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 text-lg"
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Search size={20} />
                <span>Search Trips</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Users className="text-blue-600" size={16} />
                <span>5000+ Active Members</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="text-green-600" size={16} />
                <span>200+ Destinations</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="text-purple-600" size={16} />
                <span>100% Verified</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white mb-4">
                <h3 className="text-xl font-bold mb-2">Next Adventure</h3>
                <p className="text-blue-100">Kashmir Valley Trek</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm bg-white/20 px-3 py-1 rounded-full">5 spots left</span>
                  <span className="text-lg font-bold">₹12,999</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {['🏔️', '🌲', '🏕️'].map((emoji, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-2">{emoji}</div>
                    <div className="text-xs text-gray-600">Adventure</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Travel Buddy Section */}
      <section id="why" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Why Choose Travel Buddy?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're not just another travel platform. We're your gateway to authentic connections and unforgettable experiences.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Star className="text-yellow-500" size={40} />,
                title: "Memorably Unique",
                description: "Every trip is crafted with special touches that create lasting memories and authentic local experiences."
              },
              {
                icon: <Users className="text-blue-500" size={40} />,
                title: "Verified Community",
                description: "Connect with genuine, ID-verified travelers who share your passion for exploration and adventure."
              },
              {
                icon: <Shield className="text-green-500" size={40} />,
                title: "24/7 Support",
                description: "Round-the-clock assistance ensures your safety and peace of mind throughout your journey."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group">
                <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-20 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Three simple steps to your next adventure
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                icon: <Search size={40} />,
                title: "Find Your Trip",
                description: "Browse through 200+ destinations and find the perfect trip that matches your interests and schedule."
              },
              {
                step: "02", 
                icon: <Users size={40} />,
                title: "Book Your Spot",
                description: "Secure your place with just a 20% deposit. Connect with your TripLeader and fellow travelers."
              },
              {
                step: "03",
                icon: <MapPin size={40} />,
                title: "Enjoy the Adventure",
                description: "Pack your bags and get ready for an unforgettable experience with your new travel companions!"
              }
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-all duration-300">
                    {step.icon}
                  </div>
                  <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-sm px-3 py-1 rounded-full">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-blue-100 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <button className="bg-white text-purple-900 px-8 py-4 rounded-full font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 mx-auto">
              <Play size={20} />
              <span>Watch How It Works</span>
            </button>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section id="destinations" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Popular Destinations
            </h2>
            <p className="text-xl text-gray-600">
              Explore incredible India with like-minded travelers
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((destination, index) => (
              <div key={index} className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transform hover:scale-105 transition-all duration-300 group cursor-pointer">
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={destination.imageUrl} 
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{destination.name}</h3>
                  <p className="text-gray-600 mb-4">{destination.trips} active trips</p>
                  <button 
                    onClick={() => navigate(`/search-results?query=${encodeURIComponent(destination.name)}`)}
                    className="text-blue-600 font-semibold hover:text-purple-600 transition-colors"
                  >
                    Explore Trips →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-16">What Travelers Say</h2>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 lg:p-12">
              <div className="text-6xl mb-6">{testimonials[currentTestimonial].image}</div>
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-current" size={24} />
                ))}
              </div>
              <p className="text-xl text-gray-700 mb-6 italic leading-relaxed">
                "{testimonials[currentTestimonial].text}"
              </p>
              <div>
                <h4 className="text-lg font-bold text-gray-800">{testimonials[currentTestimonial].name}</h4>
                <p className="text-gray-600">{testimonials[currentTestimonial].location}</p>
              </div>
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about Travel Buddy
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === index ? -1 : index)}
                  className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-semibold text-gray-800">{faq.question}</span>
                  <ChevronDown 
                    className={`text-gray-400 transition-transform duration-300 ${
                      activeAccordion === index ? 'rotate-180' : ''
                    }`} 
                    size={24} 
                  />
                </button>
                {activeAccordion === index && (
                  <div className="px-8 pb-6">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="text-3xl">🌍</div>
                <span className="text-2xl font-bold">Travel Buddy</span>
              </div>
              <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
                Connecting travelers across India to create unforgettable journeys and lasting friendships. 
                Your adventure starts here.
              </p>
              <div className="flex space-x-4">
                {['📘', '📷', '🐦', '📺'].map((social, i) => (
                  <button key={i} className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-xl hover:bg-gray-700 transition-colors">
                    {social}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-3 text-gray-300">
                <li><button onClick={() => scrollToSection('home')} className="hover:text-white transition-colors">Home</button></li>
                <li><button onClick={() => scrollToSection('destinations')} className="hover:text-white transition-colors">Destinations</button></li>
                <li><button className="hover:text-white transition-colors">Find Trips</button></li>
                <li><button className="hover:text-white transition-colors">Become a TripLeader</button></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Contact</h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-center space-x-3">
                  <Phone size={18} />
                  <span>+91 305-240-9671</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail size={18} />
                  <span>hello@travelbuddy.in</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe size={18} />
                  <span>Available in 200+ cities</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Travel Buddy. All rights reserved. Made with ❤️ in India
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-gray-400">
              <button className="hover:text-white transition-colors">Privacy Policy</button>
              <button className="hover:text-white transition-colors">Terms of Service</button>
              <button className="hover:text-white transition-colors">Cookie Policy</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
};

export default Home;
