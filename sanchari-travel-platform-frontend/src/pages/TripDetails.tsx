import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Calendar, Clock, ArrowRight, ArrowLeft, Plane, Compass, Globe } from "lucide-react";
import Navbar from "@/components/Navbar";
import PackageCard from "@/components/PackageCard";
import Footer from "@/components/Footer";
import { getTrip, getPackagesForTrip } from "@/data/trips";

const FloatingIcon = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`absolute pointer-events-none opacity-10 text-primary ${className}`}>
    {children}
  </div>
);

const TripDetails = () => {
  const { id } = useParams();
  const trip = getTrip(id || "");
  const pkgs = getPackagesForTrip(id || "");

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
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative h-[55vh] md:h-[65vh] overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          src={trip.image}
          alt={trip.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/30 to-transparent" />

        {/* Floating decorations */}
        <FloatingIcon className="top-24 right-10 animate-float hidden md:block"><Plane size={48} /></FloatingIcon>
        <FloatingIcon className="top-40 right-[30%] animate-float-slow hidden md:block"><Compass size={32} /></FloatingIcon>
        <FloatingIcon className="bottom-32 right-20 animate-float-delay hidden md:block"><Globe size={36} /></FloatingIcon>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container mx-auto">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Link to="/" className="inline-flex items-center gap-1.5 text-primary-foreground/70 text-sm mb-4 hover:text-primary-foreground transition-colors backdrop-blur-sm bg-foreground/10 px-3 py-1.5 rounded-full">
                <ArrowLeft size={14} /> Back to Trips
              </Link>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-primary-foreground mb-3"
            >
              {trip.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-primary-foreground/80 text-lg md:text-xl max-w-xl"
            >
              {trip.description}
            </motion.p>
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-2xl p-6 shadow-card flex flex-wrap gap-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-hero rounded-xl flex items-center justify-center shrink-0">
              <Calendar size={18} className="text-primary-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Best Time</p>
              <p className="text-sm font-bold text-foreground">{trip.bestTime}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-sunset rounded-xl flex items-center justify-center shrink-0">
              <Clock size={18} className="text-primary-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Duration</p>
              <p className="text-sm font-bold text-foreground">{trip.duration}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-ocean rounded-xl flex items-center justify-center shrink-0">
              <MapPin size={18} className="text-primary-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Places</p>
              <p className="text-sm font-bold text-foreground">{trip.places.length} places to visit</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Places */}
      <section className="py-16 md:py-20 relative overflow-hidden">
        <FloatingIcon className="top-10 left-10 animate-float-slow"><MapPin size={64} /></FloatingIcon>
        <FloatingIcon className="bottom-10 right-10 animate-float"><Globe size={48} /></FloatingIcon>

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-2">Explore</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">Places to Visit</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trip.places.map((place, i) => (
              <Link key={place.id} to={`/place/${trip.id}/${place.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -8 }}
                  className="group rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-500 bg-card cursor-pointer"
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img src={place.image} alt={place.name} loading="lazy" width={400} height={300} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                      <span className="flex items-center gap-1 text-primary-foreground text-xs font-medium bg-foreground/30 backdrop-blur-sm px-2.5 py-1 rounded-full">
                        <MapPin size={10} /> Explore
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-bold text-card-foreground mb-1.5 group-hover:text-primary transition-colors duration-300">{place.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{place.description}</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Preview */}
      {pkgs.length > 0 && (
        <section className="py-16 md:py-20 bg-muted/50 relative overflow-hidden">
          <FloatingIcon className="top-20 right-20 animate-float"><Plane size={56} /></FloatingIcon>

          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-2">Travel Packages</p>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">Popular Packages</h2>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <Link
                  to={`/packages/${trip.id}`}
                  className="hidden md:flex items-center gap-1.5 bg-gradient-hero text-primary-foreground px-5 py-2.5 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity shadow-glow"
                >
                  View All <ArrowRight size={14} />
                </Link>
              </motion.div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pkgs.slice(0, 3).map((pkg, i) => (
                <PackageCard key={pkg.id} pkg={pkg} index={i} />
              ))}
            </div>
            <Link
              to={`/packages/${trip.id}`}
              className="md:hidden flex items-center justify-center gap-1.5 bg-gradient-hero text-primary-foreground px-6 py-3 rounded-full font-semibold text-sm mt-8 hover:opacity-90 transition-opacity shadow-glow mx-auto w-fit"
            >
              View All Packages <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default TripDetails;
