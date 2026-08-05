import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Hotel as HotelIcon, MapPin, Star, Mail, Phone, Clock, FileText, ArrowLeft, Loader2 } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { packageService } from "@/services/packageService";
import { adminHotelService } from "@/services/adminHotelService";
import { hotelService } from "@/services/hotelService";
import type { DestinationOption } from "@/data/packages";
import { ApiError } from "@/lib/api";

export default function CreateHotel() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const editId = sp.get("edit");

  const [destinations, setDestinations] = useState<DestinationOption[]>([]);
  const [loadingDestinations, setLoadingDestinations] = useState(true);
  const [loadingExisting, setLoadingExisting] = useState(!!editId);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [starRating, setStarRating] = useState("3");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [checkInTime, setCheckInTime] = useState("14:00");
  const [checkOutTime, setCheckOutTime] = useState("11:00");

  useEffect(() => {
    (async () => {
      try {
        setDestinations(await packageService.listDestinationOptions());
      } catch (err) {
        toast({ title: "Could not load destinations", description: err instanceof ApiError ? err.message : String(err), variant: "destructive" });
      }
      setLoadingDestinations(false);
    })();
  }, []);

  useEffect(() => {
    if (!editId) return;
    (async () => {
      const hotel = await hotelService.getHotel(editId);
      if (hotel) {
        setName(hotel.name);
        setDescription(hotel.description || "");
        setAddress(hotel.address);
        setCity(hotel.city);
        setState(hotel.state || "");
        setCountry(hotel.country);
        setStarRating(String(hotel.starRating));
        setContactEmail(hotel.contactEmail || "");
        setContactPhone(hotel.contactPhone || "");
        setCheckInTime(hotel.checkInTime || "14:00");
        setCheckOutTime(hotel.checkOutTime || "11:00");
      }
      setLoadingExisting(false);
    })();
  }, [editId]);

  const valid = name.trim() && address.trim() && city.trim() && country.trim() &&
    Number(starRating) >= 1 && Number(starRating) <= 5 && (editId || destinationId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setSubmitting(true);
    const payload = {
      name, description, ...(editId ? {} : { destinationId }),
      address, city, state, country,
      starRating: Number(starRating),
      contactEmail, contactPhone, checkInTime, checkOutTime,
    };
    try {
      if (editId) {
        await adminHotelService.updateHotel(editId, payload);
        toast({ title: "Hotel updated" });
      } else {
        await adminHotelService.createHotel(payload);
        toast({ title: "Hotel created! It's live immediately — add room types next so guests can actually book it." });
      }
      navigate("/planner/hotels");
    } catch (err) {
      toast({ title: "Save failed", description: err instanceof ApiError ? err.message : String(err), variant: "destructive" });
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/planner/hotels" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm mb-4 transition-colors">
          <ArrowLeft size={16} /> Back to Hotels
        </Link>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">{editId ? "Edit Hotel" : "Create Hotel"}</h1>
        <p className="text-muted-foreground mt-1">
          {editId ? "Update this hotel's details." : "Fill in the details, then add room types from the Hotels list."}
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardContent className="p-6">
            {loadingExisting ? (
              <div className="text-center py-10 text-muted-foreground"><Loader2 className="animate-spin mx-auto mb-2" /> Loading hotel…</div>
            ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-1.5 text-sm font-medium">
                  <HotelIcon size={14} className="text-primary" /> Hotel Name
                </Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Ocean Pearl Resort" required />
              </div>

              {!editId && (
                <div className="space-y-2">
                  <Label htmlFor="destination" className="flex items-center gap-1.5 text-sm font-medium">
                    <MapPin size={14} className="text-primary" /> Destination
                  </Label>
                  {loadingDestinations ? (
                    <p className="text-xs text-muted-foreground">Loading destinations…</p>
                  ) : destinations.length === 0 ? (
                    <p className="text-xs text-destructive">No destinations exist yet — a hotel must belong to one. Add a destination first.</p>
                  ) : (
                    <select
                      id="destination"
                      value={destinationId}
                      onChange={(e) => setDestinationId(e.target.value)}
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                      required
                    >
                      <option value="">Select a destination</option>
                      {destinations.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}{d.state ? `, ${d.state}` : ""}</option>
                      ))}
                    </select>
                  )}
                  <p className="text-xs text-muted-foreground">Can't be changed after the hotel is created.</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-1.5 text-sm font-medium">
                  <MapPin size={14} className="text-primary" /> Address
                </Label>
                <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street address" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium">City</Label>
                  <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-sm font-medium">State (optional)</Label>
                  <Input id="state" value={state} onChange={(e) => setState(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-sm font-medium">Country</Label>
                  <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stars" className="flex items-center gap-1.5 text-sm font-medium">
                    <Star size={14} className="text-primary" /> Star rating (1–5)
                  </Label>
                  <Input id="stars" type="number" min={1} max={5} value={starRating} onChange={(e) => setStarRating(e.target.value)} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="checkin" className="flex items-center gap-1.5 text-sm font-medium">
                    <Clock size={14} className="text-primary" /> Check-in time
                  </Label>
                  <Input id="checkin" type="time" value={checkInTime} onChange={(e) => setCheckInTime(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkout" className="flex items-center gap-1.5 text-sm font-medium">
                    <Clock size={14} className="text-primary" /> Check-out time
                  </Label>
                  <Input id="checkout" type="time" value={checkOutTime} onChange={(e) => setCheckOutTime(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-1.5 text-sm font-medium">
                    <Mail size={14} className="text-primary" /> Contact email
                  </Label>
                  <Input id="email" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-1.5 text-sm font-medium">
                    <Phone size={14} className="text-primary" /> Contact phone
                  </Label>
                  <Input id="phone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="desc" className="flex items-center gap-1.5 text-sm font-medium">
                  <FileText size={14} className="text-primary" /> Description
                </Label>
                <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your hotel…" rows={4} />
              </div>

              {!editId && (
                <p className="text-xs text-muted-foreground text-center">
                  Unlike packages, new hotels go live immediately (no draft step on the backend) — but with no room
                  types yet, nobody can actually book it until you add some from the Hotels list.
                </p>
              )}

              <Button type="submit" disabled={!valid || submitting} className="w-full bg-gradient-hero text-primary-foreground hover:opacity-90 h-11 text-sm font-semibold shadow-glow">
                {submitting ? <Loader2 className="animate-spin" size={18} /> : editId ? "Save changes" : "Create Hotel"}
              </Button>
            </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
