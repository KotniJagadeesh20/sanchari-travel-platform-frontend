import type {
  Hotel, HotelAmenity, Room, RoomType, HotelSearchPage,
  HotelBookingRecord, HotelReview,
} from "@/data/hotels";

export interface BackendAmenity {
  id: string;
  name: string;
  icon: string | null;
}

export interface BackendRoom {
  id: string;
  hotelId: string;
  roomNumber: string;
  roomType: RoomType;
  capacity: number;
  pricePerNight: number;
  totalRooms: number;
  availableRooms: number;
  description: string | null;
  active: boolean;
  imageUrls: string[] | null;
  amenities: string[] | null;
}

export interface BackendHotel {
  id: string;
  name: string;
  description: string | null;
  destinationId: string;
  address: string;
  city: string;
  state: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  starRating: number;
  contactEmail: string | null;
  contactPhone: string | null;
  checkInTime: string | null;
  checkOutTime: string | null;
  active: boolean;
  averageRating: number | null;
  reviewCount: number;
  imageUrls: string[] | null;
  amenities: BackendAmenity[] | null;
  rooms: BackendRoom[] | null;
  createdById: string | null;
  createdByName: string | null;
  createdByEmail: string | null;
}

export interface BackendPage<T> {
  content: T[];
  number: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

export interface BackendBooking {
  id: string;
  userId: string;
  hotelId: string;
  hotelName: string;
  roomId: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  pricePerNight: number;
  totalAmount: number;
  bookingStatus: HotelBookingRecord["status"];
  paymentStatus: HotelBookingRecord["paymentStatus"];
  specialRequest: string | null;
  bookingDate: string;
}

export interface BackendReview {
  id: string;
  hotelId: string;
  userId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export function mapBackendRoom(r: BackendRoom): Room {
  return {
    id: r.id,
    hotelId: r.hotelId,
    label: r.roomNumber,
    roomType: r.roomType,
    capacity: r.capacity,
    pricePerNight: r.pricePerNight,
    totalRooms: r.totalRooms,
    availableRooms: r.availableRooms,
    description: r.description,
    active: r.active,
    imageUrls: r.imageUrls || [],
    amenities: r.amenities || [],
  };
}

function mapAmenity(a: BackendAmenity): HotelAmenity {
  return { id: a.id, name: a.name, icon: a.icon };
}

export function mapBackendHotel(h: BackendHotel): Hotel {
  return {
    id: h.id,
    name: h.name,
    description: h.description,
    destinationId: h.destinationId,
    address: h.address,
    city: h.city,
    state: h.state,
    country: h.country,
    latitude: h.latitude,
    longitude: h.longitude,
    starRating: h.starRating,
    contactEmail: h.contactEmail,
    contactPhone: h.contactPhone,
    checkInTime: h.checkInTime,
    checkOutTime: h.checkOutTime,
    active: h.active,
    averageRating: h.averageRating,
    reviewCount: h.reviewCount ?? 0,
    imageUrls: h.imageUrls || [],
    amenities: (h.amenities || []).map(mapAmenity),
    rooms: h.rooms ? h.rooms.map(mapBackendRoom) : null,
    createdBy: h.createdById
      ? { id: h.createdById, name: h.createdByName || h.createdByEmail || "", email: h.createdByEmail || "" }
      : null,
  };
}

export function mapBackendHotelPage(p: BackendPage<BackendHotel>): HotelSearchPage {
  return {
    hotels: (p.content || []).map(mapBackendHotel),
    page: p.number,
    size: p.size,
    totalPages: p.totalPages,
    totalElements: p.totalElements,
  };
}

export function mapBackendBooking(b: BackendBooking): HotelBookingRecord {
  return {
    id: b.id,
    hotelId: b.hotelId,
    hotelName: b.hotelName,
    roomId: b.roomId,
    roomLabel: b.roomNumber,
    checkInDate: b.checkInDate,
    checkOutDate: b.checkOutDate,
    numberOfGuests: b.numberOfGuests,
    pricePerNight: b.pricePerNight,
    totalAmount: b.totalAmount,
    status: b.bookingStatus,
    paymentStatus: b.paymentStatus,
    specialRequest: b.specialRequest,
    bookingDate: b.bookingDate,
  };
}

export function mapBackendReview(r: BackendReview): HotelReview {
  return {
    id: r.id,
    hotelId: r.hotelId,
    userId: r.userId,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt,
  };
}

/** Maps the create/edit hotel form to CreateHotelRequest's / UpdateHotelRequest's JSON shape. */
export function mapHotelFormToBackendPayload(f: {
  name: string; description?: string; destinationId?: string; address: string; city: string;
  state?: string; country: string; latitude?: number; longitude?: number; starRating: number;
  contactEmail?: string; contactPhone?: string; checkInTime?: string; checkOutTime?: string;
  active?: boolean;
}) {
  return {
    name: f.name,
    description: f.description || null,
    ...(f.destinationId ? { destinationId: f.destinationId } : {}),
    address: f.address,
    city: f.city,
    state: f.state || null,
    country: f.country,
    latitude: f.latitude ?? null,
    longitude: f.longitude ?? null,
    starRating: f.starRating,
    contactEmail: f.contactEmail || null,
    contactPhone: f.contactPhone || null,
    checkInTime: f.checkInTime || null,
    checkOutTime: f.checkOutTime || null,
    ...(f.active !== undefined ? { active: f.active } : {}),
  };
}

/** Maps a room form to CreateRoomRequest's / UpdateRoomRequest's JSON shape. */
export function mapRoomFormToBackendPayload(f: {
  label: string; roomType?: RoomType; capacity: number; pricePerNight: number;
  totalRooms: number; description?: string; active?: boolean;
}) {
  return {
    roomNumber: f.label,
    ...(f.roomType ? { roomType: f.roomType } : {}),
    capacity: f.capacity,
    pricePerNight: f.pricePerNight,
    totalRooms: f.totalRooms,
    description: f.description || null,
    ...(f.active !== undefined ? { active: f.active } : {}),
  };
}
