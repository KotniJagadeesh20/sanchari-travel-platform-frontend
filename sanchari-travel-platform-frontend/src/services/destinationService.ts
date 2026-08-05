import { apiFetch } from "@/lib/api";
import {
  mapBackendDestination, mapBackendDestinationSummary,
  type BackendDestination, type BackendDestinationSummary,
} from "@/lib/destination-mappers";
import type { Destination, DestinationSummary, DestinationCategory } from "@/data/destinations";

export const destinationService = {
  async getAllDestinations(): Promise<DestinationSummary[]> {
    const destinations = await apiFetch<BackendDestinationSummary[]>("/destinations");
    return (destinations || []).map(mapBackendDestinationSummary);
  },

  async getDestination(id: string): Promise<Destination | undefined> {
    try {
      return mapBackendDestination(await apiFetch<BackendDestination>(`/destinations/${id}`));
    } catch {
      return undefined;
    }
  },

  /** All provided filters are applied together (AND) — pass undefined for any you don't want applied. visitMonth is 1=Jan..12=Dec. */
  async search(params: { keyword?: string; category?: DestinationCategory; maxBudget?: number; visitMonth?: number }): Promise<DestinationSummary[]> {
    const q = new URLSearchParams();
    if (params.keyword) q.set("keyword", params.keyword);
    if (params.category) q.set("category", params.category);
    if (params.maxBudget !== undefined) q.set("maxBudget", String(params.maxBudget));
    if (params.visitMonth !== undefined) q.set("visitMonth", String(params.visitMonth));
    const destinations = await apiFetch<BackendDestinationSummary[]>(`/destinations/search?${q.toString()}`);
    return (destinations || []).map(mapBackendDestinationSummary);
  },

  async getPopular(): Promise<DestinationSummary[]> {
    const destinations = await apiFetch<BackendDestinationSummary[]>("/destinations/popular");
    return (destinations || []).map(mapBackendDestinationSummary);
  },
};
