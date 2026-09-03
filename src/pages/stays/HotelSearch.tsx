import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Hotel as HotelIcon, MapPin, Calendar, Users, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { packageService } from "@/services/packageService";
import type { DestinationOption } from "@/data/packages";
import { ApiError } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const todayIso = () => new Date().toISOString().slice(0, 10);
const tomorrowIso = () => new Date(Date.now() + 86400000).toISOString().slice(0, 10);

const HotelSearch = () => {
  const nav = useNavigate();
  const [destinations, setDestinations] = useState<DestinationOption[]>([]);
  const [destinationId, setDestinationId] = useState("");
  const [checkIn, setCheckIn] = useState(todayIso());
  const [checkOut, setCheckOut] = useState(tomorrowIso());
  const [guests, setGuests] = useState(2);
  const [starRating, setStarRating] = useState("");

  useEffect(() => {
    (async () => {
      try {
        // Reuses the same read-only destination lookup as the Packages flow —
        // this isn't the Destinations feature build-out, just a name picker.
        setDestinations(await packageService.listDestinationOptions());
      } catch (err) {
        toast({ title: "Could not load destinations", description: err instanceof ApiError ? err.message : String(err), variant: "destructive" });
      }
    })();
  }, []);

  const submit = () => {
    const params = new URLSearchParams({ checkIn, checkOut, guests: String(guests) });
    if (destinationId) params.set("destinationId", destinationId);
    if (starRating) params.set("starRating", starRating);
    nav(`/stays/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="relative pt-28 pb-16">
        <div className="absolute inset-0 bg-gradient-sunset opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground flex items-center justify-center gap-2">
              <HotelIcon className="text-primary" /> Find Your Stay
            </h1>
            <p className="text-muted-foreground mt-2">Search real hotels and book a room type in minutes.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-4 md:p-5 shadow-card max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              <div>
                <Label className="text-xs flex items-center gap-1"><MapPin size={13} /> Destination</Label>
                <select
                  value={destinationId}
                  onChange={(e) => setDestinationId(e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm mt-1"
                >
                  <option value="">Anywhere</option>
                  {destinations.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}{d.state ? `, ${d.state}` : ""}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-xs flex items-center gap-1"><Calendar size={13} /> Check-in</Label>
                <Input type="date" value={checkIn} min={todayIso()} onChange={(e) => setCheckIn(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs flex items-center gap-1"><Calendar size={13} /> Check-out</Label>
                <Input type="date" value={checkOut} min={checkIn} onChange={(e) => setCheckOut(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs flex items-center gap-1"><Users size={13} /> Guests</Label>
                <Input type="number" min={1} max={20} value={guests} onChange={(e) => setGuests(Math.max(1, Number(e.target.value) || 1))} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs flex items-center gap-1"><Star size={13} /> Star rating</Label>
                <select
                  value={starRating}
                  onChange={(e) => setStarRating(e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm mt-1"
                >
                  <option value="">Any</option>
                  {[5, 4, 3, 2, 1].map((s) => <option key={s} value={s}>{s}+ stars</option>)}
                </select>
              </div>
            </div>
            <Button onClick={submit} className="w-full mt-4 bg-gradient-hero text-primary-foreground hover:opacity-90 h-11">
              Search Hotels
            </Button>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Dates and guest count help you plan — availability is checked for real when you book, not filtered in search results yet.
            </p>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default HotelSearch;
