'use client';
import {
  useCallback,
  createContext,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import type { DateRange } from '@daypicker/react';
import {
  calculateBookingPrice,
  emptyBookingPrice,
  type BookingPrice,
} from '../_lib/booking-utils';

type ReservationState = {
  range: DateRange;
  numGuests: string | number;
  hasBreakfast: boolean;
  currentBookingRange: null | DateRange;
  regularPrice: number;
  discount: number;
  breakfastPrice: number;
};

type Pricing = Pick<
  ReservationState,
  'regularPrice' | 'discount' | 'breakfastPrice'
>;

enum ReservationActionTypes {
  SET_RANGE = 'setRange',
  SET_NUM_GUESTS = 'setNumGuests',
  SET_HAS_BREAKFAST = 'setHasBreakfast',
  SET_CURRENT_BOOKING_RANGE = 'setCurrentBookingRange',
  CONFIGURE_PRICING = 'configurePricing',
  RESET_RANGE = 'resetRange',
  CLEAR_RESERVATION = 'clearReservation',
  RESET_RESERVATION = 'resetReservation',
}

type ReservationAction =
  | { type: ReservationActionTypes.SET_RANGE; payload: DateRange }
  | { type: ReservationActionTypes.SET_NUM_GUESTS; payload: string | number }
  | { type: ReservationActionTypes.SET_HAS_BREAKFAST; payload: boolean }
  | {
      type: ReservationActionTypes.SET_CURRENT_BOOKING_RANGE;
      payload: DateRange | null;
    }
  | { type: ReservationActionTypes.CONFIGURE_PRICING; payload: Pricing }
  | { type: ReservationActionTypes.RESET_RANGE }
  | { type: ReservationActionTypes.CLEAR_RESERVATION }
  | { type: ReservationActionTypes.RESET_RESERVATION };

type ReservationContextValue = ReservationState &
  BookingPrice & {
    setRange: (range: DateRange) => void;
    resetRange: () => void;
    setNumGuests: (numGuests: string | number) => void;
    setHasBreakfast: (hasBreakfast: boolean) => void;
    clearReservation: () => void;
    resetReservation: () => void;
    configurePricing: (pricing: Pricing) => void;
    setCurrentBookingRange: (range: DateRange | null) => void;
  };

const initialState: ReservationState = {
  range: { from: undefined, to: undefined },
  numGuests: '',
  hasBreakfast: false,
  currentBookingRange: null,
  regularPrice: 0,
  discount: 0,
  breakfastPrice: 0,
};

const ReservationContext = createContext<ReservationContextValue | undefined>(
  undefined,
);

function reservationReducer(
  state: ReservationState,
  action: ReservationAction,
): ReservationState {
  switch (action.type) {
    case ReservationActionTypes.SET_RANGE:
      return { ...state, range: action.payload };
    case ReservationActionTypes.SET_NUM_GUESTS:
      return { ...state, numGuests: action.payload };
    case ReservationActionTypes.SET_HAS_BREAKFAST:
      return { ...state, hasBreakfast: action.payload };
    case ReservationActionTypes.SET_CURRENT_BOOKING_RANGE:
      return { ...state, currentBookingRange: action.payload };
    case ReservationActionTypes.CONFIGURE_PRICING:
      return { ...state, ...action.payload };
    case ReservationActionTypes.RESET_RANGE:
      return { ...state, range: initialState.range };
    case ReservationActionTypes.CLEAR_RESERVATION:
      return {
        ...state,
        range: initialState.range,
        numGuests: initialState.numGuests,
        hasBreakfast: initialState.hasBreakfast,
      };
    case ReservationActionTypes.RESET_RESERVATION:
      return {
        ...state,
        range: initialState.range,
        numGuests: initialState.numGuests,
        hasBreakfast: initialState.hasBreakfast,
        currentBookingRange: initialState.currentBookingRange,
      };
    default:
      return state;
  }
}

function ReservationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reservationReducer, initialState);
  const {
    range,
    numGuests,
    hasBreakfast,
    regularPrice,
    discount,
    breakfastPrice,
  } = state;

  const setRange = useCallback(
    (payload: DateRange) =>
      dispatch({ type: ReservationActionTypes.SET_RANGE, payload }),
    [],
  );
  const resetRange = useCallback(
    () => dispatch({ type: ReservationActionTypes.RESET_RANGE }),
    [],
  );
  const setNumGuests = useCallback(
    (payload: string | number) =>
      dispatch({ type: ReservationActionTypes.SET_NUM_GUESTS, payload }),
    [],
  );
  const setHasBreakfast = useCallback(
    (payload: boolean) =>
      dispatch({ type: ReservationActionTypes.SET_HAS_BREAKFAST, payload }),
    [],
  );
  const setCurrentBookingRange = useCallback(
    (payload: DateRange | null) =>
      dispatch({
        type: ReservationActionTypes.SET_CURRENT_BOOKING_RANGE,
        payload,
      }),
    [],
  );
  const configurePricing = useCallback(
    (payload: Pricing) =>
      dispatch({ type: ReservationActionTypes.CONFIGURE_PRICING, payload }),
    [],
  );
  const clearReservation = useCallback(
    () => dispatch({ type: ReservationActionTypes.CLEAR_RESERVATION }),
    [],
  );
  const resetReservation = useCallback(
    () => dispatch({ type: ReservationActionTypes.RESET_RESERVATION }),
    [],
  );

  const bookingPrice = useMemo(
    () =>
      range.from && range.to
        ? calculateBookingPrice({
            startDate: range.from,
            endDate: range.to,
            regularPrice,
            discount,
            breakfastPrice,
            numGuests: Number(numGuests),
            hasBreakfast,
          })
        : emptyBookingPrice,
    [
      breakfastPrice,
      discount,
      hasBreakfast,
      numGuests,
      range.from,
      range.to,
      regularPrice,
    ],
  );

  const value = useMemo(
    () => ({
      ...state,
      ...bookingPrice,
      setRange,
      resetRange,
      setNumGuests,
      setHasBreakfast,
      clearReservation,
      resetReservation,
      configurePricing,
      setCurrentBookingRange,
    }),
    [
      bookingPrice,
      clearReservation,
      configurePricing,
      resetRange,
      resetReservation,
      setCurrentBookingRange,
      setHasBreakfast,
      setNumGuests,
      setRange,
      state,
    ],
  );

  return (
    <ReservationContext.Provider value={value}>
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
