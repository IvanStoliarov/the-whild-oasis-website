'use client';

import { useState, useActionState } from 'react';
import { submitRating } from '../_lib/actions';
import RatingStars from './RatingStars';

interface StarRatingProps {
  bookingId: number;
}

const initialState = {
  success: false,
  message: '',
};

export default function StarRating({ bookingId }: StarRatingProps) {
  const [rating, setRating] = useState(0);
  const [result, formAction, isPending] = useActionState(
    submitRating,
    initialState,
  );
  const maxRating = 5;
  return (
    <form action={formAction}>
      <input type='hidden' name='rating' value={rating} readOnly />
      <input type='hidden' name='bookingId' value={bookingId} readOnly />
      <RatingStars
        rating={rating}
        maxRating={maxRating}
        setRating={setRating}
      />
      <button
        className='bg-yellow-800 text-yellow-200 disabled:bg-gray-200 disabled:text-gray-800 h-7 px-3 uppercase text-xs font-bold flex items-center rounded-sm mt-4'
        disabled={isPending || !rating}
      >
        {isPending ? 'Submitting...' : 'Submit'}
      </button>
      {result.message && <p>{result.message}</p>}
    </form>
  );
}
