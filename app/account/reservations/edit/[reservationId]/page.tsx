import ReservationUpdateForm from '@/app/_components/ReservationUpdateForm';
import updateReservation from '@/app/_lib/actions';
import { auth } from '@/app/_lib/auth';
import {
  getBookedDatesByCabinId,
  getBooking,
  getCabin,
  getSettings,
} from '@/app/_lib/data-service';
import { redirect } from 'next/navigation';

export default async function Page({
  params,
}: {
  params: Promise<{ reservationId: string }>;
}) {
  const { reservationId } = await params;
  const session = await auth();
  if (!session) redirect('/login');

  const reservationNumber = Number(reservationId);
  if (!Number.isInteger(reservationNumber) || reservationNumber < 1)
    return <div>No reservations found with id {reservationId}</div>;

  const [settings, reservation] = await Promise.all([
    getSettings(),
    getBooking(reservationNumber),
  ]);

  if (!reservation || reservation.guestId !== session.user.guestId)
    return <div>No reservations found with id {reservationId}</div>;

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
