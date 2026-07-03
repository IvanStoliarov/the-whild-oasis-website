'use client';
import Image from 'next/image';
import { useReservation } from './ReservationContext';
import { createBooking } from '../_lib/actions';
import SubmitButton from './SubmitButton';

function ReservationForm({ cabin, user, settings }) {
  const {
    range,
    numGuests,
    setNumGuests,
    hasBreakfast,
    setHasBreakfast,
    resetReservation,
  } = useReservation();
  const { maxCapacity, id } = cabin;
  const startDate = range.from;
  const endDate = range.to;

  const bookingData = {
    startDate,
    endDate,
    cabinId: id,
  };

  const createBookingWithData = createBooking.bind(null, bookingData);

  return (
    <div className='scale-[1.01]'>
      <div className='bg-primary-800 text-primary-300 px-16 py-2 flex justify-between items-center'>
        <p>Logged in as </p>

        <div className='flex gap-4 items-center'>
          <div className='h-8 aspect-square relative'>
            <Image
              fill
              referrerPolicy='no-referrer'
              className='rounded-full object-cover'
              src={user.image}
              alt={user.name}
            />
          </div>
          <p>{user.name}</p>
        </div>
      </div>

      <form
        action={async formData => {
          resetReservation();
          await createBookingWithData(formData);
        }}
        className='bg-primary-900 py-10 px-16 text-lg flex gap-5 flex-col'
      >
        <div className='space-y-2'>
          <label htmlFor='numGuests'>How many guests?</label>
          <select
            name='numGuests'
            id='numGuests'
            value={numGuests}
            onChange={event => setNumGuests(event.target.value)}
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
          <input
            type='checkbox'
            name='breakfast'
            id='breakfast'
            checked={hasBreakfast}
            onChange={event => setHasBreakfast(event.target.checked)}
          />
          <label htmlFor='breakfast'>
            Add breakfast (${settings.breakfastPrice} per guest/night)
          </label>
        </div>

        <div className='space-y-2'>
          <label htmlFor='observations'>
            Anything we should know about your stay?
          </label>
          <textarea
            name='observations'
            id='observations'
            className='px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm'
            placeholder='Any pets, allergies, special requirements, etc.?'
          />
        </div>

        <div className='flex justify-end items-center gap-6'>
          {!(startDate && endDate) ? null : (
            <>
              <p className='text-primary-300 text-base'>
                Start by selecting dates
              </p>

              <SubmitButton pendingLabel='Reserving...'>
                Reserve now
              </SubmitButton>
            </>
          )}
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;
