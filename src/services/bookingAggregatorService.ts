import { apiFetch } from "@/lib/api";
import { mapBackendBooking as mapBackendBusBooking, type BackendBookingDetails } from "@/lib/bus-mappers";
import { mapBackendRideBooking, type BackendRideBooking } from "@/lib/ride-mappers";
import { mapBackendBooking as mapBackendHotelBooking, type BackendBooking as BackendHotelBooking } from "@/lib/hotel-mappers";
import { mapBackendPackageBooking, type BackendPackageBooking } from "@/lib/package-mappers";
import type { BusBooking, RideBookingRecord } from "@/data/transportation";
import type { HotelBookingRecord } from "@/data/hotels";
import type { PackageBookingRecord } from "@/data/packages";

/**
 * Raw shape of GET /me/bookings (the Booking Aggregator, api-gateway). Each
 * field is exactly what that source service's own "my bookings" endpoint
 * returns — the aggregator deliberately doesn't normalize these into one
 * shape (see BookingAggregatorService's Javadoc), so neither do we here.
 * `warnings` is present only when a source failed/timed out — its absence
 * (not an empty array) means everything succeeded.
 */
interface AggregatedBookingsRaw {
  busBookings: BackendBookingDetails[];
  rideBookings: BackendRideBooking[];
  hotelBookings: BackendHotelBooking[];
  packageBookings: BackendPackageBooking[];
  warnings?: string[];
}

export interface AggregatedBookings {
  busBookings: BusBooking[];
  rideBookings: RideBookingRecord[];
  hotelBookings: HotelBookingRecord[];
  packageBookings: PackageBookingRecord[];
  /** Which sources (if any) failed to load — show this, don't silently drop it. */
  warnings: string[];
}

export const bookingAggregatorService = {
  async getMyBookings(): Promise<AggregatedBookings> {
    const raw = await apiFetch<AggregatedBookingsRaw>("/me/bookings");
    return {
      busBookings: (raw.busBookings || []).map(mapBackendBusBooking),
      rideBookings: (raw.rideBookings || []).map(mapBackendRideBooking),
      hotelBookings: (raw.hotelBookings || []).map(mapBackendHotelBooking),
      packageBookings: (raw.packageBookings || []).map(mapBackendPackageBooking),
      warnings: raw.warnings || [],
    };
  },
};

// ─── Display-layer unification ──────────────────────────────────────────────
// The aggregator itself must not normalize (each source keeps its own DTO
// shape end-to-end). This is different: a presentation-only concern so
// Profile.tsx can render one mixed "My Bookings" list without four separate
// render branches. Nothing upstream of this collapses the real shapes.

export type UnifiedBookingType = "Bus" | "Ride" | "Hotel" | "Package";

/**
 * Deliberately NOT the same five-way {@link BookingStatus}-style union used
 * elsewhere — this is only for badge color grouping across sources whose
 * statuses don't line up 1:1 (Ride has PENDING/APPROVED/REJECTED/CANCELLED;
 * Bus has no CANCELLED at all since a cancelled booking is hard-deleted, not
 * flagged; Package/Hotel use CONFIRMED). "pending" MUST render visibly
 * differently from "confirmed" — a ride request awaiting driver approval is
 * not a confirmed seat.
 */
export type UnifiedBookingTone = "pending" | "confirmed" | "completed" | "cancelled";

export interface UnifiedBooking {
  key: string;
  type: UnifiedBookingType;
  title: string;
  subtitle: string;
  meta: string;
  date: string; // ISO date/datetime, for sorting
  statusLabel: string;
  tone: UnifiedBookingTone;
  detailLink: string;
}

function busTone(status: BusBooking["status"]): UnifiedBookingTone {
  return status === "completed" ? "completed" : status === "cancelled" ? "cancelled" : "confirmed";
}

function rideTone(status: RideBookingRecord["status"]): UnifiedBookingTone {
  if (status === "PENDING") return "pending";
  if (status === "REJECTED" || status === "CANCELLED") return "cancelled";
  return "confirmed"; // APPROVED
}

function hotelTone(status: HotelBookingRecord["status"]): UnifiedBookingTone {
  if (status === "PENDING") return "pending";
  if (status === "CANCELLED") return "cancelled";
  if (status === "CHECKED_OUT") return "completed";
  return "confirmed"; // CONFIRMED, CHECKED_IN
}

function packageTone(status: PackageBookingRecord["status"]): UnifiedBookingTone {
  return status === "CANCELLED" ? "cancelled" : "confirmed";
}

export function toUnifiedBookings(bookings: AggregatedBookings): UnifiedBooking[] {
  const bus: UnifiedBooking[] = bookings.busBookings.map((b) => ({
    key: `bus-${b.id}`,
    type: "Bus",
    title: `${b.source} → ${b.destination}`,
    subtitle: b.busName || "Bus",
    meta: `${b.passengerName} · ₹${b.totalAmount.toLocaleString()}`,
    date: b.date,
    statusLabel: b.status === "upcoming" ? "Upcoming" : "Completed",
    tone: busTone(b.status),
    detailLink: "/transportation/bus/bookings",
  }));

  const ride: UnifiedBooking[] = bookings.rideBookings.map((b) => ({
    key: `ride-${b.id}`,
    type: "Ride",
    title: `${b.rideSource} → ${b.rideDestination}`,
    subtitle: `${b.seatsBooked} seat${b.seatsBooked !== 1 ? "s" : ""}`,
    meta: `₹${b.totalAmount.toLocaleString()}`,
    date: b.bookingTime,
    statusLabel: b.status === "PENDING" ? "Awaiting driver approval"
      : b.status === "APPROVED" ? "Approved"
      : b.status === "REJECTED" ? "Rejected" : "Cancelled",
    tone: rideTone(b.status),
    detailLink: "/transportation/rides/my-rides",
  }));

  const hotel: UnifiedBooking[] = bookings.hotelBookings.map((b) => ({
    key: `hotel-${b.id}`,
    type: "Hotel",
    title: b.hotelName,
    subtitle: `Room ${b.roomLabel}`,
    meta: `${b.checkInDate} → ${b.checkOutDate}`,
    date: b.checkInDate,
    statusLabel: b.status.replace("_", " "),
    tone: hotelTone(b.status),
    detailLink: "/stays/bookings",
  }));

  const pkg: UnifiedBooking[] = bookings.packageBookings.map((b) => ({
    key: `package-${b.id}`,
    type: "Package",
    title: b.packageTitle,
    subtitle: `${b.travelersCount} traveler${b.travelersCount !== 1 ? "s" : ""}`,
    meta: `From ${b.departureStartDate}`,
    date: b.departureStartDate,
    statusLabel: b.status === "CONFIRMED" ? "Confirmed" : "Cancelled",
    tone: packageTone(b.status),
    detailLink: "/my-package-bookings",
  }));

  return [...bus, ...ride, ...hotel, ...pkg].sort((a, b) => (a.date < b.date ? 1 : -1));
}
