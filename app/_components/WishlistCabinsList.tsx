import React from 'react';
import { getCabins, getWishlistItems } from '../_lib/data-service';
import CabinCard from './CabinCard';
import { auth } from '../_lib/auth';
import { redirect } from 'next/navigation';

export default async function WishlistCabinsList() {
  const session = await auth();
  if (!session) {
    redirect('/login');
  }
  if (!session?.user.guestId) return null;
  const userWishlist = await getWishlistItems(session?.user.guestId);
  const userWishlistIds = userWishlist.map(el => el.cabinId);
  const cabinsInWishlist = new Set(userWishlistIds);
  const cabinsToShow = await getCabins(userWishlistIds);
  if (cabinsToShow.length < 1)
    return <p>You have no cabins in your wishlist</p>;
  return (
    <div className='grid sm:grid-cols-1 gap-8 lg:gap-12 xl:gap-14'>
      {cabinsToShow.map(cabin => (
        <CabinCard
          cabinsInWishlist={cabinsInWishlist}
          isLoggedIn={true}
          cabin={cabin}
          key={cabin.id}
        />
      ))}
    </div>
  );
}
