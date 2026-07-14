import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Bus as BusIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchForm, { type SearchFormValues } from "@/components/transport/SearchForm";
import BusCard from "@/components/transport/BusCard";
import { busService } from "@/services/busService";
import type { Bus } from "@/data/transportation";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/api";

const BusResults = () => {
  const [sp, setSp] = useSearchParams();
  const [values, setValues] = useState<SearchFormValues>({
    source: sp.get("source") || "",
    destination: sp.get("destination") || "",
    date: sp.get("date") || new Date().toISOString().slice(0, 10),
    passengers: Number(sp.get("passengers")) || 1,
  });
  const [results, setResults] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);

  const runSearch = async (v: SearchFormValues) => {
    if (!v.source.trim() || !v.destination.trim()) {
      setLoading(false);
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const r = await busService.searchBuses({ source: v.source, destination: v.destination, date: v.date });
      setResults(r);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Could not search buses. Please try again.";
      toast({ title: "Search failed", description: message, variant: "destructive" });
      setResults([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    runSearch(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = () => {
    if (!values.source.trim() || !values.destination.trim()) {
      toast({ title: "Please enter both source and destination", variant: "destructive" });
      return;
    }
    setSp({
      source: values.source,
      destination: values.destination,
      date: values.date,
      passengers: String(values.passengers),
    });
    runSearch(values);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-6 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4">
          <Link to="/transportation/bus" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft size={14} /> Modify search
          </Link>
          <SearchForm values={values} onChange={setValues} onSubmit={submit} submitLabel="Update" loading={loading} />
        </div>
      </div>

      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-display font-bold text-foreground">
              {values.source || "All cities"} → {values.destination || "All cities"}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {loading ? "Searching…" : `${results.length} bus${results.length === 1 ? "" : "es"} found`}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-40 w-full rounded-2xl" />
            ))}
          </div>
        ) : results.length ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {results.map((b, i) => <BusCard key={b.id} bus={b} index={i} />)}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <BusIcon size={48} className="mx-auto text-muted-foreground mb-3" />
            <h3 className="text-lg font-display font-bold text-foreground mb-1">No buses found</h3>
            <p className="text-sm text-muted-foreground">Try a different route or date.</p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default BusResults;
