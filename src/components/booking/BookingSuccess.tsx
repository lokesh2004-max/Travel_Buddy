/**
 * Booking Success Component
 * Displays confirmation message after successful booking
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

interface BookingSuccessProps {
  userEmail: string;
}

export const BookingSuccess: React.FC<BookingSuccessProps> = ({ userEmail }) => {
  const navigate = useNavigate();

  return (
    <Card className="max-w-2xl mx-auto text-center p-12">
      <div className="flex justify-center mb-6" aria-label="Success">
        <CheckCircle2 className="h-24 w-24 text-success animate-scale-in" aria-hidden="true" />
      </div>
      
      <h1 
        className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent"
        role="heading"
        aria-level={1}
      >
        Booking Confirmed!
      </h1>
      
      <p className="text-muted-foreground text-lg mb-8">
        Your travel itinerary has been sent to{' '}
        <strong className="text-foreground">{userEmail}</strong>
      </p>
      
      <Button
        size="lg"
        onClick={() => navigate('/')}
        className="ocean-gradient hover:opacity-90 card-shadow"
        aria-label="Return to home page"
      >
        Back to Home
      </Button>
    </Card>
  );
};
