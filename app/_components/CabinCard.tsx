import { UsersIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';
import type { CabinSummary } from '../_lib/types';
import RatingStars from './RatingStars';
import AddToWishlistButton from './AddToWishlistButton';

function CabinCard({
  cabin,
  cabinsInWishlist,
  isLoggedIn,
}: {
  cabin: CabinSummary;
  cabinsInWishlist: Set<number>;
  isLoggedIn: boolean;
}) {
  const {
    id,
    name,
    maxCapacity,
    regularPrice,
    discount,
    image,
    rating,
    reviewCount,
  } = cabin;

  const showRating = !!reviewCount && reviewCount > 0 && !!rating && rating > 0;

  const isInWishlist = cabinsInWishlist.has(id);

  return (
    <div className='lg:flex border-primary-800 border'>
      <div className='flex-1 relative aspect-square'>
        <Image
          src={image}
          fill
          alt={`Cabin ${name}`}
          className='object-cover border-r border-primary-800'
        />
      </div>

      <div className='grow'>
        <div className='pt-5 pb-4 px-7 bg-primary-950 relative'>
          <h3 className='text-accent-500 font-semibold text-2xl mb-3'>
            Cabin {name}
          </h3>

          <div className='flex gap-3 items-center mb-2'>
            <UsersIcon className='h-5 w-5 text-primary-600' />
            <p className='text-lg text-primary-200'>
              For up to <span className='font-bold'>{maxCapacity}</span> guests
            </p>
          </div>

          <p className='flex gap-3 justify-end items-baseline'>
            {discount > 0 ? (
              <>
                <span className='text-3xl font-[350]'>
                  ${regularPrice - discount}
                </span>
                <span className='line-through font-semibold text-primary-600'>
                  ${regularPrice}
                </span>
              </>
            ) : (
              <span className='text-3xl font-[350]'>${regularPrice}</span>
            )}
            <span className='text-primary-200'>/ night</span>
          </p>
          {showRating && (
            <RatingStars rating={rating} reviewCount={reviewCount} />
          )}
          {isLoggedIn && (
            <div className='absolute top-0 right-0'>
              <AddToWishlistButton
                isInWishlist={isInWishlist}
                cabinId={cabin.id}
              />
            </div>
          )}
        </div>

        <div className='bg-primary-950 border-t border-t-primary-800 text-right'>
          <Link
            href={`/cabins/${id}`}
            className='border-l border-primary-800 py-4 px-6 inline-block hover:bg-accent-600 transition-all hover:text-primary-900'
          >
            Details & reservation &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CabinCard;
