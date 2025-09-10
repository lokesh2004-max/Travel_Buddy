import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plane, MapPin, Users, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import heroImage from '@/assets/hero-travel-bg.jpg';

const Home = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      // Simple validation - in real app, you'd handle actual authentication
      navigate('/queera');
    }
  };

  const features = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "Find Your Perfect Travel Buddy",
      description: "Connect with like-minded travelers who share your wanderlust and adventure spirit."
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Discover Amazing Destinations", 
      description: "Explore new places with companions who match your travel style and preferences."
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Build Lasting Friendships",
      description: "Create meaningful connections that extend beyond your travels."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 hero-gradient" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="animate-slide-in-up">
            <Plane className="h-16 w-16 mx-auto mb-6 animate-float" />
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Find Your Perfect
              <span className="block sunset-gradient bg-clip-text text-transparent">
                Travel Buddy
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-2xl mx-auto">
              Connect with amazing people, explore the world together, and create unforgettable memories.
            </p>
          </div>
          
          {/* Auth Form */}
          <div className="animate-fade-in-delayed max-w-md mx-auto">
            <Card className="bg-white/95 backdrop-blur-sm card-shadow border-0">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-foreground">
                  {isLogin ? 'Welcome Back!' : 'Join Travel Buddy'}
                </CardTitle>
                <CardDescription>
                  {isLogin ? 'Sign in to find your travel companions' : 'Create account to start your journey'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAuth} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <Button type="submit" className="w-full ocean-gradient hover:opacity-90">
                    {isLogin ? 'Sign In & Explore' : 'Create Account'}
                  </Button>
                </form>
                
                <div className="text-center mt-4">
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-primary hover:underline"
                  >
                    {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-slide-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose Travel Buddy?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We make it easy to find the perfect travel companion for your next adventure.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="card-hover card-shadow border-0 animate-bounce-in text-center p-6">
                <CardContent className="pt-6">
                  <div className="ocean-gradient rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-white">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;