import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Car, Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchForm, { type SearchFormValues } from "@/components/transport/SearchForm";
import RideCard from "@/components/transport/RideCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { rideService } from "@/services/rideService";
import type { Ride } from "@/data/transportation";
import { toast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/api";

const RideSearch = () => {
  const [sp, setSp] = useSearchParams();
  const [values, setValues] = useState<SearchFormValues>({
    source: sp.get("source") || "",
    destination: sp.get("destination") || "",
    date: sp.get("date") || new Date().toISOString().slice(0, 10),
    passengers: Number(sp.get("passengers")) || 1,
  });
  const [results, setResults] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  const run = async (v: SearchFormValues) => {
    if (!v.source.trim() || !v.destination.trim()) {
      setLoading(false);
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const rides = await rideService.searchRides({ source: v.source, destination: v.destination, date: v.date });
      // Backend's search endpoint only ever returns SCHEDULED rides, and
      // there's no `passengers` filter server-side — apply that narrowing here.
      setResults(rides.filter((r) => r.seatsLeft >= v.passengers));
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Could not search rides. Please try again.";
      toast({ title: "Search failed", description: message, variant: "destructive" });
      setResults([]);
    }
    setLoading(false);
  };

  useEffect(() => { run(values); /* eslint-disable-next-line */ }, []);

  const submit = () => {
    if (!values.source.trim() || !values.destination.trim()) {
      toast({ title: "Please enter both source and destination", variant: "destructive" });
      return;
    }
    setSp({
      source: values.source, destination: values.destination,
      date: values.date, passengers: String(values.passengers),
    });
    run(values);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-6 bg-gradient-to-b from-secondary/5 to-transparent">
        <div className="container mx-auto px-4">
          <SearchForm values={values} onChange={setValues} onSubmit={submit} submitLabel="Find Rides" loading={loading} />
        </div>
      </div>

      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl md:text-2xl font-display font-bold text-foreground">
            {loading ? "Searching…" : `${results.length} ride${results.length === 1 ? "" : "s"} available`}
          </h1>
          <Button asChild variant="outline" size="sm">
            <Link to="/transportation/rides/create"><Plus size={14} className="mr-1" /> Offer a ride</Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-52 rounded-2xl" />)}
          </div>
        ) : results.length ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((r, i) => <RideCard key={r.id} ride={r} index={i} />)}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <Car size={48} className="mx-auto text-muted-foreground mb-3" />
            <h3 className="text-lg font-display font-bold text-foreground mb-1">No rides matched</h3>
            <p className="text-sm text-muted-foreground mb-4">Try a different route — or be the first to offer one.</p>
            <Button asChild className="bg-gradient-sunset text-primary-foreground hover:opacity-90">
              <Link to="/transportation/rides/create">Offer a Ride</Link>
            </Button>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default RideSearch;
