// Real, backend-aligned Destination types — deliberately separate from
// src/data/admin.ts's AdminDestination (mock, used only by AdminDashboard's
// "recent destinations" widget, which depends on a createdAt field that
// doesn't exist on the real backend entity). This file backs the real,
// backend-wired admin/Destinations.tsx page instead.

export type DestinationCategory =
  | "BEACH" | "HILL_STATION" | "ADVENTURE" | "RELIGIOUS" | "FAMILY" | "NATURE" | "ROAD_TRIP";

export interface Attraction {
  id: string;
  name: string;
  description: string | null;
  attractionType: string | null;
  imageUrl: string | null;
}

export interface Activity {
  id: string;
  name: string;
  category: string | null;
  imageUrl: string | null;
}

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Formats a set of month numbers (1-12) into a readable string, e.g. [11,12,1,2] -> "Nov, Dec, Jan, Feb". */
export function formatBestMonths(months: number[]): string {
  return months
    .slice()
    .sort((a, b) => a - b)
    .map((m) => MONTH_NAMES[m - 1]?.slice(0, 3))
    .join(", ");
}

export interface Destination {
  id: string;
  name: string;
  state: string | null;
  country: string;
  description: string | null;
  // Calendar months (1=Jan..12=Dec) this destination is good to visit —
  // structured so it's queryable ("destinations good to visit in March"),
  // not a free-text string like "Nov-Feb".
  bestMonths: number[];
  averageBudget: number | null;
  recommendedDays: number | null;
  category: DestinationCategory;
  // Admin-set quality rating (0.0–5.0) — NOT computed from user reviews, no review system exists.
  manualRating: number;
  active: boolean;
  imageUrls: string[];
  attractions: Attraction[];
  activities: Activity[];
}

/** Lightweight shape for browse/search result grids — matches DestinationSummaryResponse. */
export interface DestinationSummary {
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

export const DESTINATION_CATEGORIES: DestinationCategory[] = [
  "BEACH", "HILL_STATION", "ADVENTURE", "RELIGIOUS", "FAMILY", "NATURE", "ROAD_TRIP",
];
