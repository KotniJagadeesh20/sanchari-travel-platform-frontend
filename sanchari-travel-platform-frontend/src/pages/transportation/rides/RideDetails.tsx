import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, IndianRupee, MapPin, Star, Users, Check, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DriverCard from "@/components/transport/DriverCard";
import BookingSummary from "@/components/transport/BookingSummary";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { rideService } from "@/services/rideService";
import type { Ride } from "@/data/transportation";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/lib/api";

const RideDetails = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const [ride, setRide] = useState<Ride | undefined>();
  const [loading, setLoading] = useState(true);
  const [seats, setSeats] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      setRide(await rideService.getRide(id || ""));
      setLoading(false);
    })();
  }, [id]);

  const changeSeats = (n: number) => setSeats(Math.max(1, Math.min(ride?.seatsLeft || 1, n)));

  const isOwnRide = !!ride && !!user && ride.createdBy.id === user.id;
  const canBook = ride && ride.status === "SCHEDULED" && seats > 0 && !isOwnRide;

  const book = async () => {
    if (!ride || !canBook) return;
    setSubmitting(true);
    try {
      await rideService.bookRide(ride.id, seats);
      toast({ title: "Booking request sent", description: "Awaiting the driver's approval — check My Rides for updates." });
      nav("/transportation/rides/my-rides");
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
      toast({ title: "Booking failed", description: message, variant: "destructive" });
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-28"><Skeleton className="h-96 rounded-2xl" /></div>
      </div>
    );
  }
  if (!ride) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Ride not found</h2>
          <Link to="/transportation/rides" className="text-primary hover:underline">← Back to rides</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-6 bg-gradient-to-b from-secondary/5 to-transparent">
        <div className="container mx-auto px-4">
          <Link to="/transportation/rides/search" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3">
            <ArrowLeft size={14} /> Back to rides
          </Link>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            {ride.source} → {ride.destination}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar size={13} /> {new Date(ride.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long" })}</span>
            <span className="flex items-center gap-1"><Clock size={13} /> {ride.departureTime}</span>
            <span className="flex items-center gap-1"><Users size={13} /> {ride.seatsLeft} of {ride.totalSeats} left</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
              <DriverCard createdBy={ride.createdBy} vehicle={ride.vehicle} />
            </motion.div>

            <section className="rounded-2xl bg-card border border-border/60 shadow-card p-6">
              <h2 className="font-display font-bold text-foreground mb-4">Route</h2>
              <div className="space-y-3">
                <Point icon="pickup" label="Pickup" city={ride.source} point={ride.pickupPoint} />
                <div className="ml-4 h-6 border-l-2 border-dashed border-border" />
                <Point icon="drop" label="Drop" city={ride.destination} point={ride.dropPoint} />
              </div>
            </section>

            {ride.description && (
              <section className="rounded-2xl bg-card border border-border/60 shadow-card p-6">
                <h2 className="font-display font-bold text-foreground mb-2">About this ride</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">{ride.description}</p>
              </section>
            )}

            <section className="rounded-2xl bg-card border border-border/60 shadow-card p-6">
              <h2 className="font-display font-bold text-foreground mb-4">Reviews</h2>
              {ride.reviews.length ? (
                <div className="space-y-4">
                  {ride.reviews.map((r, i) => (
                    <div key={i} className="pb-4 border-b border-border/60 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground text-sm">{r.user}</span>
                        <div className="flex items-center gap-0.5 text-secondary">
                          {Array.from({ length: r.rating }).map((_, k) => <Star key={k} size={12} className="fill-secondary" />)}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{r.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No reviews yet.</p>
              )}
            </section>
          </div>

          <aside className="space-y-4">
            <BookingSummary
              title={`${ride.vehicle.type} · ${ride.vehicle.number}`}
              route={`${ride.source} → ${ride.destination}`}
              date={ride.date}
              seats={seats}
              pricePerSeat={ride.pricePerSeat}
              quantity={seats}
            />

            <div className="rounded-2xl bg-card border border-border/60 shadow-card p-5 space-y-4">
              {isOwnRide ? (
                <p className="text-sm text-muted-foreground text-center py-2">This is your own ride — you can manage requests on it from My Rides.</p>
              ) : ride.status !== "SCHEDULED" ? (
                <p className="text-sm text-muted-foreground text-center py-2">This ride is {ride.status.toLowerCase().replace("_", " ")} and no longer accepting bookings.</p>
              ) : (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Seats to book</p>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => changeSeats(seats - 1)}>−</Button>
                    <span className="w-10 text-center font-semibold">{seats}</span>
                    <Button type="button" variant="outline" size="sm" onClick={() => changeSeats(seats + 1)}>+</Button>
                    <span className="text-xs text-muted-foreground ml-2 flex items-center gap-1">
                      <IndianRupee size={12} />{ride.pricePerSeat} × {seats}
                    </span>
                  </div>
                </div>
              )}

              <Button
                onClick={book}
                disabled={!canBook || submitting}
                className="w-full bg-gradient-hero text-primary-foreground hover:opacity-90 h-11"
              >
                {submitting ? <Loader2 className="animate-spin" size={18} /> : (<><Check size={16} className="mr-1" /> Request to Join</>)}
              </Button>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
};

const Point = ({ icon, label, city, point }: { icon: "pickup" | "drop"; label: string; city: string; point?: string }) => (
  <div className="flex items-start gap-3">
    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${icon === "pickup" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"}`}>
      <MapPin size={16} />
    </div>
    <div>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="font-semibold text-foreground">{city}</p>
      {point && <p className="text-sm text-muted-foreground">{point}</p>}
    </div>
  </div>
);

export default RideDetails;
