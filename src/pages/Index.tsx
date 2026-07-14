import { motion } from "framer-motion";
import { Globe, Compass, Route } from "lucide-react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TripCard from "@/components/TripCard";
import Footer from "@/components/Footer";
import { trips } from "@/data/trips";

const features = [
  { icon: Globe, title: "Discover Destinations", desc: "Explore handpicked places across India's most stunning landscapes." },
  { icon: Compass, title: "Curated Packages", desc: "Choose from expertly planned packages by top travel planners." },
  { icon: Route, title: "Plan Together", desc: "Collaborate with friends and family to create the perfect trip." },
];

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />

    {/* Features */}
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center p-8 rounded-2xl hover:shadow-card transition-shadow duration-300"
            >
              <div className="w-14 h-14 bg-gradient-hero rounded-2xl flex items-center justify-center mx-auto mb-5">
                <f.icon className="text-primary-foreground" size={24} />
              </div>
              <h3 className="font-display font-bold text-lg mb-2 text-card-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Trips */}
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-primary text-sm font-semibold tracking-[0.15em] uppercase mb-2">Popular Destinations</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            Where Will You Go Next?
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip, i) => (
            <TripCard key={trip.id} trip={trip} index={i} />
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-hero rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4 relative z-10">
            Ready for Your Next Adventure?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto relative z-10">
            Start planning your dream trip today with Sanchari's curated travel experiences.
          </p>
          <button className="bg-card text-primary font-semibold px-8 py-3 rounded-xl hover:shadow-card-hover transition-all duration-300 relative z-10">
            Start Exploring
          </button>
        </motion.div>
      </div>
    </section>

    <Footer />
  </div>
);

export default Index;
