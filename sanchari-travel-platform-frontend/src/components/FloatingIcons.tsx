import { Plane, MapPin, Compass, Mountain } from "lucide-react";

const FloatingIcons = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <Plane className="absolute top-[15%] left-[8%] text-primary/10 animate-float" size={32} />
    <MapPin className="absolute top-[25%] right-[10%] text-secondary/10 animate-float-delay" size={28} />
    <Compass className="absolute bottom-[30%] left-[15%] text-accent/10 animate-float-slow" size={36} />
    <Mountain className="absolute bottom-[20%] right-[12%] text-primary/10 animate-float" size={40} />
  </div>
);

export default FloatingIcons;
