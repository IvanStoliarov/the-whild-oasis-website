'use client';
import {
  differenceInDays,
  isPast,
  isSameDay,
  isWithinInterval,
} from 'date-fns';
import { DayPicker } from '@daypicker/react';
import '@daypicker/react/style.css';
import { useReservation } from './ReservationContext';
import type { DateRange } from '@daypicker/react';
import type { Cabin, Settings } from '../_lib/types';

function isAlreadyBooked(range: DateRange, datesArr: Date[]) {
  const { from, to } = range;
  return (
    from &&
    to &&
    datesArr.some(date =>
      isWithinInterval(date, { start: from, end: to }),
    )
  );
}

function DateSelector({
  settings,
  bookedDates,
  cabin,
}: {
  settings: Settings;
  bookedDates: Date[];
  cabin: Cabin;
}) {
  const { range, setRange, resetRange, numGuests, hasBreakfast } =
    useReservation();

  const { regularPrice, discount } = cabin;
  const displayRange: DateRange = isAlreadyBooked(range, bookedDates)
    ? { from: undefined, to: undefined }
    : range;
  const numNights =
    displayRange.from && displayRange.to
      ? differenceInDays(displayRange.to, displayRange.from)
      : 0;
  const cabinPrice = numNights * (regularPrice - discount);

  const { minBookingLength, maxBookingLength, breakfastPrice } = settings;
  const extrasPrice = hasBreakfast
    ? numNights * Number(numGuests) * breakfastPrice
    : 0;
  const totalPrice = cabinPrice + extrasPrice;

  return (
    <div className='flex flex-col justify-between'>
      <DayPicker
        className='pt-5 place-self-center'
        mode='range'
        min={minBookingLength + 1}
        max={maxBookingLength}
        startMonth={new Date()}
        selected={displayRange}
        // disabled={{ before: new Date() }}
        onSelect={range => setRange(range ?? { from: undefined, to: undefined })}
        disabled={curDate =>
          isPast(curDate) || bookedDates.some(date => isSameDay(date, curDate))
        }
      />

      <div className='flex items-center justify-between px-8 bg-accent-500 text-primary-800 h-[72px]'>
        <div className='flex items-baseline gap-6'>
          <p className='flex gap-2 items-baseline'>
            {discount > 0 ? (
              <>
                <span className='text-2xl'>${regularPrice - discount}</span>
                <span className='line-through font-semibold text-primary-700'>
                  ${regularPrice}
                </span>
              </>
            ) : (
              <span className='text-2xl'>${regularPrice}</span>
            )}
            <span className=''>/night</span>
          </p>
          {numNights ? (
            <>
              <p className='bg-accent-600 px-3 py-2 text-2xl'>
                <span>&times;</span> <span>{numNights}</span>
              </p>
              <p>
                <span className='text-lg font-bold uppercase'>Total</span>{' '}
                <span className='text-2xl font-semibold'>${totalPrice}</span>
                {extrasPrice > 0 ? (
                  <span className='block text-xs font-medium'>
                    Includes ${extrasPrice} breakfast
                  </span>
                ) : null}
              </p>
            </>
          ) : null}
        </div>

        {range.from || range.to ? (
          <button
            className='border border-primary-800 py-2 px-4 text-sm font-semibold'
            onClick={resetRange}
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default DateSelector;
