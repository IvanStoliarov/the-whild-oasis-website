'use client';
import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import type { DateRange } from '@daypicker/react';

type ReservationContextValue = {
  range: DateRange;
  setRange: Dispatch<SetStateAction<DateRange>>;
  resetRange: () => void;
  numGuests: string;
  setNumGuests: Dispatch<SetStateAction<string>>;
  hasBreakfast: boolean;
  setHasBreakfast: Dispatch<SetStateAction<boolean>>;
  resetReservation: () => void;
};

const ReservationContext = createContext<ReservationContextValue | undefined>(
  undefined,
);

const initialState: DateRange = { from: undefined, to: undefined };

function ReservationProvider({ children }: { children: ReactNode }) {
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
