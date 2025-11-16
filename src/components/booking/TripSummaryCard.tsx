/**
 * Trip Summary Card Component
 * Displays selected trip details in booking page
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, DollarSign, Star } from 'lucide-react';

interface TripSummaryCardProps {
  trip: {
    name: string;
    emoji: string;
    description: string;
    imageUrl: string;
    duration: string;
    approximateCost: string;
    rating: number;
    tripHighlights: string[];
  };
}

export const TripSummaryCard: React.FC<TripSummaryCardProps> = ({ trip }) => {
  return (
    <Card className="overflow-hidden">
      {/* Trip Image */}
      <div className="relative h-48">
        <img
          src={trip.imageUrl}
          alt={`${trip.name} destination`}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4">
          <Badge className="bg-background/90 text-foreground backdrop-blur-sm">
            <Star className="h-3 w-3 mr-1 fill-yellow-500 text-yellow-500" />
            {trip.rating}
          </Badge>
        </div>
      </div>

      {/* Trip Details */}
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <span aria-label={trip.name}>{trip.emoji}</span>
          {trip.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-muted-foreground">{trip.description}</p>

        <Separator />

        {/* Duration & Cost */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
            <span className="text-sm">{trip.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" aria-hidden="true" />
            <span className="text-sm">{trip.approximateCost}</span>
          </div>
        </div>

        {/* Trip Highlights */}
        <div>
          <h4 className="font-semibold mb-2">Trip Highlights</h4>
          <div className="flex flex-wrap gap-2">
            {trip.tripHighlights.map((highlight, idx) => (
              <Badge key={idx} variant="secondary">
                {highlight}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
