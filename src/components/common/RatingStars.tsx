import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: number;
  showText?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({ rating, reviewCount, size = 16, showText = true }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center text-amber-400">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <Star key={i} className="fill-amber-400 text-amber-400" style={{ width: size, height: size }} />;
          } else if (i === fullStars && hasHalfStar) {
            return <Star key={i} className="fill-amber-400/50 text-amber-400" style={{ width: size, height: size }} />;
          } else {
            return <Star key={i} className="text-slate-300 fill-slate-100" style={{ width: size, height: size }} />;
          }
        })}
      </div>
      {showText && (
        <span className="text-xs font-bold text-slate-800 ml-1">
          {rating.toFixed(1)} {reviewCount !== undefined && <span className="text-slate-500 font-normal">({reviewCount})</span>}
        </span>
      )}
    </div>
  );
};
