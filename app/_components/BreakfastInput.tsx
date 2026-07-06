import React, { useEffect } from 'react';
import { useReservation } from './ReservationContext';

interface Props {
  reservationHasBreakfast: boolean;
}

export default function BreakfastInput({ reservationHasBreakfast }: Props) {
  const { hasBreakfast, setHasBreakfast } = useReservation();

  useEffect(() => {
    setHasBreakfast(reservationHasBreakfast);
  }, [reservationHasBreakfast, setHasBreakfast]);
  return (
    <>
      <input
        checked={hasBreakfast}
        onChange={e => setHasBreakfast(!!e.target.checked)}
        type='checkbox'
        name='breakfast'
        id='breakfast'
      />
      <label htmlFor='breakfast'>Include Breakfast</label>
    </>
  );
}
