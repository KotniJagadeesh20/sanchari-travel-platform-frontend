// Real, backend-aligned Hotel types. This is the customer + creator hotel flow,
// wired to hotel-service. Room here is a room-TYPE record (e.g. "Deluxe Room"),
// not a physical room — there is no seat/room-number selection, just picking
// how many nights of a room type to book (mirrors how TravelPackage splits
// Departure out from the package template — see data/packages.ts).

export type RoomType = "STANDARD" | "DELUXE" | "SUITE" | "FAMILY";

export const ROOM_TYPES: RoomType[] = ["STANDARD", "DELUXE", "SUITE", "FAMILY"];

export const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  STANDARD: "Standard",
  DELUXE: "Deluxe",
  SUITE: "Suite",
  FAMILY: "Family",
};

export interface HotelAmenity {
  id: string;
  name: string;
  icon: string | null;
}

export interface Room {
  id: string;
  hotelId: string;
  // A short label/code for this room-type record (e.g. "DLX-A") — NOT a
  // physical room number. There's no per-room inventory here, just a pooled
  // count (see availableRooms).
  label: string;
  roomType: RoomType;
  capacity: number;
  pricePerNight: number;
  totalRooms: number;
  // Rooms of this type not currently held by an active booking. A simple
  // pooled counter, not a per-night calendar — see backend Room.availableRooms
  // Javadoc. Two bookings for non-overlapping dates still compete for the
  // same pool.
  availableRooms: number;
  description: string | null;
  active: boolean;
  imageUrls: string[];
  amenities: string[];
}

export interface Hotel {
  id: string;
  name: string;
  description: string | null;
  destinationId: string;
  address: string;
  city: string;
  state: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  starRating: number;
  contactEmail: string | null;
  contactPhone: string | null;
  checkInTime: string | null; // "HH:mm"
  checkOutTime: string | null; // "HH:mm"
  active: boolean;
  averageRating: number | null;
  reviewCount: number;
  imageUrls: string[];
  amenities: HotelAmenity[];
  // Only populated on the hotel-details endpoint, not on search results.
  rooms: Room[] | null;
  // Nullable — hotels created before this field existed have no creator on
  // record. Not an ownership/access restriction yet (any ROLE_ADMIN can still
  // manage any hotel) — just identity for display + "my hotels" scoping,
  // ahead of the full ROLE_PARTNER model described in the roadmap (mirrors
  // TravelPackage.createdBy exactly).
  createdBy: { id: string; name: string; email: string } | null;
}

/** One page of search results. */
export interface HotelSearchPage {
  hotels: Hotel[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

export interface HotelSearchFilters {
  destinationId?: string;
  checkIn?: string; // ISO date — accepted by the backend but not yet used to filter (see Room availability note)
  checkOut?: string; // ISO date — same as above
  guests?: number; // same as above
  minPrice?: number;
  maxPrice?: number;
  starRating?: number;
  roomType?: RoomType;
  page?: number;
  size?: number;
}

export type HotelBookingStatus = "PENDING" | "CONFIRMED" | "CHECKED_IN" | "CHECKED_OUT" | "CANCELLED";
export type PaymentStatus = "PENDING" | "PAID" | "REFUNDED";

export interface HotelBookingRecord {
  id: string;
  hotelId: string;
  hotelName: string;
  roomId: string;
  roomLabel: string;
  checkInDate: string; // ISO date
  checkOutDate: string; // ISO date
  numberOfGuests: number;
  pricePerNight: number;
  totalAmount: number;
  status: HotelBookingStatus;
  // Separate from `status` — no payment gateway is integrated anywhere in
  // this platform yet, so this starts PENDING at booking time.
  paymentStatus: PaymentStatus;
  specialRequest: string | null;
  bookingDate: string; // ISO datetime
}

export interface HotelReview {
  id: string;
  hotelId: string;
  userId: string;
  rating: number;
  comment: string | null;
  createdAt: string; // ISO datetime
}
