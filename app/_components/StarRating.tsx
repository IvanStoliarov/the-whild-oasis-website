'use client';

import React, { useState } from 'react';
import { submitRating } from '../_lib/actions';
import RatingStars from './RatingStars';
import { useFormState, useFormStatus } from 'react-dom';

interface StarRatingProps {
  bookingId: number;
}

const initialState = {
  success: false,
  message: '',
};

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      className='bg-yellow-800 text-yellow-200 disabled:bg-gray-200 disabled:text-gray-800 h-7 px-3 uppercase text-xs font-bold flex items-center rounded-sm mt-4'
      disabled={disabled || pending}
    >
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}

export default function StarRating({ bookingId }: StarRatingProps) {
  const [rating, setRating] = useState(0);
  const [result, formAction] = useFormState(submitRating, initialState);
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
      <SubmitButton disabled={!rating} />
      {result.message && <p>{result.message}</p>}
    </form>
  );
}
