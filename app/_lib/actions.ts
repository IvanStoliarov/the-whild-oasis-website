'use server';

import { revalidatePath } from 'next/cache';
import { auth, signIn, signOut } from './auth';
import { supabase } from './supabase';
import {
  getBookings,
  getCabin,
  getCabinPrice,
  getSettings,
} from './data-service';
import { redirect, RedirectType } from 'next/navigation';
import { format } from 'date-fns';
import type { BookingData, BookingInsert, BookingWithCabin } from './types';
import type { DateRange } from '@daypicker/react';
import { calculateBookingPrice } from './booking-utils';

function getFormString(formData: FormData, key: string): string {
  const value = formData.get(key);
  if (typeof value !== 'string') throw new Error(`${key} is required`);
  return value;
}

async function requireSession() {
  const session = await auth();
  if (!session) throw new Error('You must be logged in');
  return session;
}

async function getGuestReservation(
  guestId: number,
  reservationId: number,
  unauthorizedMessage: string,
): Promise<BookingWithCabin> {
  const reservations = await getBookings(guestId);
  const reservation = reservations.find(booking => booking.id === reservationId);

  if (!reservation) throw new Error(unauthorizedMessage);
  return reservation;
}

function getBookingFormFields(formData: FormData) {
  return {
    numGuests: Number(getFormString(formData, 'numGuests')),
    observations: getFormString(formData, 'observations').slice(0, 1000),
    hasBreakfast: !!formData.get('breakfast'),
  };
}

function formatBookingDate(date: Date) {
  return format(date, 'yyyy-MM-dd');
}

export async function signInAction() {
  await signIn('google', { redirectTo: '/account' });
}

export async function signOutAction() {
  await signOut({ redirectTo: '/' });
}

export async function updateGuest(formData: FormData) {
  const session = await requireSession();
  const nationalID = getFormString(formData, 'nationalID');
  const [nationality, countryFlag] = getFormString(
    formData,
    'nationality',
  ).split('%');
  if (!nationality || !countryFlag) throw new Error('Nationality is required');
  const updateData = { nationality, countryFlag, nationalID };

  const { data, error } = await supabase
    .from('guests')
    .update(updateData)
    .eq('id', session.user.guestId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  revalidatePath('account/profile');
}

export async function deleteReservation(bookingId: number) {
  const session = await requireSession();
  await getGuestReservation(
    session.user.guestId,
    bookingId,
    'You are not allowed to delete this booking',
  );

  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', bookingId);

  if (error) {
    throw new Error('Booking could not be deleted');
  }

  revalidatePath('/account/reservations');
}

export default async function updateReservation(
  formData: FormData,
  range: DateRange,
) {
  const session = await requireSession();
  const reservationId = Number(getFormString(formData, 'reservationId'));
  const currentReservation = await getGuestReservation(
    session.user.guestId,
    reservationId,
    "Can't change this booking",
  );
  const cabinId = currentReservation.cabinId;
  if (!cabinId) {
    throw new Error('No cabin found for booking');
  }
  const [cabin, settings] = await Promise.all([
    getCabin(cabinId),
    getSettings(),
  ]);
  const { regularPrice, discount } = cabin;

  if (!range.from || !range.to) {
    throw new Error("Range hasn't been selected");
  }

  const startDate = formatBookingDate(range.from);
  const endDate = formatBookingDate(range.to);
  const { data: conflictingBookings, error: availabilityError } = await supabase
    .from('bookings')
    .select('id')
    .eq('cabinId', cabinId)
    .neq('id', reservationId)
    .lte('startDate', endDate)
    .gte('endDate', startDate)
    .limit(1);

  if (availabilityError) {
    throw new Error('Booking availability could not be checked');
  }
  if (conflictingBookings.length > 0) {
    throw new Error('The selected dates are no longer available');
  }

  const { numGuests, observations, hasBreakfast } =
    getBookingFormFields(formData);
  const priceDetails = calculateBookingPrice({
    startDate: range.from,
    endDate: range.to,
    regularPrice,
    discount,
    breakfastPrice: settings.breakfastPrice,
    numGuests,
    hasBreakfast,
  });

  const updatedFields = {
    numGuests,
    observations,
    startDate,
    endDate,
    hasBreakfast,
    ...priceDetails,
  };

  const { error } = await supabase
    .from('bookings')
    .update(updatedFields)
    .eq('id', reservationId)
    .select()
    .single();

  revalidatePath(`/account/reservations/edit/${reservationId}`);
  revalidatePath('/account/reservations');

  if (error) {
    throw new Error('Booking could not be updated');
  }

  redirect('/account/reservations', RedirectType.push);
}

export async function createBooking(
  bookingData: BookingData,
  formData: FormData,
) {
  const session = await requireSession();

  const [{ regularPrice, discount }, { breakfastPrice }] = await Promise.all([
    getCabinPrice(bookingData.cabinId),
    getSettings(),
  ]);

  const { numGuests, observations, hasBreakfast } =
    getBookingFormFields(formData);
  const priceDetails = calculateBookingPrice({
    startDate: bookingData.startDate,
    endDate: bookingData.endDate,
    regularPrice,
    discount,
    breakfastPrice,
    numGuests,
    hasBreakfast,
  });

  const newBooking: BookingInsert = {
    ...bookingData,
    startDate: formatBookingDate(bookingData.startDate),
    endDate: formatBookingDate(bookingData.endDate),
    guestId: session.user.guestId,
    numGuests,
    observations,
    ...priceDetails,
    isPaid: false,
    hasBreakfast,
    status: 'unconfirmed',
  };

  const { error } = await supabase.from('bookings').insert([newBooking]);

  if (error) {
    console.error(error);
    throw new Error('Booking could not be created');
  }
  revalidatePath(`/cabins/${bookingData.cabinId}`);
  redirect('/cabins/thankyou', RedirectType.push);
}
