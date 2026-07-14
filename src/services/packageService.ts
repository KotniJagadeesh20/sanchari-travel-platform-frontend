import { apiFetch } from "@/lib/api";
import {
  mapBackendPackage, mapBackendPackageBooking, mapBackendDestinationOption,
  type BackendPackage, type BackendPackageBooking, type BackendDestinationSummary, type BackendTraveler,
} from "@/lib/package-mappers";
import type { TravelPackage, PackageBookingRecord, DestinationOption, BookingTraveler } from "@/data/packages";

export const packageService = {
  async getAllPackages(): Promise<TravelPackage[]> {
    const packages = await apiFetch<BackendPackage[]>("/packages");
    return (packages || []).map(mapBackendPackage);
  },

  async getPackagesByDestination(destinationId: string): Promise<TravelPackage[]> {
    const packages = await apiFetch<BackendPackage[]>(`/packages/by-destination/${destinationId}`);
    return (packages || []).map(mapBackendPackage);
  },

  async getPackage(id: string): Promise<TravelPackage | undefined> {
    try {
      return mapBackendPackage(await apiFetch<BackendPackage>(`/packages/${id}`));
    } catch {
      return undefined;
    }
  },

  /**
   * Books a specific departure batch. Auto-confirms immediately — no
   * approval step, unlike ride-share's booking flow. Requires real
   * traveler names/ages (not just a headcount) since a partner needs these
   * to arrange hotels/transport for the group.
   */
  async bookPackage(departureId: string, travelers: BookingTraveler[]): Promise<PackageBookingRecord> {
    const booking = await apiFetch<BackendPackageBooking>(`/packages/departures/${departureId}/book`, {
      method: "POST",
      body: JSON.stringify({ travelers: travelers as BackendTraveler[] }),
    });
    return mapBackendPackageBooking(booking);
  },

  async getMyBookings(): Promise<PackageBookingRecord[]> {
    const bookings = await apiFetch<BackendPackageBooking[]>("/packages/bookings");
    return (bookings || []).map(mapBackendPackageBooking);
  },

  async cancelBooking(bookingId: string, reason?: string): Promise<void> {
    const q = reason ? `?reason=${encodeURIComponent(reason)}` : "";
    await apiFetch(`/packages/bookings/${bookingId}${q}`, { method: "DELETE" });
  },

  /**
   * Read-only destination name lookup — NOT the Destinations feature build-out
   * (that's deferred). Used purely to resolve destinationId -> a display name
   * for package cards/details and the create-package picker.
   */
  async listDestinationOptions(): Promise<DestinationOption[]> {
    const destinations = await apiFetch<BackendDestinationSummary[]>("/destinations");
    return (destinations || []).map(mapBackendDestinationOption);
  },
};
