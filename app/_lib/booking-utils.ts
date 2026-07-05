import { differenceInDays } from 'date-fns';

export type BookingPriceInput = {
  startDate: Date;
  endDate: Date;
  regularPrice: number;
  discount: number;
  breakfastPrice: number;
  numGuests: number;
  hasBreakfast: boolean;
};

export type BookingPrice = {
  numNights: number;
  cabinPrice: number;
  extrasPrice: number;
  totalPrice: number;
};

export const emptyBookingPrice: BookingPrice = {
  numNights: 0,
  cabinPrice: 0,
  extrasPrice: 0,
  totalPrice: 0,
};

export function calculateBookingPrice({
  startDate,
  endDate,
  regularPrice,
  discount,
  breakfastPrice,
  numGuests,
  hasBreakfast,
}: BookingPriceInput): BookingPrice {
  const numNights = differenceInDays(endDate, startDate);
  const cabinPrice = (regularPrice - discount) * numNights;
  const extrasPrice = hasBreakfast
    ? breakfastPrice * numNights * numGuests
    : 0;

  return {
    numNights,
    cabinPrice,
    extrasPrice,
    totalPrice: cabinPrice + extrasPrice,
  };
}
