import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Clock, Star, Phone, MessageCircle, Check, IndianRupee, Shield, Plane, Compass, Heart, CalendarCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPackage, getTrip } from "@/data/trips";
import BookingDialog from "@/components/BookingDialog";

const PackageDetails = () => {
  const { id } = useParams();
  const [bookingOpen, setBookingOpen] = useState(false);
  const pkg = getPackage(id || "");
  const trip = pkg ? getTrip(pkg.tripId) : null;

  if (!pkg || !trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold mb-4">Package not found</h1>
          <Link to="/" className="text-primary font-semibold">Go back home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />

      {/* Floating decorations */}
      <div className="absolute top-40 right-8 opacity-5 text-primary animate-float pointer-events-none hidden lg:block"><Plane size={70} /></div>
      <div className="absolute top-[50%] left-6 opacity-5 text-primary animate-float-slow pointer-events-none hidden lg:block"><Compass size={50} /></div>

      {/* Header with trip image */}
      <div className="relative pt-20 pb-10 overflow-hidden">
        <div className="absolute inset-0">
          <img src={trip.image} alt="" className="w-full h-full object-cover opacity-10 blur-sm" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/90 to-background" />
        </div>
        <div className="container mx-auto px-4 relative z-10 pt-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Link to={`/packages/${trip.id}`} className="inline-flex items-center gap-1.5 text-muted-foreground text-sm mb-6 hover:text-foreground transition-colors bg-muted/50 px-3 py-1.5 rounded-full">
              <ArrowLeft size={14} /> Back to {trip.name} Packages
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20 -mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {pkg.popular && (
                  <span className="inline-block bg-gradient-sunset text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    🔥 Popular Choice
                  </span>
                )}
                <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                  {trip.name}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">{pkg.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-full"><Clock size={14} /> {pkg.duration}</span>
                <span className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-full"><Star size={14} className="text-secondary" /> {pkg.planner}</span>
                <span className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-full"><MapPin size={14} /> {pkg.places.length} places</span>
              </div>
            </div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-card rounded-2xl p-6 shadow-card border border-border/50"
            >
              <h2 className="font-display font-bold text-lg mb-3 text-card-foreground flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center"><Heart size={14} className="text-primary-foreground" /></div>
                About This Package
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[15px]">{pkg.description}</p>
            </motion.div>

            {/* Places */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-card rounded-2xl p-6 shadow-card border border-border/50"
            >
              <h2 className="font-display font-bold text-lg mb-5 text-card-foreground flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-sunset rounded-lg flex items-center justify-center"><MapPin size={14} className="text-primary-foreground" /></div>
                Places Included
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pkg.places.map((place, i) => (
                  <motion.div
                    key={place}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                  >
                    <div className="w-10 h-10 bg-gradient-hero rounded-xl flex items-center justify-center shrink-0 group-hover:shadow-glow transition-shadow">
                      <MapPin size={16} className="text-primary-foreground" />
                    </div>
                    <span className="font-medium text-sm text-foreground">{place}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-card rounded-2xl p-6 shadow-card border border-border/50"
            >
              <h2 className="font-display font-bold text-lg mb-5 text-card-foreground flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-ocean rounded-lg flex items-center justify-center"><Shield size={14} className="text-primary-foreground" /></div>
                Key Features
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pkg.features.map((f, i) => (
                  <motion.div
                    key={f}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <Check size={13} className="text-primary" />
                    </div>
                    <span className="text-sm text-foreground font-medium">{f}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Price Card */}
            <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50 sticky top-24">
              <div className="text-center mb-6 pb-6 border-b border-border">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">Starting from</p>
                <p className="text-4xl font-display font-bold text-gradient-hero">₹{pkg.price.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-1">per person</p>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <h3 className="font-semibold text-sm text-card-foreground flex items-center gap-2">
                  <IndianRupee size={14} className="text-primary" /> Price Breakdown
                </h3>
                {pkg.priceBreakdown.map((item, i) => (
                  <motion.div
                    key={item.item}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="flex items-center justify-between text-sm py-1.5"
                  >
                    <span className="text-muted-foreground">{item.item}</span>
                    <span className="font-semibold text-foreground flex items-center"><IndianRupee size={11} />{ item.cost.toLocaleString()}</span>
                  </motion.div>
                ))}
                <div className="border-t border-border pt-3 flex items-center justify-between text-sm font-bold">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary text-lg flex items-center"><IndianRupee size={13} />{pkg.price.toLocaleString()}</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setBookingOpen(true)}
                  className="w-full bg-gradient-hero text-primary-foreground py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-glow transition-shadow"
                >
                  <CalendarCheck size={16} /> Book Package
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-card border-2 border-primary text-primary py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors"
                >
                  <Phone size={16} /> Call Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-card border border-border text-muted-foreground py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-muted transition-colors text-sm"
                >
                  <MessageCircle size={16} /> WhatsApp
                </motion.button>
              </div>

              {/* Trust badge */}
              <div className="mt-5 pt-5 border-t border-border flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Shield size={14} className="text-primary" />
                <span>Secure booking · Instant confirmation</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <BookingDialog open={bookingOpen} onOpenChange={setBookingOpen} packageTitle={pkg.title} price={pkg.price} />
      <Footer />
    </div>
  );
};

export default PackageDetails;
