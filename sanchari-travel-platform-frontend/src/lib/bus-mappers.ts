// Maps between bus-booking-service's backend JSON shapes and the frontend's
// Bus/BusBooking types. Kept separate from busService.ts so the API-calling
// code and the shape-translation code can be read/tested independently.

import type { Bus, BusBooking, BookingStatus } from "@/data/transportation";
import type { AdminBus, AdminDriver } from "@/data/admin";

// Raw shape of bus-booking-service's Bus entity, as Jackson serializes it.
export interface BackendBus {
  id: string;
  source: string;
  destination: string;
  busType: string;
  busno: string;
  date: string; // "2026-07-10"
  time: string; // "21:30:00"
  arrivalDate: string | null;
  arrivalTime: string | null;
  price: number;
}

// Raw shape of a Bookingdetails row, as returned nested under GET /bookingDetails.
export interface BackendBookingDetails {
  id: string;
  name: string;
  email: string;
  phoneno: string;
  age: number;
  price: number;
  paymentdate: string; // ISO datetime
  bus: BackendBus;
  user: { id: string; email: string | null } | null;
}

function formatTime(t: string): string {
  // Backend sends "HH:mm:ss" — drop the seconds for display.
  return t.slice(0, 5);
}

/** Computes a human "Xh Ym" duration from departure/arrival, handling overnight (next-day arrival) trips. */
export function computeDuration(bus: Pick<BackendBus, "date" | "time" | "arrivalDate" | "arrivalTime">): string {
  if (!bus.arrivalTime) return "—";
  const depart = new Date(`${bus.date}T${bus.time}`);
  const arriveDate = bus.arrivalDate || bus.date;
  const arrive = new Date(`${arriveDate}T${bus.arrivalTime}`);
  let diffMs = arrive.getTime() - depart.getTime();
  if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000; // guard against bad data implying arrival "before" departure
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.round((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

/**
 * Maps a backend Bus to the frontend's richer Bus type. Fields with no
 * backend equivalent get honest empty defaults (null/0/[]) rather than
 * fabricated values — components should conditionally hide those, not
 * display fake data (see BusCard.tsx).
 */
export function mapBackendBus(b: BackendBus): Bus {
  return {
    id: b.id,
    busno: b.busno,
    date: b.date,
    operator: null, // no operator concept in backend yet — stays null until V2
    busName: b.busno, // backend has no display-name field yet — busno is the only stable identifier we have
    busType: b.busType,
    source: b.source,
    destination: b.destination,
    departure: formatTime(b.time),
    arrival: b.arrivalTime ? formatTime(b.arrivalTime) : "",
    duration: computeDuration(b),
    totalSeats: 0, // no seat inventory model in backend — see BusCard for how 0 is treated as "unknown, hide"
    bookedSeats: [],
    pricePerSeat: b.price,
    rating: null,
    amenities: [],
  };
}

function deriveStatus(bus: BackendBus): BookingStatus {
  // Backend stores no booking status at all, and cancellation is a hard
  // DELETE (see BookingdetailsServiceImpl.cancelTickets) rather than a
  // soft-cancel flag — so a cancelled booking simply won't appear in
  // GET /bookingDetails results at all. "cancelled" is derivable here only
  // in the sense that it will never occur; upcoming/completed is a simple
  // date comparison against the bus's own departure.
  const departureAt = new Date(`${bus.date}T${bus.time}`);
  return departureAt.getTime() >= Date.now() ? "upcoming" : "completed";
}

export function mapBackendBooking(d: BackendBookingDetails): BusBooking {
  return {
    id: d.id,
    busId: d.bus.id,
    operator: null,
    busName: d.bus.busno,
    source: d.bus.source,
    destination: d.bus.destination,
    date: d.bus.date,
    passengerName: d.name,
    passengerEmail: d.email,
    passengerPhone: d.phoneno,
    passengerAge: d.age,
    totalAmount: d.price,
    status: deriveStatus(d.bus),
    bookedAt: d.paymentdate,
  };
}

// ─── Admin: Bus ─────────────────────────────────────────────────────────────

/**
 * Maps a backend Bus to AdminBus for the admin dashboard.
 * `operator`/`seats`/`status` have no backend field — existingLocal lets the
 * caller carry forward whatever cosmetic values were showing before this
 * refetch, since the backend can't persist them and would otherwise reset
 * them to defaults on every reload.
 */
export function mapBackendBusToAdminBus(b: BackendBus, existingLocal?: Partial<AdminBus>): AdminBus {
  return {
    id: b.id,
    busno: b.busno,
    operator: existingLocal?.operator ?? null,
    source: b.source,
    destination: b.destination,
    busType: b.busType,
    date: b.date,
    departure: formatTime(b.time),
    arrival: b.arrivalTime ? formatTime(b.arrivalTime) : undefined,
    arrivalDate: b.arrivalDate ?? undefined,
    price: b.price,
    seats: existingLocal?.seats,
    driverId: existingLocal?.driverId,
    status: existingLocal?.status ?? "active",
  };
}

/**
 * Maps an AdminBus form back to the exact JSON shape the backend's Bus entity expects.
 *
 * `id` should be supplied when editing: the backend's editBus handler calls
 * `busRepo.save(bus)` on the raw request body rather than merging onto the
 * entity it just fetched — if `id` is missing/null, Hibernate treats it as a
 * new row and tries to INSERT, which then fails on busno's unique
 * constraint. Passing the existing row's id makes Hibernate correctly
 * `merge()` instead. (Worth fixing properly on the backend — see note in
 * adminBusService.editBus.)
 */
export function mapAdminBusToBackendPayload(b: {
  id?: string; busno: string; source: string; destination: string; busType: string;
  date: string; departure: string; arrival?: string; arrivalDate?: string; price: number;
}) {
  return {
    ...(b.id ? { id: b.id } : {}),
    busno: b.busno,
    source: b.source,
    destination: b.destination,
    busType: b.busType,
    date: b.date,
    time: b.departure.length === 5 ? `${b.departure}:00` : b.departure,
    arrivalTime: b.arrival ? (b.arrival.length === 5 ? `${b.arrival}:00` : b.arrival) : null,
    arrivalDate: b.arrivalDate || null,
    price: b.price,
  };
}

// ─── Admin: Driver ──────────────────────────────────────────────────────────

export interface BackendDriver {
  id: string;
  name: string;
  email: string;
  age: number;
  phone: number;
  bus: BackendBus | null;
}

export function mapBackendDriverToAdminDriver(d: BackendDriver, existingLocal?: Partial<AdminDriver>): AdminDriver {
  return {
    id: d.id,
    name: d.name,
    email: d.email,
    age: d.age,
    phone: existingLocal?.phone ?? String(d.phone),
    license: existingLocal?.license,
    experience: existingLocal?.experience,
    assignedBusId: d.bus?.id,
    status: existingLocal?.status ?? (d.bus ? "on-duty" : "off-duty"),
  };
}

/** Maps an AdminDriver form back to the backend Driver JSON shape. Strips non-digits from phone (backend stores a plain `long`). */
export function mapAdminDriverToBackendPayload(d: { name: string; email: string; age: number; phone: string }) {
  return {
    name: d.name,
    email: d.email,
    age: d.age,
    phone: Number(d.phone.replace(/\D/g, "")),
  };
}
