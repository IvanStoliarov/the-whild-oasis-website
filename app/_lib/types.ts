import type { Tables, TablesInsert, TablesUpdate } from "./database.types";

export type CabinRow = Tables<"cabins">;
export type BookingRow = Tables<"bookings">;
export type GuestRow = Tables<"guests">;
export type SettingsRow = Tables<"settings">;
export type GuestInsert = TablesInsert<"guests">;
export type BookingInsert = TablesInsert<"bookings">;
export type BookingUpdate = TablesUpdate<"bookings">;
export type GuestUpdate = TablesUpdate<"guests">;

export type Cabin = Omit<
  CabinRow,
  "name" | "maxCapacity" | "regularPrice" | "discount" | "image" | "description"
> & {
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  image: string;
  description: string;
};

export type CabinSummary = Pick<
  Cabin,
  "id" | "name" | "maxCapacity" | "regularPrice" | "discount" | "image" | "rating" | "reviewCount"
>;

export type Settings = Omit<
  SettingsRow,
  "breakfastPrice" | "minBookingLength" | "maxBookingLength"
> & {
  breakfastPrice: number;
  minBookingLength: number;
  maxBookingLength: number;
};

export type Guest = Omit<GuestRow, "email" | "fullName"> & {
  email: string;
  fullName: string;
};

export type BookingWithCabin = Pick<
  BookingRow,
  | "id"
  | "created_at"
  | "startDate"
  | "endDate"
  | "numNights"
  | "numGuests"
  | "totalPrice"
  | "guestId"
  | "cabinId"
  | "rating"
> & {
  startDate: string;
  endDate: string;
  numNights: number;
  numGuests: number;
  totalPrice: number;
  cabins: Pick<Cabin, "name" | "image">;
};

export type CapacityFilter = "all" | "small" | "medium" | "large";

export type BookingData = {
  cabinId: number;
  startDate: Date;
  endDate: Date;
};

export type CountryApiResponse = {
  data: {
    objects: Array<{
      names: { official: string };
      flag: { url_png: string };
    }>;
  };
};
