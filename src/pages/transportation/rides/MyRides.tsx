import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Car, Plus, ChevronDown, Check, X, Loader2, Calendar, Clock, Users, IndianRupee } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { rideService } from "@/services/rideService";
import type { Ride, RideBookingRecord } from "@/data/transportation";
import { toast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/api";

type EnrichedBooking = RideBookingRecord & { travelDate?: string; departureTime?: string };

const statusBadgeVariant = (s: string) =>
  s === "APPROVED" ? "default" : s === "PENDING" ? "secondary" : s === "REJECTED" ? "destructive" : "outline";

const MyRides = () => {
  const [tab, setTab] = useState<"driver" | "passenger">("driver");

  const [driverRides, setDriverRides] = useState<Ride[]>([]);
  const [driverLoading, setDriverLoading] = useState(true);
  const [expandedRideId, setExpandedRideId] = useState<string | null>(null);
  const [requestsByRide, setRequestsByRide] = useState<Record<string, RideBookingRecord[]>>({});
  const [requestsLoading, setRequestsLoading] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [cancellingRide, setCancellingRide] = useState<string | null>(null);

  const [passengerBookings, setPassengerBookings] = useState<EnrichedBooking[]>([]);
  const [passengerLoading, setPassengerLoading] = useState(true);

  const loadDriverRides = async () => {
    setDriverLoading(true);
    try {
      setDriverRides(await rideService.getMyRidesAsDriver());
    } catch (err) {
      toast({ title: "Could not load your rides", description: err instanceof ApiError ? err.message : String(err), variant: "destructive" });
    }
    setDriverLoading(false);
  };

  const loadPassengerBookings = async () => {
    setPassengerLoading(true);
    try {
      const bookings = await rideService.getMyBookings();
      // RideBookingRecord has no travel date/time of its own — enrich each
      // with its ride's schedule so the card can show "when", not just
      // "when I requested it" (bookingTime).
      const enriched = await Promise.all(
        bookings.map(async (b) => {
          const ride = await rideService.getRide(b.rideId).catch(() => undefined);
          return { ...b, travelDate: ride?.date, departureTime: ride?.departureTime };
        })
      );
      setPassengerBookings(enriched);
    } catch (err) {
      toast({ title: "Could not load your bookings", description: err instanceof ApiError ? err.message : String(err), variant: "destructive" });
    }
    setPassengerLoading(false);
  };

  useEffect(() => { loadDriverRides(); loadPassengerBookings(); }, []);

  const toggleRequests = async (rideId: string) => {
    if (expandedRideId === rideId) { setExpandedRideId(null); return; }
    setExpandedRideId(rideId);
    if (!requestsByRide[rideId]) {
      setRequestsLoading(rideId);
      try {
        const requests = await rideService.getBookingsForRide(rideId);
        setRequestsByRide((prev) => ({ ...prev, [rideId]: requests }));
      } catch (err) {
        toast({ title: "Could not load requests", description: err instanceof ApiError ? err.message : String(err), variant: "destructive" });
      }
      setRequestsLoading(null);
    }
  };

  const respond = async (rideId: string, bookingId: string, action: "approve" | "reject") => {
    setActionLoading(bookingId);
    try {
      const updated = action === "approve"
        ? await rideService.approveBooking(bookingId)
        : await rideService.rejectBooking(bookingId);
      setRequestsByRide((prev) => ({
        ...prev,
        [rideId]: prev[rideId].map((r) => (r.id === bookingId ? updated : r)),
      }));
      toast({ title: action === "approve" ? "Booking approved" : "Booking rejected" });
      loadDriverRides(); // refresh seatsLeft on the ride card
    } catch (err) {
      toast({ title: "Action failed", description: err instanceof ApiError ? err.message : String(err), variant: "destructive" });
    }
    setActionLoading(null);
  };

  const cancelMyRide = async (rideId: string) => {
    setCancellingRide(rideId);
    try {
      await rideService.cancelMyRide(rideId);
      toast({ title: "Ride cancelled" });
      loadDriverRides();
    } catch (err) {
      toast({ title: "Could not cancel ride", description: err instanceof ApiError ? err.message : String(err), variant: "destructive" });
    }
    setCancellingRide(null);
  };

  const cancelMyBooking = async (bookingId: string) => {
    try {
      await rideService.cancelBooking(bookingId);
      toast({ title: "Booking cancelled" });
      loadPassengerBookings();
    } catch (err) {
      toast({ title: "Could not cancel booking", description: err instanceof ApiError ? err.message : String(err), variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative pt-28 pb-8">
        <div className="absolute inset-0 bg-gradient-sunset opacity-10" />
        <div className="container mx-auto px-4 relative z-10 flex flex-wrap items-end justify-between gap-4">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">My Rides</h1>
            <p className="text-muted-foreground mt-1">Rides you've offered or joined.</p>
          </motion.div>
          <Button asChild className="bg-gradient-hero text-primary-foreground hover:opacity-90">
            <Link to="/transportation/rides/create"><Plus size={16} className="mr-1" /> Offer a Ride</Link>
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <Tabs value={tab} onValueChange={(v) => setTab(v as "driver" | "passenger")}>
          <TabsList className="mb-6">
            <TabsTrigger value="driver">As Driver</TabsTrigger>
            <TabsTrigger value="passenger">As Passenger</TabsTrigger>
          </TabsList>

          {/* AS DRIVER */}
          <TabsContent value="driver">
            {driverLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[0, 1].map((i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}
              </div>
            ) : driverRides.length ? (
              <div className="space-y-4">
                {driverRides.map((r) => {
                  const pendingCount = requestsByRide[r.id]?.filter((b) => b.status === "PENDING").length;
                  return (
                    <div key={r.id} className="rounded-2xl bg-card border border-border/60 shadow-card overflow-hidden">
                      <div className="p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="font-display font-bold text-foreground">{r.source} → {r.destination}</h3>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1"><Calendar size={11} /> {r.date}</span>
                              <span className="flex items-center gap-1"><Clock size={11} /> {r.departureTime}</span>
                              <span className="flex items-center gap-1"><Users size={11} /> {r.seatsLeft}/{r.totalSeats} left</span>
                              <span className="flex items-center gap-1"><IndianRupee size={11} />{r.pricePerSeat}/seat</span>
                            </div>
                          </div>
                          <Badge variant={r.status === "SCHEDULED" ? "default" : r.status === "CANCELLED" ? "destructive" : "secondary"} className="capitalize">
                            {r.status.toLowerCase().replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                          <Button size="sm" variant="outline" onClick={() => toggleRequests(r.id)}>
                            {requestsLoading === r.id ? <Loader2 size={14} className="animate-spin mr-1" /> : <ChevronDown size={14} className={`mr-1 transition-transform ${expandedRideId === r.id ? "rotate-180" : ""}`} />}
                            Requests{pendingCount ? ` (${pendingCount} pending)` : ""}
                          </Button>
                          {r.status === "SCHEDULED" && (
                            <Button
                              size="sm" variant="outline" className="text-destructive hover:text-destructive"
                              onClick={() => cancelMyRide(r.id)}
                              disabled={cancellingRide === r.id}
                            >
                              {cancellingRide === r.id ? <Loader2 size={14} className="animate-spin" /> : "Cancel ride"}
                            </Button>
                          )}
                        </div>
                      </div>

                      <AnimatePresence>
                        {expandedRideId === r.id && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-border/60 bg-muted/30">
                            <div className="p-5 space-y-3">
                              {(requestsByRide[r.id] || []).length === 0 ? (
                                <p className="text-sm text-muted-foreground">No booking requests yet.</p>
                              ) : (
                                requestsByRide[r.id].map((b) => (
                                  <div key={b.id} className="flex flex-wrap items-center justify-between gap-3 bg-card rounded-xl border border-border/60 p-3">
                                    <div>
                                      <p className="text-sm font-medium text-foreground">{b.passengerName}</p>
                                      <p className="text-xs text-muted-foreground">{b.seatsBooked} seat(s) · ₹{b.totalAmount.toLocaleString()}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge variant={statusBadgeVariant(b.status)} className="capitalize text-[10px]">{b.status.toLowerCase()}</Badge>
                                      {b.status === "PENDING" && (
                                        <>
                                          <Button size="sm" variant="outline" className="h-8 px-2 text-emerald-600 hover:text-emerald-600" disabled={actionLoading === b.id} onClick={() => respond(r.id, b.id, "approve")}>
                                            {actionLoading === b.id ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                                          </Button>
                                          <Button size="sm" variant="outline" className="h-8 px-2 text-destructive hover:text-destructive" disabled={actionLoading === b.id} onClick={() => respond(r.id, b.id, "reject")}>
                                            <X size={13} />
                                          </Button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState tab="driver" />
            )}
          </TabsContent>

          {/* AS PASSENGER */}
          <TabsContent value="passenger">
            {passengerLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[0, 1].map((i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}
              </div>
            ) : passengerBookings.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {passengerBookings.map((b) => (
                  <div key={b.id} className="rounded-2xl bg-card border border-border/60 shadow-card p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display font-bold text-foreground">{b.rideSource} → {b.rideDestination}</h3>
                      <Badge variant={statusBadgeVariant(b.status)} className="capitalize text-[10px]">{b.status.toLowerCase()}</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-muted-foreground">
                      {b.travelDate && <span className="flex items-center gap-1"><Calendar size={11} /> {b.travelDate}</span>}
                      {b.departureTime && <span className="flex items-center gap-1"><Clock size={11} /> {b.departureTime}</span>}
                      <span className="flex items-center gap-1"><Users size={11} /> {b.seatsBooked} seat(s)</span>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/60">
                      <p className="font-bold text-primary flex items-center"><IndianRupee size={15} />{b.totalAmount.toLocaleString()}</p>
                      {(b.status === "PENDING" || b.status === "APPROVED") && (
                        <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => cancelMyBooking(b.id)}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState tab="passenger" />
            )}
          </TabsContent>
        </Tabs>
      </section>

      <Footer />
    </div>
  );
};

const EmptyState = ({ tab }: { tab: "driver" | "passenger" }) => (
  <div className="text-center py-20">
    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
      <Car size={32} className="text-muted-foreground" />
    </div>
    <h3 className="text-xl font-display font-bold text-foreground mb-2">Nothing here yet</h3>
    <p className="text-muted-foreground mb-6">
      {tab === "driver" ? "Offer a ride to see it here." : "Find and join a ride to get started."}
    </p>
    <Button asChild className="bg-gradient-hero text-primary-foreground hover:opacity-90">
      <Link to={tab === "driver" ? "/transportation/rides/create" : "/transportation/rides/search"}>
        {tab === "driver" ? "Offer a Ride" : "Find a Ride"}
      </Link>
    </Button>
  </div>
);

export default MyRides;
