import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Star, IndianRupee, Clock, Calendar, Compass, Sparkles, Package as PackageIcon, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import RealPackageCard from "@/components/RealPackageCard";
import { destinationService } from "@/services/destinationService";
import { packageService } from "@/services/packageService";
import type { Destination } from "@/data/destinations";
import { formatBestMonths } from "@/data/destinations";
import type { TravelPackage } from "@/data/packages";

const RealDestinationDetails = () => {
  const { id } = useParams();
  const [destination, setDestination] = useState<Destination | undefined>();
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [packagesLoading, setPackagesLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const d = await destinationService.getDestination(id || "");
      setDestination(d);
      setLoading(false);

      if (d) {
        setPackagesLoading(true);
        setPackages(await packageService.getPackagesByDestination(d.id));
        setPackagesLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-28 space-y-4">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold mb-4">Destination not found</h1>
          <Link to="/all-destinations" className="text-primary font-semibold">Back to All Destinations</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="relative pt-20 pb-10 overflow-hidden">
        {destination.imageUrls[0] && (
          <div className="absolute inset-0">
            <img src={destination.imageUrls[0]} alt="" className="w-full h-full object-cover opacity-15 blur-sm" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/90 to-background" />
          </div>
        )}
        <div className="container mx-auto px-4 relative z-10 pt-6">
          <Link to="/all-destinations" className="inline-flex items-center gap-1.5 text-muted-foreground text-sm mb-6 hover:text-foreground transition-colors bg-muted/50 px-3 py-1.5 rounded-full">
            <ArrowLeft size={14} /> Back to All Destinations
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full capitalize">
                {destination.category.replace("_", " ").toLowerCase()}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-3">{destination.name}</h1>
            <p className="text-muted-foreground flex items-center gap-1.5 mb-4">
              <MapPin size={15} /> {[destination.state, destination.country].filter(Boolean).join(", ")}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-full"><Star size={14} className="fill-secondary text-secondary" /> {destination.manualRating.toFixed(1)}</span>
              {destination.averageBudget != null && (
                <span className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-full"><IndianRupee size={14} /> {destination.averageBudget.toLocaleString()} avg budget</span>
              )}
              {destination.recommendedDays != null && (
                <span className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-full"><Clock size={14} /> {destination.recommendedDays} days recommended</span>
              )}
              {destination.bestMonths.length > 0 && (
                <span className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-full"><Calendar size={14} /> Best: {formatBestMonths(destination.bestMonths)}</span>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20 space-y-6">
        {destination.description && (
          <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
            <h2 className="font-display font-bold text-lg mb-3 text-card-foreground">About {destination.name}</h2>
            <p className="text-muted-foreground leading-relaxed text-[15px]">{destination.description}</p>
          </div>
        )}

        {destination.imageUrls.length > 1 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {destination.imageUrls.slice(1).map((url, i) => (
              <div key={i} className="rounded-xl overflow-hidden h-28">
                <img src={url} alt={`${destination.name} ${i + 2}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        {destination.attractions.length > 0 && (
          <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
            <h2 className="font-display font-bold text-lg mb-5 text-card-foreground flex items-center gap-2"><Compass size={16} className="text-primary" /> Attractions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {destination.attractions.map((a) => (
                <div key={a.id} className="flex gap-3 p-3.5 rounded-xl bg-muted/50">
                  {a.imageUrl && (
                    <img src={a.imageUrl} alt={a.name} className="w-14 h-14 rounded-lg object-cover shrink-0" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      {!a.imageUrl && <MapPin size={14} className="text-primary shrink-0" />}
                      <span className="font-medium text-sm text-foreground">{a.name}</span>
                      {a.attractionType && <span className="text-[10px] text-muted-foreground bg-background px-2 py-0.5 rounded-full">{a.attractionType}</span>}
                    </div>
                    {a.description && <p className="text-xs text-muted-foreground mt-1">{a.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {destination.activities.length > 0 && (
          <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
            <h2 className="font-display font-bold text-lg mb-5 text-card-foreground flex items-center gap-2"><Sparkles size={16} className="text-primary" /> Activities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {destination.activities.map((a) => (
                a.imageUrl ? (
                  <div key={a.id} className="rounded-xl overflow-hidden bg-muted/50">
                    <img src={a.imageUrl} alt={a.name} className="w-full h-20 object-cover" />
                    <div className="p-2">
                      <p className="text-xs font-medium text-foreground">{a.name}</p>
                      {a.category && <p className="text-[10px] text-muted-foreground">{a.category}</p>}
                    </div>
                  </div>
                ) : (
                  <span key={a.id} className="text-sm bg-muted text-foreground px-3 py-1.5 rounded-full self-start">
                    {a.name}{a.category && <span className="text-muted-foreground text-xs"> · {a.category}</span>}
                  </span>
                )
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="font-display font-bold text-xl mb-5 text-foreground flex items-center gap-2"><PackageIcon size={18} className="text-primary" /> Packages for {destination.name}</h2>
          {packagesLoading ? (
            <div className="text-center py-10 text-muted-foreground"><Loader2 className="animate-spin mx-auto mb-2" size={20} /> Loading packages…</div>
          ) : packages.length === 0 ? (
            <div className="bg-card rounded-2xl p-8 text-center border border-border/50">
              <p className="text-sm text-muted-foreground">No packages are open for booking here yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg, i) => (
                <RealPackageCard key={pkg.id} pkg={pkg} destinationName={destination.name} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RealDestinationDetails;
