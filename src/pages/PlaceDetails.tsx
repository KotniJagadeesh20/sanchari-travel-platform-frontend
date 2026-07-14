import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Camera, Sun, Mountain, TreePine, Clock, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPlace, getTrip } from "@/data/trips";

const placeInfo: Record<string, { highlights: string[]; bestTime: string; rating: string; category: string; tips: string[] }> = {
  "ooty-lake": { highlights: ["Boating on serene waters", "Beautiful surrounding gardens", "Toy train views nearby", "Evening light shows"], bestTime: "Year-round", rating: "4.5", category: "Lake", tips: ["Visit early morning for fewer crowds", "Try the pedal boats for a peaceful experience"] },
  "botanical-garden": { highlights: ["Over 1,000 plant species", "Fossilized tree trunk", "Italian-style garden layout", "Annual flower show in May"], bestTime: "May – June", rating: "4.6", category: "Garden", tips: ["Spend at least 2 hours", "Don't miss the fossil tree section"] },
  "doddabetta": { highlights: ["Highest peak in Nilgiris", "Telescope house at summit", "360° panoramic views", "Tea plantations en route"], bestTime: "Oct – Mar", rating: "4.4", category: "Peak", tips: ["Go early for clear views", "Carry warm clothing"] },
  "tea-factory": { highlights: ["Watch tea processing live", "Fresh Nilgiri tea tasting", "Learn about tea grades", "Buy authentic tea products"], bestTime: "Year-round", rating: "4.3", category: "Factory", tips: ["Morning visits see active processing", "Great photo opportunities"] },
  "baga-beach": { highlights: ["Vibrant nightlife scene", "Water sports paradise", "Famous beach shacks", "Stunning sunsets"], bestTime: "Nov – Feb", rating: "4.5", category: "Beach", tips: ["Visit Tito's Lane at night", "Try parasailing and jet skiing"] },
  "fort-aguada": { highlights: ["17th-century Portuguese fort", "Panoramic ocean views", "Historic lighthouse", "Well-preserved architecture"], bestTime: "Nov – Feb", rating: "4.4", category: "Fort", tips: ["Go during sunset for best photos", "Combine with Sinquerim Beach visit"] },
  "dudhsagar": { highlights: ["Four-tiered waterfall", "310 meters tall", "Jeep safari through forests", "Natural swimming pool at base"], bestTime: "Oct – Jan", rating: "4.7", category: "Waterfall", tips: ["Book jeep safari in advance", "Carry waterproof bags for electronics"] },
  "old-goa": { highlights: ["UNESCO World Heritage Site", "Basilica of Bom Jesus", "Se Cathedral", "Baroque and Gothic architecture"], bestTime: "Nov – Feb", rating: "4.6", category: "Heritage", tips: ["Hire a local guide for history", "Visit on weekdays for fewer crowds"] },
  "abbey-falls": { highlights: ["Surrounded by coffee estates", "Lush green scenery", "Hanging bridge viewpoint", "Spice plantation nearby"], bestTime: "Oct – Jan", rating: "4.3", category: "Waterfall", tips: ["Best after monsoon season", "Slippery paths — wear good shoes"] },
  "raja-seat": { highlights: ["Kings' sunset viewpoint", "Musical fountain show", "Panoramic valley views", "Beautiful flower garden"], bestTime: "Oct – Mar", rating: "4.2", category: "Viewpoint", tips: ["Visit for evening fountain show", "Great sunrise point too"] },
  "talacauvery": { highlights: ["Origin of River Cauvery", "Sacred temple complex", "Brahmagiri hill trek", "Spiritual significance"], bestTime: "Oct – Mar", rating: "4.1", category: "Temple", tips: ["Trek to Brahmagiri Peak nearby", "Visit during Tula Sankramana festival"] },
  "namdroling": { highlights: ["Golden Temple complex", "18-meter golden Buddha", "Tibetan Buddhist culture", "Peaceful monastery grounds"], bestTime: "Oct – Mar", rating: "4.7", category: "Monastery", tips: ["Observe prayer ceremonies", "Try Tibetan food nearby"] },
  "dal-lake": { highlights: ["Iconic shikara rides", "Floating markets", "Houseboat stays", "Mughal garden views"], bestTime: "Apr – Oct", rating: "4.8", category: "Lake", tips: ["Stay in a houseboat overnight", "Visit floating vegetable market at dawn"] },
  "gulmarg": { highlights: ["Asia's highest gondola", "Pristine ski slopes", "Meadow of flowers", "Stunning mountain panorama"], bestTime: "Dec – Mar (snow), Apr – Jun (flowers)", rating: "4.9", category: "Hill Station", tips: ["Book gondola tickets early", "Try skiing in winter months"] },
  "pahalgam": { highlights: ["Valley of Shepherds", "Lidder River fishing", "Aru Valley trek", "Betaab Valley scenery"], bestTime: "Mar – Oct", rating: "4.7", category: "Valley", tips: ["Horse ride to Baisaran", "Visit Betaab Valley for Bollywood nostalgia"] },
  "mughal-gardens": { highlights: ["Shalimar Bagh terraces", "Nishat Bagh lake views", "Chashme Shahi spring", "Chinar tree avenues"], bestTime: "Mar – May (tulips)", rating: "4.5", category: "Garden", tips: ["Visit during tulip season", "See all three gardens in one day"] },
  "rohtang": { highlights: ["Breathtaking snow views", "13,050 ft altitude", "Gateway to Lahaul-Spiti", "Adventure activities in snow"], bestTime: "May – Jun, Sep – Oct", rating: "4.6", category: "Mountain Pass", tips: ["Get permit in advance online", "Carry altitude sickness medication"] },
  "solang": { highlights: ["Paragliding paradise", "Skiing in winter", "Zorbing and rope way", "Stunning valley views"], bestTime: "Dec – Feb (snow), May – Jun (adventure)", rating: "4.5", category: "Valley", tips: ["Try paragliding for aerial views", "Negotiate adventure sport prices"] },
  "hadimba": { highlights: ["Ancient cave temple", "Pagoda-style architecture", "Cedar forest surroundings", "Dedicated to goddess Hadimba"], bestTime: "Year-round", rating: "4.4", category: "Temple", tips: ["Visit early to avoid queues", "Walk through the surrounding deodar forest"] },
  "old-manali": { highlights: ["Charming hippie village", "Riverside cafés", "Handcraft shopping", "Manu Temple nearby"], bestTime: "Mar – Jun", rating: "4.3", category: "Village", tips: ["Walk across the bridge to explore", "Try the famous cafés for Israeli and Italian food"] },
  "jaipur": { highlights: ["Amber Fort grandeur", "Hawa Mahal facade", "City Palace museum", "Jantar Mantar observatory"], bestTime: "Oct – Mar", rating: "4.7", category: "City", tips: ["Elephant ride at Amber Fort", "Visit Nahargarh Fort for sunset"] },
  "udaipur": { highlights: ["City Palace lakeside", "Lake Pichola boat ride", "Jag Mandir island", "Romantic sunset views"], bestTime: "Oct – Mar", rating: "4.8", category: "City", tips: ["Watch sunset from Ambrai Ghat", "Dine at a lakeside restaurant"] },
  "jaisalmer": { highlights: ["Golden sandstone fort", "Sam Sand Dunes safari", "Patwon Ki Haveli", "Desert cultural shows"], bestTime: "Oct – Mar", rating: "4.6", category: "Desert City", tips: ["Stay overnight in desert camp", "Visit the living fort at sunrise"] },
  "jodhpur": { highlights: ["Mehrangarh Fort views", "Blue city old town", "Umaid Bhawan Palace", "Spice and textile markets"], bestTime: "Oct – Mar", rating: "4.5", category: "City", tips: ["Zip-line at Mehrangarh", "Walk through the blue-painted streets"] },
};

const defaultInfo = { highlights: ["Beautiful scenery", "Rich cultural heritage", "Local cuisine", "Photography spots"], bestTime: "Year-round", rating: "4.5", category: "Attraction", tips: ["Carry comfortable walking shoes", "Visit during weekdays for fewer crowds"] };

const PlaceDetails = () => {
  const { tripId, placeId } = useParams();
  const trip = getTrip(tripId || "");
  const place = getPlace(tripId || "", placeId || "");

  if (!place || !trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold mb-4">Place not found</h1>
          <Link to="/" className="text-primary font-semibold">Go back home</Link>
        </div>
      </div>
    );
  }

  const info = placeInfo[place.id] || defaultInfo;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="relative h-[55vh] md:h-[65vh] overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          src={place.image}
          alt={place.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container mx-auto">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Link to={`/trip/${trip.id}`} className="inline-flex items-center gap-1.5 text-primary-foreground/70 text-sm mb-4 hover:text-primary-foreground transition-colors backdrop-blur-sm bg-foreground/10 px-3 py-1.5 rounded-full">
                <ArrowLeft size={14} /> Back to {trip.name}
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex items-center gap-2 mb-2">
              <span className="bg-primary/80 backdrop-blur-sm text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">{info.category}</span>
              <span className="flex items-center gap-1 text-secondary text-sm font-semibold">
                <Star size={14} className="fill-secondary" /> {info.rating}
              </span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-primary-foreground mb-3">
              {place.name}
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="text-primary-foreground/80 text-lg md:text-xl max-w-xl">
              {place.description}
            </motion.p>
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="glass rounded-2xl p-6 shadow-card flex flex-wrap gap-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-hero rounded-xl flex items-center justify-center shrink-0">
              <Sun size={18} className="text-primary-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Best Time</p>
              <p className="text-sm font-bold text-foreground">{info.bestTime}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-sunset rounded-xl flex items-center justify-center shrink-0">
              <MapPin size={18} className="text-primary-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Located in</p>
              <p className="text-sm font-bold text-foreground">{trip.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-ocean rounded-xl flex items-center justify-center shrink-0">
              <Star size={18} className="text-primary-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Rating</p>
              <p className="text-sm font-bold text-foreground">{info.rating} / 5.0</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Highlights */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-2">Discover</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">Highlights</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {info.highlights.map((highlight, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50"
              >
                <div className="w-12 h-12 bg-gradient-hero rounded-xl flex items-center justify-center mb-4">
                  {i === 0 && <Camera size={20} className="text-primary-foreground" />}
                  {i === 1 && <Mountain size={20} className="text-primary-foreground" />}
                  {i === 2 && <TreePine size={20} className="text-primary-foreground" />}
                  {i === 3 && <Star size={20} className="text-primary-foreground" />}
                </div>
                <h3 className="font-display font-bold text-card-foreground mb-1">{highlight}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Travel Tips */}
      <section className="py-16 md:py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-2">Pro Tips</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">Travel Tips</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            {info.tips.map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex items-start gap-4 bg-card rounded-xl p-5 shadow-card"
              >
                <div className="w-8 h-8 bg-gradient-sunset rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <Clock size={14} className="text-primary-foreground" />
                </div>
                <p className="text-foreground font-medium leading-relaxed">{tip}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Ready to visit {place.name}?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Explore travel packages that include {place.name} and book your trip to {trip.name}.
            </p>
            <Link
              to={`/packages/${trip.id}`}
              className="inline-flex items-center gap-2 bg-gradient-hero text-primary-foreground px-8 py-3.5 rounded-full font-semibold hover:opacity-90 transition-opacity shadow-glow"
            >
              View {trip.name} Packages
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PlaceDetails;