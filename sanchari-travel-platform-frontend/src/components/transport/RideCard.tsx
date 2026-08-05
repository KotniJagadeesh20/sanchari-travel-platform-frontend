import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Car, IndianRupee, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Ride } from "@/data/transportation";

const RideCard = ({ ride, index = 0 }: { ride: Ride; index?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    whileHover={{ y: -4 }}
  >
    <Link to={`/transportation/rides/${ride.id}`} className="block">
      <div className="rounded-2xl bg-card border border-border/60 shadow-card hover:shadow-card-hover hover:border-primary/30 transition-all duration-300 p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-hero text-primary-foreground flex items-center justify-center font-display font-bold text-lg">
              {ride.createdBy.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-foreground leading-tight">{ride.createdBy.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{ride.createdBy.email}</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-[10px]">{ride.vehicle.type}</Badge>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-foreground">{ride.departureTime}</p>
            <p className="text-xs text-muted-foreground">{ride.source}</p>
          </div>
          <div className="flex-1 mx-3 border-t border-dashed border-primary/40" />
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">{ride.destination}</p>
            <p className="text-xs text-muted-foreground">{new Date(ride.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-border/60 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Car size={13} /> {ride.vehicle.number}</span>
            <span className="flex items-center gap-1"><Users size={13} /> {ride.seatsLeft} left</span>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-lg font-bold text-primary flex items-center">
              <IndianRupee size={14} />{ride.pricePerSeat}
              <span className="text-[10px] text-muted-foreground font-normal ml-1">/seat</span>
            </p>
            <span className="text-primary text-sm font-semibold inline-flex items-center gap-1">
              View <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

export default RideCard;
