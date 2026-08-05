import { motion } from "framer-motion";
import { Clock, MapPin, Star, ArrowRight, IndianRupee } from "lucide-react";
import { Link } from "react-router-dom";
import type { Package } from "@/data/trips";

const PackageCard = ({ pkg, index }: { pkg: Package; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ y: -6 }}
  >
    <Link to={`/package/${pkg.id}`} className="group block">
      <div className="rounded-2xl bg-card shadow-card hover:shadow-card-hover transition-all duration-500 overflow-hidden border border-border/50 hover:border-primary/20">
        {/* Top accent bar */}
        <div className="h-1 bg-gradient-hero group-hover:h-1.5 transition-all duration-300" />

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              {pkg.popular && (
                <span className="inline-block bg-gradient-sunset text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full mb-3">
                  🔥 Popular
                </span>
              )}
              <h3 className="text-lg font-display font-bold text-card-foreground group-hover:text-primary transition-colors duration-300 leading-snug">
                {pkg.title}
              </h3>
            </div>
            <div className="text-right shrink-0 ml-4">
              <div className="bg-primary/5 group-hover:bg-primary/10 transition-colors px-3 py-2 rounded-xl">
                <p className="text-xl font-bold text-primary flex items-center justify-end">
                  <IndianRupee size={16} />{pkg.price.toLocaleString()}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">per person</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Clock size={14} className="text-primary/60" /> {pkg.duration}</span>
            <span className="flex items-center gap-1.5"><Star size={14} className="text-secondary" /> {pkg.planner}</span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-5">
            {pkg.places.map((place) => (
              <span key={place} className="flex items-center gap-1 bg-muted text-muted-foreground text-xs px-2.5 py-1 rounded-full group-hover:bg-primary/5 group-hover:text-primary/80 transition-colors duration-300">
                <MapPin size={9} /> {place}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-primary text-sm font-semibold pt-4 border-t border-border/50 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
            View Details <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

export default PackageCard;
