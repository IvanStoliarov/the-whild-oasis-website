import React from 'react';
import CabinCard from '@/app/_components/CabinCard';
import { getCabins } from '@/app/_lib/data-service';
import type { CapacityFilter } from '../_lib/types';

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
  const cabins = await getCabins(filter);

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
        <CabinCard cabin={cabin} key={cabin.id} />
      ))}
    </div>
  );
}
