import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating, setRating, interactive = false }) => (
  <div style={{display:'flex', gap: '6px'}}>
    {[1, 2, 3, 4, 5].map(star => (
      <Star 
        key={star} 
        size={24} 
        fill={star <= rating ? "#f59e0b" : "transparent"} 
        stroke={star <= rating ? "#f59e0b" : "#cbd5e1"}
        style={{cursor: interactive ? 'pointer' : 'default', transition: '0.2s'}}
        onClick={() => interactive && setRating(star)}
      />
    ))}
  </div>
);

export default RatingStars;

