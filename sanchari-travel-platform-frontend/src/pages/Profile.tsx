import { useState } from "react";
import { motion } from "framer-motion";
import {
  User, Mail, Phone, MapPin, Calendar, Heart, Package, Users, Camera, Edit2, Globe,
  Bus, Hotel, Car, Sparkles, Wallet, Clock, CheckCircle2, XCircle, PlayCircle,
  MessageSquare, Plus, ChevronRight, Compass, Route, Map, Star, TrendingUp, Bookmark
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ---------------- MOCK DATA ---------------- */

const overviewStats = [
  { label: "Total Bookings", value: 14, icon: Bookmark, tone: "from-primary/15 to-primary/5 text-primary" },
  { label: "Planned Trips", value: 3, icon: Route, tone: "from-orange-500/15 to-orange-500/5 text-orange-500" },
  { label: "Wishlist Items", value: 8, icon: Heart, tone: "from-rose-500/15 to-rose-500/5 text-rose-500" },
  { label: "Reviews Written", value: 15, icon: Star, tone: "from-amber-500/15 to-amber-500/5 text-amber-500" },
];

type BookingType = "Bus" | "Hotel" | "Package" | "Ride";
type BookingStatus = "Upcoming" | "Ongoing" | "Completed" | "Cancelled";

const bookings: {
  id: number; type: BookingType; title: string; subtitle: string; meta: string;
  date: string; status: BookingStatus;
}[] = [
  { id: 1, type: "Bus", title: "APSRTC · Garuda Plus", subtitle: "Hyderabad → Goa", meta: "Seat A4 · Boarding 9:30 PM", date: "18 Jul 2026", status: "Upcoming" },
  { id: 2, type: "Hotel", title: "Hotel Paradise", subtitle: "Deluxe Sea View · 3 Nights", meta: "Check-in Tomorrow, 2:00 PM", date: "20 Jul 2026", status: "Upcoming" },
  { id: 3, type: "Package", title: "Goa Beach Escape", subtitle: "5 Days · 4 Nights", meta: "4 Travelers · All Inclusive", date: "20 – 25 Jul 2026", status: "Upcoming" },
  { id: 4, type: "Ride", title: "Airport → Hotel Paradise", subtitle: "Sedan · Rahul Verma", meta: "12 km · ETA 25 min", date: "20 Jul 2026", status: "Upcoming" },
  { id: 5, type: "Hotel", title: "Backwater Retreat", subtitle: "Houseboat · 2 Nights", meta: "Kumarakom, Kerala", date: "12 – 14 Mar 2026", status: "Completed" },
  { id: 6, type: "Bus", title: "KSRTC · Airavat", subtitle: "Bangalore → Ooty", meta: "Seat B2 · Sleeper", date: "01 Oct 2025", status: "Completed" },
  { id: 7, type: "Ride", title: "City Tour Cab", subtitle: "Hatchback · Meera S.", meta: "Cancelled by driver", date: "22 Sep 2025", status: "Cancelled" },
];

const bookingMeta: Record<BookingType, { icon: any; tint: string; ring: string }> = {
  Bus: { icon: Bus, tint: "bg-sky-500/10 text-sky-500", ring: "ring-sky-500/20" },
  Hotel: { icon: Hotel, tint: "bg-violet-500/10 text-violet-500", ring: "ring-violet-500/20" },
  Package: { icon: Package, tint: "bg-primary/10 text-primary", ring: "ring-primary/20" },
  Ride: { icon: Car, tint: "bg-emerald-500/10 text-emerald-500", ring: "ring-emerald-500/20" },
};

const statusStyle: Record<BookingStatus, string> = {
  Upcoming: "bg-primary/10 text-primary border-primary/20",
  Ongoing: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

const trips = [
  {
    id: 1, name: "Goa Adventure", dates: "20 Jul – 25 Jul 2026", status: "Planning",
    budget: 25000, spent: 16400, travelers: 4,
    cover: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800",
    destination: "Goa, India",
    progress: 65,
    parts: { transport: 2, hotels: 1, packages: 1, expenses: 4 },
  },
  {
    id: 2, name: "Kashmir Valley", dates: "05 – 12 Jan 2027", status: "Planning",
    budget: 48000, spent: 12000, travelers: 2,
    cover: "https://images.unsplash.com/photo-1597074866923-dc0589150458?w=800",
    destination: "Srinagar, J&K",
    progress: 25,
    parts: { transport: 1, hotels: 0, packages: 1, expenses: 1 },
  },
  {
    id: 3, name: "Kerala Escape", dates: "12 – 18 Mar 2026", status: "Completed",
    budget: 32000, spent: 30250, travelers: 2,
    cover: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800",
    destination: "Alleppey, Kerala",
    progress: 100,
    parts: { transport: 2, hotels: 2, packages: 1, expenses: 8 },
  },
];

const wishlistData = {
  Destinations: [
    { id: 1, name: "Manali, Himachal", meta: "Mountains · Snow", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600" },
    { id: 2, name: "Andaman Islands", meta: "Beach · Diving", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600" },
  ],
  Hotels: [
    { id: 3, name: "Taj Lake Palace", meta: "Udaipur · ₹28,000/night", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600" },
  ],
  Packages: [
    { id: 4, name: "Rajasthan Heritage", meta: "7 Days · ₹18,999", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600" },
    { id: 5, name: "Kerala Backwaters", meta: "5 Days · ₹12,499", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600" },
  ],
  Experiences: [
    { id: 6, name: "Hot Air Balloon", meta: "Jaipur · Sunrise", image: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=600" },
    { id: 7, name: "Scuba Diving", meta: "Havelock Island", image: "https://images.unsplash.com/photo-1560275619-4662e36fa65c?w=600" },
  ],
};

const recentActivity = [
  { id: 1, icon: Bus, text: "Booked bus APSRTC Hyderabad → Goa", time: "2h ago", tint: "bg-sky-500/10 text-sky-500" },
  { id: 2, icon: Hotel, text: "Booked Hotel Paradise, Goa", time: "5h ago", tint: "bg-violet-500/10 text-violet-500" },
  { id: 3, icon: Users, text: "Joined Troop 'Goa Beach Bums'", time: "1d ago", tint: "bg-primary/10 text-primary" },
  { id: 4, icon: Heart, text: "Added Manali to your wishlist", time: "3d ago", tint: "bg-rose-500/10 text-rose-500" },
  { id: 5, icon: MessageSquare, text: "Reviewed Backwater Retreat", time: "1w ago", tint: "bg-amber-500/10 text-amber-500" },
];

/* ---------------- COMPONENT ---------------- */

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [bookingTypeFilter, setBookingTypeFilter] = useState<"All" | BookingType>("All");
  const [bookingStatusFilter, setBookingStatusFilter] = useState<"All" | BookingStatus>("All");
  const [wishlistCat, setWishlistCat] = useState<keyof typeof wishlistData>("Destinations");
  const [openTripId, setOpenTripId] = useState<number | null>(null);

  const filteredBookings = bookings.filter(b =>
    (bookingTypeFilter === "All" || b.type === bookingTypeFilter) &&
    (bookingStatusFilter === "All" || b.status === bookingStatusFilter)
  );

  const upcomingHotel = bookings.find(b => b.type === "Hotel" && b.status === "Upcoming");
  const upcomingTrip = trips.find(t => t.status === "Planning");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Cover */}
      <div className="relative h-56 md:h-72 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600"
          alt="Travel banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/10" />
        <button className="absolute top-4 right-4 bg-background/70 backdrop-blur-md text-foreground rounded-lg px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 hover:bg-background transition">
          <Camera size={13} /> Change Cover
        </button>
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10 pb-20">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start md:items-end gap-5 mb-8"
        >
          <div className="relative">
            <div className="h-28 w-28 rounded-2xl border-4 border-background bg-gradient-hero flex items-center justify-center text-primary-foreground text-4xl font-bold shadow-xl">
              A
            </div>
            <button className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground p-1.5 rounded-lg shadow-md hover:opacity-90 transition-opacity">
              <Camera size={14} />
            </button>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Aarav Sharma</h1>
              <Badge className="bg-gradient-hero text-primary-foreground border-0 gap-1">
                <Sparkles size={11} /> Explorer
              </Badge>
            </div>
            <p className="text-muted-foreground flex items-center gap-1.5 mt-1 text-sm">
              <MapPin size={14} /> Bangalore, India · Traveler since 2023
            </p>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Compass size={12} className="text-primary" /> 12 cities</span>
              <span className="flex items-center gap-1"><Globe size={12} className="text-primary" /> 3 countries</span>
              <span className="flex items-center gap-1"><TrendingUp size={12} className="text-primary" /> Level 4</span>
            </div>
          </div>
          <Button variant="outline" onClick={() => setEditing(!editing)} className="gap-2">
            <Edit2 size={14} /> {editing ? "Cancel" : "Edit Profile"}
          </Button>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-muted/50 p-1 rounded-xl w-full md:w-auto overflow-x-auto flex md:inline-flex">
            {["overview", "bookings", "trips", "wishlist", "settings"].map(v => (
              <TabsTrigger
                key={v} value={v}
                className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm capitalize whitespace-nowrap"
              >
                {v === "overview" ? "Overview" : v === "bookings" ? "My Bookings" : v === "trips" ? "My Trips" : v === "wishlist" ? "Wishlist" : "Settings"}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ---------- OVERVIEW ---------- */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {overviewStats.map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className={`overflow-hidden bg-gradient-to-br ${s.tone} border-0`}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <s.icon size={22} />
                        <span className="text-3xl font-bold text-foreground">{s.value}</span>
                      </div>
                      <p className="text-xs font-medium text-foreground/70 mt-2">{s.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {/* Upcoming Booking */}
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-violet-500/10 to-primary/10 px-5 py-3 flex items-center justify-between border-b">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Upcoming Booking</span>
                  <Hotel size={16} className="text-violet-500" />
                </div>
                <CardContent className="p-5">
                  {upcomingHotel ? (
                    <>
                      <h3 className="font-display font-bold text-lg text-foreground">{upcomingHotel.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{upcomingHotel.subtitle}</p>
                      <div className="flex items-center gap-2 mt-4 text-sm">
                        <Clock size={14} className="text-primary" />
                        <span className="text-foreground font-medium">{upcomingHotel.meta}</span>
                      </div>
                      <Button variant="outline" size="sm" className="mt-4 gap-1.5">
                        View Details <ChevronRight size={14} />
                      </Button>
                    </>
                  ) : <p className="text-sm text-muted-foreground">No upcoming bookings</p>}
                </CardContent>
              </Card>

              {/* Upcoming Trip */}
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 px-5 py-3 flex items-center justify-between border-b">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Upcoming Trip</span>
                  <Route size={16} className="text-orange-500" />
                </div>
                <CardContent className="p-5">
                  {upcomingTrip ? (
                    <>
                      <h3 className="font-display font-bold text-lg text-foreground">{upcomingTrip.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{upcomingTrip.dates}</p>
                      <div className="mt-4 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Planning progress</span>
                          <span className="font-medium text-foreground">{upcomingTrip.progress}%</span>
                        </div>
                        <Progress value={upcomingTrip.progress} className="h-1.5" />
                      </div>
                      <Badge className="mt-4 bg-orange-500/10 text-orange-600 border-orange-500/20" variant="outline">
                        {upcomingTrip.status}
                      </Badge>
                    </>
                  ) : <p className="text-sm text-muted-foreground">No planned trips</p>}
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-semibold text-foreground">Recent Activity</h3>
                  <Button variant="ghost" size="sm" className="text-xs gap-1">View all <ChevronRight size={12} /></Button>
                </div>
                <div className="space-y-1">
                  {recentActivity.map((a) => (
                    <div key={a.id} className="flex items-center gap-3 py-2.5 border-b last:border-0">
                      <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${a.tint} shrink-0`}>
                        <a.icon size={15} />
                      </div>
                      <p className="text-sm text-foreground flex-1">{a.text}</p>
                      <span className="text-xs text-muted-foreground">{a.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---------- MY BOOKINGS ---------- */}
          <TabsContent value="bookings" className="space-y-5">
            <Card className="p-4">
              <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                <div className="flex gap-1.5 flex-wrap">
                  {(["All", "Bus", "Hotel", "Package", "Ride"] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setBookingTypeFilter(t)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        bookingTypeFilter === t
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-muted/60 text-muted-foreground hover:bg-muted"
                      }`}
                    >{t}</button>
                  ))}
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {(["All", "Upcoming", "Ongoing", "Completed", "Cancelled"] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => setBookingStatusFilter(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                        bookingStatusFilter === s
                          ? "border-primary text-primary bg-primary/5"
                          : "border-border text-muted-foreground hover:border-muted-foreground/40"
                      }`}
                    >{s}</button>
                  ))}
                </div>
              </div>
            </Card>

            <div className="grid gap-3">
              {filteredBookings.length === 0 ? (
                <Card className="p-12 text-center">
                  <div className="mx-auto h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mb-3">
                    <Bookmark size={22} className="text-muted-foreground" />
                  </div>
                  <p className="font-semibold text-foreground">No bookings found</p>
                  <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or explore services</p>
                </Card>
              ) : filteredBookings.map((b, i) => {
                const meta = bookingMeta[b.type];
                const StatusIcon = b.status === "Completed" ? CheckCircle2 : b.status === "Cancelled" ? XCircle : b.status === "Ongoing" ? PlayCircle : Clock;
                return (
                  <motion.div key={b.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                    <Card className={`overflow-hidden hover:shadow-md transition-shadow ring-1 ${meta.ring}`}>
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className={`h-14 w-14 rounded-xl flex items-center justify-center ${meta.tint} shrink-0`}>
                          <meta.icon size={22} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px] font-semibold uppercase tracking-wide">{b.type}</Badge>
                            <span className="text-xs text-muted-foreground">{b.date}</span>
                          </div>
                          <h3 className="font-display font-semibold text-foreground mt-1 truncate">{b.title}</h3>
                          <p className="text-sm text-muted-foreground truncate">{b.subtitle}</p>
                          <p className="text-xs text-foreground/70 mt-1 truncate">{b.meta}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <Badge variant="outline" className={`gap-1 ${statusStyle[b.status]}`}>
                            <StatusIcon size={11} /> {b.status}
                          </Badge>
                          <Button size="sm" variant="ghost" className="h-7 text-xs gap-1">
                            Details <ChevronRight size={12} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* ---------- MY TRIPS ---------- */}
          <TabsContent value="trips" className="space-y-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Your travel journeys — planned, ongoing, and completed.</p>
              <Button size="sm" className="bg-gradient-hero text-primary-foreground gap-1.5">
                <Plus size={14} /> New Trip
              </Button>
            </div>

            <div className="grid gap-5">
              {trips.map((t, i) => {
                const open = openTripId === t.id;
                return (
                  <motion.div key={t.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="flex flex-col md:flex-row">
                        <div className="relative md:w-64 h-40 md:h-auto overflow-hidden shrink-0">
                          <img src={t.cover} alt={t.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/50 to-transparent" />
                          <Badge className={`absolute top-3 left-3 border-0 ${
                            t.status === "Completed" ? "bg-emerald-500 text-white" :
                            t.status === "Ongoing" ? "bg-amber-500 text-white" :
                            "bg-primary text-primary-foreground"
                          }`}>
                            {t.status}
                          </Badge>
                        </div>
                        <div className="p-5 flex-1">
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div>
                              <h3 className="font-display font-bold text-xl text-foreground">{t.name}</h3>
                              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                <MapPin size={12} /> {t.destination}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">Budget</p>
                              <p className="font-bold text-foreground">₹{t.budget.toLocaleString()}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-3 mt-4">
                            <div className="text-center bg-muted/40 rounded-lg py-2">
                              <Calendar size={14} className="mx-auto text-primary" />
                              <p className="text-[11px] text-muted-foreground mt-1">Dates</p>
                              <p className="text-xs font-medium text-foreground">{t.dates.split(" – ")[0]}</p>
                            </div>
                            <div className="text-center bg-muted/40 rounded-lg py-2">
                              <Users size={14} className="mx-auto text-primary" />
                              <p className="text-[11px] text-muted-foreground mt-1">Travelers</p>
                              <p className="text-xs font-medium text-foreground">{t.travelers}</p>
                            </div>
                            <div className="text-center bg-muted/40 rounded-lg py-2">
                              <Wallet size={14} className="mx-auto text-primary" />
                              <p className="text-[11px] text-muted-foreground mt-1">Spent</p>
                              <p className="text-xs font-medium text-foreground">₹{(t.spent/1000).toFixed(1)}k</p>
                            </div>
                          </div>

                          <div className="mt-4 space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Planning progress</span>
                              <span className="font-medium text-foreground">{t.progress}%</span>
                            </div>
                            <Progress value={t.progress} className="h-1.5" />
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1"><Bus size={12} /> {t.parts.transport}</span>
                              <span className="flex items-center gap-1"><Hotel size={12} /> {t.parts.hotels}</span>
                              <span className="flex items-center gap-1"><Package size={12} /> {t.parts.packages}</span>
                            </div>
                            <Button size="sm" variant="ghost" onClick={() => setOpenTripId(open ? null : t.id)} className="gap-1 text-xs">
                              {open ? "Hide" : "View"} Timeline <ChevronRight size={12} className={`transition-transform ${open ? "rotate-90" : ""}`} />
                            </Button>
                          </div>

                          {open && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                              className="mt-5 border-t pt-5 space-y-4"
                            >
                              {[
                                { icon: Map, label: "Destination", value: t.destination, tint: "bg-primary/10 text-primary" },
                                { icon: Bus, label: "Transportation", value: `${t.parts.transport} bookings added`, tint: "bg-sky-500/10 text-sky-500" },
                                { icon: Hotel, label: "Hotel", value: `${t.parts.hotels} reservations`, tint: "bg-violet-500/10 text-violet-500" },
                                { icon: Package, label: "Packages", value: `${t.parts.packages} package(s)`, tint: "bg-orange-500/10 text-orange-500" },
                                { icon: Wallet, label: "Expenses", value: `${t.parts.expenses} entries · ₹${t.spent.toLocaleString()}`, tint: "bg-emerald-500/10 text-emerald-500" },
                                { icon: Users, label: "Troop Members", value: `${t.travelers} travelers`, tint: "bg-rose-500/10 text-rose-500" },
                              ].map((s, idx) => (
                                <div key={s.label} className="flex gap-3 relative">
                                  <div className="flex flex-col items-center">
                                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${s.tint} shrink-0 z-10`}>
                                      <s.icon size={15} />
                                    </div>
                                    {idx < 5 && <div className="w-px flex-1 bg-border mt-1" />}
                                  </div>
                                  <div className="pb-3 flex-1">
                                    <p className="text-xs text-muted-foreground">{s.label}</p>
                                    <p className="text-sm font-medium text-foreground">{s.value}</p>
                                  </div>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* ---------- WISHLIST ---------- */}
          <TabsContent value="wishlist" className="space-y-5">
            <div className="flex gap-1.5 flex-wrap">
              {(Object.keys(wishlistData) as (keyof typeof wishlistData)[]).map(cat => (
                <button
                  key={cat}
                  onClick={() => setWishlistCat(cat)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                    wishlistCat === cat
                      ? "bg-gradient-hero text-primary-foreground shadow-sm"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {cat} <span className="opacity-70 ml-1">{wishlistData[cat].length}</span>
                </button>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {wishlistData[wishlistCat].map((item, i) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300">
                    <div className="relative h-44 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <button className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm p-2 rounded-full text-rose-500 hover:scale-110 transition-transform">
                        <Heart size={14} fill="currentColor" />
                      </button>
                      <Badge className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm text-foreground border-0 text-[10px]">
                        {wishlistCat}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-display font-semibold text-foreground">{item.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{item.meta}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* ---------- SETTINGS ---------- */}
          <TabsContent value="settings">
            <div className="grid md:grid-cols-3 gap-5">
              <Card className="md:col-span-1">
                <CardContent className="p-5">
                  <h3 className="font-display font-semibold text-foreground">Account</h3>
                  <p className="text-xs text-muted-foreground mt-1">Manage your personal details and public profile.</p>
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground"><User size={13} /> Profile info</div>
                    <div className="flex items-center gap-2 text-muted-foreground"><Mail size={13} /> Email & phone</div>
                    <div className="flex items-center gap-2 text-muted-foreground"><MapPin size={13} /> Location</div>
                    <div className="flex items-center gap-2 text-muted-foreground"><Globe size={13} /> Bio</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardContent className="p-6 space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1.5 text-sm font-medium">
                        <User size={14} className="text-primary" /> Full Name
                      </Label>
                      <Input defaultValue="Aarav Sharma" disabled={!editing} />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1.5 text-sm font-medium">
                        <Mail size={14} className="text-primary" /> Email
                      </Label>
                      <Input defaultValue="aarav@email.com" type="email" disabled={!editing} />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1.5 text-sm font-medium">
                        <Phone size={14} className="text-primary" /> Phone
                      </Label>
                      <Input defaultValue="+91 98765 43210" disabled={!editing} />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1.5 text-sm font-medium">
                        <MapPin size={14} className="text-primary" /> Location
                      </Label>
                      <Input defaultValue="Bangalore, India" disabled={!editing} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5 text-sm font-medium">
                      <Globe size={14} className="text-primary" /> Bio
                    </Label>
                    <Textarea defaultValue="Adventure seeker & mountain lover. Always planning the next escape!" rows={3} disabled={!editing} />
                  </div>
                  {editing && (
                    <div className="flex gap-2">
                      <Button className="bg-gradient-hero text-primary-foreground hover:opacity-90 h-11 font-semibold">
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setEditing(false)} className="h-11">Cancel</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
