import { apiFetch } from "@/lib/api";
import {
  mapBackendPackage, mapBackendPackageBooking, mapPackageFormToBackendPayload, mapDepartureFormToBackendPayload,
  type BackendPackage, type BackendPackageBooking, type BackendDeparture,
} from "@/lib/package-mappers";
import type { TravelPackage, PackageBookingRecord, Departure } from "@/data/packages";

export interface PackageFormPayload {
  title: string; description?: string; destinationId: string;
  durationDays: number; durationNights: number; price: number; maxPeople: number;
  thumbnailImage?: string; inclusions?: string[]; exclusions?: string[];
  placesCovered?: string[]; activities?: string[]; imageUrls?: string[];
  itinerary?: { dayNumber: number; plan: string }[];
  departures?: { startDate: string; maxPeople?: number }[];
  /** Only meaningful on update — lets MyPackages.tsx publish a draft or relist a delisted package. */
  active?: boolean;
}

function mapDeparture(d: BackendDeparture): Departure {
  return { id: d.id, startDate: d.startDate, endDate: d.endDate, maxPeople: d.maxPeople, availableSlots: d.availableSlots, active: d.active };
}

export const adminPackageService = {
  /** Admin view — includes delisted/draft (active=false) packages too, unlike the customer-facing list. */
  async getAllPackages(): Promise<TravelPackage[]> {
    const packages = await apiFetch<BackendPackage[]>("/packages/admin");
    return (packages || []).map(mapBackendPackage);
  },

  /**
   * Packages the caller created, via createdBy. Scopes the *listing* only —
   * doesn't restrict editing/delisting to the creator, since any ROLE_ADMIN
   * can still manage any package until the full ROLE_PARTNER model lands.
   */
  async getMyPackages(): Promise<TravelPackage[]> {
    const packages = await apiFetch<BackendPackage[]>("/packages/admin/mine");
    return (packages || []).map(mapBackendPackage);
  },

  /** New packages are created as drafts (active=false) — call updatePackage(id, {active:true}) to publish. */
  async createPackage(payload: PackageFormPayload): Promise<TravelPackage> {
    const pkg = await apiFetch<BackendPackage>("/packages/admin", {
      method: "POST",
      body: JSON.stringify(mapPackageFormToBackendPayload(payload)),
    });
    return mapBackendPackage(pkg);
  },

  /** Only non-null fields in the payload are applied — matches backend's partial-update semantics. */
  async updatePackage(id: string, payload: Partial<PackageFormPayload>): Promise<TravelPackage> {
    const pkg = await apiFetch<BackendPackage>(`/packages/admin/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return mapBackendPackage(pkg);
  },

  /** Soft-delete: sets active=false, preserves booking history. */
  async delistPackage(id: string): Promise<void> {
    await apiFetch(`/packages/admin/${id}`, { method: "DELETE" });
  },

  async getBookingsForPackage(id: string): Promise<PackageBookingRecord[]> {
    const bookings = await apiFetch<BackendPackageBooking[]>(`/packages/admin/${id}/bookings`);
    return (bookings || []).map(mapBackendPackageBooking);
  },

  /** maxPeople defaults to the package's own maxPeople if omitted. */
  async addDeparture(packageId: string, startDate: string, maxPeople?: number): Promise<Departure> {
    const d = await apiFetch<BackendDeparture>(`/packages/admin/${packageId}/departures`, {
      method: "POST",
      body: JSON.stringify(mapDepartureFormToBackendPayload({ startDate, maxPeople })),
    });
    return mapDeparture(d);
  },

  /** Changing maxPeople shifts availableSlots by the same delta — already-booked travelers stay booked. */
  async updateDeparture(departureId: string, changes: { startDate?: string; maxPeople?: number }): Promise<Departure> {
    const d = await apiFetch<BackendDeparture>(`/packages/admin/departures/${departureId}`, {
      method: "PUT",
      body: JSON.stringify(changes),
    });
    return mapDeparture(d);
  },

  /** Soft-cancels one specific departure batch — the package template and its other departures are unaffected. */
  async cancelDeparture(departureId: string): Promise<void> {
    await apiFetch(`/packages/admin/departures/${departureId}`, { method: "DELETE" });
  },

  /**
   * Operator-initiated cancellation of a customer's booking (trip called off, etc).
   * No ownership check — any admin can do this, same as every other admin action here.
   */
  async cancelBookingAsAdmin(bookingId: string, reason?: string): Promise<void> {
    const q = reason ? `?reason=${encodeURIComponent(reason)}` : "";
    await apiFetch(`/packages/admin/bookings/${bookingId}/cancel${q}`, { method: "POST" });
  },
};
