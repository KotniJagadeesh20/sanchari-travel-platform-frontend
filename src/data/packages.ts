// Real, backend-aligned Package types — deliberately separate from
// src/data/trips.ts's Package/Trip types. Those are mock data for the
// trip-scoped browsing flow (Packages.tsx / PackageDetails.tsx / PackageCard.tsx),
// which stays untouched since it's entangled with the still-deferred
// Trip-vs-Destination decision. This file backs the real, backend-wired
// flow instead (AllPackages.tsx / RealPackageDetails.tsx / RealPackageCard.tsx).

export interface ItineraryDay {
  id: string;
  dayNumber: number;
  plan: string;
}

/**
 * One bookable departure batch for a package — a package template can run
 * on several dates at once, each tracked independently (mirrors how
 * hotel-service splits Room out from Hotel).
 */
export interface Departure {
  id: string;
  startDate: string; // ISO date
  endDate: string; // ISO date — derived server-side from startDate + package's durationDays
  maxPeople: number;
  availableSlots: number;
  active: boolean; // a partner can cancel one specific batch without affecting the package template
}

export interface TravelPackage {
  id: string;
  title: string;
  description: string | null;
  destinationId: string;
  durationDays: number;
  durationNights: number;
  price: number;
  // Default capacity used when adding a new departure batch without
  // specifying one — NOT the same as availability, which now lives per
  // departure (see departures below).
  maxPeople: number;
  thumbnailImage: string | null;
  // Whether this package is published/visible to customers. New packages
  // default to false (draft) — must be explicitly published.
  active: boolean;
  inclusions: string[];
  exclusions: string[];
  placesCovered: string[];
  activities: string[];
  imageUrls: string[];
  itinerary: ItineraryDay[];
  departures: Departure[];
  // Nullable — packages created before this field existed have no creator on
  // record. Not an ownership/access restriction yet (any ROLE_ADMIN can still
  // manage any package) — just identity for display + "my packages" scoping,
  // ahead of the full ROLE_PARTNER model described in the roadmap.
  createdBy: { id: string; name: string; email: string } | null;
}

export type PackageBookingStatus = "CONFIRMED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "PAID" | "REFUNDED";

export interface BookingTraveler {
  name: string;
  age: number;
}

export interface PackageBookingRecord {
  id: string;
  packageId: string;
  packageTitle: string;
  departureId: string;
  departureStartDate: string; // ISO date
  travelerId: string;
  travelerEmail: string;
  travelersCount: number;
  travelers: BookingTraveler[];
  totalAmount: number;
  status: PackageBookingStatus;
  // Separate from `status` — no payment gateway is integrated anywhere in
  // this platform yet, so this starts PENDING at booking time.
  paymentStatus: PaymentStatus;
  cancellationReason: string | null;
  bookingTime: string; // ISO datetime
}

/** Minimal shape for the destination picker — read-only lookup, not the full Destinations feature. */
export interface DestinationOption {
  id: string;
  name: string;
  state: string | null;
}
