import { User } from 'next-auth';
import Image from 'next/image';
import React from 'react';
import AccountAvatarPlaceholder from './AccountAvatarPlaceholder';

interface Props {
  user: User;
}

export default function ReservationFormHeader({ user }: Props) {
  return (
    <div className='bg-primary-800 text-primary-300 px-16 py-2 flex justify-between items-center'>
      <p>Logged in as </p>

      <div className='flex gap-4 items-center'>
        <div className='h-8 aspect-square relative'>
          {user.image ? (
            <Image
              fill
              referrerPolicy='no-referrer'
              className='rounded-full object-cover'
              src={user.image}
              alt={user.name ?? 'Guest'}
            />
          ) : (
            <AccountAvatarPlaceholder />
          )}
        </div>
        <p>{user.name}</p>
      </div>
    </div>
  );
}
