import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Filter, SlidersHorizontal, MapPin, Plane, Compass, Package, Globe, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import RealPackageCard from "@/components/RealPackageCard";
import Footer from "@/components/Footer";
import { packageService } from "@/services/packageService";
import type { TravelPackage, DestinationOption } from "@/data/packages";
import { toast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/api";

const AllPackages = () => {
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [destinations, setDestinations] = useState<DestinationOption[]>([]);
  const [loading, setLoading] = useState(true);

  const [destFilter, setDestFilter] = useState<string>("all");
  const [placeFilter, setPlaceFilter] = useState<string>("all");
  const [sort, setSort] = useState<string>("price-low"); // no "popular" flag in the backend, so this is the default now

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [pkgs, dests] = await Promise.all([
          packageService.getAllPackages(),
          packageService.listDestinationOptions(),
        ]);
        setPackages(pkgs);
        setDestinations(dests);
      } catch (err) {
        toast({ title: "Could not load packages", description: err instanceof ApiError ? err.message : String(err), variant: "destructive" });
      }
      setLoading(false);
    })();
  }, []);

  const destNameById = useMemo(() => new Map(destinations.map((d) => [d.id, d.name])), [destinations]);

  const allPlaces = useMemo(() => {
    const pkgs = destFilter === "all" ? packages : packages.filter((p) => p.destinationId === destFilter);
    const s = new Set<string>();
    pkgs.forEach((p) => p.placesCovered.forEach((pl) => s.add(pl)));
    return Array.from(s);
  }, [packages, destFilter]);

  const filtered = useMemo(() => {
    let result = [...packages];
    if (destFilter !== "all") result = result.filter((p) => p.destinationId === destFilter);
    if (placeFilter !== "all") result = result.filter((p) => p.placesCovered.includes(placeFilter));
    if (sort === "price-low") result.sort((a, b) => a.price - b.price);
    else if (sort === "price-high") result.sort((a, b) => b.price - a.price);
    return result;
  }, [packages, destFilter, placeFilter, sort]);

  const handleDestChange = (val: string) => {
    setDestFilter(val);
    setPlaceFilter("all");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />

      <div className="absolute top-32 right-8 opacity-5 text-primary animate-float pointer-events-none hidden lg:block"><Plane size={80} /></div>
      <div className="absolute top-[60%] left-6 opacity-5 text-primary animate-float-slow pointer-events-none hidden lg:block"><Compass size={60} /></div>
      <div className="absolute bottom-40 right-[15%] opacity-5 text-primary animate-float-delay pointer-events-none hidden lg:block"><MapPin size={50} /></div>

      <div className="relative pt-20 pb-14 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 to-background" />
        <div className="container mx-auto px-4 relative z-10 pt-8 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Package size={16} /> All Packages
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            Find Your Perfect <span className="text-gradient-hero">Package</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {loading ? "Loading packages…" : `Browse ${packages.length} curated travel packages — filter by destination, places, and price.`}
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-2xl p-4 md:p-5 flex flex-wrap items-center gap-4 md:gap-5 shadow-card">
          <div className="flex items-center gap-2.5 bg-muted/50 px-4 py-2.5 rounded-xl">
            <Globe size={16} className="text-primary" />
            <select value={destFilter} onChange={(e) => handleDestChange(e.target.value)} className="bg-transparent text-sm font-medium text-foreground outline-none cursor-pointer">
              <option value="all">All Destinations</option>
              {destinations.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2.5 bg-muted/50 px-4 py-2.5 rounded-xl">
            <Filter size={16} className="text-primary" />
            <select value={placeFilter} onChange={(e) => setPlaceFilter(e.target.value)} className="bg-transparent text-sm font-medium text-foreground outline-none cursor-pointer">
              <option value="all">All Places</option>
              {allPlaces.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2.5 bg-muted/50 px-4 py-2.5 rounded-xl">
            <SlidersHorizontal size={16} className="text-secondary" />
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-transparent text-sm font-medium text-foreground outline-none cursor-pointer">
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
          <div className="ml-auto hidden md:block">
            <span className="text-sm text-muted-foreground">{filtered.length} package{filtered.length !== 1 ? "s" : ""} found</span>
          </div>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 pb-20">
        {loading ? (
          <div className="text-center py-20 text-muted-foreground"><Loader2 className="animate-spin mx-auto mb-2" /> Loading packages…</div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
            <MapPin size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground text-lg">No packages found for this filter.</p>
            <button onClick={() => { setDestFilter("all"); setPlaceFilter("all"); }} className="text-primary font-semibold text-sm mt-2 hover:underline">
              Clear filters
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((pkg, i) => (
              <RealPackageCard key={pkg.id} pkg={pkg} destinationName={destNameById.get(pkg.destinationId)} index={i} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AllPackages;
