'use client';
import { createContext, useContext, useState } from 'react';

const ReservationContext = createContext();

const initialState = { from: undefined, to: undefined };

function ReservationProvider({ children }) {
  const [range, setRange] = useState(initialState);
  const [numGuests, setNumGuests] = useState('');
  const [hasBreakfast, setHasBreakfast] = useState(false);

  const resetRange = () => setRange(initialState);
  const resetReservation = () => {
    setRange(initialState);
    setNumGuests('');
    setHasBreakfast(false);
  };

  return (
    <ReservationContext.Provider
      value={{
        range,
        setRange,
        resetRange,
        numGuests,
        setNumGuests,
        hasBreakfast,
        setHasBreakfast,
        resetReservation,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
}

function useReservation() {
  const context = useContext(ReservationContext);
  if (!context) throw new Error('Context used outside of provider');

  return context;
}

export { ReservationProvider, useReservation };
