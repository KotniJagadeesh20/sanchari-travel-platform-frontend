import ootyImg from "@/assets/ooty.jpg";
import goaImg from "@/assets/goa.jpg";
import coorgImg from "@/assets/coorg.jpg";
import kashmirImg from "@/assets/kashmir.jpg";
import manaliImg from "@/assets/manali.jpg";
import rajasthanImg from "@/assets/rajasthan.jpg";

export type PackageStatus = "active" | "draft" | "archived";
export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface CreatorPackageMeta {
  id: string;
  image: string;
  status: PackageStatus;
  bookings: number;
  rating: number;
  reviews: number;
}

// Extra creator-side metadata layered on top of `packages` in trips.ts
export const creatorPackageMeta: Record<string, CreatorPackageMeta> = {
  "ooty-1": { id: "ooty-1", image: ootyImg, status: "active", bookings: 42, rating: 4.8, reviews: 31 },
  "ooty-2": { id: "ooty-2", image: ootyImg, status: "active", bookings: 18, rating: 4.6, reviews: 12 },
  "ooty-3": { id: "ooty-3", image: ootyImg, status: "draft", bookings: 0, rating: 0, reviews: 0 },
  "goa-1": { id: "goa-1", image: goaImg, status: "active", bookings: 64, rating: 4.9, reviews: 47 },
  "goa-2": { id: "goa-2", image: goaImg, status: "active", bookings: 22, rating: 4.5, reviews: 15 },
  "coorg-1": { id: "coorg-1", image: coorgImg, status: "active", bookings: 27, rating: 4.7, reviews: 19 },
  "coorg-2": { id: "coorg-2", image: coorgImg, status: "archived", bookings: 8, rating: 4.2, reviews: 6 },
  "kashmir-1": { id: "kashmir-1", image: kashmirImg, status: "active", bookings: 35, rating: 4.9, reviews: 28 },
  "kashmir-2": { id: "kashmir-2", image: kashmirImg, status: "draft", bookings: 0, rating: 0, reviews: 0 },
  "manali-1": { id: "manali-1", image: manaliImg, status: "active", bookings: 51, rating: 4.7, reviews: 38 },
  "rajasthan-1": { id: "rajasthan-1", image: rajasthanImg, status: "active", bookings: 29, rating: 4.8, reviews: 22 },
  "rajasthan-2": { id: "rajasthan-2", image: rajasthanImg, status: "archived", bookings: 4, rating: 4.0, reviews: 3 },
};

export interface Hotel {
  id: string;
  name: string;
  destination: string;
  image: string;
  starRating: number;
  rooms: number;
  bookings: number;
  rating: number;
  reviews: number;
  priceFrom: number;
  amenities: string[];
}

export const hotels: Hotel[] = [
  { id: "h1", name: "Ocean View Resort", destination: "Goa", image: goaImg, starRating: 5, rooms: 42, bookings: 187, rating: 4.8, reviews: 142, priceFrom: 6500, amenities: ["Pool", "Beachfront", "Spa", "Wi-Fi", "Restaurant"] },
  { id: "h2", name: "Hotel Paradise", destination: "Ooty", image: ootyImg, starRating: 4, rooms: 28, bookings: 94, rating: 4.6, reviews: 71, priceFrom: 3800, amenities: ["Mountain view", "Restaurant", "Wi-Fi", "Parking"] },
  { id: "h3", name: "Coffee Country Retreat", destination: "Coorg", image: coorgImg, starRating: 4, rooms: 18, bookings: 63, rating: 4.7, reviews: 48, priceFrom: 4200, amenities: ["Plantation view", "Bonfire", "Restaurant", "Wi-Fi"] },
  { id: "h4", name: "Dal Lake Houseboat Suites", destination: "Kashmir", image: kashmirImg, starRating: 5, rooms: 12, bookings: 71, rating: 4.9, reviews: 58, priceFrom: 7200, amenities: ["Lakefront", "All meals", "Shikara", "Heating"] },
  { id: "h5", name: "Mountain Escape Manali", destination: "Manali", image: manaliImg, starRating: 3, rooms: 22, bookings: 45, rating: 4.4, reviews: 29, priceFrom: 2800, amenities: ["Mountain view", "Cafe", "Wi-Fi"] },
];

export interface Booking {
  id: string;
  kind: "package" | "hotel";
  itemId: string;
  itemName: string;
  customer: string;
  date: string;
  guests: number;
  amount: number;
  status: BookingStatus;
}

export const bookings: Booking[] = [
  { id: "BKG-2001", kind: "package", itemId: "goa-1", itemName: "Goa Beach Bliss", customer: "Rahul Sharma", date: "2026-07-12", guests: 3, amount: 35997, status: "confirmed" },
  { id: "BKG-2002", kind: "package", itemId: "kashmir-1", itemName: "Kashmir Paradise Tour", customer: "Priya Nair", date: "2026-07-18", guests: 2, amount: 49998, status: "pending" },
  { id: "BKG-2003", kind: "package", itemId: "ooty-1", itemName: "Ooty Heritage Explorer", customer: "Amit Patel", date: "2026-06-30", guests: 4, amount: 35996, status: "completed" },
  { id: "BKG-2004", kind: "package", itemId: "manali-1", itemName: "Manali Snow Adventure", customer: "Sneha Reddy", date: "2026-07-22", guests: 2, amount: 27998, status: "confirmed" },
  { id: "BKG-2005", kind: "package", itemId: "coorg-1", itemName: "Coorg Coffee Trail", customer: "Vikram Singh", date: "2026-07-05", guests: 5, amount: 47495, status: "cancelled" },
  { id: "BKG-2006", kind: "hotel", itemId: "h1", itemName: "Ocean View Resort", customer: "Neha Gupta", date: "2026-07-14", guests: 2, amount: 26000, status: "confirmed" },
  { id: "BKG-2007", kind: "hotel", itemId: "h4", itemName: "Dal Lake Houseboat Suites", customer: "Arjun Menon", date: "2026-07-20", guests: 4, amount: 43200, status: "pending" },
  { id: "BKG-2008", kind: "hotel", itemId: "h2", itemName: "Hotel Paradise", customer: "Kavita Iyer", date: "2026-06-28", guests: 2, amount: 11400, status: "completed" },
  { id: "BKG-2009", kind: "hotel", itemId: "h3", itemName: "Coffee Country Retreat", customer: "Rohan Das", date: "2026-07-16", guests: 3, amount: 18900, status: "confirmed" },
  { id: "BKG-2010", kind: "hotel", itemId: "h5", itemName: "Mountain Escape Manali", customer: "Divya Rao", date: "2026-07-01", guests: 2, amount: 8400, status: "completed" },
];

export interface Review {
  id: string;
  kind: "package" | "hotel";
  itemId: string;
  itemName: string;
  customer: string;
  rating: number;
  comment: string;
  date: string;
}

export const reviews: Review[] = [
  { id: "r1", kind: "package", itemId: "goa-1", itemName: "Goa Beach Bliss", customer: "Rahul Sharma", rating: 5, comment: "Absolutely loved the beach parties and the resort was top-notch. Guides were friendly and everything ran on time.", date: "2026-06-24" },
  { id: "r2", kind: "package", itemId: "ooty-1", itemName: "Ooty Heritage Explorer", customer: "Amit Patel", rating: 4, comment: "Beautiful stay in the hills. Tea factory tour was the highlight. Breakfast could be improved.", date: "2026-06-19" },
  { id: "r3", kind: "package", itemId: "kashmir-1", itemName: "Kashmir Paradise Tour", customer: "Meera Joshi", rating: 5, comment: "Houseboat + Gulmarg gondola combo was magical. Worth every rupee.", date: "2026-06-15" },
  { id: "r4", kind: "hotel", itemId: "h1", itemName: "Ocean View Resort", customer: "Neha Gupta", rating: 5, comment: "Rooms opening to the beach, incredible breakfast spread. Will come back.", date: "2026-06-22" },
  { id: "r5", kind: "hotel", itemId: "h4", itemName: "Dal Lake Houseboat Suites", customer: "Arjun Menon", rating: 5, comment: "Waking up on Dal Lake is unbeatable. Hosts were warm and attentive.", date: "2026-06-18" },
  { id: "r6", kind: "hotel", itemId: "h2", itemName: "Hotel Paradise", customer: "Kavita Iyer", rating: 4, comment: "Great mountain views, cozy rooms. Wi-Fi patchy in the evenings.", date: "2026-06-10" },
];

export const monthlyRevenue = [
  { month: "Jan", revenue: 84000, bookings: 18 },
  { month: "Feb", revenue: 96000, bookings: 22 },
  { month: "Mar", revenue: 132000, bookings: 29 },
  { month: "Apr", revenue: 118000, bookings: 26 },
  { month: "May", revenue: 154000, bookings: 34 },
  { month: "Jun", revenue: 189000, bookings: 41 },
  { month: "Jul", revenue: 212000, bookings: 47 },
];
