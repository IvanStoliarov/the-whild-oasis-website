'use client';

import { useEffect } from 'react';
import updateReservation from '../_lib/actions';
import { BookingRow, Cabin, Settings } from '../_lib/types';
import BreakfastInput from './BreakfastInput';
import DateSelector from './DateSelector';
import { useReservation } from './ReservationContext';
import SubmitButton from './SubmitButton';

interface Props {
  reservation: BookingRow;
  maxCapacity: number;
  settings: Settings;
  cabin: Cabin;
  bookedDates: Date[];
}

export default function ReservationUpdateForm({
  maxCapacity,
  reservation,
  settings,
  cabin,
  bookedDates,
}: Props) {
  const { id: reservationId, observations } = reservation;
  const {
    setRange,
    setCurrentBookingRange,
    setNumGuests,
    range,
    numGuests,
    resetReservation,
  } = useReservation();

  useEffect(() => {
    if (reservation.startDate && reservation.endDate) {
      setCurrentBookingRange({
        from: new Date(reservation.startDate),
        to: new Date(reservation.endDate),
      });
      setRange({
        from: new Date(reservation.startDate),
        to: new Date(reservation.endDate),
      });
      setNumGuests(reservation.numGuests ?? 0);
    }

    return () => resetReservation();
  }, []);
  return (
    <form
      className='bg-primary-900 py-4 px-6 md:py-8 md:px-12 text-lg flex gap-6 flex-col'
      action={async formData => {
        await updateReservation(formData, { from: range.from, to: range.to });
      }}
    >
      <input type='hidden' name='reservationId' value={reservationId} />
      <div className='space-y-2'>
        <label htmlFor='numGuests'>How many guests?</label>
        <select
          name='numGuests'
          value={numGuests ?? ''}
          onChange={e => {
            setNumGuests(e.target.value);
          }}
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

      <div className='flex items-center space-x-2'>
        <BreakfastInput reservationHasBreakfast={!!reservation.hasBreakfast} />
      </div>

      <DateSelector
        bookedDates={bookedDates}
        cabin={cabin}
        settings={settings}
      />

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
  );
}
