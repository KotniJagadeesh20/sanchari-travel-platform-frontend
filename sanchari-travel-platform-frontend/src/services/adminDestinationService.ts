import { apiFetch } from "@/lib/api";
import { mapBackendDestination, mapDestinationFormToBackendPayload, type BackendDestination } from "@/lib/destination-mappers";
import type { Destination, DestinationCategory } from "@/data/destinations";

export interface DestinationFormPayload {
  name: string; state?: string; country: string; description?: string; bestMonths?: number[];
  averageBudget?: number; recommendedDays?: number; category: DestinationCategory; manualRating?: number;
  imageUrls?: string[];
  attractions?: { name: string; description?: string; attractionType?: string; imageUrl?: string }[];
  activities?: { name: string; category?: string; imageUrl?: string }[];
  /** Only meaningful on update — lets the admin page relist a delisted destination. */
  active?: boolean;
}

export const adminDestinationService = {
  /** Admin view — includes delisted (active=false) destinations too, unlike the customer-facing list. */
  async getAllDestinations(): Promise<Destination[]> {
    const destinations = await apiFetch<BackendDestination[]>("/destinations/admin");
    return (destinations || []).map(mapBackendDestination);
  },

  /** Includes attractions/activities in the same call. */
  async createDestination(payload: DestinationFormPayload): Promise<Destination> {
    const d = await apiFetch<BackendDestination>("/destinations/admin", {
      method: "POST",
      body: JSON.stringify(mapDestinationFormToBackendPayload(payload)),
    });
    return mapBackendDestination(d);
  },

  /** Only non-null fields in the payload are applied. If attractions/activities are provided, they fully replace the existing set. */
  async updateDestination(id: string, payload: Partial<DestinationFormPayload>): Promise<Destination> {
    const d = await apiFetch<BackendDestination>(`/destinations/admin/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return mapBackendDestination(d);
  },

  /** Soft-delete: sets active=false, preserves FK integrity for packages/hotels already linked via destinationId. */
  async delistDestination(id: string): Promise<void> {
    await apiFetch(`/destinations/admin/${id}`, { method: "DELETE" });
  },
};
