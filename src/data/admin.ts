// Admin platform data — mock layer for the Admin Dashboard.
// Kept UI-free so it can be replaced with real API calls later.

import goaImg from "@/assets/goa.jpg";
import ootyImg from "@/assets/ooty.jpg";
import coorgImg from "@/assets/coorg.jpg";
import kashmirImg from "@/assets/kashmir.jpg";
import manaliImg from "@/assets/manali.jpg";
import rajasthanImg from "@/assets/rajasthan.jpg";

export type EntityStatus = "active" | "inactive" | "pending";

export interface AdminDestination {
  id: string;
  name: string;
  state: string;
  country: string;
  image: string;
  packages: number;
  hotels: number;
  rating: number;
  status: EntityStatus;
  popular: boolean;
  createdAt: string;
}

export const adminDestinations: AdminDestination[] = [
  { id: "d1", name: "Goa", state: "Goa", country: "India", image: goaImg, packages: 24, hotels: 68, rating: 4.7, status: "active", popular: true, createdAt: "2024-11-02" },
  { id: "d2", name: "Munnar", state: "Kerala", country: "India", image: coorgImg, packages: 18, hotels: 42, rating: 4.6, status: "active", popular: true, createdAt: "2024-12-15" },
  { id: "d3", name: "Araku Valley", state: "Andhra Pradesh", country: "India", image: manaliImg, packages: 9, hotels: 14, rating: 4.4, status: "active", popular: false, createdAt: "2025-02-10" },
  { id: "d4", name: "Ooty", state: "Tamil Nadu", country: "India", image: ootyImg, packages: 21, hotels: 55, rating: 4.5, status: "active", popular: true, createdAt: "2024-10-05" },
  { id: "d5", name: "Kashmir", state: "J&K", country: "India", image: kashmirImg, packages: 16, hotels: 38, rating: 4.8, status: "active", popular: true, createdAt: "2025-01-22" },
  { id: "d6", name: "Manali", state: "Himachal Pradesh", country: "India", image: manaliImg, packages: 19, hotels: 47, rating: 4.6, status: "active", popular: false, createdAt: "2025-03-11" },
  { id: "d7", name: "Rajasthan", state: "Rajasthan", country: "India", image: rajasthanImg, packages: 22, hotels: 51, rating: 4.7, status: "active", popular: true, createdAt: "2024-09-18" },
  { id: "d8", name: "Coorg", state: "Karnataka", country: "India", image: coorgImg, packages: 12, hotels: 26, rating: 4.5, status: "inactive", popular: false, createdAt: "2025-04-02" },
];

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "traveler" | "creator" | "admin";
  joined: string;
  status: "active" | "suspended";
  avatar?: string;
}

export const adminUsers: AdminUser[] = [
  { id: "u1", name: "Priya Sharma", email: "priya.sharma@gmail.com", role: "traveler", joined: "2025-06-12", status: "active" },
  { id: "u2", name: "Rahul Verma", email: "rahul.v@outlook.com", role: "traveler", joined: "2025-05-30", status: "active" },
  { id: "u3", name: "Wanderlust Travels", email: "hello@wanderlust.in", role: "creator", joined: "2024-11-04", status: "active" },
  { id: "u4", name: "Aditya Nair", email: "aditya.nair@gmail.com", role: "traveler", joined: "2025-07-01", status: "suspended" },
  { id: "u5", name: "Meera Iyer", email: "meera.iyer@yahoo.com", role: "traveler", joined: "2025-06-24", status: "active" },
  { id: "u6", name: "Kavya Reddy", email: "kavya.reddy@gmail.com", role: "admin", joined: "2024-08-15", status: "active" },
  { id: "u7", name: "Southern Sojourns", email: "team@southernsojourns.in", role: "creator", joined: "2025-01-19", status: "active" },
  { id: "u8", name: "Arjun Menon", email: "arjun.m@gmail.com", role: "traveler", joined: "2025-04-08", status: "active" },
];

export interface AdminBus {
  id: string; // backend Bus.id (UUID)
  busno: string; // renamed from busNumber — this is the backend's real unique identifier
  operator: string | null; // not in backend yet — frontend-only, stays null until V2
  source: string;
  destination: string;
  busType: string; // required by backend — was missing from this type entirely before
  date: string; // ISO date — required by backend (one Bus row = one dated departure), was missing before
  departure: string; // maps to backend's `time`
  arrival?: string; // maps to backend's `arrivalTime` (optional)
  arrivalDate?: string; // maps to backend's `arrivalDate` — only for overnight trips
  price: number; // required by backend, was missing from this type entirely before
  seats?: number; // not in backend — frontend-only, never sent on create/edit
  driverId?: string; // derived client-side (driver.bus.id === this bus's id) — Bus itself has no driver FK; Driver has the FK to Bus
  status: "active" | "maintenance" | "inactive"; // NOT persisted anywhere in the backend — cosmetic only, always "active" for real data
}

export const adminBuses: AdminBus[] = [
  { id: "b1", busno: "AP09AB1234", operator: "APSRTC", source: "Hyderabad", destination: "Vizag", busType: "AC Sleeper", date: "2026-07-10", departure: "21:30", arrival: "06:15", price: 1250, seats: 36, driverId: "dr1", status: "active" },
  { id: "b2", busno: "TS07CD5567", operator: "TSRTC", source: "Hyderabad", destination: "Vijayawada", busType: "Non-AC Seater", date: "2026-07-10", departure: "22:00", arrival: "05:30", price: 700, seats: 40, driverId: "dr2", status: "active" },
  { id: "b3", busno: "KA05OT7788", operator: "Orange Travels", source: "Bangalore", destination: "Hyderabad", busType: "AC Sleeper", date: "2026-07-11", departure: "20:15", arrival: "05:45", price: 1450, seats: 32, driverId: "dr3", status: "active" },
  { id: "b4", busno: "KA01VR9911", operator: "VRL Travels", source: "Bangalore", destination: "Goa", busType: "AC Sleeper", date: "2026-07-12", departure: "19:30", arrival: "07:15", price: 1600, seats: 36, status: "maintenance" },
  { id: "b5", busno: "TN22SR4422", operator: "SRS Travels", source: "Chennai", destination: "Bangalore", busType: "AC Sleeper", date: "2026-07-11", departure: "23:00", arrival: "05:30", price: 650, seats: 44, driverId: "dr4", status: "active" },
  { id: "b6", busno: "KA02KS3311", operator: "KSRTC", source: "Bangalore", destination: "Mysore", busType: "Non-AC Seater", date: "2026-07-09", departure: "07:00", arrival: "10:15", price: 320, seats: 40, status: "inactive" },
];

export interface AdminDriver {
  id: string;
  name: string;
  email: string; // required + unique in backend — was missing from this type entirely before
  age: number; // required by backend, was missing before
  license?: string; // not in backend — frontend-only
  experience?: number; // years — not in backend — frontend-only
  assignedBusId?: string; // derived client-side from this driver's `bus` relation
  status: "on-duty" | "off-duty" | "leave"; // not persisted in backend — cosmetic only
  phone: string; // backend stores as a plain numeric `long` — display format here, service layer strips non-digits before sending
}

export const adminDrivers: AdminDriver[] = [
  { id: "dr1", name: "Ramesh Naidu", email: "ramesh.naidu@example.com", age: 38, license: "DL-AP0920140012", experience: 12, assignedBusId: "b1", status: "on-duty", phone: "+91 98480 12345" },
  { id: "dr2", name: "Suresh Kumar", email: "suresh.kumar@example.com", age: 34, license: "DL-TS0720170448", experience: 8, assignedBusId: "b2", status: "on-duty", phone: "+91 90101 66721" },
  { id: "dr3", name: "Jagadeesh Reddy", email: "jagadeesh.reddy@example.com", age: 41, license: "DL-KA0520120992", experience: 15, assignedBusId: "b3", status: "on-duty", phone: "+91 99880 47712" },
  { id: "dr4", name: "Karthik Iyer", email: "karthik.iyer@example.com", age: 29, license: "DL-TN2220180221", experience: 6, assignedBusId: "b5", status: "on-duty", phone: "+91 94440 88123" },
  { id: "dr5", name: "Manoj Pillai", email: "manoj.pillai@example.com", age: 27, license: "DL-KL0720190770", experience: 4, status: "off-duty", phone: "+91 97460 33212" },
  { id: "dr6", name: "Vikram Singh", email: "vikram.singh@example.com", age: 45, license: "DL-RJ1420100034", experience: 18, status: "leave", phone: "+91 90010 42881" },
];

export interface AdminBusBooking {
  id: string;
  busNumber: string;
  operator: string;
  passenger: string;
  seats: string[];
  journeyDate: string;
  status: "upcoming" | "completed" | "cancelled";
  amount: number;
}

export const adminBusBookings: AdminBusBooking[] = [
  { id: "BB-1042", busNumber: "AP09AB1234", operator: "APSRTC", passenger: "Priya Sharma", seats: ["A3", "A4"], journeyDate: "2026-07-12", status: "upcoming", amount: 2500 },
  { id: "BB-1041", busNumber: "TS07CD5567", operator: "TSRTC", passenger: "Rahul Verma", seats: ["B2"], journeyDate: "2026-07-10", status: "upcoming", amount: 950 },
  { id: "BB-1039", busNumber: "KA05OT7788", operator: "Orange Travels", passenger: "Aditya Nair", seats: ["D1", "D2"], journeyDate: "2026-07-04", status: "completed", amount: 2900 },
  { id: "BB-1035", busNumber: "TN22SR4422", operator: "SRS Travels", passenger: "Meera Iyer", seats: ["C1"], journeyDate: "2026-06-30", status: "completed", amount: 650 },
  { id: "BB-1030", busNumber: "AP09AB1234", operator: "APSRTC", passenger: "Arjun Menon", seats: ["E4"], journeyDate: "2026-06-22", status: "cancelled", amount: 1250 },
];

export interface AdminReport {
  id: string;
  type: "review" | "user" | "content";
  target: string;
  reason: string;
  reportedBy: string;
  reportedAt: string;
  status: "pending" | "resolved" | "hidden";
}

export const adminReports: AdminReport[] = [
  { id: "r1", type: "review", target: "Review on Ocean View Resort", reason: "Spam / fake review", reportedBy: "Priya Sharma", reportedAt: "2026-07-05", status: "pending" },
  { id: "r2", type: "user", target: "@aditya_travels", reason: "Abusive messages in Troop chat", reportedBy: "Meera Iyer", reportedAt: "2026-07-04", status: "pending" },
  { id: "r3", type: "review", target: "Review on Mountain Escape Manali", reason: "Offensive language", reportedBy: "Rahul Verma", reportedAt: "2026-07-02", status: "hidden" },
  { id: "r4", type: "content", target: "Goa Package listing image", reason: "Copyrighted image", reportedBy: "System scan", reportedAt: "2026-06-30", status: "resolved" },
  { id: "r5", type: "review", target: "Review on Coffee Country Retreat", reason: "Not related to stay", reportedBy: "Arjun Menon", reportedAt: "2026-06-28", status: "pending" },
];

export interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  lastUpdated: string;
}

export const notificationTemplates: NotificationTemplate[] = [
  {
    id: "welcome",
    name: "Welcome Email",
    subject: "Welcome to Sanchari, {{name}}!",
    body: "Hi {{name}},\n\nWelcome aboard Sanchari — your new home for handpicked travel across India.\n\nStart exploring curated destinations, book buses in seconds, and join Troops of like-minded travellers.\n\nHappy journeys,\nTeam Sanchari",
    lastUpdated: "2026-06-10",
  },
  {
    id: "booking-confirm",
    name: "Booking Confirmation",
    subject: "Your booking {{bookingId}} is confirmed",
    body: "Hi {{name}},\n\nYour booking for {{itemName}} on {{date}} is confirmed.\n\nBooking ID: {{bookingId}}\nAmount: ₹{{amount}}\n\nWe can't wait to be part of your trip.\n\nTeam Sanchari",
    lastUpdated: "2026-06-18",
  },
  {
    id: "booking-cancel",
    name: "Booking Cancellation",
    subject: "Booking {{bookingId}} cancelled",
    body: "Hi {{name}},\n\nYour booking {{bookingId}} has been cancelled. Any eligible refund will reach you in 5–7 working days.\n\nTeam Sanchari",
    lastUpdated: "2026-05-22",
  },
  {
    id: "password-reset",
    name: "Password Reset",
    subject: "Reset your Sanchari password",
    body: "Hi {{name}},\n\nUse the link below to reset your password. It expires in 30 minutes.\n\n{{resetLink}}\n\nIf you didn't request this, please ignore.\n\nTeam Sanchari",
    lastUpdated: "2026-04-01",
  },
  {
    id: "reminder",
    name: "Trip Reminder",
    subject: "Your trip to {{destination}} starts in 2 days",
    body: "Hi {{name}},\n\nJust a friendly nudge — your journey to {{destination}} begins on {{date}}.\n\nWe've packed a checklist and local tips inside the app.\n\nSafe travels,\nTeam Sanchari",
    lastUpdated: "2026-06-25",
  },
];

// Aggregated analytics
export const platformKpis = {
  totalUsers: 12480,
  totalDestinations: adminDestinations.length,
  totalOperators: 14,
  totalBuses: adminBuses.length,
  todaysBookings: 218,
  platformRevenue: 4820000, // INR
  pendingReports: adminReports.filter((r) => r.status === "pending").length,
  pendingApprovals: 6,
};

export const monthlyStats = [
  { month: "Jan", users: 620, bookings: 1420, revenue: 320000 },
  { month: "Feb", users: 780, bookings: 1680, revenue: 386000 },
  { month: "Mar", users: 940, bookings: 1980, revenue: 442000 },
  { month: "Apr", users: 1120, bookings: 2210, revenue: 498000 },
  { month: "May", users: 1380, bookings: 2540, revenue: 561000 },
  { month: "Jun", users: 1610, bookings: 2830, revenue: 624000 },
  { month: "Jul", users: 1720, bookings: 3010, revenue: 682000 },
];

export const topDestinations = [
  { name: "Goa", bookings: 1240 },
  { name: "Kashmir", bookings: 980 },
  { name: "Manali", bookings: 870 },
  { name: "Ooty", bookings: 760 },
  { name: "Rajasthan", bookings: 690 },
];

export const busOccupancy = [
  { operator: "APSRTC", occupancy: 82 },
  { operator: "TSRTC", occupancy: 74 },
  { operator: "Orange", occupancy: 91 },
  { operator: "VRL", occupancy: 68 },
  { operator: "SRS", occupancy: 79 },
  { operator: "KSRTC", occupancy: 71 },
];

export const bookingDistribution = [
  { name: "Bus", value: 46 },
  { name: "Package", value: 28 },
  { name: "Hotel", value: 18 },
  { name: "Ride Share", value: 8 },
];

export const recentActivities = [
  { id: 1, text: "New destination 'Andaman Islands' proposed by admin Kavya", time: "10 min ago", type: "destination" },
  { id: 2, text: "Bus KA01VR9911 flagged for maintenance", time: "42 min ago", type: "bus" },
  { id: 3, text: "Review on Ocean View Resort reported as spam", time: "1 hr ago", type: "moderation" },
  { id: 4, text: "New creator 'Southern Sojourns' onboarded", time: "3 hr ago", type: "user" },
  { id: 5, text: "218 bookings processed today", time: "6 hr ago", type: "booking" },
];
