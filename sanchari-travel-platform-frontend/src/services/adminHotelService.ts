import { apiFetch } from "@/lib/api";
import {
  mapBackendHotel, mapBackendRoom, mapBackendBooking,
  mapHotelFormToBackendPayload, mapRoomFormToBackendPayload,
  type BackendHotel, type BackendRoom, type BackendBooking,
} from "@/lib/hotel-mappers";
import type { Hotel, Room, RoomType, HotelBookingRecord } from "@/data/hotels";

export interface HotelFormPayload {
  name: string; description?: string; destinationId?: string; address: string; city: string;
  state?: string; country: string; latitude?: number; longitude?: number; starRating: number;
  contactEmail?: string; contactPhone?: string; checkInTime?: string; checkOutTime?: string;
  /** Only meaningful on update — lets MyHotels.tsx relist a delisted hotel. */
  active?: boolean;
}

export interface RoomFormPayload {
  label: string; roomType?: RoomType; capacity: number; pricePerNight: number;
  totalRooms: number; description?: string; active?: boolean;
}

export const adminHotelService = {
  /** Admin view — includes delisted (active=false) hotels too, unlike the customer-facing search. */
  async getAllHotels(): Promise<Hotel[]> {
    const hotels = await apiFetch<BackendHotel[]>("/hotels/admin");
    return (hotels || []).map(mapBackendHotel);
  },

  /**
   * Hotels the caller created, via createdBy. Scopes the *listing* only —
   * doesn't restrict editing/delisting to the creator, since any ROLE_ADMIN
   * can still manage any hotel until the full ROLE_PARTNER model lands.
   */
  async getMyHotels(): Promise<Hotel[]> {
    const hotels = await apiFetch<BackendHotel[]>("/hotels/admin/mine");
    return (hotels || []).map(mapBackendHotel);
  },

  async createHotel(payload: HotelFormPayload): Promise<Hotel> {
    const hotel = await apiFetch<BackendHotel>("/hotels/admin", {
      method: "POST",
      body: JSON.stringify(mapHotelFormToBackendPayload(payload)),
    });
    return mapBackendHotel(hotel);
  },

  /** Only fields present in the payload are applied — matches backend's partial-update semantics. destinationId isn't editable (see UpdateHotelRequest). */
  async updateHotel(id: string, payload: Partial<Omit<HotelFormPayload, "destinationId">>): Promise<Hotel> {
    const hotel = await apiFetch<BackendHotel>(`/hotels/admin/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return mapBackendHotel(hotel);
  },

  /** Soft-delete: sets active=false, preserves booking/review history. */
  async delistHotel(id: string): Promise<void> {
    await apiFetch(`/hotels/admin/${id}`, { method: "DELETE" });
  },

  async addHotelImage(hotelId: string, imageUrl: string, displayOrder = 0): Promise<void> {
    await apiFetch(`/hotels/admin/${hotelId}/images`, {
      method: "POST",
      body: JSON.stringify({ imageUrl, displayOrder }),
    });
  },

  async addHotelAmenity(hotelId: string, name: string, icon?: string): Promise<void> {
    await apiFetch(`/hotels/admin/${hotelId}/amenities`, {
      method: "POST",
      body: JSON.stringify({ name, icon: icon || null }),
    });
  },

  async addRoom(hotelId: string, payload: RoomFormPayload): Promise<Room> {
    const room = await apiFetch<BackendRoom>(`/hotels/admin/${hotelId}/rooms`, {
      method: "POST",
      body: JSON.stringify(mapRoomFormToBackendPayload(payload)),
    });
    return mapBackendRoom(room);
  },

  /** Only fields present in the payload are applied. roomType isn't editable after creation (not part of UpdateRoomRequest). Changing totalRooms reconciles availableRooms by the same delta — already-booked rooms stay booked. */
  async updateRoom(roomId: string, payload: Partial<RoomFormPayload>): Promise<Room> {
    const { label, roomType: _roomType, ...rest } = payload;
    const body: Record<string, unknown> = { ...rest };
    if (label !== undefined) body.roomNumber = label;
    const room = await apiFetch<BackendRoom>(`/hotels/admin/rooms/${roomId}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
    return mapBackendRoom(room);
  },

  /** Soft delete — sets active=false. */
  async deleteRoom(roomId: string): Promise<void> {
    await apiFetch(`/hotels/admin/rooms/${roomId}`, { method: "DELETE" });
  },

  async addRoomImage(roomId: string, imageUrl: string, displayOrder = 0): Promise<void> {
    await apiFetch(`/hotels/admin/rooms/${roomId}/images`, {
      method: "POST",
      body: JSON.stringify({ imageUrl, displayOrder }),
    });
  },

  async addRoomAmenity(roomId: string, name: string): Promise<void> {
    await apiFetch(`/hotels/admin/rooms/${roomId}/amenities`, {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  },

  /** Every booking across every room of this hotel. No ownership check — any ROLE_ADMIN can view any hotel's bookings. */
  async getBookingsForHotel(hotelId: string): Promise<HotelBookingRecord[]> {
    const bookings = await apiFetch<BackendBooking[]>(`/hotels/admin/${hotelId}/bookings`);
    return (bookings || []).map(mapBackendBooking);
  },
};
