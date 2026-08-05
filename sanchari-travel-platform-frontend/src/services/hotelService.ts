import { apiFetch } from "@/lib/api";
import {
  mapBackendHotel, mapBackendHotelPage, mapBackendBooking, mapBackendReview,
  type BackendHotel, type BackendPage, type BackendBooking, type BackendReview,
} from "@/lib/hotel-mappers";
import type { Hotel, HotelSearchPage, HotelSearchFilters, HotelBookingRecord, HotelReview } from "@/data/hotels";

function buildSearchQuery(filters: HotelSearchFilters): string {
  const params = new URLSearchParams();
  if (filters.destinationId) params.set("destinationId", filters.destinationId);
  if (filters.checkIn) params.set("checkIn", filters.checkIn);
  if (filters.checkOut) params.set("checkOut", filters.checkOut);
  if (filters.guests) params.set("guests", String(filters.guests));
  if (filters.minPrice != null) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice != null) params.set("maxPrice", String(filters.maxPrice));
  if (filters.starRating) params.set("starRating", String(filters.starRating));
  if (filters.roomType) params.set("roomType", filters.roomType);
  params.set("page", String(filters.page ?? 0));
  params.set("size", String(filters.size ?? 20));
  return params.toString();
}

export const hotelService = {
  /**
   * checkIn/checkOut/guests are sent through (so the URL/search state round-trips
   * cleanly) but the backend doesn't actually filter by them yet — it has one
   * pooled inventory count per room type, not a per-night calendar. Results are
   * therefore not guaranteed to actually be free on the dates entered; that's
   * only checked for real at booking time. See Room.availableRooms in
   * hotel-mappers.ts.
   */
  async searchHotels(filters: HotelSearchFilters): Promise<HotelSearchPage> {
    const page = await apiFetch<BackendPage<BackendHotel>>(`/hotels?${buildSearchQuery(filters)}`);
    return mapBackendHotelPage(page);
  },

  /** Includes rooms — search results don't. */
  async getHotel(id: string): Promise<Hotel | undefined> {
    try {
      return mapBackendHotel(await apiFetch<BackendHotel>(`/hotels/${id}`));
    } catch {
      return undefined;
    }
  },

  /**
   * Auto-confirms immediately — no payment step exists anywhere on this
   * platform yet. Fails (ApiError) if the room has no available inventory or
   * the date range is invalid.
   */
  async bookRoom(payload: {
    hotelId: string; roomId: string; checkInDate: string; checkOutDate: string;
    numberOfGuests: number; specialRequest?: string;
  }): Promise<HotelBookingRecord> {
    const booking = await apiFetch<BackendBooking>("/hotel-bookings", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return mapBackendBooking(booking);
  },

  async getMyBookings(): Promise<HotelBookingRecord[]> {
    const bookings = await apiFetch<BackendBooking[]>("/hotel-bookings/me");
    return (bookings || []).map(mapBackendBooking);
  },

  /** Backend verifies the caller owns this booking (403 if not) and restores room inventory on success. */
  async cancelBooking(id: string): Promise<void> {
    await apiFetch(`/hotel-bookings/${id}`, { method: "DELETE" });
  },

  async getReviews(hotelId: string): Promise<HotelReview[]> {
    const reviews = await apiFetch<BackendReview[]>(`/hotels/${hotelId}/reviews`);
    return (reviews || []).map(mapBackendReview);
  },

  /** One review per user per hotel — a second attempt fails with an ApiError (400). */
  async createReview(hotelId: string, rating: number, comment?: string): Promise<HotelReview> {
    const review = await apiFetch<BackendReview>(`/hotels/${hotelId}/reviews`, {
      method: "POST",
      body: JSON.stringify({ rating, comment: comment || null }),
    });
    return mapBackendReview(review);
  },
};
