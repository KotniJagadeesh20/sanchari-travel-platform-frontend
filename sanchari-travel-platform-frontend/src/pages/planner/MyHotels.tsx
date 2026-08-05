import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, IndianRupee, Pencil, Hotel as HotelIcon, Plus, Search, ChevronDown,
  Loader2, AlertTriangle, EyeOff, Eye, Trash2, BedDouble, Star, Users, Image as ImageIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { adminHotelService } from "@/services/adminHotelService";
import { hotelService } from "@/services/hotelService";
import { packageService } from "@/services/packageService";
import type { Hotel, Room, HotelBookingRecord, RoomType } from "@/data/hotels";
import { ROOM_TYPES, ROOM_TYPE_LABELS } from "@/data/hotels";
import type { DestinationOption } from "@/data/packages";
import { ApiError } from "@/lib/api";

type Panel = "rooms" | "media" | "bookings" | null;

const emptyRoomForm = { label: "", roomType: "STANDARD" as RoomType, capacity: "2", pricePerNight: "", totalRooms: "1", description: "" };

export default function MyHotels() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [destinations, setDestinations] = useState<DestinationOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "delisted">("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  const [openPanel, setOpenPanel] = useState<Record<string, Panel>>({});
  const [bookingsByHotel, setBookingsByHotel] = useState<Record<string, HotelBookingRecord[]>>({});
  const [bookingsLoading, setBookingsLoading] = useState<string | null>(null);

  const [roomFormByHotel, setRoomFormByHotel] = useState<Record<string, typeof emptyRoomForm>>({});
  const [roomBusyId, setRoomBusyId] = useState<string | null>(null);

  const [amenityInputByHotel, setAmenityInputByHotel] = useState<Record<string, string>>({});
  const [imageInputByHotel, setImageInputByHotel] = useState<Record<string, string>>({});
  const [mediaBusyId, setMediaBusyId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [mine, dests] = await Promise.all([
        adminHotelService.getMyHotels(),
        packageService.listDestinationOptions(),
      ]);
      setHotels(mine);
      setDestinations(dests);
    } catch (err) {
      toast({ title: "Could not load hotels", description: err instanceof ApiError ? err.message : String(err), variant: "destructive" });
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const destNameById = useMemo(() => new Map(destinations.map((d) => [d.id, d.name])), [destinations]);

  const filtered = useMemo(() => hotels.filter((h) => {
    const matchesStatus = status === "all" || (status === "active" ? h.active : !h.active);
    const matchesQ = q === "" || h.name.toLowerCase().includes(q.toLowerCase()) || h.city.toLowerCase().includes(q.toLowerCase());
    return matchesStatus && matchesQ;
  }), [hotels, q, status]);

  // Refetches one hotel with full room detail (getMyHotels doesn't include rooms — mirrors
  // HotelResponse.from vs withRooms on the backend) and merges it back into the list.
  const refreshHotel = async (hotelId: string) => {
    const fresh = await hotelService.getHotel(hotelId);
    if (fresh) setHotels((prev) => prev.map((h) => (h.id === hotelId ? fresh : h)));
  };

  const toggleActive = async (hotel: Hotel) => {
    setBusyId(hotel.id);
    try {
      if (hotel.active) {
        await adminHotelService.delistHotel(hotel.id);
        toast({ title: "Hotel delisted" });
      } else {
        await adminHotelService.updateHotel(hotel.id, { active: true });
        toast({ title: "Hotel relisted" });
      }
      load();
    } catch (err) {
      toast({ title: "Action failed", description: err instanceof ApiError ? err.message : String(err), variant: "destructive" });
    }
    setBusyId(null);
  };

  const togglePanel = async (hotelId: string, panel: Panel) => {
    const next = openPanel[hotelId] === panel ? null : panel;
    setOpenPanel((prev) => ({ ...prev, [hotelId]: next }));
    if (next === "rooms" && !hotels.find((h) => h.id === hotelId)?.rooms) {
      await refreshHotel(hotelId);
    }
    if (next === "bookings" && !bookingsByHotel[hotelId]) {
      setBookingsLoading(hotelId);
      try {
        const bookings = await adminHotelService.getBookingsForHotel(hotelId);
        setBookingsByHotel((prev) => ({ ...prev, [hotelId]: bookings }));
      } catch (err) {
        toast({ title: "Could not load bookings", description: err instanceof ApiError ? err.message : String(err), variant: "destructive" });
      }
      setBookingsLoading(null);
    }
  };

  const addRoom = async (hotel: Hotel) => {
    const form = roomFormByHotel[hotel.id] || emptyRoomForm;
    if (!form.label.trim() || !form.pricePerNight || !form.totalRooms) return;
    setRoomBusyId(hotel.id);
    try {
      await adminHotelService.addRoom(hotel.id, {
        label: form.label, roomType: form.roomType,
        capacity: Number(form.capacity) || 1,
        pricePerNight: Number(form.pricePerNight),
        totalRooms: Number(form.totalRooms),
        description: form.description || undefined,
      });
      toast({ title: "Room type added" });
      setRoomFormByHotel((prev) => ({ ...prev, [hotel.id]: emptyRoomForm }));
      refreshHotel(hotel.id);
    } catch (err) {
      toast({ title: "Could not add room type", description: err instanceof ApiError ? err.message : String(err), variant: "destructive" });
    }
    setRoomBusyId(null);
  };

  const toggleRoomActive = async (hotel: Hotel, room: Room) => {
    setRoomBusyId(room.id);
    try {
      if (room.active) {
        await adminHotelService.deleteRoom(room.id);
        toast({ title: "Room type delisted" });
      } else {
        await adminHotelService.updateRoom(room.id, { active: true });
        toast({ title: "Room type relisted" });
      }
      refreshHotel(hotel.id);
    } catch (err) {
      toast({ title: "Action failed", description: err instanceof ApiError ? err.message : String(err), variant: "destructive" });
    }
    setRoomBusyId(null);
  };

  const addAmenity = async (hotel: Hotel) => {
    const name = (amenityInputByHotel[hotel.id] || "").trim();
    if (!name) return;
    setMediaBusyId(hotel.id);
    try {
      await adminHotelService.addHotelAmenity(hotel.id, name);
      setAmenityInputByHotel((prev) => ({ ...prev, [hotel.id]: "" }));
      refreshHotel(hotel.id);
    } catch (err) {
      toast({ title: "Could not add amenity", description: err instanceof ApiError ? err.message : String(err), variant: "destructive" });
    }
    setMediaBusyId(null);
  };

  const addImage = async (hotel: Hotel) => {
    const url = (imageInputByHotel[hotel.id] || "").trim();
    if (!url) return;
    setMediaBusyId(hotel.id);
    try {
      await adminHotelService.addHotelImage(hotel.id, url);
      setImageInputByHotel((prev) => ({ ...prev, [hotel.id]: "" }));
      refreshHotel(hotel.id);
    } catch (err) {
      toast({ title: "Could not add image", description: err instanceof ApiError ? err.message : String(err), variant: "destructive" });
    }
    setMediaBusyId(null);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Hotels</h1>
            <p className="text-muted-foreground mt-1">{hotels.length} hotels · {filtered.length} shown</p>
          </div>
          <Button onClick={() => navigate("/planner/hotels/create")} className="bg-gradient-hero text-primary-foreground hover:opacity-90">
            <HotelIcon size={16} className="mr-1" /> Create Hotel
          </Button>
        </div>
      </motion.div>

      <div className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800">
        <AlertTriangle size={14} className="shrink-0 mt-0.5" />
        <span>
          Showing hotels you created. This is scoped by <code>createdBy</code>, but not yet enforced as an access
          restriction — any admin can still edit, delist, or manage rooms/bookings for any hotel until the full
          ROLE_PARTNER ownership model lands (per the V2 roadmap). Unlike packages, hotels have no draft step —
          a new hotel is live immediately, even with zero room types (customers just can't book it until one exists).
        </span>
      </div>

      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-3 md:items-center">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or city…" className="pl-9" />
          </div>
          <div className="flex flex-wrap gap-2">
            {(["all", "active", "delisted"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`text-xs px-3 py-1.5 rounded-full border capitalize transition-all ${
                  status === s ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border hover:border-primary/40"
                }`}
              >{s}</button>
            ))}
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-16 text-muted-foreground"><Loader2 className="animate-spin mx-auto mb-2" /> Loading hotels…</div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center">
            <HotelIcon className="mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No hotels match your filters.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filtered.map((hotel, i) => {
            const panel = openPanel[hotel.id] || null;
            const roomForm = roomFormByHotel[hotel.id] || emptyRoomForm;
            return (
              <motion.div key={hotel.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.05 }}>
                <Card className="overflow-hidden hover:shadow-card-hover transition-all duration-300">
                  {hotel.imageUrls[0] && (
                    <div className="relative h-36">
                      <img src={hotel.imageUrls[0]} alt={hotel.name} className="w-full h-full object-cover" />
                      <Badge variant={hotel.active ? "default" : "secondary"} className="absolute top-3 right-3 text-[10px]">{hotel.active ? "Live" : "Delisted"}</Badge>
                    </div>
                  )}
                  <CardContent className="p-5">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-display font-semibold text-card-foreground leading-snug">{hotel.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <MapPin size={11} /> {destNameById.get(hotel.destinationId) || hotel.city} · <Star size={11} className="text-amber-500" fill="currentColor" /> {hotel.starRating}
                        </p>
                      </div>
                      {!hotel.imageUrls[0] && <Badge variant={hotel.active ? "default" : "secondary"} className="text-[10px]">{hotel.active ? "Live" : "Delisted"}</Badge>}
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-border/50 flex-wrap">
                      <Button variant="outline" size="sm" className="text-xs" onClick={() => navigate(`/stays/${hotel.id}`)}>View</Button>
                      <Button variant="outline" size="sm" className="text-xs" onClick={() => navigate(`/planner/hotels/create?edit=${hotel.id}`)}>
                        <Pencil size={13} className="mr-1" /> Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs" disabled={busyId === hotel.id} onClick={() => toggleActive(hotel)}>
                        {busyId === hotel.id ? <Loader2 size={13} className="animate-spin" /> : hotel.active ? <EyeOff size={13} /> : <><Eye size={13} className="mr-1" /> Relist</>}
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs" onClick={() => togglePanel(hotel.id, "rooms")}>
                        <BedDouble size={13} className={`mr-1 transition-transform ${panel === "rooms" ? "rotate-180" : ""}`} /> Rooms
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs" onClick={() => togglePanel(hotel.id, "media")}>
                        <ImageIcon size={13} className="mr-1" /> Amenities/Photos
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs ml-auto" onClick={() => togglePanel(hotel.id, "bookings")}>
                        {bookingsLoading === hotel.id ? <Loader2 size={13} className="animate-spin mr-1" /> : <ChevronDown size={13} className={`mr-1 transition-transform ${panel === "bookings" ? "rotate-180" : ""}`} />}
                        Bookings
                      </Button>
                    </div>

                    <AnimatePresence>
                      {panel === "rooms" && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="pt-3 mt-3 border-t border-border/50 space-y-2">
                            {hotel.rooms == null ? (
                              <p className="text-xs text-muted-foreground flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> Loading room types…</p>
                            ) : hotel.rooms.length === 0 ? (
                              <p className="text-xs text-muted-foreground">No room types yet — add one below. Guests can't book this hotel until it has at least one.</p>
                            ) : (
                              hotel.rooms.map((r) => (
                                <div key={r.id} className="flex items-center justify-between text-xs bg-muted/50 rounded-lg px-3 py-2">
                                  <span className="text-foreground flex items-center gap-1.5">
                                    {ROOM_TYPE_LABELS[r.roomType]} ({r.label}) · <Users size={11} /> {r.capacity} · <IndianRupee size={11} />{r.pricePerNight.toLocaleString()}/night · {r.availableRooms}/{r.totalRooms} free
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <Badge variant={r.active ? "default" : "secondary"} className="text-[9px] capitalize">{r.active ? "active" : "delisted"}</Badge>
                                    <button onClick={() => toggleRoomActive(hotel, r)} disabled={roomBusyId === r.id} className="text-muted-foreground hover:text-destructive">
                                      {roomBusyId === r.id ? <Loader2 size={12} className="animate-spin" /> : r.active ? <Trash2 size={12} /> : <Eye size={12} />}
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                            <div className="grid grid-cols-2 gap-2 pt-1">
                              <Input placeholder="Label (e.g. DLX-A)" value={roomForm.label}
                                onChange={(e) => setRoomFormByHotel((prev) => ({ ...prev, [hotel.id]: { ...roomForm, label: e.target.value } }))}
                                className="h-8 text-xs" />
                              <select value={roomForm.roomType}
                                onChange={(e) => setRoomFormByHotel((prev) => ({ ...prev, [hotel.id]: { ...roomForm, roomType: e.target.value as RoomType } }))}
                                className="h-8 text-xs rounded-md border border-input bg-background px-2">
                                {ROOM_TYPES.map((t) => <option key={t} value={t}>{ROOM_TYPE_LABELS[t]}</option>)}
                              </select>
                              <Input type="number" min={1} placeholder="Capacity" value={roomForm.capacity}
                                onChange={(e) => setRoomFormByHotel((prev) => ({ ...prev, [hotel.id]: { ...roomForm, capacity: e.target.value } }))}
                                className="h-8 text-xs" />
                              <Input type="number" min={1} placeholder="Price/night ₹" value={roomForm.pricePerNight}
                                onChange={(e) => setRoomFormByHotel((prev) => ({ ...prev, [hotel.id]: { ...roomForm, pricePerNight: e.target.value } }))}
                                className="h-8 text-xs" />
                              <Input type="number" min={1} placeholder="Total rooms" value={roomForm.totalRooms}
                                onChange={(e) => setRoomFormByHotel((prev) => ({ ...prev, [hotel.id]: { ...roomForm, totalRooms: e.target.value } }))}
                                className="h-8 text-xs" />
                              <Button size="sm" className="h-8 text-xs" disabled={roomBusyId === hotel.id || !roomForm.label || !roomForm.pricePerNight || !roomForm.totalRooms} onClick={() => addRoom(hotel)}>
                                {roomBusyId === hotel.id ? <Loader2 size={12} className="animate-spin" /> : <><Plus size={12} className="mr-1" /> Add room type</>}
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {panel === "media" && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="pt-3 mt-3 border-t border-border/50 space-y-3">
                            <div>
                              <p className="text-xs font-medium text-foreground mb-1.5">Amenities ({hotel.amenities.length})</p>
                              <div className="flex flex-wrap gap-1.5 mb-2">
                                {hotel.amenities.map((a) => <span key={a.id} className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{a.name}</span>)}
                              </div>
                              <div className="flex gap-2">
                                <Input placeholder="e.g. Free WiFi" value={amenityInputByHotel[hotel.id] || ""}
                                  onChange={(e) => setAmenityInputByHotel((prev) => ({ ...prev, [hotel.id]: e.target.value }))}
                                  onKeyDown={(e) => e.key === "Enter" && addAmenity(hotel)}
                                  className="h-8 text-xs flex-1" />
                                <Button size="sm" className="h-8 text-xs" disabled={mediaBusyId === hotel.id} onClick={() => addAmenity(hotel)}>
                                  {mediaBusyId === hotel.id ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                                </Button>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-foreground mb-1.5">Photos ({hotel.imageUrls.length})</p>
                              <div className="flex gap-2">
                                <Input placeholder="https://…" value={imageInputByHotel[hotel.id] || ""}
                                  onChange={(e) => setImageInputByHotel((prev) => ({ ...prev, [hotel.id]: e.target.value }))}
                                  onKeyDown={(e) => e.key === "Enter" && addImage(hotel)}
                                  className="h-8 text-xs flex-1" />
                                <Button size="sm" className="h-8 text-xs" disabled={mediaBusyId === hotel.id} onClick={() => addImage(hotel)}>
                                  {mediaBusyId === hotel.id ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                                </Button>
                              </div>
                              <p className="text-[11px] text-muted-foreground mt-1">No file-upload/image-hosting service exists in the backend yet — paste a hosted image URL.</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {panel === "bookings" && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="pt-3 mt-3 border-t border-border/50 space-y-2">
                            {(bookingsByHotel[hotel.id] || []).length === 0 ? (
                              <p className="text-xs text-muted-foreground">No bookings yet.</p>
                            ) : (
                              bookingsByHotel[hotel.id].map((b) => (
                                <div key={b.id} className="flex items-center justify-between text-xs bg-muted/50 rounded-lg px-3 py-2">
                                  <span className="text-foreground">Room {b.roomLabel} · {b.checkInDate} → {b.checkOutDate} · {b.numberOfGuests} guest(s)</span>
                                  <Badge variant={b.status === "CANCELLED" ? "destructive" : "default"} className="text-[9px] capitalize">{b.status.toLowerCase()}</Badge>
                                </div>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
