'use server';

import { revalidatePath } from 'next/cache';
import { auth, signIn, signOut } from './auth';
import { supabase } from './supabase';
import { getBookings, getCabinPrice, getSettings } from './data-service';
import { redirect, RedirectType } from 'next/navigation';
import { differenceInDays } from 'date-fns';

export async function signInAction() {
  await signIn('google', { redirectTo: '/account' });
}

export async function signOutAction() {
  await signOut({ redirectTo: '/' });
}

export async function updateGuest(formData) {
  const session = await auth();
  if (!session) throw new Error('You must be logged in');
  const nationalID = formData.get('nationalID');
  const [nationality, countryFlag] = formData.get('nationality').split('%');
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

export async function deleteReservation(bookingId) {
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

export default async function updateReservation(formData) {
  const session = await auth();
  if (!session) throw new Error('You must be logged in');
  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingsIds = guestBookings.map(booking => booking.id);
  const reservationId = Number(formData.get('reservationId'));

  if (!guestBookingsIds.includes(reservationId)) {
    throw new Error("Can't change this booking");
  }

  const updatedFields = {
    numGuests: Number(formData.get('numGuests')),
    observations: formData.get('observations').slice(0, 1000),
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

export async function createBooking(bookingData, formData) {
  const session = await auth();
  if (!session) throw new Error('You must be logged in');

  const [{ regularPrice, discount }, { breakfastPrice }] = await Promise.all([
    getCabinPrice(bookingData.cabinId),
    getSettings(),
  ]);

  const numGuests = Number(formData.get('numGuests'));
  const numNights = differenceInDays(
    new Date(bookingData.endDate),
    new Date(bookingData.startDate),
  );
  const hasBreakfast = !!formData.get('breakfast');
  const cabinPrice = numNights * (regularPrice - discount);
  const extrasPrice = hasBreakfast
    ? numNights * numGuests * breakfastPrice
    : 0;

  const newBooking = {
    ...bookingData,
    numNights,
    cabinPrice,
    guestId: session.user.guestId,
    numGuests,
    observations: formData.get('observations').slice(1, 1000),
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
