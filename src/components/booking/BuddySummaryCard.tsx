/**
 * Buddy Summary Card Component
 * Displays selected travel buddy details
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';

interface BuddySummaryCardProps {
  buddy: {
    name: string;
    image: string;
    age: number;
    location: string;
    bio: string;
    interests: string[];
    matchPercentage: number;
  };
}

export const BuddySummaryCard: React.FC<BuddySummaryCardProps> = ({ buddy }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" aria-hidden="true" />
          Your Travel Buddy
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Buddy Profile */}
        <div className="flex items-center gap-4">
          <div className="text-4xl" aria-label={`${buddy.name}'s avatar`}>
            {buddy.image}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{buddy.name}</h3>
            <p className="text-sm text-muted-foreground">
              {buddy.age} years • {buddy.location}
            </p>
            <Badge className="mt-1 ocean-gradient" aria-label={`${buddy.matchPercentage}% compatibility match`}>
              {buddy.matchPercentage}% Match
            </Badge>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-muted-foreground">{buddy.bio}</p>

        {/* Common Interests */}
        <div>
          <h4 className="font-semibold mb-2 text-sm">Common Interests</h4>
          <div className="flex flex-wrap gap-2">
            {buddy.interests.slice(0, 5).map((interest, idx) => (
              <Badge key={idx} variant="outline">
                {interest}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
