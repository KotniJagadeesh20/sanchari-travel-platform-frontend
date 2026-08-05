import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, LucideIcon } from "lucide-react";

interface TransportCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  cta: string;
  to: string;
  gradient: "hero" | "sunset" | "ocean";
  index?: number;
}

const gradientClass = {
  hero: "bg-gradient-hero",
  sunset: "bg-gradient-sunset",
  ocean: "bg-gradient-ocean",
};

const TransportCard = ({ icon: Icon, title, description, cta, to, gradient, index = 0 }: TransportCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    whileHover={{ y: -6 }}
  >
    <Link to={to} className="group block">
      <div className="relative overflow-hidden rounded-3xl bg-card border border-border/60 shadow-card hover:shadow-card-hover transition-all duration-500 p-8 md:p-10 h-full">
        <div className={`absolute -right-16 -top-16 w-56 h-56 ${gradientClass[gradient]} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${gradientClass[gradient]} text-primary-foreground mb-6 group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={30} />
        </div>
        <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">{title}</h3>
        <p className="text-muted-foreground text-base mb-6 leading-relaxed">{description}</p>
        <div className="inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
          {cta} <ArrowRight size={18} />
        </div>
      </div>
    </Link>
  </motion.div>
);

export default TransportCard;
