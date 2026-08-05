import { motion } from "framer-motion";
import { Bus, Car, Route, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TransportCard from "@/components/transport/TransportCard";

const Transportation = () => (
  <div className="min-h-screen bg-background relative overflow-hidden">
    <Navbar />

    {/* Floating decorations */}
    <div className="absolute top-32 right-8 opacity-5 text-primary animate-float pointer-events-none hidden lg:block"><Bus size={80} /></div>
    <div className="absolute top-[55%] left-6 opacity-5 text-primary animate-float-slow pointer-events-none hidden lg:block"><Car size={60} /></div>
    <div className="absolute bottom-40 right-[15%] opacity-5 text-primary animate-float-delay pointer-events-none hidden lg:block"><Route size={50} /></div>

    {/* Hero */}
    <section className="relative pt-28 pb-12">
      <div className="absolute inset-0 bg-gradient-hero opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 to-background" />
      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6"
        >
          <Sparkles size={16} /> Move smarter
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4"
        >
          Get there with <span className="text-gradient-hero">Sanchari</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-lg max-w-2xl mx-auto"
        >
          Book intercity buses or share a ride with fellow travelers. Simple, transparent, and reliable.
        </motion.p>
      </div>
    </section>

    {/* Cards */}
    <section className="container mx-auto px-4 pb-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
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
          cta="Explore Rides"
          to="/transportation/rides"
          gradient="sunset"
          index={1}
        />
      </div>

      {/* Quick links */}
      <div className="mt-10 flex flex-wrap justify-center gap-3 text-sm">
        <a href="/transportation/bus/bookings" className="glass px-4 py-2 rounded-full text-muted-foreground hover:text-foreground transition-colors">My Bus Bookings</a>
        <a href="/transportation/rides/my-rides" className="glass px-4 py-2 rounded-full text-muted-foreground hover:text-foreground transition-colors">My Rides</a>
        <a href="/transportation/rides/create" className="glass px-4 py-2 rounded-full text-muted-foreground hover:text-foreground transition-colors">Offer a Ride</a>
      </div>
    </section>

    <Footer />
  </div>
);

export default Transportation;
