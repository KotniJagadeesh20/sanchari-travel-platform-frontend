import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Star, Hotel as HotelIcon, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { hotelService } from "@/services/hotelService";
import type { Hotel, RoomType } from "@/data/hotels";
import { ROOM_TYPES, ROOM_TYPE_LABELS } from "@/data/hotels";
import { ApiError } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const HotelResults = () => {
  const [sp, setSp] = useSearchParams();
  const nav = useNavigate();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);

  const page = Number(sp.get("page") || 0);
  const checkIn = sp.get("checkIn") || "";
  const checkOut = sp.get("checkOut") || "";
  const guests = sp.get("guests") || "";
  const destinationId = sp.get("destinationId") || "";
  const starRating = sp.get("starRating") || "";
  const roomType = (sp.get("roomType") || "") as RoomType | "";
  const minPrice = sp.get("minPrice") || "";
  const maxPrice = sp.get("maxPrice") || "";

  const search = async () => {
    setLoading(true);
    try {
      const result = await hotelService.searchHotels({
        destinationId: destinationId || undefined,
        checkIn: checkIn || undefined,
        checkOut: checkOut || undefined,
        guests: guests ? Number(guests) : undefined,
        starRating: starRating ? Number(starRating) : undefined,
        roomType: roomType || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        page,
        size: 12,
      });
      setHotels(result.hotels);
      setTotalPages(result.totalPages);
      setTotalElements(result.totalElements);
    } catch (err) {
      toast({ title: "Search failed", description: err instanceof ApiError ? err.message : String(err), variant: "destructive" });
    }
    setLoading(false);
  };

  useEffect(() => { search(); }, [sp.toString()]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(sp);
    if (value) next.set(key, value); else next.delete(key);
    next.set("page", "0");
    setSp(next);
  };

  const goToDetails = (hotelId: string) => {
    const params = new URLSearchParams();
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests) params.set("guests", guests);
    nav(`/stays/${hotelId}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-24 pb-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-1">
            {loading ? "Searching hotels…" : `${totalElements} hotel${totalElements !== 1 ? "s" : ""} found`}
          </h1>
          {checkIn && checkOut && (
            <p className="text-sm text-muted-foreground">{checkIn} → {checkOut} · {guests || 1} guest{Number(guests) !== 1 ? "s" : ""}</p>
          )}

          <div className="flex flex-wrap gap-2 mt-4">
            <select value={starRating} onChange={(e) => updateParam("starRating", e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
              <option value="">Any star rating</option>
              {[5, 4, 3, 2, 1].map((s) => <option key={s} value={s}>{s}+ stars</option>)}
            </select>
            <select value={roomType} onChange={(e) => updateParam("roomType", e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
              <option value="">Any room type</option>
              {ROOM_TYPES.map((t) => <option key={t} value={t}>{ROOM_TYPE_LABELS[t]}</option>)}
            </select>
            <input type="number" placeholder="Min price/night" value={minPrice} onChange={(e) => updateParam("minPrice", e.target.value)} className="h-9 w-36 rounded-md border border-input bg-background px-3 text-sm" />
            <input type="number" placeholder="Max price/night" value={maxPrice} onChange={(e) => updateParam("maxPrice", e.target.value)} className="h-9 w-36 rounded-md border border-input bg-background px-3 text-sm" />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[0, 1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-64 rounded-2xl" />)}
          </div>
        ) : hotels.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <HotelIcon size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-display font-bold text-foreground mb-2">No hotels match your filters</h3>
            <p className="text-muted-foreground">Try widening your search — a different destination or fewer filters.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {hotels.map((h) => (
                <motion.button
                  key={h.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                  onClick={() => goToDetails(h.id)}
                  className="text-left rounded-2xl bg-card border border-border/60 shadow-card overflow-hidden hover:shadow-glow transition-shadow"
                >
                  <div className="h-36 bg-muted flex items-center justify-center overflow-hidden">
                    {h.imageUrls[0] ? (
                      <img src={h.imageUrls[0]} alt={h.name} className="w-full h-full object-cover" />
                    ) : (
                      <HotelIcon className="text-muted-foreground" size={32} />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display font-bold text-foreground line-clamp-1">{h.name}</h3>
                      <span className="flex items-center gap-0.5 text-xs font-semibold text-amber-600 shrink-0">
                        <Star size={12} fill="currentColor" /> {h.starRating}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin size={11} /> {h.city}{h.state ? `, ${h.state}` : ""}
                    </p>
                    {h.averageRating != null && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {h.averageRating.toFixed(1)} rating · {h.reviewCount} review{h.reviewCount !== 1 ? "s" : ""}
                      </p>
                    )}
                    {h.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {h.amenities.slice(0, 3).map((a) => (
                          <span key={a.id} className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{a.name}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8">
                <Button variant="outline" size="sm" disabled={page <= 0} onClick={() => updateParam("page", String(page - 1))}>
                  <ChevronLeft size={14} /> Prev
                </Button>
                <span className="text-sm text-muted-foreground">Page {page + 1} of {totalPages}</span>
                <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => updateParam("page", String(page + 1))}>
                  Next <ChevronRight size={14} />
                </Button>
              </div>
            )}
          </>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default HotelResults;
