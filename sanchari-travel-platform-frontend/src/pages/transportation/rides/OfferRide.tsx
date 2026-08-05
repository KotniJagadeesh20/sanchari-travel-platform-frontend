import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Car, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { rideService } from "@/services/rideService";
import { toast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/api";

const OfferRide = () => {
  const nav = useNavigate();
  const today = new Date().toISOString().slice(0, 10);
  const [f, setF] = useState({
    source: "",
    destination: "",
    pickupPoint: "",
    dropPoint: "",
    date: today,
    departureTime: "08:00",
    vehicleType: "Sedan",
    vehicleNumber: "",
    totalSeats: 3,
    pricePerSeat: 500,
  });
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof typeof f>(k: K, v: typeof f[K]) => setF((p) => ({ ...p, [k]: v }));

  const valid =
    f.source && f.destination && f.pickupPoint && f.dropPoint &&
    f.vehicleNumber && f.totalSeats > 0 && f.pricePerSeat > 0;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setSubmitting(true);
    try {
      const ride = await rideService.offerRide({
        vehicleType: f.vehicleType, vehicleNumber: f.vehicleNumber,
        source: f.source,
        destination: f.destination,
        pickupPoint: f.pickupPoint,
        dropPoint: f.dropPoint,
        date: f.date,
        departureTime: f.departureTime,
        totalSeats: f.totalSeats,
        pricePerSeat: f.pricePerSeat,
      });
      toast({ title: "Ride published!", description: "Passengers can now find your ride." });
      nav(`/transportation/rides/${ride.id}`);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
      toast({ title: "Could not publish ride", description: message, variant: "destructive" });
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative pt-28 pb-8">
        <div className="absolute inset-0 bg-gradient-sunset opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-semibold mb-3">
              <Car size={16} /> Offer a Ride
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">Publish your trip</h1>
            <p className="text-muted-foreground">Fill in the details and let travelers find you.</p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <form onSubmit={submit} className="max-w-2xl mx-auto glass rounded-3xl p-6 md:p-8 space-y-6">
          <Section title="Route">
            <FieldRow>
              <Field label="From"><Input value={f.source} onChange={(e) => set("source", e.target.value)} placeholder="Hyderabad" /></Field>
              <Field label="To"><Input value={f.destination} onChange={(e) => set("destination", e.target.value)} placeholder="Vijayawada" /></Field>
            </FieldRow>
            <FieldRow>
              <Field label="Pickup point"><Input value={f.pickupPoint} onChange={(e) => set("pickupPoint", e.target.value)} placeholder="LB Nagar Metro" /></Field>
              <Field label="Drop point"><Input value={f.dropPoint} onChange={(e) => set("dropPoint", e.target.value)} placeholder="Benz Circle" /></Field>
            </FieldRow>
          </Section>

          <Section title="When">
            <FieldRow>
              <Field label="Date"><Input type="date" value={f.date} onChange={(e) => set("date", e.target.value)} /></Field>
              <Field label="Departure time"><Input type="time" value={f.departureTime} onChange={(e) => set("departureTime", e.target.value)} /></Field>
            </FieldRow>
          </Section>

          <Section title="Vehicle">
            <FieldRow>
              <Field label="Type">
                <select
                  value={f.vehicleType}
                  onChange={(e) => set("vehicleType", e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  {["Hatchback", "Sedan", "SUV", "MPV"].map((t) => <option key={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Vehicle number"><Input value={f.vehicleNumber} onChange={(e) => set("vehicleNumber", e.target.value.toUpperCase())} placeholder="TS 09 AB 1234" /></Field>
            </FieldRow>
            <FieldRow>
              <Field label="Available seats">
                <Input type="number" min={1} max={8} value={f.totalSeats} onChange={(e) => set("totalSeats", Number(e.target.value) || 1)} />
              </Field>
            </FieldRow>
          </Section>

          <Section title="Pricing">
            <FieldRow>
              <Field label="Price per seat (₹)">
                <Input type="number" min={0} value={f.pricePerSeat} onChange={(e) => set("pricePerSeat", Number(e.target.value) || 0)} />
              </Field>
            </FieldRow>
          </Section>

          <Button
            type="submit"
            disabled={!valid || submitting}
            className="w-full bg-gradient-hero text-primary-foreground hover:opacity-90 h-12 text-base"
          >
            {submitting ? "Publishing…" : (<><Send size={16} className="mr-1.5" /> Publish Ride</>)}
          </Button>
        </form>
      </section>

      <Footer />
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-3">
    <h3 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">{title}</h3>
    {children}
  </div>
);
const FieldRow = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>
);
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <Label className="text-xs">{label}</Label>
    {children}
  </div>
);

export default OfferRide;
