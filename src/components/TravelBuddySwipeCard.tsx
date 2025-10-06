import React, { useState, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { MapPin, Star, Heart, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TravelBuddy {
  id: string;
  name: string;
  image: string;
  age: number;
  location: string;
  bio: string;
  interests: string[];
  matchPercentage: number;
}

interface SwipeCardProps {
  buddies: TravelBuddy[];
  onSwipeRight?: (buddy: TravelBuddy) => void;
  onSwipeLeft?: (buddy: TravelBuddy) => void;
  onAllSwipedComplete?: () => void;
}

const TravelBuddySwipeCard: React.FC<SwipeCardProps> = ({ 
  buddies, 
  onSwipeRight, 
  onSwipeLeft,
  onAllSwipedComplete 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const currentBuddy = buddies[currentIndex];
  const remainingCount = buddies.length - currentIndex;

  // Calculate rotation based on drag distance
  const getRotation = () => {
    const maxRotation = 15;
    return (dragOffset.x / 300) * maxRotation;
  };

  // Calculate opacity for swipe indicators
  const getSwipeOpacity = () => {
    return Math.min(Math.abs(dragOffset.x) / 100, 1);
  };

  // Handle drag start
  const handleDragStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
  };

  // Handle drag move
  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  // Handle drag end
  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const swipeThreshold = 100;
    
    if (Math.abs(dragOffset.x) > swipeThreshold) {
      // Swipe completed
      if (dragOffset.x > 0) {
        handleSwipeRight();
      } else {
        handleSwipeLeft();
      }
    } else {
      // Return to center
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const handleSwipeRight = () => {
    if (!currentBuddy) return;

    // Animate card off screen to the right
    setDragOffset({ x: 1000, y: 0 });

    setTimeout(() => {
      onSwipeRight?.(currentBuddy);
      toast({
        title: "Great Match! 🎉",
        description: `You connected with ${currentBuddy.name} (${currentBuddy.matchPercentage}% match)`,
      });
      
      setCurrentIndex(prev => prev + 1);
      setDragOffset({ x: 0, y: 0 });

      if (currentIndex + 1 >= buddies.length) {
        onAllSwipedComplete?.();
      }
    }, 300);
  };

  const handleSwipeLeft = () => {
    if (!currentBuddy) return;

    // Animate card off screen to the left
    setDragOffset({ x: -1000, y: 0 });

    setTimeout(() => {
      onSwipeLeft?.(currentBuddy);
      console.log(`Skipped ${currentBuddy.name} (${currentBuddy.matchPercentage}% match)`);
      
      setCurrentIndex(prev => prev + 1);
      setDragOffset({ x: 0, y: 0 });

      if (currentIndex + 1 >= buddies.length) {
        onAllSwipedComplete?.();
      }
    }, 300);
  };

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  // Add global mouse move and up listeners
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleDragMove(e.clientX, e.clientY);
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleDragEnd();
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, dragStart]);

  // No more buddies state
  if (!currentBuddy) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center animate-fade-in">
          <div className="text-8xl mb-6">🌍</div>
          <h2 className="text-3xl font-bold mb-4">No More Travel Buddies</h2>
          <p className="text-muted-foreground text-lg mb-6">
            You've reviewed all potential travel companions!
          </p>
          <p className="text-sm text-muted-foreground">
            Check back later for more matches or adjust your preferences.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto h-[600px] select-none">
      {/* Counter */}
      <div className="absolute -top-12 left-0 right-0 text-center">
        <p className="text-sm text-muted-foreground">
          {remainingCount} {remainingCount === 1 ? 'buddy' : 'buddies'} remaining
        </p>
      </div>

      {/* Card Stack - Background cards */}
      <div className="absolute inset-0">
        {buddies.slice(currentIndex + 1, currentIndex + 3).map((buddy, index) => (
          <Card
            key={buddy.id}
            className="absolute inset-0 transition-all duration-300"
            style={{
              transform: `translateY(${(index + 1) * 10}px) scale(${1 - (index + 1) * 0.05})`,
              opacity: 1 - (index + 1) * 0.3,
              zIndex: 10 - index,
            }}
          >
            <div className="h-full bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg" />
          </Card>
        ))}
      </div>

      {/* Active Swipe Card */}
      <Card
        ref={cardRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing card-shadow border-0 overflow-hidden"
        style={{
          transform: `translateX(${dragOffset.x}px) translateY(${dragOffset.y * 0.3}px) rotate(${getRotation()}deg)`,
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 20,
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Swipe Indicators */}
        <div
          className="absolute top-8 right-8 z-30 pointer-events-none"
          style={{ opacity: dragOffset.x > 0 ? getSwipeOpacity() : 0 }}
        >
          <div className="bg-success text-white px-6 py-3 rounded-full font-bold text-lg transform rotate-12 border-4 border-success shadow-lg">
            <Heart className="inline-block h-6 w-6 mr-2" />
            CONNECT
          </div>
        </div>

        <div
          className="absolute top-8 left-8 z-30 pointer-events-none"
          style={{ opacity: dragOffset.x < 0 ? getSwipeOpacity() : 0 }}
        >
          <div className="bg-destructive text-white px-6 py-3 rounded-full font-bold text-lg transform -rotate-12 border-4 border-destructive shadow-lg">
            <X className="inline-block h-6 w-6 mr-2" />
            SKIP
          </div>
        </div>

        {/* Card Content */}
        <div className="relative h-full flex flex-col">
          {/* Profile Image/Avatar */}
          <div className="relative h-2/3 hero-gradient flex items-center justify-center">
            <div className="text-9xl">{currentBuddy.image}</div>
            
            {/* Match Badge */}
            <div className="absolute top-6 left-6">
              <Badge className="bg-white/90 text-primary border-0 text-base px-4 py-2 shadow-lg backdrop-blur-sm">
                <Star className="h-4 w-4 mr-1 fill-primary" />
                {currentBuddy.matchPercentage}% Match
              </Badge>
            </div>
          </div>

          {/* Card Info */}
          <div className="flex-1 p-6 bg-card">
            <div className="mb-4">
              <h2 className="text-3xl font-bold mb-1">
                {currentBuddy.name}, {currentBuddy.age}
              </h2>
              <div className="flex items-center text-muted-foreground mb-3">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{currentBuddy.location}</span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{currentBuddy.bio}</p>
            </div>

            {/* Interests */}
            <div className="flex flex-wrap gap-2 mb-4">
              {currentBuddy.interests.slice(0, 5).map((interest, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="text-xs bg-gradient-to-r from-primary/10 to-accent/10"
                >
                  {interest}
                </Badge>
              ))}
              {currentBuddy.interests.length > 5 && (
                <Badge variant="secondary" className="text-xs">
                  +{currentBuddy.interests.length - 5} more
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="absolute -bottom-20 left-0 right-0 flex justify-center gap-6 pointer-events-auto">
        <button
          onClick={handleSwipeLeft}
          className="h-16 w-16 rounded-full bg-background border-2 border-destructive text-destructive hover:bg-destructive hover:text-white transition-all shadow-lg hover:scale-110 flex items-center justify-center"
          aria-label="Skip"
        >
          <X className="h-8 w-8" />
        </button>
        
        <button
          onClick={handleSwipeRight}
          className="h-20 w-20 rounded-full bg-gradient-to-br from-success to-success/80 text-white hover:from-success/90 hover:to-success/70 transition-all shadow-lg hover:scale-110 glow-effect flex items-center justify-center"
          aria-label="Connect"
        >
          <Heart className="h-10 w-10 fill-white" />
        </button>
      </div>
    </div>
  );
};

export default TravelBuddySwipeCard;
