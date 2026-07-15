import Spinner from '@/app/_components/Spinner';
import WishlistCabinsList from '@/app/_components/WishlistCabinsList';
import { auth } from '@/app/_lib/auth';
import { redirect } from 'next/navigation';
import React, { Suspense } from 'react';
export const metadata = {
  title: 'Wishlist',
};

export default async function page() {
  return (
    <>
      <h2 className='font-semibold text-2xl text-accent-400 mb-4'>Wishlist</h2>
      <Suspense fallback={<Spinner />}>
        <WishlistCabinsList />
      </Suspense>
    </>
  );
}
