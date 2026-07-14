import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { MapPin, Plane, Compass, Globe, Mountain, Map, Search, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import TripCard from "@/components/TripCard";
import Footer from "@/components/Footer";
import { trips } from "@/data/trips";

const Trips = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [search, setSearch] = useState(initialSearch);

  const filtered = useMemo(() => {
    if (!search.trim()) return trips;
    const q = search.toLowerCase();
    return trips.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.places.some((p) => p.name.toLowerCase().includes(q))
    );
  }, [search]);

  const clearSearch = () => {
    setSearch("");
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />

      {/* Floating decorations */}
      <div className="absolute top-32 right-8 opacity-5 text-primary animate-float pointer-events-none hidden lg:block"><Plane size={80} /></div>
      <div className="absolute top-[55%] left-6 opacity-5 text-primary animate-float-slow pointer-events-none hidden lg:block"><Compass size={60} /></div>
      <div className="absolute bottom-40 right-[15%] opacity-5 text-primary animate-float-delay pointer-events-none hidden lg:block"><Mountain size={50} /></div>

      {/* Hero Header */}
      <div className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 to-background" />
        <div className="container mx-auto px-4 relative z-10 pt-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6"
          >
            <Globe size={16} />
            Explore India
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4"
          >
            Discover Incredible{" "}
            <span className="text-gradient-hero">India</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto mb-2"
          >
            From misty hill stations to golden deserts — explore {trips.length} handpicked destinations across the country.
          </motion.p>
        </div>
      </div>

      {/* Search bar */}
      <div className="container mx-auto px-4 -mt-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass rounded-2xl p-2 flex items-center gap-2 max-w-lg mx-auto shadow-card"
        >
          <div className="flex items-center gap-2 px-4 flex-1">
            <Search size={18} className="text-muted-foreground" />
            <input
              type="text"
              placeholder="Search destinations or places..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none text-foreground placeholder:text-muted-foreground w-full py-2 text-sm"
            />
          </div>
          {search && (
            <button onClick={clearSearch} className="p-2 rounded-xl hover:bg-muted transition-colors">
              <X size={16} className="text-muted-foreground" />
            </button>
          )}
        </motion.div>
      </div>

      {/* Stats bar */}
      <div className="container mx-auto px-4 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-5 flex flex-wrap justify-center gap-8 md:gap-16 shadow-card"
        >
          {[
            { icon: Map, label: "Destinations", value: trips.length },
            { icon: MapPin, label: "Places to Visit", value: trips.reduce((a, t) => a + t.places.length, 0) },
            { icon: Globe, label: "States Covered", value: trips.length },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <s.icon size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{s.value}+</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Results info */}
      {search && (
        <div className="container mx-auto px-4 mb-6">
          <p className="text-muted-foreground text-sm">
            {filtered.length > 0
              ? `Showing ${filtered.length} result${filtered.length > 1 ? "s" : ""} for "${search}"`
              : `No destinations found for "${search}"`}
          </p>
        </div>
      )}

      {/* Trip Grid */}
      <div className="container mx-auto px-4 pb-20">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((trip, i) => (
              <TripCard key={trip.id} trip={trip} index={i} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-display font-bold text-foreground mb-2">No destinations found</h3>
            <p className="text-muted-foreground mb-6">Try searching for Ooty, Goa, Kashmir, or other destinations</p>
            <button onClick={clearSearch} className="bg-primary text-primary-foreground px-6 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
              Show All Destinations
            </button>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Trips;
