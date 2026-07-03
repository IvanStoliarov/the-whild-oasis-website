import SubmitButton from '@/app/_components/SubmitButton';
import updateReservation from '@/app/_lib/actions';
import { auth } from '@/app/_lib/auth';
import { getBooking, getBookings, getCabin } from '@/app/_lib/data-service';
import { redirect } from 'next/navigation';

export default async function Page({
  params,
}: {
  params: { reservationId: string };
}) {
  // CHANGE
  const reservationId = params.reservationId;
  const session = await auth();
  if (!session) redirect('/login');
  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingsIds = guestBookings.map(booking => booking.id);

  if (!guestBookingsIds.includes(Number(reservationId)))
    return <div>No reservations find with id {reservationId}</div>;

  const { numGuests, cabinId, observations } = await getBooking(reservationId);
  if (cabinId === null) throw new Error('Reservation has no cabin');
  const { maxCapacity } = await getCabin(cabinId);

  return (
    <div>
      <h2 className='font-semibold text-2xl text-accent-400 mb-7'>
        Edit Reservation #{reservationId}
      </h2>

      <form
        className='bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col'
        action={updateReservation}
      >
        <input type='hidden' name='reservationId' value={reservationId} />
        <div className='space-y-2'>
          <label htmlFor='numGuests'>How many guests?</label>
          <select
            defaultValue={numGuests ?? ''}
            name='numGuests'
            id='numGuests'
            className='px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm'
            required
          >
            <option value='' key=''>
              Select number of guests...
            </option>
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map(x => (
              <option value={x} key={x}>
                {x} {x === 1 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>
        </div>

        <div className='space-y-2'>
          <label htmlFor='observations'>
            Anything we should know about your stay?
          </label>
          <textarea
            defaultValue={observations ?? ''}
            name='observations'
            className='px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm'
          />
        </div>

        <div className='flex justify-end items-center gap-6'>
          <SubmitButton pendingLabel='Updating reservation...'>
            Update reservation
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
