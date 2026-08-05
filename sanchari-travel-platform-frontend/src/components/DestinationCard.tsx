import { motion } from "framer-motion";
import { MapPin, Star, IndianRupee, ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import type { DestinationSummary } from "@/data/destinations";

const DestinationCard = ({ destination, index }: { destination: DestinationSummary; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.05 }}
    whileHover={{ y: -6 }}
  >
    <Link to={`/all-destinations/${destination.id}`} className="group block">
      <div className="rounded-2xl bg-card shadow-card hover:shadow-card-hover transition-all duration-500 overflow-hidden border border-border/50 hover:border-primary/20">
        {destination.thumbnailImage ? (
          <div className="h-40 overflow-hidden">
            <img
              src={destination.thumbnailImage}
              alt={destination.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ) : (
          <div className="h-1 bg-gradient-hero group-hover:h-1.5 transition-all duration-300" />
        )}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <span className="inline-block bg-primary/10 text-primary text-[10px] font-semibold px-2.5 py-0.5 rounded-full mb-2 capitalize">
                {destination.category.replace("_", " ").toLowerCase()}
              </span>
              <h3 className="text-lg font-display font-bold text-card-foreground group-hover:text-primary transition-colors duration-300 leading-snug">
                {destination.name}
              </h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin size={11} /> {[destination.state, destination.country].filter(Boolean).join(", ")}
              </p>
            </div>
            <div className="flex items-center gap-1 text-sm shrink-0 ml-3">
              <Star size={14} className="fill-secondary text-secondary" />
              <span className="font-semibold text-foreground">{destination.manualRating.toFixed(1)}</span>
            </div>
          </div>

          {destination.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{destination.description}</p>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            {destination.averageBudget != null ? (
              <p className="text-sm font-semibold text-primary flex items-center">
                <IndianRupee size={13} />{destination.averageBudget.toLocaleString()} <span className="text-xs text-muted-foreground font-normal ml-1">avg budget</span>
              </p>
            ) : <span />}
            <div className="flex items-center gap-1 text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
              Explore <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

export default DestinationCard;
