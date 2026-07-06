'use client';
import { StarIcon } from '@heroicons/react/24/solid';

interface RatingStarsProps {
  rating?: number;
  maxRating?: number;
  setRating?: null | ((rating: number) => void);
  reviewCount?: number | null;
}

export default function RatingStars({
  rating = 0,
  maxRating = 5,
  setRating = null,
  reviewCount = null,
}: RatingStarsProps) {
  function handleClick(number: number) {
    if (!setRating) return;
    setRating(number);
  }

  const reviewCountLabel = !reviewCount ? null : (
    <span>{` / ${reviewCount} ${reviewCount > 1 ? 'reviews' : 'review'}`}</span>
  );
  return (
    <div className='flex gap-0.5 items-center'>
      {Array.from({ length: maxRating }).map((el, index) => (
        <div key={index}>
          <StarIcon
            onClick={() => handleClick(index + 1)}
            className={`w-4 h-4 stroke-amber-500 ${Math.round(rating) >= index + 1 ? 'text-amber-400' : 'text-white'}`}
          />
        </div>
      ))}
      {!!rating && (
        <span>
          ({rating}
          {reviewCountLabel})
        </span>
      )}
    </div>
  );
}
