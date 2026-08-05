import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Trip } from "@/data/trips";

const TripCard = ({ trip, index }: { trip: Trip; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
  >
    <Link to={`/trip/${trip.id}`} className="group block">
      <div className="relative rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 bg-card">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={trip.image}
            alt={trip.name}
            loading="lazy"
            width={800}
            height={600}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-center gap-1 mb-2">
            <MapPin size={14} className="text-secondary" />
            <span className="text-primary-foreground/80 text-xs font-medium">{trip.places.length} places</span>
          </div>
          <h3 className="text-xl font-display font-bold text-primary-foreground mb-1">{trip.name}</h3>
          <p className="text-primary-foreground/70 text-sm line-clamp-2 mb-3">{trip.description}</p>
          <div className="flex items-center gap-1 text-secondary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Explore <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

export default TripCard;
