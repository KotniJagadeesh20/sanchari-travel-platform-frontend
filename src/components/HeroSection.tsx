import { motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";
import FloatingIcons from "./FloatingIcons";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate(query.trim() ? `/trips?search=${encodeURIComponent(query.trim())}` : "/trips");
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBg} alt="Travel landscape" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-foreground/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-foreground/20" />
      </div>

      <FloatingIcons />

      <div className="container mx-auto px-4 relative z-10 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-primary-foreground/80 text-sm font-semibold tracking-[0.2em] uppercase mb-4"
          >
            Your Journey Starts Here
          </motion.p>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-primary-foreground leading-tight mb-6">
            Explore. Plan.
            <br />
            <span className="text-gradient-hero bg-clip-text" style={{ WebkitTextFillColor: "transparent", backgroundImage: "linear-gradient(135deg, hsl(174, 80%, 65%), hsl(25, 95%, 70%))" }}>
              Travel Together.
            </span>
          </h1>
          <p className="text-primary-foreground/80 text-lg md:text-xl max-w-xl mb-10 font-light leading-relaxed">
            Discover incredible destinations, curated packages, and handpicked experiences across India's most beautiful places.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-2xl p-2 flex items-center gap-2 max-w-lg shadow-card"
          >
            <div className="flex items-center gap-2 px-4 flex-1">
              <Search size={18} className="text-muted-foreground" />
              <input
                type="text"
                placeholder="Where do you want to go?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleExplore()}
                className="bg-transparent outline-none text-foreground placeholder:text-muted-foreground w-full py-2 text-sm"
              />
            </div>
            <button
              onClick={handleExplore}
              className="bg-gradient-hero text-primary-foreground px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity shrink-0"
            >
              Explore <ArrowRight size={16} />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex gap-8 mt-12"
          >
            {[
              { value: "50+", label: "Destinations" },
              { value: "200+", label: "Packages" },
              { value: "10K+", label: "Happy Travelers" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl md:text-3xl font-display font-bold text-primary-foreground">{stat.value}</p>
                <p className="text-primary-foreground/60 text-xs">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
