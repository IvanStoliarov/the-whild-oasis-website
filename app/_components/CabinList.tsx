import React, { Suspense } from 'react';
import CabinCard from '@/app/_components/CabinCard';
import { getCabins, getWishlistItems } from '@/app/_lib/data-service';
import type { CapacityFilter } from '../_lib/types';
import Spinner from './Spinner';
import { cacheLife, cacheTag } from 'next/cache';
import { auth } from '../_lib/auth';

interface CabinListProps {
  searchParamsPromise:
    | Promise<{
        capacity?: string | string[];
      }>
    | undefined;
}

const filters: CapacityFilter[] = ['all', 'small', 'medium', 'large'];

export default async function CabinList({
  searchParamsPromise,
}: CabinListProps) {
  const resolvedSearchParams = await searchParamsPromise;
  const capacity =
    typeof resolvedSearchParams?.capacity === 'string'
      ? resolvedSearchParams.capacity
      : 'all';
  const filter: CapacityFilter = filters.includes(capacity as CapacityFilter)
    ? (capacity as CapacityFilter)
    : 'all';

  const session = await auth();
  const userWishlist = session
    ? await getWishlistItems(session.user.guestId)
    : [];
  const isLoggedIn = !!session?.user;
  return (
    <Suspense key={filter} fallback={<Spinner />}>
      <CabinsGrid
        isLoggedIn={isLoggedIn}
        userWishlist={userWishlist}
        filter={filter}
      />
    </Suspense>
  );
}

async function CabinsGrid({
  filter,
  userWishlist,
  isLoggedIn,
}: {
  filter: string;
  userWishlist: { cabinId: number }[];
  isLoggedIn: boolean;
}) {
  const cabins = await getCachedCabins();
  const cabinsInWishlist = new Set(userWishlist.map(item => item.cabinId));

  if (!cabins.length) return null;

  let displayedCabins = cabins;
  if (filter === 'small') {
    displayedCabins = cabins.filter(cabin => cabin.maxCapacity <= 3);
  }
  if (filter === 'medium') {
    displayedCabins = cabins.filter(
      cabin => cabin.maxCapacity >= 4 && cabin.maxCapacity <= 7,
    );
  }
  if (filter === 'large') {
    displayedCabins = cabins.filter(cabin => cabin.maxCapacity >= 8);
  }
  return (
    <div className='grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14'>
      {displayedCabins.map(cabin => (
        <CabinCard
          cabinsInWishlist={cabinsInWishlist}
          isLoggedIn={isLoggedIn}
          cabin={cabin}
          key={cabin.id}
        />
      ))}
    </div>
  );
}

async function getCachedCabins() {
  'use cache';
  cacheLife('default');
  cacheTag('cabins');
  return getCabins();
}
