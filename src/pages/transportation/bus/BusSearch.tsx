import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bus as BusIcon, ArrowLeftRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchForm, { type SearchFormValues } from "@/components/transport/SearchForm";
import { popularCities } from "@/data/transportation";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const today = new Date().toISOString().slice(0, 10);

const BusSearch = () => {
  const nav = useNavigate();
  const [values, setValues] = useState<SearchFormValues>({
    source: "",
    destination: "",
    date: today,
    passengers: 1,
  });

  const submit = () => {
    if (!values.source.trim() || !values.destination.trim()) {
      toast({ title: "Please enter both source and destination", variant: "destructive" });
      return;
    }
    const params = new URLSearchParams({
      source: values.source,
      destination: values.destination,
      date: values.date,
      passengers: String(values.passengers),
    });
    nav(`/transportation/bus/search?${params.toString()}`);
  };

  const popularRoutes = [
    ["Hyderabad", "Vizag"],
    ["Bangalore", "Hyderabad"],
    ["Bangalore", "Goa"],
    ["Chennai", "Bangalore"],
    ["Bangalore", "Mysore"],
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative pt-28 pb-10">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <BusIcon size={16} /> Bus Booking
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
              Where are you going?
            </h1>
            <p className="text-muted-foreground">Real-time seat availability across 500+ operators.</p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <SearchForm values={values} onChange={setValues} onSubmit={submit} submitLabel="Search Buses" />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Popular routes</h2>
          <div className="flex flex-wrap gap-2">
            {popularRoutes.map(([from, to]) => (
              <button
                key={`${from}-${to}`}
                onClick={() => setValues({ ...values, source: from, destination: to })}
                className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 text-sm text-foreground hover:border-primary/40 hover:bg-primary/5 transition-colors"
              >
                {from} <ArrowLeftRight size={12} className="text-muted-foreground" /> {to}
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="font-semibold">Cities we cover:</span>
            {popularCities.map((c) => <span key={c}>{c}</span>).reduce<React.ReactNode[]>((acc, el, i) => acc.concat(i ? [" · ", el] : [el]), [])}
          </div>

          <div className="mt-10 text-center">
            <Link to="/transportation/bus/bookings" className="text-primary text-sm font-semibold hover:underline">
              View my bus bookings →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BusSearch;
