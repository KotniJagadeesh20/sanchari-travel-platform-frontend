import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Star, ArrowLeft, Phone, MessageCircle, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getService } from "@/data/services";

const ServiceDetails = () => {
  const { id } = useParams();
  const service = getService(id || "");

  if (!service) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Service not found</h2>
          <Link to="/services" className="text-primary hover:underline">← Back to Services</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Banner */}
      <div className="relative h-[45vh] min-h-[320px]">
        <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/services" className="inline-flex items-center gap-1 text-white/80 hover:text-white text-sm mb-4 transition-colors">
              <ArrowLeft size={16} /> Back to Services
            </Link>
            <Badge className="mb-3 bg-primary/90 text-primary-foreground">{service.category}</Badge>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">{service.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
              <span className="flex items-center gap-1"><MapPin size={14} /> {service.location}</span>
              <span className="flex items-center gap-1"><Star size={14} className="fill-secondary text-secondary" /> {service.rating} rating</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h2 className="text-2xl font-display font-bold text-foreground mb-4">About</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">{service.description}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="text-2xl font-display font-bold text-foreground mb-4">What's Included</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 glass rounded-xl p-4">
                    <div className="bg-primary/10 p-1.5 rounded-lg">
                      <Check size={16} className="text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{f}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="glass rounded-2xl p-6 space-y-6 sticky top-28">
              <div className="text-center">
                <p className="text-3xl font-display font-bold text-primary">{service.price}</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Star size={14} className="fill-secondary text-secondary" />
                  <span className="text-sm text-muted-foreground">{service.rating} rating</span>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium text-foreground">{service.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-medium text-foreground">{service.location}</span>
                </div>
              </div>
              <div className="space-y-3">
                <Button
                  className="w-full bg-gradient-hero text-primary-foreground py-5 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                  onClick={() => window.open(`tel:${service.contact}`)}
                >
                  <Phone size={18} className="mr-2" /> Call Now
                </Button>
                <Button
                  variant="outline"
                  className="w-full py-5 rounded-xl font-semibold"
                  onClick={() => window.open(`https://wa.me/${service.contact.replace(/\D/g, "")}`)}
                >
                  <MessageCircle size={18} className="mr-2" /> WhatsApp
                </Button>
              </div>
              <p className="text-xs text-center text-muted-foreground">Contact directly for booking</p>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ServiceDetails;
