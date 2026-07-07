import SelectCountry from '@/app/_components/SelectCountry';
import UpdateProfileFom from '@/app/_components/UpdateProfileFom';
import { auth } from '@/app/_lib/auth';
import { getGuest } from '@/app/_lib/data-service';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Update Profile',
};

export default async function Page() {
  const session = await auth();
  if (!session?.user?.email) redirect('/login');
  const guest = await getGuest(session.user.email);
  if (!guest) throw new Error('Guest profile was not found');
  return (
    <div>
      <h2 className='font-semibold text-2xl text-accent-400 mb-4'>
        Update your guest profile
      </h2>

      <p className='text-lg mb-8 text-primary-200'>
        Providing the following information will make your check-in process
        faster and smoother. See you soon!
      </p>

      <UpdateProfileFom guest={guest}>
        <SelectCountry
          name='nationality'
          id='nationality'
          className='px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm'
          defaultCountry={guest.nationality}
        />
      </UpdateProfileFom>
    </div>
  );
}
