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
  numGuests: string | number;
  setNumGuests: Dispatch<SetStateAction<string | number>>;
  hasBreakfast: boolean;
  setHasBreakfast: Dispatch<SetStateAction<boolean>>;
  clearReservation: () => void;
  resetReservation: () => void;
  setBreakfastPrice: Dispatch<SetStateAction<number>>;
  breakfastPrice: number;
  currentBookingRange: null | DateRange;
  setCurrentBookingRange: Dispatch<SetStateAction<DateRange | null>>;
};

const ReservationContext = createContext<ReservationContextValue | undefined>(
  undefined,
);

const initialState: DateRange = { from: undefined, to: undefined };

function ReservationProvider({ children }: { children: ReactNode }) {
  const [range, setRange] = useState(initialState);
  const [numGuests, setNumGuests] = useState<string | number>('');
  const [hasBreakfast, setHasBreakfast] = useState(false);
  const [breakfastPrice, setBreakfastPrice] = useState(0);
  const [currentBookingRange, setCurrentBookingRange] =
    useState<null | DateRange>(null);

  const resetRange = () => setRange(initialState);
  const clearReservation = () => {
    setRange(initialState);
    setNumGuests('');
    setHasBreakfast(false);
  };
  const resetReservation = () => {
    clearReservation();
    setCurrentBookingRange(null);
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
        clearReservation,
        resetReservation,
        breakfastPrice,
        setBreakfastPrice,
        currentBookingRange,
        setCurrentBookingRange,
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
