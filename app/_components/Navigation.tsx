import { Suspense } from 'react';
import Link from 'next/link';
import NavigationMenu from './NavigationMenu';
import AccountAvatar from './AccountAvatar';
import AccountAvatarPlaceholder from './AccountAvatarPlaceholder';

function NavigationFallback() {
  return (
    <nav aria-label='Main navigation'>
      <ul className='hidden items-center gap-16 text-xl md:flex'>
        <li className='order-last'>
          <Link
            href='/account'
            className='flex items-center gap-4 transition-all hover:text-accent-400'
          >
            <AccountAvatarPlaceholder />
            <span>Guest area</span>
          </Link>
        </li>
        <li>
          <Link
            href='/cabins'
            className='inline-block transition-all hover:text-accent-400'
          >
            Cabins
          </Link>
        </li>
        <li>
          <Link
            href='/about'
            className='inline-block transition-all hover:text-accent-400'
          >
            About
          </Link>
        </li>
      </ul>
      <div
        className='h-12 w-12 rounded-sm bg-primary-900 md:hidden'
        aria-hidden='true'
      />
    </nav>
  );
}

export default function Navigation() {
  return (
    <Suspense fallback={<NavigationFallback />}>
      <NavigationMenu>
        <Suspense fallback={<AccountAvatarPlaceholder />}>
          <AccountAvatar />
        </Suspense>
      </NavigationMenu>
    </Suspense>
  );
}
