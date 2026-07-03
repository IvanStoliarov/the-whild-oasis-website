import React from 'react';
import SideNavigation from '@/app/_components/SideNavigation';
import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className='grid grid-cols-[16rem_1fr] gap-12'>
      <SideNavigation />
      <div className='py-1'>{children}</div>
    </div>
  );
}
