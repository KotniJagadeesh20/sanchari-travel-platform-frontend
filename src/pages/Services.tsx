import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Hotel, Car, Bus, UtensilsCrossed, Compass, MapPin, Star, ChevronRight, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TransportCard from "@/components/transport/TransportCard";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { services, type ServiceCategory } from "@/data/services";

const categoryIcons: Record<ServiceCategory, React.ReactNode> = {
  Stays: <Hotel size={16} />,
  Transport: <Car size={16} />,
  Food: <UtensilsCrossed size={16} />,
  Guides: <Compass size={16} />,
};

const Services = () => {
  const [category, setCategory] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = services.filter((s) => {
    if (category !== "all" && s.category !== category) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.location.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-ocean opacity-10" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Compass size={16} />
              Everything you need at your destination
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Local <span className="text-accent">Services</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover stays, transport, food, and guides at every destination. Everything curated for travelers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="container mx-auto px-4 pb-6 space-y-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="relative max-w-md mx-auto">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search services or locations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex justify-center">
          <Tabs value={category} onValueChange={setCategory}>
            <TabsList className="bg-muted/50">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="Stays" className="flex items-center gap-1"><Hotel size={14} /> Stays</TabsTrigger>
              <TabsTrigger value="Transport" className="flex items-center gap-1"><Car size={14} /> Transport</TabsTrigger>
              <TabsTrigger value="Food" className="flex items-center gap-1"><UtensilsCrossed size={14} /> Food</TabsTrigger>
              <TabsTrigger value="Guides" className="flex items-center gap-1"><Compass size={14} /> Guides</TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>
      </section>

      {/* Grid */}
      <section className="container mx-auto px-4 pb-20">
        {category === "Transport" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-5xl mx-auto mb-14"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-display font-bold text-foreground">On the move</h2>
              <p className="text-muted-foreground">
                Book intercity buses or share a ride with fellow travelers.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TransportCard
                icon={Bus}
                title="Bus Booking"
                description="Book intercity buses with live seat availability, transparent pricing, and instant confirmations."
                cta="Book Bus"
                to="/transportation/bus"
                gradient="hero"
                index={0}
              />
              <TransportCard
                icon={Car}
                title="Ride Sharing"
                description="Find rides going your way or offer your own. Split fuel, meet fellow travelers, travel light."
                cta="Find Rides"
                to="/transportation/rides"
                gradient="sunset"
                index={1}
              />
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link to={`/services/${service.id}`}>
                <div className="group rounded-2xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <Badge className="absolute top-3 left-3 bg-card/90 text-foreground border-none flex items-center gap-1">
                      {categoryIcons[service.category]} {service.category}
                    </Badge>
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/40 text-white px-2 py-1 rounded-lg text-xs">
                      <Star size={12} className="fill-secondary text-secondary" /> {service.rating}
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {service.name}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin size={13} /> {service.location}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-primary font-bold">{service.price}</span>
                      <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        Details <ChevronRight size={14} />
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
            <p className="text-muted-foreground text-lg">No services found. Try a different search.</p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Services;
