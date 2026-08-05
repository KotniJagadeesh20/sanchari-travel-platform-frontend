import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, MapPin, Calendar, Filter, ChevronRight, Compass } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { troops } from "@/data/troops";

const typeColors: Record<string, string> = {
  "Road Trip": "bg-secondary text-secondary-foreground",
  Backpacking: "bg-accent text-accent-foreground",
  "Group Trip": "bg-primary text-primary-foreground",
  "Weekend Getaway": "bg-muted text-foreground",
};

const Troops = () => {
  const [destination, setDestination] = useState("all");
  const [type, setType] = useState("all");

  const destinations = [...new Set(troops.map((t) => t.destination))];
  const types = [...new Set(troops.map((t) => t.type))];

  const filtered = troops.filter((t) => {
    if (destination !== "all" && t.destination !== destination) return false;
    if (type !== "all" && t.type !== type) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Users size={16} />
              Travel with new people
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Travel <span className="text-primary">Troops</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join group trips with fellow travelers. Find your tribe, share adventures, and create lifelong memories.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="container mx-auto px-4 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center gap-4 glass rounded-2xl p-4"
        >
          <Filter size={18} className="text-muted-foreground" />
          <Select value={destination} onValueChange={setDestination}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Destination" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Destinations</SelectItem>
              {destinations.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trip Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {types.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>
      </section>

      {/* Grid */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((troop, i) => (
            <motion.div
              key={troop.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link to={`/troops/${troop.id}`}>
                <div className="group rounded-2xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={troop.image}
                      alt={troop.destination}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <Badge className={`absolute top-3 left-3 ${typeColors[troop.type]}`}>
                      {troop.type}
                    </Badge>
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white">
                      <MapPin size={14} />
                      <span className="text-sm font-semibold">{troop.destination}</span>
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar size={14} />
                      {troop.dates}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{troop.description}</p>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {troop.members.slice(0, 4).map((m) => (
                            <img
                              key={m.id}
                              src={m.avatar}
                              alt={m.name}
                              className="w-7 h-7 rounded-full border-2 border-card bg-muted"
                            />
                          ))}
                          {troop.members.length > 4 && (
                            <div className="w-7 h-7 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                              +{troop.members.length - 4}
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {troop.members.length}/{troop.maxMembers}
                        </span>
                      </div>
                      <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        View <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Compass size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">No troops found. Try changing filters.</p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Troops;
