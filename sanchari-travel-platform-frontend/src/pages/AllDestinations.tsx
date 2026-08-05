import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, MapPin, Compass, Globe, Calendar, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import DestinationCard from "@/components/DestinationCard";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { destinationService } from "@/services/destinationService";
import { DESTINATION_CATEGORIES, MONTH_NAMES, type DestinationSummary, type DestinationCategory } from "@/data/destinations";
import { toast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/api";

const AllDestinations = () => {
  const [destinations, setDestinations] = useState<DestinationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState<DestinationCategory | "all">("all");
  const [visitMonth, setVisitMonth] = useState<number | "all">("all");
  const [sort, setSort] = useState<"rating" | "budget-low" | "budget-high">("rating");

  const runSearch = async () => {
    setLoading(true);
    try {
      const results = await destinationService.search({
        keyword: keyword.trim() || undefined,
        category: category === "all" ? undefined : category,
        visitMonth: visitMonth === "all" ? undefined : visitMonth,
      });
      setDestinations(results);
    } catch (err) {
      toast({ title: "Search failed", description: err instanceof ApiError ? err.message : String(err), variant: "destructive" });
    }
    setLoading(false);
  };

  useEffect(() => { runSearch(); /* eslint-disable-line react-hooks/exhaustive-deps */ }, [category, visitMonth]);

  const sorted = useMemo(() => {
    const list = [...destinations];
    if (sort === "rating") list.sort((a, b) => b.manualRating - a.manualRating);
    else if (sort === "budget-low") list.sort((a, b) => (a.averageBudget ?? Infinity) - (b.averageBudget ?? Infinity));
    else if (sort === "budget-high") list.sort((a, b) => (b.averageBudget ?? -Infinity) - (a.averageBudget ?? -Infinity));
    return list;
  }, [destinations, sort]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />

      <div className="relative pt-20 pb-14 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 to-background" />
        <div className="container mx-auto px-4 relative z-10 pt-8 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Compass size={16} /> Destinations
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            Where To <span className="text-gradient-hero">Next?</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {loading ? "Loading destinations…" : `${destinations.length} destinations to explore — search by name or filter by category.`}
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-2xl p-4 md:p-5 flex flex-wrap items-center gap-4 md:gap-5 shadow-card">
          <div className="flex items-center gap-2.5 bg-muted/50 px-4 py-2.5 rounded-xl flex-1 min-w-[200px]">
            <Search size={16} className="text-primary shrink-0" />
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") runSearch(); }}
              placeholder="Search destinations…"
              className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0 text-sm"
            />
          </div>
          <div className="flex items-center gap-2.5 bg-muted/50 px-4 py-2.5 rounded-xl">
            <Globe size={16} className="text-primary" />
            <select value={category} onChange={(e) => setCategory(e.target.value as DestinationCategory | "all")} className="bg-transparent text-sm font-medium text-foreground outline-none cursor-pointer">
              <option value="all">All Categories</option>
              {DESTINATION_CATEGORIES.map((c) => <option key={c} value={c}>{c.replace("_", " ")}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2.5 bg-muted/50 px-4 py-2.5 rounded-xl">
            <Calendar size={16} className="text-primary" />
            <select
              value={visitMonth}
              onChange={(e) => setVisitMonth(e.target.value === "all" ? "all" : Number(e.target.value))}
              className="bg-transparent text-sm font-medium text-foreground outline-none cursor-pointer"
            >
              <option value="all">Any Month</option>
              {MONTH_NAMES.map((name, idx) => <option key={name} value={idx + 1}>Best in {name}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2.5 bg-muted/50 px-4 py-2.5 rounded-xl">
            <SlidersHorizontal size={16} className="text-secondary" />
            <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="bg-transparent text-sm font-medium text-foreground outline-none cursor-pointer">
              <option value="rating">Top Rated</option>
              <option value="budget-low">Budget: Low to High</option>
              <option value="budget-high">Budget: High to Low</option>
            </select>
          </div>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 pb-20">
        {loading ? (
          <div className="text-center py-20 text-muted-foreground"><Loader2 className="animate-spin mx-auto mb-2" /> Loading destinations…</div>
        ) : sorted.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
            <MapPin size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground text-lg">No destinations found.</p>
            <button onClick={() => { setKeyword(""); setCategory("all"); }} className="text-primary font-semibold text-sm mt-2 hover:underline">
              Clear filters
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.map((d, i) => <DestinationCard key={d.id} destination={d} index={i} />)}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AllDestinations;
