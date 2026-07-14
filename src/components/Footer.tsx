import { MapPin, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-foreground text-primary-foreground/80 py-16">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="bg-gradient-hero rounded-xl p-2">
              <MapPin className="text-primary-foreground" size={18} />
            </div>
            <span className="text-lg font-display font-bold text-primary-foreground">Sanchari</span>
          </Link>
          <p className="text-sm text-primary-foreground/50 leading-relaxed">
            Discover India's most beautiful destinations with curated travel packages.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-primary-foreground mb-4 text-sm">Destinations</h4>
          <div className="flex flex-col gap-2">
            {["Ooty", "Goa", "Coorg", "Kashmir", "Manali", "Rajasthan"].map((d) => (
              <Link key={d} to={`/trip/${d.toLowerCase()}`} className="text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors">{d}</Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-primary-foreground mb-4 text-sm">Company</h4>
          <div className="flex flex-col gap-2">
            {["About Us", "Contact", "Privacy Policy", "Terms"].map((item) => (
              <Link key={item} to="/" className="text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors">{item}</Link>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 pt-6 text-center">
        <p className="text-xs text-primary-foreground/40 flex items-center justify-center gap-1">
          Made with <Heart size={12} className="text-secondary" /> by Sanchari
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
