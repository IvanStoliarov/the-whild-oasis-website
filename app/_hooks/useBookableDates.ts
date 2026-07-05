import { endOfDay, isWithinInterval, startOfDay } from 'date-fns';
import { useMemo } from 'react';
import type { DateRange } from '@daypicker/react';

const emptyRange: DateRange = { from: undefined, to: undefined };

function includesBookedDate(range: DateRange, bookedDates: Date[]) {
  const { from, to } = range;

  return (
    from &&
    to &&
    bookedDates.some(date =>
      isWithinInterval(date, { start: from, end: to }),
    )
  );
}

export default function useBookableDates(
  range: DateRange,
  bookedDates: Date[],
  currentBookingRange: DateRange | null,
) {
  const currentBookingStart = currentBookingRange?.from;
  const currentBookingEnd = currentBookingRange?.to;
  const unavailableDates = useMemo(
    () =>
      currentBookingStart && currentBookingEnd
        ? bookedDates.filter(
            date =>
              !isWithinInterval(date, {
                start: startOfDay(currentBookingStart),
                end: endOfDay(currentBookingEnd),
              }),
          )
        : bookedDates,
    [bookedDates, currentBookingEnd, currentBookingStart],
  );
  const hasUnavailableDates = Boolean(
    includesBookedDate(range, unavailableDates),
  );

  return {
    unavailableDates,
    selectedRange: hasUnavailableDates ? emptyRange : range,
    hasUnavailableDates,
  };
}
