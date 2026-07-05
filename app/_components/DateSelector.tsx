'use client';
import { useCallback, useEffect } from 'react';
import { useReservation } from './ReservationContext';
import ReservationDayPicker from './ReservationDayPicker';
import ReservationPriceSummary from './ReservationPriceSummary';
import useBookableDates from '../_hooks/useBookableDates';
import type { DateRange } from '@daypicker/react';
import type { Cabin, Settings } from '../_lib/types';

const emptyRange: DateRange = { from: undefined, to: undefined };

function DateSelector({
  settings,
  bookedDates,
  cabin,
}: {
  settings: Settings;
  bookedDates: Date[];
  cabin: Cabin;
}) {
  const {
    range,
    setRange,
    hasBreakfast,
    currentBookingRange,
    clearReservation,
    configurePricing,
    numNights,
    totalPrice,
    extrasPrice,
  } = useReservation();

  const { regularPrice, discount } = cabin;
  const { minBookingLength, maxBookingLength, breakfastPrice } = settings;

  useEffect(() => {
    configurePricing({ regularPrice, discount, breakfastPrice });
  }, [breakfastPrice, configurePricing, discount, regularPrice]);

  const { unavailableDates, selectedRange, hasUnavailableDates } =
    useBookableDates(range, bookedDates, currentBookingRange);
  const handleSelect = useCallback(
    (selectedRange: DateRange | undefined) =>
      setRange(selectedRange ?? emptyRange),
    [setRange],
  );

  return (
    <div className='flex flex-col justify-between'>
      <ReservationDayPicker
        minBookingLength={minBookingLength}
        maxBookingLength={maxBookingLength}
        selected={selectedRange}
        unavailableDates={unavailableDates}
        onSelect={handleSelect}
      />

      <ReservationPriceSummary
        regularPrice={regularPrice}
        discount={discount}
        numNights={hasUnavailableDates ? 0 : numNights}
        totalPrice={hasUnavailableDates ? 0 : totalPrice}
        extrasPrice={hasUnavailableDates ? 0 : extrasPrice}
        hasBreakfast={hasBreakfast}
        hasSelection={Boolean(range.from || range.to)}
        onClear={clearReservation}
      />
    </div>
  );
}

export default DateSelector;
