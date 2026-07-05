'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { ReactNode } from 'react';
import type { CapacityFilter } from '../_lib/types';

export default function FIlter() {
  return (
    <div className='border border-primary-500 flex'>
      <Button filterValue='all'>All Cabins</Button>
      <Button filterValue='small'>1&mdash;3 guests</Button>
      <Button filterValue='medium'>4&mdash;7 guests</Button>
      <Button filterValue='large'>8&mdash;12 guests</Button>
      {/* <button
        className='px-5 py-2 hover:bg-primary-700'
        onClick={() => handleFilter('all')}
      >
        All Cabins
      </button> */}
      {/* <button
        className='px-5 py-2 hover:bg-primary-700'
        onClick={() => handleFilter('small')}
      >
        1&mdash;3 guests
      </button> */}
      {/* <button
        className='px-5 py-2 hover:bg-primary-700'
        onClick={() => handleFilter('medium')}
      >
        4&mdash;7 guests
      </button>
      <button
        className='px-5 py-2 hover:bg-primary-700'
        onClick={() => handleFilter('large')}
      >
        8&mdash;12 guests
      </button> */}
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
