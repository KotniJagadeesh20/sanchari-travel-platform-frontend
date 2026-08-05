import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, Plus, Car, Users, IndianRupee } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const RidesLanding = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    <section className="relative pt-28 pb-10">
      <div className="absolute inset-0 bg-gradient-sunset opacity-10" />
      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Car size={16} /> Ride Sharing
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-3">
            Share the journey
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Find rides going your way — or offer a seat in yours and split the cost.
          </p>
        </motion.div>
      </div>
    </section>

    <section className="container mx-auto px-4 pb-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <ActionCard
          to="/transportation/rides/search"
          icon={<Search size={28} />}
          gradient="bg-gradient-hero"
          title="Find a Ride"
          description="Browse rides across your route, filter by date and seats, and book in seconds."
          cta="Find Ride"
        />
        <ActionCard
          to="/transportation/rides/create"
          icon={<Plus size={28} />}
          gradient="bg-gradient-sunset"
          title="Offer a Ride"
          description="Publish your trip, set the seats and price, and earn back your fuel."
          cta="Offer Ride"
        />
      </div>

      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        <Stat icon={<Users size={18} />} value="12K+" label="Riders" />
        <Stat icon={<Car size={18} />} value="3.2K" label="Trips a week" />
        <Stat icon={<IndianRupee size={18} />} value="₹380" label="Avg. saved" />
        <Stat icon={<Users size={18} />} value="4.8★" label="Driver rating" />
      </div>

      <div className="mt-8 text-center">
        <Link to="/transportation/rides/my-rides" className="text-primary text-sm font-semibold hover:underline">
          View my rides →
        </Link>
      </div>
    </section>

    <Footer />
  </div>
);

const ActionCard = ({
  to, icon, gradient, title, description, cta,
}: { to: string; icon: React.ReactNode; gradient: string; title: string; description: string; cta: string }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -6 }}>
    <Link to={to} className="group block">
      <div className="rounded-3xl bg-card border border-border/60 shadow-card hover:shadow-card-hover transition-all p-8 relative overflow-hidden h-full">
        <div className={`absolute -right-16 -top-16 w-56 h-56 ${gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${gradient} text-primary-foreground mb-4 group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <h3 className="text-2xl font-display font-bold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4">{description}</p>
        <span className="text-primary font-semibold text-sm">{cta} →</span>
      </div>
    </Link>
  </motion.div>
);

const Stat = ({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) => (
  <div className="glass rounded-2xl p-4 flex items-center gap-3">
    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">{icon}</div>
    <div>
      <p className="text-lg font-bold text-foreground leading-tight">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  </div>
);

export default RidesLanding;
