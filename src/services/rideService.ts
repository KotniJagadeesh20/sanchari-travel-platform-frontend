import { apiFetch } from "@/lib/api";
import {
  mapBackendRide, mapBackendRideBooking, mapOfferRideToBackendPayload,
  type BackendRide, type BackendRideBooking,
} from "@/lib/ride-mappers";
import type { Ride, RideBookingRecord } from "@/data/transportation";

export interface OfferRidePayload {
  source: string; destination: string; date: string; departureTime: string;
  totalSeats: number; pricePerSeat: number; vehicleType?: string; vehicleNumber?: string;
  pickupPoint?: string; dropPoint?: string;
}

export const rideService = {
  async searchRides(params: { source: string; destination: string; date: string }): Promise<Ride[]> {
    const q = new URLSearchParams({ source: params.source, destination: params.destination, date: params.date });
    const rides = await apiFetch<BackendRide[]>(`/rides/search?${q.toString()}`);
    return (rides || []).map(mapBackendRide);
  },

  async getRide(id: string): Promise<Ride | undefined> {
    try {
      return mapBackendRide(await apiFetch<BackendRide>(`/rides/${id}`));
    } catch {
      return undefined;
    }
  },

  async offerRide(payload: OfferRidePayload): Promise<Ride> {
    const ride = await apiFetch<BackendRide>("/rides", {
      method: "POST",
      body: JSON.stringify(mapOfferRideToBackendPayload(payload)),
    });
    return mapBackendRide(ride);
  },

  /** Driver cancelling a ride they created. Existing bookings on it remain on record (backend doesn't delete them). */
  async cancelMyRide(rideId: string): Promise<void> {
    await apiFetch(`/rides/${rideId}`, { method: "DELETE" });
  },

  /** Rides I created, as driver. */
  async getMyRidesAsDriver(): Promise<Ride[]> {
    const rides = await apiFetch<BackendRide[]>("/rides/driver");
    return (rides || []).map(mapBackendRide);
  },

  /** Books seats as passenger — creates a PENDING booking awaiting the driver's approval, not an instant confirmation. */
  async bookRide(rideId: string, seats: number): Promise<RideBookingRecord> {
    const booking = await apiFetch<BackendRideBooking>(`/rides/${rideId}/book`, {
      method: "POST",
      body: JSON.stringify({ seats }),
    });
    return mapBackendRideBooking(booking);
  },

  /** My bookings, as passenger. */
  async getMyBookings(): Promise<RideBookingRecord[]> {
    const bookings = await apiFetch<BackendRideBooking[]>("/rides/bookings");
    return (bookings || []).map(mapBackendRideBooking);
  },

  /** Passenger cancelling their own booking. */
  async cancelBooking(bookingId: string): Promise<void> {
    await apiFetch(`/rides/bookings/${bookingId}`, { method: "DELETE" });
  },

  /** Driver viewing booking requests received on one of their rides. */
  async getBookingsForRide(rideId: string): Promise<RideBookingRecord[]> {
    const bookings = await apiFetch<BackendRideBooking[]>(`/rides/${rideId}/bookings`);
    return (bookings || []).map(mapBackendRideBooking);
  },

  async approveBooking(bookingId: string): Promise<RideBookingRecord> {
    const booking = await apiFetch<BackendRideBooking>(`/rides/bookings/${bookingId}/approve`, { method: "POST" });
    return mapBackendRideBooking(booking);
  },

  async rejectBooking(bookingId: string): Promise<RideBookingRecord> {
    const booking = await apiFetch<BackendRideBooking>(`/rides/bookings/${bookingId}/reject`, { method: "POST" });
    return mapBackendRideBooking(booking);
  },
};
