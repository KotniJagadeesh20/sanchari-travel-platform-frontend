import { useParams, Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Filter, SlidersHorizontal, MapPin, Plane, Compass } from "lucide-react";
import Navbar from "@/components/Navbar";
import PackageCard from "@/components/PackageCard";
import Footer from "@/components/Footer";
import { getTrip, getPackagesForTrip } from "@/data/trips";

const Packages = () => {
  const { tripId } = useParams();
  const trip = getTrip(tripId || "");
  const allPkgs = getPackagesForTrip(tripId || "");

  const [placeFilter, setPlaceFilter] = useState<string>("all");
  const [sort, setSort] = useState<string>("popular");

  const allPlaces = useMemo(() => {
    const s = new Set<string>();
    allPkgs.forEach((p) => p.places.forEach((pl) => s.add(pl)));
    return Array.from(s);
  }, [allPkgs]);

  const filtered = useMemo(() => {
    let result = placeFilter === "all" ? allPkgs : allPkgs.filter((p) => p.places.includes(placeFilter));
    if (sort === "price-low") result = [...result].sort((a, b) => a.price - b.price);
    else if (sort === "price-high") result = [...result].sort((a, b) => b.price - a.price);
    else result = [...result].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    return result;
  }, [allPkgs, placeFilter, sort]);

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold mb-4">Trip not found</h1>
          <Link to="/" className="text-primary font-semibold">Go back home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />

      {/* Floating decorations */}
      <div className="absolute top-32 right-8 opacity-5 text-primary animate-float pointer-events-none hidden lg:block"><Plane size={80} /></div>
      <div className="absolute top-[60%] left-6 opacity-5 text-primary animate-float-slow pointer-events-none hidden lg:block"><Compass size={60} /></div>
      <div className="absolute bottom-40 right-[15%] opacity-5 text-primary animate-float-delay pointer-events-none hidden lg:block"><MapPin size={50} /></div>

      {/* Header with trip image background */}
      <div className="relative pt-20 pb-12 overflow-hidden">
        <div className="absolute inset-0">
          <img src={trip.image} alt="" className="w-full h-full object-cover opacity-15 blur-sm" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/90 to-background" />
        </div>
        <div className="container mx-auto px-4 relative z-10 pt-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Link to={`/trip/${trip.id}`} className="inline-flex items-center gap-1.5 text-muted-foreground text-sm mb-5 hover:text-foreground transition-colors bg-muted/50 px-3 py-1.5 rounded-full">
              <ArrowLeft size={14} /> Back to {trip.name}
            </Link>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-display font-bold text-foreground mb-2"
          >
            {trip.name} <span className="text-gradient-hero">Packages</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg"
          >
            {allPkgs.length} curated packages to explore
          </motion.p>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-4 md:p-5 flex flex-wrap items-center gap-4 md:gap-6 shadow-card"
        >
          <div className="flex items-center gap-2.5 bg-muted/50 px-4 py-2.5 rounded-xl">
            <Filter size={16} className="text-primary" />
            <select
              value={placeFilter}
              onChange={(e) => setPlaceFilter(e.target.value)}
              className="bg-transparent text-sm font-medium text-foreground outline-none cursor-pointer"
            >
              <option value="all">All Places</option>
              {allPlaces.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2.5 bg-muted/50 px-4 py-2.5 rounded-xl">
            <SlidersHorizontal size={16} className="text-secondary" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-transparent text-sm font-medium text-foreground outline-none cursor-pointer"
            >
              <option value="popular">Popular First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
          <div className="ml-auto hidden md:block">
            <span className="text-sm text-muted-foreground">{filtered.length} package{filtered.length !== 1 ? 's' : ''} found</span>
          </div>
        </motion.div>
      </div>

      {/* Packages */}
      <div className="container mx-auto px-4 pb-20">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <MapPin size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground text-lg">No packages found for this filter.</p>
            <button onClick={() => setPlaceFilter("all")} className="text-primary font-semibold text-sm mt-2 hover:underline">
              Clear filters
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((pkg, i) => (
              <PackageCard key={pkg.id} pkg={pkg} index={i} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Packages;
