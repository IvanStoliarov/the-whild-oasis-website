import Image from 'next/image';
import TextExpander from './TextExpander';
import { EyeSlashIcon, MapPinIcon, UsersIcon } from '@heroicons/react/24/solid';
import type { Cabin as CabinType } from '../_lib/types';
import { auth } from '../_lib/auth';
import { getWishlistItems } from '../_lib/data-service';
import AddToWishlistButton from './AddToWishlistButton';

export default async function Cabin({ cabin }: { cabin: CabinType }) {
  const { id, name, maxCapacity, regularPrice, discount, image, description } =
    cabin;
  const session = await auth();
  const userWishlist = session
    ? await getWishlistItems(session.user.guestId)
    : [];
  const isInWishlist = userWishlist.map(el => el.cabinId).includes(id);
  return (
    <div className='grid md:grid-cols-[3fr_4fr] gap-20 border border-primary-800 py-3 px-5 md:px-10 mb-24 relative'>
      <div className='aspect-square md:aspect-auto relative md:scale-[1.15] md:-translate-x-3'>
        <Image
          fill
          src={image}
          className='object-cover'
          alt={`Cabin ${name}`}
        />
      </div>

      <div>
        <h3 className='text-accent-100 font-black text-4xl md:text-7xl mb-5 md:translate-x-[-254px] bg-primary-950 p-6 pb-1 md:w-[150%]'>
          Cabin {name}
        </h3>

        <p className='text-lg text-primary-300 mb-10'>
          <TextExpander>{description}</TextExpander>
        </p>

        <ul className='flex flex-col gap-4 mb-7'>
          <li className='flex gap-3 items-center'>
            <UsersIcon className='h-5 w-5 text-primary-600' />
            <span className='text-lg'>
              For up to <span className='font-bold'>{maxCapacity}</span> guests
            </span>
          </li>
          <li className='flex gap-3 items-center'>
            <MapPinIcon className='h-5 w-5 text-primary-600' />
            <span className='text-lg'>
              Located in the heart of the{' '}
              <span className='font-bold'>Dolomites</span> (Italy)
            </span>
          </li>
          <li className='flex gap-3 items-center'>
            <EyeSlashIcon className='h-5 w-5 text-primary-600' />
            <span className='text-lg'>
              Privacy <span className='font-bold'>100%</span> guaranteed
            </span>
          </li>
        </ul>
      </div>
      {session && (
        <div className='absolute top-0 right-0'>
          <AddToWishlistButton cabinId={id} isInWishlist={isInWishlist} />
        </div>
      )}
    </div>
  );
}
