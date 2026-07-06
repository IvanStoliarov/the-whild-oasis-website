alter table public.bookings
add column if not exists rating integer
check (rating between 1 and 5);

create or replace function public.submit_booking_rating(
  booking_id bigint,
  guest_id bigint,
  new_rating integer
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  booking_record record;
  cabin_record record;
begin
  if new_rating < 1 or new_rating > 5 then
    raise exception 'Rating must be between 1 and 5';
  end if;

  select b."cabinId", b."endDate", b.rating
  into booking_record
  from public.bookings as b
  where b.id = booking_id
    and b."guestId" = guest_id
  for update;

  if not found then
    raise exception 'You are not allowed to rate this booking';
  end if;

  if booking_record."endDate" is null
    or booking_record."endDate" > current_date then
    raise exception 'You can only rate a booking after the stay ends';
  end if;

  if booking_record.rating is not null then
    raise exception 'Rating already submitted';
  end if;

  if booking_record."cabinId" is null then
    raise exception 'Cannot find cabin';
  end if;

  select c.rating, c."reviewCount"
  into cabin_record
  from public.cabins as c
  where c.id = booking_record."cabinId"
  for update;

  if not found then
    raise exception 'Cannot find cabin';
  end if;

  update public.bookings
  set rating = new_rating
  where id = booking_id;

  update public.cabins
  set
    rating = round((
      (
        coalesce(cabin_record."reviewCount", 0)
        * coalesce(cabin_record.rating, 0)
        + new_rating
      ) / (coalesce(cabin_record."reviewCount", 0) + 1)
    )::numeric, 2),
    "reviewCount" = coalesce(cabin_record."reviewCount", 0) + 1
  where id = booking_record."cabinId";
end;
$$;
