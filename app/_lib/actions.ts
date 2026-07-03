'use server';

import { revalidatePath } from 'next/cache';
import { auth, signIn, signOut } from './auth';
import { supabase } from './supabase';
import { getBookings, getCabinPrice, getSettings } from './data-service';
import { redirect, RedirectType } from 'next/navigation';
import { differenceInDays } from 'date-fns';
import type { BookingData, BookingInsert } from './types';

function getFormString(formData: FormData, key: string): string {
  const value = formData.get(key);
  if (typeof value !== 'string') throw new Error(`${key} is required`);
  return value;
}

export async function signInAction() {
  await signIn('google', { redirectTo: '/account' });
}

export async function signOutAction() {
  await signOut({ redirectTo: '/' });
}

export async function updateGuest(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error('You must be logged in');
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
  const session = await auth();
  if (!session) throw new Error('You must be logged in');

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingsIds = guestBookings.map(booking => booking.id);

  if (!guestBookingsIds.includes(bookingId))
    throw new Error('You are not allowed to delete this booking');

  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', bookingId);

  if (error) {
    throw new Error('Booking could not be deleted');
  }

  revalidatePath('/account/reservations');
}

export default async function updateReservation(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error('You must be logged in');
  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingsIds = guestBookings.map(booking => booking.id);
  const reservationId = Number(getFormString(formData, 'reservationId'));

  if (!guestBookingsIds.includes(reservationId)) {
    throw new Error("Can't change this booking");
  }

  const updatedFields = {
    numGuests: Number(getFormString(formData, 'numGuests')),
    observations: getFormString(formData, 'observations').slice(0, 1000),
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
  const session = await auth();
  if (!session) throw new Error('You must be logged in');

  const [{ regularPrice, discount }, { breakfastPrice }] = await Promise.all([
    getCabinPrice(bookingData.cabinId),
    getSettings(),
  ]);

  const numGuests = Number(getFormString(formData, 'numGuests'));
  const numNights = differenceInDays(
    new Date(bookingData.endDate),
    new Date(bookingData.startDate),
  );
  const hasBreakfast = !!formData.get('breakfast');
  const cabinPrice = numNights * (regularPrice - discount);
  const extrasPrice = hasBreakfast
    ? numNights * numGuests * breakfastPrice
    : 0;

  const newBooking: BookingInsert = {
    ...bookingData,
    startDate: bookingData.startDate.toISOString(),
    endDate: bookingData.endDate.toISOString(),
    numNights,
    cabinPrice,
    guestId: session.user.guestId,
    numGuests,
    observations: getFormString(formData, 'observations').slice(0, 1000),
    extrasPrice,
    totalPrice: cabinPrice + extrasPrice,
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
