import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bus, Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import BookingCard from "@/components/transport/BookingCard";
import { busService } from "@/services/busService";
import type { BookingStatus, BusBooking } from "@/data/transportation";
import { toast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/api";

const BusBookings = () => {
  const [bookings, setBookings] = useState<BusBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<BookingStatus>("upcoming");

  const load = async () => {
    setLoading(true);
    setBookings(await busService.getBookings());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const cancel = async (id: string) => {
    try {
      await busService.cancelBooking(id);
      toast({ title: "Booking cancelled" });
      load();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Could not cancel booking. Please try again.";
      toast({ title: "Cancellation failed", description: message, variant: "destructive" });
    }
  };

  const filtered = bookings.filter((b) => b.status === tab);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative pt-28 pb-8">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">My Bus Bookings</h1>
            <p className="text-muted-foreground mt-1">All your bookings in one place.</p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <Tabs value={tab} onValueChange={(v) => setTab(v as BookingStatus)}>
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value={tab}>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[0, 1].map((i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}
              </div>
            ) : filtered.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((b) => (
                  <BookingCard
                    key={b.id}
                    title={b.operator ? `${b.operator} · ${b.busName}` : b.busName}
                    subtitle={`Booking ${b.id}`}
                    route={`${b.source} → ${b.destination}`}
                    date={b.date}
                    status={b.status}
                    meta={[
                      { label: "Passenger", value: b.passengerName },
                      { label: "Age", value: String(b.passengerAge) },
                      { label: "Total", value: `₹${b.totalAmount.toLocaleString()}` },
                    ]}
                    onCancel={() => cancel(b.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bus size={32} className="text-muted-foreground" />
                </div>
                <h3 className="text-xl font-display font-bold text-foreground mb-2">No {tab} bookings</h3>
                <p className="text-muted-foreground mb-6">
                  {tab === "cancelled"
                    ? "Cancelled bookings aren't kept in your history — cancelling removes a booking entirely."
                    : "Start by searching for a bus."}
                </p>
                <Button asChild className="bg-gradient-hero text-primary-foreground hover:opacity-90">
                  <Link to="/transportation/bus"><Plus size={16} className="mr-1" /> Book a Bus</Link>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>

      <Footer />
    </div>
  );
};

export default BusBookings;
