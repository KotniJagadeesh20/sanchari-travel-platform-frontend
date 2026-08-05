// Mock data for the Transportation module.
// Keep this file free of UI concerns — services in `src/services/*` read from
// here today but can be swapped for REST calls without touching components.

export type BookingStatus = "upcoming" | "completed" | "cancelled";
export type SeatStatus = "available" | "booked" | "selected";

export interface Bus {
  id: string;
  busno: string; // real backend unique identifier (bus-booking-service Bus.busno)
  date: string; // ISO date — backend Bus is a single dated departure, not a recurring route template
  operator: string | null; // not in backend yet — stays null until Partner/V2 model adds it
  busName: string;
  busType: string; // "AC Sleeper" | "Non-AC Seater" ...
  source: string;
  destination: string;
  departure: string; // "22:30"
  arrival: string; // "06:15" — maps to backend's arrivalTime (+ optional arrivalDate for overnight trips)
  duration: string; // "7h 45m" — always computed client-side from departure/arrival, never sent to or stored in backend
  totalSeats: number; // not in backend yet — frontend-only until seat model exists
  bookedSeats: string[]; // seat labels e.g. "A1" — not in backend yet
  pricePerSeat: number; // maps from backend's flat `price` field for now
  rating: number | null; // not in backend yet — stays null until added
  amenities: string[]; // not in backend yet — frontend-only
}

export interface BusBooking {
  id: string;
  busId: string;
  operator: string | null;
  busName: string;
  source: string;
  destination: string;
  date: string; // ISO date
  passengerName: string;
  passengerEmail: string;
  passengerPhone: string;
  passengerAge: number;
  totalAmount: number; // = bus's flat price — backend has no per-seat pricing or fees
  status: BookingStatus;
  bookedAt: string;
}

export type RideStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type RideBookingStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export interface Ride {
  id: string;
  createdBy: {
    // Renamed from "driver" — there's no ROLE_DRIVER, any authenticated user
    // can post a ride and become the driver for it while booking other
    // people's rides as a passenger elsewhere.
    id: string;
    name: string; // maps to backend's driverName (synced from auth-service's UserAdmin.name on ride creation)
    email: string; // maps to backend's driverEmail
  };
  vehicle: {
    type: string; // "Sedan" | "SUV" | "Hatchback" — maps to backend vehicleType
    number: string; // "TS09AB1234" — maps to backend vehicleNumber
    // "model" (e.g. "Toyota Innova") dropped — no backend field for it;
    // fold into `type` as free text if you want it displayed for now.
  };
  source: string;
  destination: string;
  pickupPoint?: string; // now backed by Ride.pickupPoint — optional/nullable, may be absent
  dropPoint?: string; // now backed by Ride.dropPoint — optional/nullable, may be absent
  date: string; // ISO date — maps to backend's travelDate
  departureTime: string;
  totalSeats: number;
  seatsLeft: number; // maps to backend's availableSeats
  pricePerSeat: number;
  status: RideStatus; // maps to backend's RideStatus — only SCHEDULED rides are bookable/searchable
  description?: string; // not in backend yet — frontend-only
  reviews: { user: string; rating: number; comment: string }[]; // not in backend yet — no review system exists, keep empty until built
}

/**
 * A booking a passenger made on someone else's ride. Matches backend's
 * RideBookingResponse exactly. This is intentionally a separate type from
 * "a ride I posted as driver" (see Ride above + rideService.getMyRidesAsDriver) —
 * they're different backend endpoints with different status enums, and
 * conflating them into one "RideBooking" type (as this used to be) doesn't
 * match either shape and hides the driver-side approve/reject workflow.
 */
export interface RideBookingRecord {
  id: string;
  rideId: string;
  rideSource: string;
  rideDestination: string;
  passengerId: string;
  passengerName: string;
  passengerEmail: string;
  seatsBooked: number;
  totalAmount: number;
  status: RideBookingStatus;
  bookingTime: string; // ISO datetime
}

export const mockBuses: Bus[] = [
  {
    id: "bus-1",
    busno: "AP09AB1234",
    date: "2026-07-10",
    operator: "APSRTC",
    busName: "Garuda Plus",
    busType: "AC Sleeper",
    source: "Hyderabad",
    destination: "Vizag",
    departure: "21:30",
    arrival: "06:15",
    duration: "8h 45m",
    totalSeats: 36,
    bookedSeats: ["A1", "A4", "B2", "C5", "D3", "E1"],
    pricePerSeat: 1250,
    rating: 4.5,
    amenities: ["Charging Point", "Blanket", "Water Bottle", "GPS Tracking"],
  },
  {
    id: "bus-2",
    busno: "TS07CD5567",
    date: "2026-07-10",
    operator: "TSRTC",
    busName: "Rajdhani Express",
    busType: "AC Semi-Sleeper",
    source: "Hyderabad",
    destination: "Vizag",
    departure: "22:00",
    arrival: "07:00",
    duration: "9h 00m",
    totalSeats: 40,
    bookedSeats: ["A2", "B3", "B4", "C1"],
    pricePerSeat: 950,
    rating: 4.2,
    amenities: ["Charging Point", "Reading Light", "Water Bottle"],
  },
  {
    id: "bus-3",
    busno: "KA05OT7788",
    date: "2026-07-11",
    operator: "Orange Travels",
    busName: "Volvo Multi-Axle",
    busType: "AC Sleeper",
    source: "Bangalore",
    destination: "Hyderabad",
    departure: "20:15",
    arrival: "05:45",
    duration: "9h 30m",
    totalSeats: 32,
    bookedSeats: ["A1", "A2", "B5", "C3", "D1", "D2", "E4"],
    pricePerSeat: 1450,
    rating: 4.7,
    amenities: ["Charging Point", "Blanket", "Snacks", "Wi-Fi", "GPS Tracking"],
  },
  {
    id: "bus-4",
    busno: "KA01VR9911",
    date: "2026-07-12",
    operator: "VRL Travels",
    busName: "Scania Sleeper",
    busType: "AC Sleeper",
    source: "Bangalore",
    destination: "Goa",
    departure: "19:30",
    arrival: "07:15",
    duration: "11h 45m",
    totalSeats: 36,
    bookedSeats: ["B1", "B2", "C4"],
    pricePerSeat: 1650,
    rating: 4.6,
    amenities: ["Charging Point", "Blanket", "Water Bottle", "Wi-Fi"],
  },
  {
    id: "bus-5",
    busno: "TN22SR4422",
    date: "2026-07-11",
    operator: "SRS Travels",
    busName: "Express Deluxe",
    busType: "Non-AC Seater",
    source: "Chennai",
    destination: "Bangalore",
    departure: "23:00",
    arrival: "05:30",
    duration: "6h 30m",
    totalSeats: 44,
    bookedSeats: ["A3", "B1", "C2", "D4"],
    pricePerSeat: 650,
    rating: 4.0,
    amenities: ["Reading Light", "Water Bottle"],
  },
  {
    id: "bus-6",
    busno: "KA02KS3311",
    date: "2026-07-09",
    operator: "KSRTC",
    busName: "Airavat Club Class",
    busType: "AC Semi-Sleeper",
    source: "Bangalore",
    destination: "Mysore",
    departure: "07:00",
    arrival: "10:15",
    duration: "3h 15m",
    totalSeats: 40,
    bookedSeats: ["A1", "A2", "A3"],
    pricePerSeat: 550,
    rating: 4.4,
    amenities: ["Charging Point", "Water Bottle", "GPS Tracking"],
  },
];

export const mockRides: Ride[] = [
  {
    id: "ride-1",
    createdBy: { id: "d1", name: "Jagadeesh Reddy", email: "jagadeesh.r@example.com" },
    vehicle: { type: "SUV", number: "TS09AB1234" },
    source: "Hyderabad",
    destination: "Vijayawada",
    pickupPoint: "LB Nagar Metro",
    dropPoint: "Benz Circle",
    date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    departureTime: "06:30",
    totalSeats: 6,
    seatsLeft: 3,
    pricePerSeat: 850,
    status: "SCHEDULED",
    description:
      "Comfortable AC Innova, non-stop drive with a short breakfast halt. Music on request, no smoking.",
    reviews: [
      { user: "Priya S.", rating: 5, comment: "Very safe driver, on time." },
      { user: "Kiran M.", rating: 4, comment: "Smooth ride, clean vehicle." },
    ],
  },
  {
    id: "ride-2",
    createdBy: { id: "d2", name: "Anitha K.", email: "anitha.k@example.com" },
    vehicle: { type: "Sedan", number: "KA05CX4421" },
    source: "Bangalore",
    destination: "Mysore",
    pickupPoint: "Silk Board",
    dropPoint: "Mysore Palace",
    date: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10),
    departureTime: "07:15",
    totalSeats: 4,
    seatsLeft: 2,
    pricePerSeat: 450,
    status: "SCHEDULED",
    description: "Weekend Mysore run. Ladies + families preferred.",
    reviews: [
      { user: "Sneha R.", rating: 5, comment: "Amazing driver, felt very safe." },
    ],
  },
  {
    id: "ride-3",
    createdBy: { id: "d3", name: "Ramesh Naidu", email: "ramesh.n@example.com" },
    vehicle: { type: "SUV", number: "AP16TR7788" },
    source: "Vizag",
    destination: "Araku Valley",
    pickupPoint: "RTC Complex",
    dropPoint: "Araku Bus Stand",
    date: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
    departureTime: "05:45",
    totalSeats: 6,
    seatsLeft: 4,
    pricePerSeat: 700,
    status: "SCHEDULED",
    description: "Scenic Araku ghat road drive. Photo stops included.",
    reviews: [
      { user: "Vikram J.", rating: 4, comment: "Great drive, good stops." },
      { user: "Meera L.", rating: 5, comment: "Loved the view halts!" },
    ],
  },
  {
    id: "ride-4",
    createdBy: { id: "d4", name: "Suresh P.", email: "suresh.p@example.com" },
    vehicle: { type: "Hatchback", number: "TN22BJ9911" },
    source: "Chennai",
    destination: "Pondicherry",
    pickupPoint: "OMR Toll",
    dropPoint: "White Town",
    date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    departureTime: "08:00",
    totalSeats: 4,
    seatsLeft: 1,
    pricePerSeat: 550,
    status: "SCHEDULED",
    description: "ECR coastal drive with beach stops.",
    reviews: [{ user: "Arjun T.", rating: 4, comment: "Chill vibes, good music." }],
  },
];

export const popularCities = [
  "Hyderabad",
  "Bangalore",
  "Chennai",
  "Vizag",
  "Vijayawada",
  "Mysore",
  "Pondicherry",
  "Goa",
  "Mumbai",
  "Pune",
];
