import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, MapPin, IndianRupee, Clock, FileText, Users, X, ArrowLeft, Plus, ListChecks, Loader2 } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { packageService } from "@/services/packageService";
import { adminPackageService } from "@/services/adminPackageService";
import type { DestinationOption } from "@/data/packages";
import { ApiError } from "@/lib/api";

/** Chip-list input reused for places/inclusions/exclusions/activities/imageUrls. */
function ChipListField({ label, icon, items, setItems, placeholder }: {
  label: string; icon: React.ReactNode; items: string[]; setItems: (v: string[]) => void; placeholder: string;
}) {
  const [input, setInput] = useState("");
  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !items.includes(trimmed)) { setItems([...items, trimmed]); setInput(""); }
  };
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-1.5 text-sm font-medium">{icon} {label}</Label>
      <div className="flex gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder={placeholder}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} />
        <Button type="button" variant="outline" onClick={add} className="shrink-0">Add</Button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {items.map((item) => (
            <span key={item} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
              {item}
              <button type="button" onClick={() => setItems(items.filter((i) => i !== item))} className="hover:text-destructive transition-colors">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CreatePackage() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const editId = sp.get("edit");

  const [destinations, setDestinations] = useState<DestinationOption[]>([]);
  const [loadingDestinations, setLoadingDestinations] = useState(true);
  const [loadingExisting, setLoadingExisting] = useState(!!editId);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [durationDays, setDurationDays] = useState("");
  const [durationNights, setDurationNights] = useState("");
  const [price, setPrice] = useState("");
  const [maxPeople, setMaxPeople] = useState("");
  const [thumbnailImage, setThumbnailImage] = useState("");
  const [places, setPlaces] = useState<string[]>([]);
  const [inclusions, setInclusions] = useState<string[]>([]);
  const [exclusions, setExclusions] = useState<string[]>([]);
  const [activities, setActivities] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [itinerary, setItinerary] = useState<{ dayNumber: number; plan: string }[]>([{ dayNumber: 1, plan: "" }]);
  const [firstDepartureDate, setFirstDepartureDate] = useState("");

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
      const pkg = await packageService.getPackage(editId);
      if (pkg) {
        setTitle(pkg.title);
        setDescription(pkg.description || "");
        setDestinationId(pkg.destinationId);
        setDurationDays(String(pkg.durationDays));
        setDurationNights(String(pkg.durationNights));
        setPrice(String(pkg.price));
        setMaxPeople(String(pkg.maxPeople));
        setThumbnailImage(pkg.thumbnailImage || "");
        setPlaces(pkg.placesCovered);
        setInclusions(pkg.inclusions);
        setExclusions(pkg.exclusions);
        setActivities(pkg.activities);
        setImageUrls(pkg.imageUrls);
        if (pkg.itinerary.length) setItinerary(pkg.itinerary.map((d) => ({ dayNumber: d.dayNumber, plan: d.plan })));
      }
      setLoadingExisting(false);
    })();
  }, [editId]);

  const addDay = () => setItinerary((prev) => [...prev, { dayNumber: prev.length + 1, plan: "" }]);
  const removeDay = (i: number) => setItinerary((prev) => prev.filter((_, idx) => idx !== i).map((d, idx) => ({ ...d, dayNumber: idx + 1 })));
  const setDayPlan = (i: number, plan: string) => setItinerary((prev) => prev.map((d, idx) => (idx === i ? { ...d, plan } : d)));

  const valid = title.trim() && destinationId && Number(durationDays) >= 1 && Number(durationNights) >= 0 &&
    Number(price) > 0 && Number(maxPeople) >= 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setSubmitting(true);
    const payload = {
      title, description, destinationId,
      durationDays: Number(durationDays), durationNights: Number(durationNights),
      price: Number(price), maxPeople: Number(maxPeople), thumbnailImage,
      inclusions, exclusions, placesCovered: places, activities, imageUrls,
      itinerary: itinerary.filter((d) => d.plan.trim()),
      ...(!editId && firstDepartureDate ? { departures: [{ startDate: firstDepartureDate, maxPeople: Number(maxPeople) }] } : {}),
    };
    try {
      if (editId) {
        await adminPackageService.updatePackage(editId, payload);
        toast({ title: "Package updated" });
      } else {
        await adminPackageService.createPackage(payload);
        toast({ title: "Package created!" });
      }
      navigate("/planner/packages");
    } catch (err) {
      toast({ title: "Save failed", description: err instanceof ApiError ? err.message : String(err), variant: "destructive" });
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/planner/packages" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm mb-4 transition-colors">
          <ArrowLeft size={16} /> Back to Packages
        </Link>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">{editId ? "Edit Package" : "Create Package"}</h1>
        <p className="text-muted-foreground mt-1">
          {editId ? "Update this package's details." : "Fill in the details to create a new travel package."}
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardContent className="p-6">
            {loadingExisting ? (
              <div className="text-center py-10 text-muted-foreground"><Loader2 className="animate-spin mx-auto mb-2" /> Loading package…</div>
            ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center gap-1.5 text-sm font-medium">
                  <Package size={14} className="text-primary" /> Package Title
                </Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Ooty Heritage Explorer" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination" className="flex items-center gap-1.5 text-sm font-medium">
                  <MapPin size={14} className="text-primary" /> Destination
                </Label>
                {loadingDestinations ? (
                  <p className="text-xs text-muted-foreground">Loading destinations…</p>
                ) : destinations.length === 0 ? (
                  <p className="text-xs text-destructive">No destinations exist yet — a package must belong to one. Add a destination first.</p>
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
              </div>

              <ChipListField label="Places Covered" icon={<MapPin size={14} className="text-primary" />} items={places} setItems={setPlaces} placeholder="Type a place and press Add" />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="flex items-center gap-1.5 text-sm font-medium">
                    <IndianRupee size={14} className="text-primary" /> Price per person (₹)
                  </Label>
                  <Input id="price" type="number" min={1} value={price} onChange={(e) => setPrice(e.target.value)} placeholder="12999" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="people" className="flex items-center gap-1.5 text-sm font-medium">
                    <Users size={14} className="text-primary" /> Max people
                  </Label>
                  <Input id="people" type="number" min={1} value={maxPeople} onChange={(e) => setMaxPeople(e.target.value)} placeholder="e.g., 20" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="days" className="flex items-center gap-1.5 text-sm font-medium">
                    <Clock size={14} className="text-primary" /> Duration (days)
                  </Label>
                  <Input id="days" type="number" min={1} value={durationDays} onChange={(e) => setDurationDays(e.target.value)} placeholder="4" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nights" className="flex items-center gap-1.5 text-sm font-medium">
                    <Clock size={14} className="text-primary" /> Duration (nights)
                  </Label>
                  <Input id="nights" type="number" min={0} value={durationNights} onChange={(e) => setDurationNights(e.target.value)} placeholder="3" required />
                </div>
              </div>

              {!editId && (
                <div className="space-y-2">
                  <Label htmlFor="firstDeparture" className="flex items-center gap-1.5 text-sm font-medium">
                    <Clock size={14} className="text-primary" /> First departure date (optional)
                  </Label>
                  <Input id="firstDeparture" type="date" value={firstDepartureDate} onChange={(e) => setFirstDepartureDate(e.target.value)} />
                  <p className="text-xs text-muted-foreground">
                    Skip this if you're not ready to open bookings yet — you can add departure dates any time from the Packages list. A package with no dates or that isn't published yet won't show up to customers.
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="desc" className="flex items-center gap-1.5 text-sm font-medium">
                  <FileText size={14} className="text-primary" /> Description
                </Label>
                <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your package…" rows={4} />
              </div>

              <div className="space-y-4 rounded-xl border border-border p-4">
                <Label className="flex items-center gap-1.5 text-sm font-medium">
                  <ListChecks size={14} className="text-primary" /> Day-wise Itinerary
                </Label>
                {itinerary.map((day, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="mt-2 text-xs font-semibold text-muted-foreground shrink-0 w-10">Day {day.dayNumber}</span>
                    <Textarea rows={2} value={day.plan} onChange={(e) => setDayPlan(i, e.target.value)} placeholder="What happens on this day…" className="flex-1" />
                    {itinerary.length > 1 && (
                      <Button type="button" variant="outline" size="sm" onClick={() => removeDay(i)} className="mt-1 shrink-0"><X size={13} /></Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addDay}><Plus size={13} className="mr-1" /> Add day</Button>
              </div>

              <ChipListField label="Inclusions" icon={<Package size={14} className="text-primary" />} items={inclusions} setItems={setInclusions} placeholder="e.g., Hotel Stay" />
              <ChipListField label="Exclusions" icon={<Package size={14} className="text-primary" />} items={exclusions} setItems={setExclusions} placeholder="e.g., Flights" />
              <ChipListField label="Activities" icon={<Package size={14} className="text-primary" />} items={activities} setItems={setActivities} placeholder="e.g., Scuba Diving" />

              <div className="space-y-2">
                <Label htmlFor="thumb" className="text-sm font-medium">Thumbnail image URL</Label>
                <Input id="thumb" value={thumbnailImage} onChange={(e) => setThumbnailImage(e.target.value)} placeholder="https://…" />
                <p className="text-xs text-muted-foreground">
                  No file-upload/image-hosting service exists in the backend yet — paste a hosted image URL for now.
                </p>
              </div>
              <ChipListField label="Gallery image URLs" icon={<Package size={14} className="text-primary" />} items={imageUrls} setItems={setImageUrls} placeholder="https://…" />

              {!editId && (
                <p className="text-xs text-muted-foreground text-center">
                  New packages are created as drafts — customers won't see this until you publish it from the Packages list.
                </p>
              )}

              <Button type="submit" disabled={!valid || submitting} className="w-full bg-gradient-hero text-primary-foreground hover:opacity-90 h-11 text-sm font-semibold shadow-glow">
                {submitting ? <Loader2 className="animate-spin" size={18} /> : editId ? "Save changes" : "Create Package"}
              </Button>
            </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
