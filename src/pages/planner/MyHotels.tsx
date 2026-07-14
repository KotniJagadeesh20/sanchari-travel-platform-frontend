import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Hotel as HotelIcon, MapPin, Star, BedDouble, Users, Plus, Settings2, Pencil, Trash2, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { hotels as initialHotels, type Hotel } from "@/data/creator";

export default function MyHotels() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState<Hotel[]>(initialHotels);
  const [q, setQ] = useState("");
  const [manageId, setManageId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = hotels.filter(h =>
    h.name.toLowerCase().includes(q.toLowerCase()) ||
    h.destination.toLowerCase().includes(q.toLowerCase())
  );

  const managed = hotels.find(h => h.id === manageId);

  const handleDelete = () => {
    if (!deleteId) return;
    setHotels(prev => prev.filter(h => h.id !== deleteId));
    setDeleteId(null);
    toast.success("Hotel removed");
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">My Hotels</h1>
            <p className="text-muted-foreground mt-1">{hotels.length} properties in your portfolio</p>
          </div>
          <Button
            className="bg-gradient-hero text-primary-foreground hover:opacity-90"
            onClick={() => toast.info("Hotel onboarding coming soon")}
          >
            <Plus size={16} /> Add Hotel
          </Button>
        </div>
      </motion.div>

      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search hotels or destinations…" className="pl-9" />
          </div>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center">
            <HotelIcon className="mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No hotels match your search.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((h, i) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
            >
              <Card className="overflow-hidden hover:shadow-card-hover transition-all duration-300 h-full">
                <div className="relative h-40">
                  <img src={h.image} alt={h.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 flex items-center gap-1 bg-background/90 backdrop-blur rounded-full px-2 py-1 text-xs font-semibold text-amber-600">
                    {Array.from({ length: h.starRating }).map((_, i) => (
                      <Star key={i} size={10} fill="currentColor" strokeWidth={0} />
                    ))}
                  </div>
                  <div className="absolute top-3 right-3 bg-background/90 backdrop-blur rounded-full px-2 py-1 text-xs font-medium text-foreground">
                    ₹{h.priceFrom.toLocaleString("en-IN")}<span className="text-muted-foreground">/night</span>
                  </div>
                </div>
                <CardContent className="p-5 flex flex-col h-full">
                  <h3 className="font-display font-semibold text-card-foreground">{h.name}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin size={11} /> {h.destination}
                  </p>

                  <div className="grid grid-cols-3 gap-2 my-4 text-center">
                    <div>
                      <p className="text-sm font-semibold text-card-foreground flex items-center justify-center gap-1"><BedDouble size={12} /> {h.rooms}</p>
                      <p className="text-[10px] text-muted-foreground">Rooms</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-card-foreground flex items-center justify-center gap-1"><Users size={12} /> {h.bookings}</p>
                      <p className="text-[10px] text-muted-foreground">Bookings</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-card-foreground flex items-center justify-center gap-1 text-amber-600"><Star size={12} fill="currentColor" strokeWidth={0} /> {h.rating}</p>
                      <p className="text-[10px] text-muted-foreground">Rating</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-border/50 mt-auto">
                    <Button size="sm" className="flex-1 bg-gradient-hero text-primary-foreground hover:opacity-90" onClick={() => setManageId(h.id)}>
                      <Settings2 size={13} /> Manage
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => toast.info("Edit coming soon")}>
                      <Pencil size={13} />
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30" onClick={() => setDeleteId(h.id)}>
                      <Trash2 size={13} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Manage Hotel Dialog */}
      <Dialog open={!!manageId} onOpenChange={() => setManageId(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{managed?.name}</DialogTitle>
          </DialogHeader>
          {managed && (
            <div className="space-y-5">
              <img src={managed.image} alt={managed.name} className="w-full h-40 object-cover rounded-lg" />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Star rating", value: `${managed.starRating}★` },
                  { label: "Rooms", value: managed.rooms },
                  { label: "Bookings", value: managed.bookings },
                  { label: "Rating", value: `${managed.rating} (${managed.reviews})` },
                ].map(s => (
                  <div key={s.label} className="rounded-lg bg-muted/40 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
                    <p className="text-sm font-semibold text-foreground">{s.value}</p>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Amenities</h4>
                <div className="flex flex-wrap gap-1.5">
                  {managed.amenities.map(a => (
                    <Badge key={a} variant="secondary" className="text-xs">{a}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Quick actions</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Button variant="outline" size="sm" onClick={() => toast.info("Add Room coming soon")}><Plus size={14} /> Add Room</Button>
                  <Button variant="outline" size="sm" onClick={() => toast.info("Add Amenity coming soon")}><Plus size={14} /> Add Amenity</Button>
                  <Button variant="outline" size="sm" onClick={() => toast.info("Add Image coming soon")}><Plus size={14} /> Add Image</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-border">
                <Button variant="ghost" size="sm">Details</Button>
                <Button variant="ghost" size="sm">Rooms</Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/planner/reviews">Reviews</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/planner/bookings">Bookings</Link>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Remove hotel</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Guests won't be able to book this property anymore. Existing bookings are preserved.</p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
