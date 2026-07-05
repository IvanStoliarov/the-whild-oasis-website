import { isPast, isSameDay } from 'date-fns';
import { DayPicker } from '@daypicker/react';
import '@daypicker/react/style.css';
import { memo } from 'react';
import type { DateRange } from '@daypicker/react';

type Props = {
  minBookingLength: number;
  maxBookingLength: number;
  selected: DateRange;
  unavailableDates: Date[];
  onSelect: (range: DateRange | undefined) => void;
};

function ReservationDayPicker({
  minBookingLength,
  maxBookingLength,
  selected,
  unavailableDates,
  onSelect,
}: Props) {
  return (
    <DayPicker
      className='pt-5 place-self-center'
      mode='range'
      min={minBookingLength}
      max={maxBookingLength}
      startMonth={new Date()}
      selected={selected}
      onSelect={onSelect}
      disabled={date =>
        isPast(date) ||
        unavailableDates.some(unavailableDate =>
          isSameDay(unavailableDate, date),
        )
      }
    />
  );
}

export default memo(ReservationDayPicker);
