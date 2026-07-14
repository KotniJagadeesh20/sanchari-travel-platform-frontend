// Maps between ride-share-service's backend JSON shapes and the frontend's
// Ride/RideBookingRecord types.

import type { Ride, RideBookingRecord, RideStatus } from "@/data/transportation";

export interface BackendRide {
  id: string;
  source: string;
  destination: string;
  travelDate: string; // "2026-07-10"
  departureTime: string; // "08:00:00"
  totalSeats: number;
  availableSeats: number;
  pricePerSeat: number;
  vehicleType: string | null;
  vehicleNumber: string | null;
  pickupPoint: string | null;
  dropPoint: string | null;
  status: RideStatus;
  driverId: string;
  driverName: string | null;
  driverEmail: string;
}

export interface BackendRideBooking {
  id: string;
  rideId: string;
  rideSource: string;
  rideDestination: string;
  passengerId: string;
  passengerName: string | null;
  passengerEmail: string;
  seatsBooked: number;
  totalAmount: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  bookingTime: string;
}

function formatTime(t: string): string {
  return t.slice(0, 5); // "08:00:00" -> "08:00"
}

export function mapBackendRide(r: BackendRide): Ride {
  return {
    id: r.id,
    createdBy: {
      id: r.driverId,
      name: r.driverName || r.driverEmail, // fall back to email if name sync hasn't happened yet
      email: r.driverEmail,
    },
    vehicle: {
      type: r.vehicleType || "—",
      number: r.vehicleNumber || "—",
    },
    source: r.source,
    destination: r.destination,
    pickupPoint: r.pickupPoint || undefined,
    dropPoint: r.dropPoint || undefined,
    date: r.travelDate,
    departureTime: formatTime(r.departureTime),
    totalSeats: r.totalSeats,
    seatsLeft: r.availableSeats,
    pricePerSeat: r.pricePerSeat,
    status: r.status,
    reviews: [], // no review system exists yet
  };
}

export function mapBackendRideBooking(b: BackendRideBooking): RideBookingRecord {
  return {
    id: b.id,
    rideId: b.rideId,
    rideSource: b.rideSource,
    rideDestination: b.rideDestination,
    passengerId: b.passengerId,
    passengerName: b.passengerName || b.passengerEmail,
    passengerEmail: b.passengerEmail,
    seatsBooked: b.seatsBooked,
    totalAmount: b.totalAmount,
    status: b.status,
    bookingTime: b.bookingTime,
  };
}

/** Maps the OfferRide form to CreateRideRequest's exact JSON shape. */
export function mapOfferRideToBackendPayload(f: {
  source: string; destination: string; date: string; departureTime: string;
  totalSeats: number; pricePerSeat: number; vehicleType?: string; vehicleNumber?: string;
  pickupPoint?: string; dropPoint?: string;
}) {
  return {
    source: f.source,
    destination: f.destination,
    travelDate: f.date,
    departureTime: f.departureTime.length === 5 ? `${f.departureTime}:00` : f.departureTime,
    totalSeats: f.totalSeats,
    pricePerSeat: f.pricePerSeat,
    vehicleType: f.vehicleType || null,
    vehicleNumber: f.vehicleNumber || null,
    pickupPoint: f.pickupPoint || null,
    dropPoint: f.dropPoint || null,
  };
}
