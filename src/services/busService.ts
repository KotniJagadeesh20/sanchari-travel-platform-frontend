import { apiFetch } from "@/lib/api";
import { mapBackendBus, mapBackendBooking, type BackendBus, type BackendBookingDetails } from "@/lib/bus-mappers";
import type { Bus, BusBooking } from "@/data/transportation";

interface BusListResponse {
  success: boolean;
  message?: string;
  busses: BackendBus[] | null;
}

export interface PassengerDetails {
  name: string;
  email: string;
  phoneno: string;
  age: number;
}

export const busService = {
  async searchBuses(params: { source: string; destination: string; date: string }): Promise<Bus[]> {
    const { source, destination, date } = params;
    const res = await apiFetch<BusListResponse>(
      `/api/user/searchbusses/${encodeURIComponent(source)}/${encodeURIComponent(destination)}/${date}`
    );
    return (res.busses || []).map(mapBackendBus);
  },

  // NOTE: there is no GET /bus/{id} endpoint on the backend — a single Bus's
  // detail is only ever available as part of a search result. Callers should
  // pass the Bus through router state from the results page rather than
  // re-fetching by ID (see BusResults.tsx / BusCard.tsx).

  /** Books exactly one passenger on one bus — the backend has no multi-seat/multi-passenger concept. */
  async bookTicket(busId: string, passenger: PassengerDetails): Promise<{ bookingId: string }> {
    const res = await apiFetch<{ success: boolean; message: string; bookingId: string }>(
      `/api/user/bookticket/${busId}`,
      { method: "POST", body: JSON.stringify(passenger) }
    );
    return { bookingId: res.bookingId };
  },

  async getBookings(): Promise<BusBooking[]> {
    try {
      const res = await apiFetch<{ success: boolean; bookingDetails: BackendBookingDetails[] }>(
        "/api/user/bookingDetails"
      );
      return (res.bookingDetails || []).map(mapBackendBooking);
    } catch {
      // Backend returns 404 with {success:false} when the user has zero
      // bookings — treat that as an empty list rather than an error.
      return [];
    }
  },

  /**
   * ⚠️ Backend does not verify that the caller owns this booking before
   * deleting it (see BookingdetailsServiceImpl.cancelTickets) — any
   * authenticated user who knows a booking UUID can cancel it. This needs a
   * server-side ownership check added before relying on this in production.
   */
  async cancelBooking(id: string): Promise<void> {
    await apiFetch(`/api/user/cancelbooking/${id}`, { method: "DELETE" });
  },
};
