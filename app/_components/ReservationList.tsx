'use client';
import ReservationCard from '@/app/_components/ReservationCard';
import { useOptimistic } from 'react';
import { deleteReservation } from '../_lib/actions';
import type { BookingWithCabin } from '../_lib/types';

export default function ReservationList({
  bookings,
}: {
  bookings: BookingWithCabin[];
}) {
  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    (currentBookings, bookingId: number) => {
      return currentBookings.filter(booking => booking.id !== bookingId);
    },
  );

  async function handleDelete(bookingId: number) {
    optimisticDelete(bookingId);
    deleteReservation(bookingId);
  }

  return (
    <ul className='space-y-6'>
      {optimisticBookings.map(booking => (
        <ReservationCard
          booking={booking}
          key={booking.id}
          onDelete={handleDelete}
        />
      ))}
    </ul>
  );
}
