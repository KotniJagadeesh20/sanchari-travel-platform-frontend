import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingSummary from "@/components/transport/BookingSummary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { busService } from "@/services/busService";
import type { Bus } from "@/data/transportation";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/lib/api";

const PHONE_PATTERN = /^[6-9]\d{9}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BusSeatSelection = () => {
  const location = useLocation();
  // No GET /bus/{id} endpoint exists on the backend — the selected Bus is
  // passed via router state from the results page (see BusCard.tsx) rather
  // than re-fetched here. Landing on this URL directly (e.g. a refresh)
  // won't have it, hence the "not found" fallback below.
  const bus = (location.state as { bus?: Bus } | null)?.bus;
  const nav = useNavigate();
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phoneno, setPhoneno] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [submitting, setSubmitting] = useState(false);

  const canConfirm =
    name.trim().length > 1 &&
    EMAIL_PATTERN.test(email) &&
    PHONE_PATTERN.test(phoneno) &&
    typeof age === "number" && age > 0;

  const confirm = async () => {
    if (!bus || !canConfirm || typeof age !== "number") return;
    setSubmitting(true);
    try {
      const { bookingId } = await busService.bookTicket(bus.id, { name, email, phoneno, age });
      toast({ title: "Booking confirmed", description: `Ref: ${bookingId}` });
      nav("/transportation/bus/bookings");
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
      toast({ title: "Booking failed", description: message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (!bus) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Bus not found</h2>
          <p className="text-sm text-muted-foreground mb-4">Please search again to select a bus.</p>
          <Link to="/transportation/bus" className="text-primary hover:underline">← Back to search</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <div className="pt-24 pb-6 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4">
          <Link to="/transportation/bus/search" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3">
            <ArrowLeft size={14} /> Back to results
          </Link>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">{bus.busName}</h1>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">{bus.busType}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {bus.source} {bus.departure} → {bus.destination} {bus.arrival}{bus.duration !== "—" && ` · ${bus.duration}`}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-xl font-display font-bold text-foreground mb-4">Passenger details</h2>
              <div className="rounded-xl border border-border/60 bg-card p-4 space-y-3">
                <div>
                  <Label className="text-xs">Full name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="As on ID" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <Label className="text-xs">Email</Label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                  </div>
                  <div>
                    <Label className="text-xs">Age</Label>
                    <Input
                      type="number"
                      min={1}
                      max={120}
                      value={age}
                      onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")}
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Phone number</Label>
                  <Input
                    type="tel"
                    value={phoneno}
                    onChange={(e) => setPhoneno(e.target.value)}
                    placeholder="9876543210"
                  />
                </div>
              </div>
            </motion.section>
          </div>

          <aside className="space-y-4">
            <BookingSummary
              title={bus.busName}
              route={`${bus.source} → ${bus.destination}`}
              date={bus.date}
              pricePerSeat={bus.pricePerSeat}
              quantity={1}
            />
            <Button
              onClick={confirm}
              disabled={!canConfirm || submitting}
              className="w-full bg-gradient-hero text-primary-foreground hover:opacity-90 h-12 text-base"
            >
              {submitting ? <Loader2 className="animate-spin" size={18} /> : (
                <><Check size={18} className="mr-1.5" /> Confirm Booking</>
              )}
            </Button>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BusSeatSelection;
