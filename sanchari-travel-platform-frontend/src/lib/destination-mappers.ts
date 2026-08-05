import type { Destination, DestinationSummary, Attraction, Activity, DestinationCategory } from "@/data/destinations";

export interface BackendAttraction {
  id: string;
  name: string;
  description: string | null;
  attractionType: string | null;
  imageUrl: string | null;
}

export interface BackendActivity {
  id: string;
  name: string;
  category: string | null;
  imageUrl: string | null;
}

export interface BackendDestination {
  id: string;
  name: string;
  state: string | null;
  country: string;
  description: string | null;
  bestMonths: number[] | null;
  averageBudget: number | null;
  recommendedDays: number | null;
  category: DestinationCategory;
  manualRating: number;
  active: boolean;
  imageUrls: string[] | null;
  attractions: BackendAttraction[] | null;
  activities: BackendActivity[] | null;
}

export interface BackendDestinationSummary {
  id: string;
  name: string;
  state: string | null;
  country: string;
  description: string | null;
  averageBudget: number | null;
  manualRating: number;
  category: DestinationCategory;
  thumbnailImage: string | null;
}

function mapAttraction(a: BackendAttraction): Attraction {
  return { id: a.id, name: a.name, description: a.description, attractionType: a.attractionType, imageUrl: a.imageUrl };
}

function mapActivity(a: BackendActivity): Activity {
  return { id: a.id, name: a.name, category: a.category, imageUrl: a.imageUrl };
}

export function mapBackendDestination(d: BackendDestination): Destination {
  return {
    id: d.id,
    name: d.name,
    state: d.state,
    country: d.country,
    description: d.description,
    bestMonths: d.bestMonths || [],
    averageBudget: d.averageBudget,
    recommendedDays: d.recommendedDays,
    category: d.category,
    manualRating: d.manualRating,
    active: d.active,
    imageUrls: d.imageUrls || [],
    attractions: (d.attractions || []).map(mapAttraction),
    activities: (d.activities || []).map(mapActivity),
  };
}

export function mapBackendDestinationSummary(d: BackendDestinationSummary): DestinationSummary {
  return {
    id: d.id,
    name: d.name,
    state: d.state,
    country: d.country,
    description: d.description,
    averageBudget: d.averageBudget,
    manualRating: d.manualRating,
    category: d.category,
    thumbnailImage: d.thumbnailImage,
  };
}

/** Maps the create/edit destination form to CreateDestinationRequest's / UpdateDestinationRequest's JSON shape. */
export function mapDestinationFormToBackendPayload(f: {
  name: string; state?: string; country: string; description?: string; bestMonths?: number[];
  averageBudget?: number; recommendedDays?: number; category: DestinationCategory; manualRating?: number;
  imageUrls?: string[];
  attractions?: { name: string; description?: string; attractionType?: string; imageUrl?: string }[];
  activities?: { name: string; category?: string; imageUrl?: string }[];
  active?: boolean;
}) {
  return {
    name: f.name,
    state: f.state || null,
    country: f.country,
    description: f.description || null,
    bestMonths: f.bestMonths || [],
    averageBudget: f.averageBudget ?? null,
    recommendedDays: f.recommendedDays ?? null,
    category: f.category,
    manualRating: f.manualRating ?? null,
    imageUrls: f.imageUrls || [],
    attractions: f.attractions || [],
    activities: f.activities || [],
    ...(f.active !== undefined ? { active: f.active } : {}),
  };
}
