import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Calendar, Users, ArrowLeft, Shield, Star, Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getTroop } from "@/data/troops";
import { toast } from "sonner";

const TroopDetails = () => {
  const { id } = useParams();
  const troop = getTroop(id || "");

  if (!troop) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Troop not found</h2>
          <Link to="/troops" className="text-primary hover:underline">← Back to Troops</Link>
        </div>
      </div>
    );
  }

  const spotsLeft = troop.maxMembers - troop.members.length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Banner */}
      <div className="relative h-[50vh] min-h-[360px]">
        <img src={troop.image} alt={troop.destination} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/troops" className="inline-flex items-center gap-1 text-white/80 hover:text-white text-sm mb-4 transition-colors">
              <ArrowLeft size={16} /> Back to Troops
            </Link>
            <Badge className="mb-3 bg-primary text-primary-foreground">{troop.type}</Badge>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-2">
              {troop.destination} Trip
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
              <span className="flex items-center gap-1"><Calendar size={14} /> {troop.dates}</span>
              <span className="flex items-center gap-1"><Users size={14} /> {troop.members.length}/{troop.maxMembers} joined</span>
              <span className="flex items-center gap-1"><MapPin size={14} /> {troop.destination}, India</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h2 className="text-2xl font-display font-bold text-foreground mb-4">About This Trip</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">{troop.description}</p>
            </motion.div>

            {/* Trust signals */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: Shield, label: "Verified Organizer", desc: "Identity verified" },
                { icon: Star, label: "4.8 Rating", desc: "From past trips" },
                { icon: Heart, label: "Safe & Inclusive", desc: "Community guidelines" },
              ].map((item, i) => (
                <div key={i} className="glass rounded-xl p-4 flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <item.icon size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Members */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                Members ({troop.members.length}/{troop.maxMembers})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {troop.members.map((member, i) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="glass rounded-xl p-4 flex flex-col items-center gap-2 hover:shadow-md transition-shadow"
                  >
                    <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-full bg-muted" />
                    <span className="text-sm font-medium text-foreground text-center">{member.name}</span>
                    {member.name === troop.organizer && (
                      <Badge variant="secondary" className="text-[10px]">Organizer</Badge>
                    )}
                  </motion.div>
                ))}
                {/* Empty spots */}
                {Array.from({ length: Math.min(spotsLeft, 4) }).map((_, i) => (
                  <div key={`empty-${i}`} className="rounded-xl border-2 border-dashed border-border p-4 flex flex-col items-center justify-center gap-2 opacity-50">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <Users size={18} className="text-muted-foreground" />
                    </div>
                    <span className="text-xs text-muted-foreground">Open spot</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar CTA */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="glass rounded-2xl p-6 space-y-6 sticky top-28">
              <div className="text-center">
                <p className="text-4xl font-display font-bold text-primary">{spotsLeft}</p>
                <p className="text-muted-foreground text-sm">spots left</p>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Destination</span>
                  <span className="font-medium text-foreground">{troop.destination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dates</span>
                  <span className="font-medium text-foreground">{troop.dates.split(",")[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium text-foreground">{troop.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Organizer</span>
                  <span className="font-medium text-foreground">{troop.organizer}</span>
                </div>
              </div>
              <Button
                className="w-full bg-gradient-hero text-primary-foreground text-lg py-6 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                onClick={() => toast.success("You've joined the troop! 🎉")}
              >
                <Users size={20} className="mr-2" /> Join Troop
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Free to join • No payment required
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TroopDetails;
