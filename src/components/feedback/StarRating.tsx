import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

const StarRating = ({ rating, onRatingChange }: StarRatingProps) => {
  const [hovered, setHovered] = React.useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform duration-150 hover:scale-110 focus:outline-none"
        >
          <Star
            size={28}
            className={cn(
              'transition-colors duration-150',
              (hovered || rating) >= star
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-muted-foreground/40'
            )}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
