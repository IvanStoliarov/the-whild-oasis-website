'use client';

import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { MouseEvent } from 'react';
import { useEffect, useRef, useState } from 'react';

type NavigationMenuProps = {
  userImage?: string | null;
  userName?: string | null;
};

export default function NavigationMenu({
  userImage,
  userName,
}: NavigationMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navigationStartPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const menuButton = menuButtonRef.current;
    document.body.style.overflow = 'hidden';

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleEscape);
      menuButton?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (
      navigationStartPathRef.current &&
      pathname !== navigationStartPathRef.current
    ) {
      setPendingHref(null);
      setIsOpen(false);
      navigationStartPathRef.current = null;
    }
  }, [pathname]);

  function closeMenu() {
    setIsOpen(false);
  }

  function handleLinkClick(
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    if (pathname === href) {
      closeMenu();
      return;
    }

    navigationStartPathRef.current = pathname;
    setPendingHref(href);
  }

  return (
    <div className='z-50'>
      <button
        ref={menuButtonRef}
        type='button'
        className='rounded-sm p-1 transition-colors hover:text-accent-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 md:hidden'
        aria-label='Open navigation menu'
        aria-expanded={isOpen}
        aria-controls='main-navigation'
        onClick={() => setIsOpen(true)}
      >
        <Bars3Icon className='h-10 w-10' aria-hidden='true' />
      </button>

      <div
        className={`fixed inset-0 z-50 transition-[visibility] duration-300 md:visible md:static ${
          isOpen ? 'visible' : 'invisible delay-300 md:delay-0'
        }`}
      >
        <button
          type='button'
          className={`absolute inset-0 bg-primary-950/70 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          aria-label='Close navigation menu'
          tabIndex={isOpen ? 0 : -1}
          onClick={closeMenu}
        />

        <div
          className={`absolute inset-y-0 right-0 h-full w-5/6 bg-white text-primary-950 shadow-2xl transition-transform duration-300 ease-out md:static md:h-auto md:w-auto md:translate-x-0 md:bg-transparent md:text-inherit md:shadow-none ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <button
            type='button'
            className='absolute right-5 top-5 rounded-sm p-1 transition-colors hover:text-accent-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 md:hidden'
            aria-label='Close navigation menu'
            tabIndex={isOpen ? 0 : -1}
            onClick={closeMenu}
          >
            <XMarkIcon className='h-10 w-10' aria-hidden='true' />
          </button>

          <nav
            id='main-navigation'
            className='px-8 py-24 text-xl md:px-0 md:py-0'
            aria-label='Main navigation'
          >
            <ul className='flex flex-col items-center gap-8 md:flex-row md:gap-16'>
              <li className='md:order-last'>
                <Link
                  href='/account'
                  className={`flex items-center gap-4 transition-all duration-300 hover:text-accent-400 ${
                    pendingHref === '/account'
                      ? 'translate-x-3 scale-125 animate-pulse font-semibold text-accent-600'
                      : ''
                  }`}
                  tabIndex={isOpen ? 0 : undefined}
                  onClick={(event) => handleLinkClick(event, '/account')}
                >
                  {userImage && (
                    <span className='relative h-8 aspect-square'>
                      <Image
                        fill
                        className='rounded-full object-cover'
                        src={userImage}
                        alt={userName ?? 'Guest'}
                        referrerPolicy='no-referrer'
                      />
                    </span>
                  )}
                  <span>Guest area</span>
                </Link>
              </li>
              <li>
                <Link
                  href='/cabins'
                  className={`inline-block transition-all duration-300 hover:text-accent-400 ${
                    pendingHref === '/cabins'
                      ? 'translate-x-3 scale-125 animate-pulse font-semibold text-accent-600'
                      : ''
                  }`}
                  tabIndex={isOpen ? 0 : undefined}
                  onClick={(event) => handleLinkClick(event, '/cabins')}
                >
                  Cabins
                </Link>
              </li>
              <li>
                <Link
                  href='/about'
                  className={`inline-block transition-all duration-300 hover:text-accent-400 ${
                    pendingHref === '/about'
                      ? 'translate-x-3 scale-125 animate-pulse font-semibold text-accent-600'
                      : ''
                  }`}
                  tabIndex={isOpen ? 0 : undefined}
                  onClick={(event) => handleLinkClick(event, '/about')}
                >
                  About
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
