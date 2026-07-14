import { Car } from "lucide-react";
import type { Ride } from "@/data/transportation";

const DriverCard = ({ createdBy, vehicle }: { createdBy: Ride["createdBy"]; vehicle: Ride["vehicle"] }) => (
  <div className="rounded-2xl bg-card border border-border/60 shadow-card p-5 md:p-6">
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 rounded-full bg-gradient-hero text-primary-foreground flex items-center justify-center font-display font-bold text-xl">
        {createdBy.name.charAt(0)}
      </div>
      <div className="flex-1">
        <h3 className="font-display font-bold text-foreground text-lg">{createdBy.name}</h3>
        <p className="text-sm text-muted-foreground">{createdBy.email}</p>
      </div>
    </div>
    <div className="mt-4 pt-4 border-t border-border/60 flex items-center gap-3 text-sm">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <Car size={18} className="text-primary" />
      </div>
      <div>
        <p className="font-semibold text-foreground">{vehicle.type}</p>
        <p className="text-xs text-muted-foreground">{vehicle.number}</p>
      </div>
    </div>
  </div>
);

export default DriverCard;
