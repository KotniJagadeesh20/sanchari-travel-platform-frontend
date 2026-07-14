import type { TravelPackage, ItineraryDay, Departure, PackageBookingRecord, BookingTraveler, DestinationOption } from "@/data/packages";

export interface BackendItineraryDay {
  id: string;
  dayNumber: number;
  plan: string;
}

export interface BackendDeparture {
  id: string;
  startDate: string;
  endDate: string;
  maxPeople: number;
  availableSlots: number;
  active: boolean;
}

export interface BackendPackage {
  id: string;
  title: string;
  description: string | null;
  destinationId: string;
  durationDays: number;
  durationNights: number;
  price: number;
  maxPeople: number;
  thumbnailImage: string | null;
  active: boolean;
  inclusions: string[] | null;
  exclusions: string[] | null;
  placesCovered: string[] | null;
  activities: string[] | null;
  imageUrls: string[] | null;
  itinerary: BackendItineraryDay[] | null;
  departures: BackendDeparture[] | null;
  createdById: string | null;
  createdByName: string | null;
  createdByEmail: string | null;
}

export interface BackendTraveler {
  name: string;
  age: number;
}

export interface BackendPackageBooking {
  id: string;
  packageId: string;
  packageTitle: string;
  departureId: string;
  departureStartDate: string;
  travelerId: string;
  travelerEmail: string;
  travelersCount: number;
  travelers: BackendTraveler[] | null;
  totalAmount: number;
  status: "CONFIRMED" | "CANCELLED";
  paymentStatus: "PENDING" | "PAID" | "REFUNDED";
  cancellationReason: string | null;
  bookingTime: string;
}

export interface BackendDestinationSummary {
  id: string;
  name: string;
  state: string | null;
}

export function mapBackendPackage(p: BackendPackage): TravelPackage {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    destinationId: p.destinationId,
    durationDays: p.durationDays,
    durationNights: p.durationNights,
    price: p.price,
    maxPeople: p.maxPeople,
    thumbnailImage: p.thumbnailImage,
    active: p.active,
    inclusions: p.inclusions || [],
    exclusions: p.exclusions || [],
    placesCovered: p.placesCovered || [],
    activities: p.activities || [],
    imageUrls: p.imageUrls || [],
    itinerary: (p.itinerary || []).map(mapItineraryDay),
    departures: (p.departures || []).map(mapDeparture),
    createdBy: p.createdById ? { id: p.createdById, name: p.createdByName || p.createdByEmail || "", email: p.createdByEmail || "" } : null,
  };
}

function mapItineraryDay(d: BackendItineraryDay): ItineraryDay {
  return { id: d.id, dayNumber: d.dayNumber, plan: d.plan };
}

function mapDeparture(d: BackendDeparture): Departure {
  return {
    id: d.id,
    startDate: d.startDate,
    endDate: d.endDate,
    maxPeople: d.maxPeople,
    availableSlots: d.availableSlots,
    active: d.active,
  };
}

function mapTraveler(t: BackendTraveler): BookingTraveler {
  return { name: t.name, age: t.age };
}

export function mapBackendPackageBooking(b: BackendPackageBooking): PackageBookingRecord {
  return {
    id: b.id,
    packageId: b.packageId,
    packageTitle: b.packageTitle,
    departureId: b.departureId,
    departureStartDate: b.departureStartDate,
    travelerId: b.travelerId,
    travelerEmail: b.travelerEmail,
    travelersCount: b.travelersCount,
    travelers: (b.travelers || []).map(mapTraveler),
    totalAmount: b.totalAmount,
    status: b.status,
    paymentStatus: b.paymentStatus,
    cancellationReason: b.cancellationReason,
    bookingTime: b.bookingTime,
  };
}

export function mapBackendDestinationOption(d: BackendDestinationSummary): DestinationOption {
  return { id: d.id, name: d.name, state: d.state };
}

/** Maps the create/edit package form to CreatePackageRequest's / UpdatePackageRequest's JSON shape. */
export function mapPackageFormToBackendPayload(f: {
  title: string; description?: string; destinationId: string;
  durationDays: number; durationNights: number; price: number; maxPeople: number;
  thumbnailImage?: string; inclusions?: string[]; exclusions?: string[];
  placesCovered?: string[]; activities?: string[]; imageUrls?: string[];
  itinerary?: { dayNumber: number; plan: string }[];
  departures?: { startDate: string; maxPeople?: number }[];
  active?: boolean;
}) {
  return {
    title: f.title,
    description: f.description || null,
    destinationId: f.destinationId,
    durationDays: f.durationDays,
    durationNights: f.durationNights,
    price: f.price,
    maxPeople: f.maxPeople,
    thumbnailImage: f.thumbnailImage || null,
    inclusions: f.inclusions || [],
    exclusions: f.exclusions || [],
    placesCovered: f.placesCovered || [],
    activities: f.activities || [],
    imageUrls: f.imageUrls || [],
    itinerary: f.itinerary || [],
    departures: f.departures || [],
    ...(f.active !== undefined ? { active: f.active } : {}),
  };
}

/** Maps a departure form to DepartureRequest's JSON shape. */
export function mapDepartureFormToBackendPayload(f: { startDate: string; maxPeople?: number }) {
  return { startDate: f.startDate, maxPeople: f.maxPeople ?? null };
}
