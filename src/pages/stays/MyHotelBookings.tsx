import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Hotel as HotelIcon, Plus, Calendar, Users, IndianRupee, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { hotelService } from "@/services/hotelService";
import type { HotelBookingRecord } from "@/data/hotels";
import { toast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/api";

const statusVariant = (s: string) =>
  s === "CONFIRMED" || s === "CHECKED_IN" ? "default" : s === "CHECKED_OUT" ? "secondary" : s === "CANCELLED" ? "destructive" : "outline";
const paymentVariant = (s: string) => (s === "PAID" ? "default" : s === "REFUNDED" ? "secondary" : "outline");

const MyHotelBookings = () => {
  const [bookings, setBookings] = useState<HotelBookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setBookings(await hotelService.getMyBookings());
    } catch (err) {
      toast({ title: "Could not load bookings", description: err instanceof ApiError ? err.message : String(err), variant: "destructive" });
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const cancel = async (bookingId: string) => {
    setCancellingId(bookingId);
    try {
      await hotelService.cancelBooking(bookingId);
      toast({ title: "Booking cancelled" });
      load();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Could not cancel booking. Please try again.";
      toast({ title: "Cancellation failed", description: message, variant: "destructive" });
    }
    setCancellingId(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative pt-28 pb-8">
        <div className="absolute inset-0 bg-gradient-sunset opacity-10" />
        <div className="container mx-auto px-4 relative z-10 flex flex-wrap items-end justify-between gap-4">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">My Hotel Bookings</h1>
            <p className="text-muted-foreground mt-1">Stays you've booked through Sanchari.</p>
          </motion.div>
          <Button asChild className="bg-gradient-hero text-primary-foreground hover:opacity-90">
            <Link to="/stays"><Plus size={16} className="mr-1" /> Find a Stay</Link>
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[0, 1].map((i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <HotelIcon size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-display font-bold text-foreground mb-2">No bookings yet</h3>
            <p className="text-muted-foreground mb-6">Find a hotel to plan your next stay.</p>
            <Button asChild className="bg-gradient-hero text-primary-foreground hover:opacity-90">
              <Link to="/stays">Find a Stay</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookings.map((b) => (
              <motion.div key={b.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-card border border-border/60 shadow-card p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display font-bold text-foreground">{b.hotelName}</h3>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant={statusVariant(b.status)} className="text-[10px] capitalize">{b.status.toLowerCase().replace("_", " ")}</Badge>
                    <Badge variant={paymentVariant(b.paymentStatus)} className="text-[10px] capitalize">{b.paymentStatus.toLowerCase()}</Badge>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar size={11} /> {b.checkInDate} → {b.checkOutDate}</span>
                  <span className="flex items-center gap-1"><Users size={11} /> {b.numberOfGuests} guest{b.numberOfGuests !== 1 ? "s" : ""}</span>
                </div>

                <p className="text-[11px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full inline-block mt-2">Room {b.roomLabel}</p>

                {b.specialRequest && (
                  <p className="text-xs text-muted-foreground mt-2 italic">Request: {b.specialRequest}</p>
                )}

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/60">
                  <p className="font-bold text-primary flex items-center"><IndianRupee size={15} />{b.totalAmount.toLocaleString()}</p>
                  {(b.status === "CONFIRMED" || b.status === "PENDING") && (
                    <Button
                      size="sm" variant="outline" className="text-destructive hover:text-destructive"
                      disabled={cancellingId === b.id}
                      onClick={() => cancel(b.id)}
                    >
                      {cancellingId === b.id ? <Loader2 size={13} className="animate-spin" /> : "Cancel"}
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default MyHotelBookings;
