import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Bus as BusIcon, Clock, IndianRupee, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Bus } from "@/data/transportation";

const BusCard = ({ bus, index = 0 }: { bus: Bus; index?: number }) => {
  // totalSeats/bookedSeats/rating/amenities have no backend model yet —
  // mapBackendBus() sets them to 0/null/[] rather than fake numbers, so hide
  // these UI bits entirely for real data instead of showing "0 seats left".
  const hasSeatData = bus.totalSeats > 0;
  const seatsLeft = bus.totalSeats - bus.bookedSeats.length;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="rounded-2xl bg-card border border-border/60 shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden">
        <div className="h-1 bg-gradient-hero" />
        <div className="p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Operator */}
            <div className="flex items-start gap-3 md:w-52">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <BusIcon size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-display font-bold text-foreground leading-tight">{bus.busName}</h3>
                {bus.operator && <p className="text-xs text-muted-foreground">{bus.operator}</p>}
                <Badge variant="secondary" className="mt-1 text-[10px] font-normal">{bus.busType}</Badge>
              </div>
            </div>

            {/* Timing */}
            <div className="flex items-center gap-4 md:gap-6 flex-1">
              <div>
                <p className="text-xl font-bold text-foreground">{bus.departure}</p>
                <p className="text-xs text-muted-foreground">{bus.source}</p>
              </div>
              <div className="flex-1 flex flex-col items-center min-w-[80px]">
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock size={11} /> {bus.duration}</span>
                <div className="w-full h-px bg-border my-1 relative">
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-dashed border-primary/40" />
                </div>
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{bus.arrival}</p>
                <p className="text-xs text-muted-foreground">{bus.destination}</p>
              </div>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-3 md:w-40 md:justify-end">
              <div className="text-right">
                {bus.rating !== null && (
                  <div className="flex items-center justify-end gap-1 text-sm">
                    <Star size={13} className="fill-secondary text-secondary" />
                    <span className="font-semibold">{bus.rating}</span>
                  </div>
                )}
                {hasSeatData && (
                  <p className="text-xs text-muted-foreground mt-0.5">{seatsLeft} seats left</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-border/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {bus.amenities.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {bus.amenities.slice(0, 4).map((a) => (
                  <span key={a} className="text-[11px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                    {a}
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center gap-4 ml-auto">
              <p className="text-xl font-bold text-primary flex items-center">
                <IndianRupee size={16} />{bus.pricePerSeat.toLocaleString()}
              </p>
              <Link
                to={`/transportation/bus/${bus.id}`}
                state={{ bus }}
                className="inline-flex items-center gap-1.5 bg-gradient-hero text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Book Now <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BusCard;
