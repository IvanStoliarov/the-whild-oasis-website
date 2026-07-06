'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { ReactNode } from 'react';
import type { CapacityFilter } from '../_lib/types';

export default function FIlter() {
  return (
    <div className='grid grid-cols-2 border w-full md:w-auto border-primary-500 md:flex'>
      <Button filterValue='all'>All Cabins</Button>
      <Button filterValue='small'>1&mdash;3 guests</Button>
      <Button filterValue='medium'>4&mdash;7 guests</Button>
      <Button filterValue='large'>8&mdash;12 guests</Button>
    </div>
  );
}

function Button({
  filterValue,
  children,
}: {
  filterValue: CapacityFilter;
  children: ReactNode;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();
  const currentFilter = searchParams.get('capacity') ?? 'all';

  function handleFilter(filterTerm: CapacityFilter) {
    const params = new URLSearchParams(searchParams);
    params.set('capacity', filterTerm);
    router.replace(`${pathName}?${params.toString()}`, { scroll: false });
  }
  return (
    <button
      className={`px-5 py-2 hover:bg-primary-700 ${filterValue === currentFilter ? 'bg-primary-700 text-primary-50' : ''}`}
      onClick={() => handleFilter(filterValue)}
    >
      {children}
    </button>
  );
}
