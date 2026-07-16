'use client';
import React, { startTransition, useActionState, useEffect } from 'react';
import { addToWishlist, type WishlistState } from '../_lib/actions';
import { HeartIcon } from '@heroicons/react/24/solid';

const initialState: WishlistState = {
  success: false,
  message: '',
};

export default function AddToWishlistButton({
  cabinId,
  isInWishlist,
}: {
  cabinId: number;
  isInWishlist: boolean;
}) {
  const addToWishlistForCabin = addToWishlist.bind(null, cabinId);

  const [result, submitForm, isPending] = useActionState(
    addToWishlistForCabin,
    initialState,
  );

  useEffect(() => {
    return () => {
      startTransition(() => {
        submitForm(null);
      });
    };
  }, [submitForm]);

  const currentIsInWishlist = result.isInWishlist ?? isInWishlist;

  return (
    <form action={submitForm}>
      <input
        type='hidden'
        name='isInWishlist'
        value={String(currentIsInWishlist)}
      />
      <button
        type='submit'
        disabled={isPending}
        aria-label={`${currentIsInWishlist ? 'Remove from wish list' : 'Add to wish list'}`}
        className='p-4 hover:cursor-pointer group disabled:opacity-50'
      >
        <HeartIcon
          className={`w-5 h-5 stroke-white group-hover:fill-white ${currentIsInWishlist ? 'fill-white' : 'fill-transparent'}`}
        />
      </button>
      {!result.success && result.message && (
        <p className='sr-only' role='alert'>
          {result.message}
        </p>
      )}
    </form>
  );
}
