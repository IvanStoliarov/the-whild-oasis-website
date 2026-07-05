import ReservationUpdateForm from '@/app/_components/ReservationUpdateForm';
import SubmitButton from '@/app/_components/SubmitButton';
import updateReservation from '@/app/_lib/actions';
import { auth } from '@/app/_lib/auth';
import {
  getBookedDatesByCabinId,
  getBooking,
  getBookings,
  getCabin,
  getSettings,
} from '@/app/_lib/data-service';
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

  const [settings, reservation] = await Promise.all([
    getSettings(),
    getBooking(reservationId),
  ]);

  if (reservation.cabinId === null) throw new Error('Reservation has no cabin');
  const [cabin, bookedDates] = await Promise.all([
    getCabin(reservation.cabinId),
    getBookedDatesByCabinId(reservation.cabinId),
  ]);
  const { maxCapacity } = await getCabin(reservation.cabinId);

  return (
    <div>
      <h2 className='font-semibold text-2xl text-accent-400 mb-7'>
        Edit Reservation #{reservationId}
      </h2>
      <ReservationUpdateForm
        settings={settings}
        reservation={reservation}
        maxCapacity={maxCapacity}
        cabin={cabin}
        bookedDates={bookedDates}
      />
    </div>
  );
}
