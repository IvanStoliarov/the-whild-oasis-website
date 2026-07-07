import { eachDayOfInterval, format, parseISO } from 'date-fns';
import { notFound } from 'next/navigation';
import { supabase } from './supabase';
import type {
  BookingRow,
  BookingUpdate,
  BookingWithCabin,
  Cabin,
  CabinSummary,
  CountryApiResponse,
  Guest,
  GuestInsert,
  GuestUpdate,
  Settings,
} from './types';
import { cacheLife, cacheTag } from 'next/cache';

function requireCabin(cabin: Awaited<ReturnType<typeof fetchCabin>>): Cabin {
  if (
    !cabin ||
    cabin.name === null ||
    cabin.maxCapacity === null ||
    cabin.regularPrice === null ||
    cabin.discount === null ||
    cabin.image === null ||
    cabin.description === null
  ) {
    throw new Error('Cabin data is incomplete');
  }
  return cabin as Cabin;
}

async function fetchCabin(id: number | string) {
  const { data, error } = await supabase
    .from('cabins')
    .select('*')
    .eq('id', Number(id))
    .single();

  if (error) {
    console.error(error);
    notFound();
  }
  return data;
}

export async function getCabin(id: number | string): Promise<Cabin> {
  return requireCabin(await fetchCabin(id));
}

export async function getCabinPrice(id: number) {
  const { data, error } = await supabase
    .from('cabins')
    .select('regularPrice, discount')
    .eq('id', Number(id))
    .single();

  if (error || !data || data.regularPrice === null || data.discount === null) {
    console.error(error);
    throw new Error('Cabin price could not be loaded');
  }
  return { regularPrice: data.regularPrice, discount: data.discount };
}

export async function getCabins(): Promise<CabinSummary[]> {
  const { data, error } = await supabase
    .from('cabins')
    .select(
      'id, name, maxCapacity, regularPrice, discount, image, rating, reviewCount',
    )
    .order('name');

  if (error) {
    console.error(error);
    throw new Error('Cabins could not be loaded');
  }

  return data.map(cabin => {
    if (
      cabin.name === null ||
      cabin.maxCapacity === null ||
      cabin.regularPrice === null ||
      cabin.discount === null ||
      cabin.image === null
    ) {
      throw new Error('Cabin data is incomplete');
    }
    return cabin as CabinSummary;
  });
}

export async function getGuest(email: string): Promise<Guest | null> {
  const { data } = await supabase
    .from('guests')
    .select('*')
    .eq('email', email)
    .single();

  if (!data) return null;
  if (data.email === null || data.fullName === null)
    throw new Error('Guest data is incomplete');
  return data as Guest;
}

export async function getBooking(
  id: number | string,
): Promise<BookingRow | null> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', Number(id))
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new Error('Booking could not get loaded');
  }
  return data;
}

export async function getBookings(
  guestId: number,
): Promise<BookingWithCabin[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select(
      'id, created_at, startDate, endDate, numNights, numGuests, totalPrice, guestId, cabinId, cabins(name, image), rating',
    )
    .eq('guestId', guestId)
    .order('startDate');

  if (error) {
    console.error(error);
    throw new Error('Bookings could not get loaded');
  }

  return data.map(booking => {
    if (
      booking.startDate === null ||
      booking.endDate === null ||
      booking.numNights === null ||
      booking.numGuests === null ||
      booking.totalPrice === null ||
      booking.cabins === null ||
      booking.cabins.name === null ||
      booking.cabins.image === null
    ) {
      throw new Error('Booking data is incomplete');
    }
    return booking as BookingWithCabin;
  });
}

export async function getBookedDatesByCabinId(
  cabinId: number | string,
): Promise<Date[]> {
  const today = format(new Date(), 'yyyy-MM-dd');

  const { data, error } = await supabase
    .from('bookings')
    .select('startDate, endDate')
    .eq('cabinId', Number(cabinId))
    .gte('endDate', today);

  if (error) {
    console.error(error);
    throw new Error('Bookings could not get loaded');
  }

  return data.flatMap(booking => {
    if (!booking.startDate || !booking.endDate) return [];
    return eachDayOfInterval({
      start: parseISO(booking.startDate),
      end: parseISO(booking.endDate),
    });
  });
}

export async function getSettings(): Promise<Settings> {
  const { data, error } = await supabase.from('settings').select('*').single();

  if (
    error ||
    !data ||
    data.breakfastPrice === null ||
    data.minBookingLength === null ||
    data.maxBookingLength === null
  ) {
    console.error(error);
    throw new Error('Settings could not be loaded');
  }
  return data as Settings;
}

export async function getCountries() {
  const res = await fetch(
    'https://api.restcountries.com/countries/v5?region=Europe&limit=100&response_fields=names.official,flag.url_png',
    {
      headers: {
        Authorization: 'Bearer rc_live_e8186bebb62e402ea9b2c91fd1507fe2',
      },
    },
  );
  if (!res.ok) throw new Error('Could not fetch countries');
  const countries = (await res.json()) as CountryApiResponse;
  return countries.data.objects;
}

export async function createGuest(newGuest: GuestInsert) {
  const { data, error } = await supabase.from('guests').insert([newGuest]);
  if (error) {
    console.error(error);
    throw new Error('Guest could not be created');
  }
  return data;
}

export async function updateGuest(id: number, updatedFields: GuestUpdate) {
  const { data, error } = await supabase
    .from('guests')
    .update(updatedFields)
    .eq('id', id)
    .select()
    .single();
  if (error) {
    console.error(error);
    throw new Error('Guest could not be updated');
  }
  return data;
}

export async function updateBooking(id: number, updatedFields: BookingUpdate) {
  const { data, error } = await supabase
    .from('bookings')
    .update(updatedFields)
    .eq('id', id)
    .select()
    .single();
  if (error) {
    console.error(error);
    throw new Error('Booking could not be updated');
  }
  return data;
}

export async function deleteBooking(id: number) {
  const { data, error } = await supabase.from('bookings').delete().eq('id', id);
  if (error) {
    console.error(error);
    throw new Error('Booking could not be deleted');
  }
  return data;
}
