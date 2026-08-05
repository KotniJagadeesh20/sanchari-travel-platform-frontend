import { motion } from "framer-motion";
import { Clock, MapPin, IndianRupee, ArrowRight, Users, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import type { TravelPackage } from "@/data/packages";

const RealPackageCard = ({ pkg, destinationName, index }: { pkg: TravelPackage; destinationName?: string; index: number }) => {
  const upcoming = pkg.departures.filter((d) => d.active && new Date(d.startDate) >= new Date()).sort((a, b) => a.startDate.localeCompare(b.startDate));
  const nextDeparture = upcoming[0];

  return (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.05 }}
    whileHover={{ y: -6 }}
  >
    <Link to={`/all-packages/${pkg.id}`} className="group block">
      <div className="rounded-2xl bg-card shadow-card hover:shadow-card-hover transition-all duration-500 overflow-hidden border border-border/50 hover:border-primary/20">
        <div className="h-1 bg-gradient-hero group-hover:h-1.5 transition-all duration-300" />
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              {destinationName && (
                <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3">
                  {destinationName}
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
            <span className="flex items-center gap-1.5"><Clock size={14} className="text-primary/60" /> {pkg.durationDays}D / {pkg.durationNights}N</span>
            {nextDeparture ? (
              <span className="flex items-center gap-1.5"><Calendar size={14} className="text-secondary" /> Next: {nextDeparture.startDate}</span>
            ) : (
              <span className="flex items-center gap-1.5"><Users size={14} className="text-secondary" /> No upcoming dates</span>
            )}
          </div>

          {pkg.createdBy && (
            <p className="text-xs text-muted-foreground mb-4">By <span className="font-medium text-foreground">{pkg.createdBy.name}</span></p>
          )}

          {pkg.placesCovered.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {pkg.placesCovered.slice(0, 4).map((place) => (
                <span key={place} className="flex items-center gap-1 bg-muted text-muted-foreground text-xs px-2.5 py-1 rounded-full group-hover:bg-primary/5 group-hover:text-primary/80 transition-colors duration-300">
                  <MapPin size={9} /> {place}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-1.5 text-primary text-sm font-semibold pt-4 border-t border-border/50 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
            View Details <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
  );
};

export default RealPackageCard;
