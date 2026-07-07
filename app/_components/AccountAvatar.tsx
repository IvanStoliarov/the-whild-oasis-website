import Image from 'next/image';
import { auth } from '../_lib/auth';

export default async function AccountAvatar() {
  const session = await auth();
  const userImage = session?.user.image;
  const userName = session?.user.name;
  return (
    <>
      {userImage && userImage?.length > 0 && (
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
    </>
  );
}
