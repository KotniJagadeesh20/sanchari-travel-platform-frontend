import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin, Plus, Search, Star, IndianRupee, Pencil, Trash2, Eye, EyeOff,
  Loader2, X, Clock, Compass, Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import ChipListField from "@/components/admin/ChipListField";
import { adminDestinationService, type DestinationFormPayload } from "@/services/adminDestinationService";
import { DESTINATION_CATEGORIES, MONTH_NAMES, type Destination, type DestinationCategory } from "@/data/destinations";
import { toast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/api";

type AttractionForm = { name: string; description: string; attractionType: string; imageUrl: string };
type ActivityForm = { name: string; category: string; imageUrl: string };

type DestForm = {
  name: string; state: string; country: string; description: string; bestMonths: number[];
  averageBudget: string; recommendedDays: string; category: DestinationCategory | "";
  manualRating: string; imageUrls: string[]; attractions: AttractionForm[]; activities: ActivityForm[];
};

const emptyForm: DestForm = {
  name: "", state: "", country: "India", description: "", bestMonths: [],
  averageBudget: "", recommendedDays: "", category: "", manualRating: "",
  imageUrls: [], attractions: [], activities: [],
};

export default function Destinations() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<DestinationCategory | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Destination | null>(null);
  const [form, setForm] = useState<DestForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setDestinations(await adminDestinationService.getAllDestinations());
    } catch (err) {
      toast({ title: "Could not load destinations", description: err instanceof ApiError ? err.message : String(err), variant: "destructive" });
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => destinations.filter((d) => {
    const matchesQuery = !query || d.name.toLowerCase().includes(query.toLowerCase()) || (d.state || "").toLowerCase().includes(query.toLowerCase());
    const matchesCategory = categoryFilter === "all" || d.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? d.active : !d.active);
    return matchesQuery && matchesCategory && matchesStatus;
  }), [destinations, query, categoryFilter, statusFilter]);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (d: Destination) => {
    setEditing(d);
    setForm({
      name: d.name, state: d.state || "", country: d.country, description: d.description || "",
      bestMonths: d.bestMonths, averageBudget: d.averageBudget != null ? String(d.averageBudget) : "",
      recommendedDays: d.recommendedDays != null ? String(d.recommendedDays) : "", category: d.category,
      manualRating: String(d.manualRating), imageUrls: d.imageUrls,
      attractions: d.attractions.map((a) => ({ name: a.name, description: a.description || "", attractionType: a.attractionType || "", imageUrl: a.imageUrl || "" })),
      activities: d.activities.map((a) => ({ name: a.name, category: a.category || "", imageUrl: a.imageUrl || "" })),
    });
    setDialogOpen(true);
  };

  const valid = form.name.trim() && form.country.trim() && form.category;

  const toggleMonth = (month: number) =>
    setForm((f) => ({ ...f, bestMonths: f.bestMonths.includes(month) ? f.bestMonths.filter((m) => m !== month) : [...f.bestMonths, month] }));

  const addAttraction = () => setForm((f) => ({ ...f, attractions: [...f.attractions, { name: "", description: "", attractionType: "", imageUrl: "" }] }));
  const removeAttraction = (i: number) => setForm((f) => ({ ...f, attractions: f.attractions.filter((_, idx) => idx !== i) }));
  const setAttraction = (i: number, field: keyof AttractionForm, value: string) =>
    setForm((f) => ({ ...f, attractions: f.attractions.map((a, idx) => (idx === i ? { ...a, [field]: value } : a)) }));

  const addActivity = () => setForm((f) => ({ ...f, activities: [...f.activities, { name: "", category: "", imageUrl: "" }] }));
  const removeActivity = (i: number) => setForm((f) => ({ ...f, activities: f.activities.filter((_, idx) => idx !== i) }));
  const setActivity = (i: number, field: keyof ActivityForm, value: string) =>
    setForm((f) => ({ ...f, activities: f.activities.map((a, idx) => (idx === i ? { ...a, [field]: value } : a)) }));

  const submit = async () => {
    if (!valid || !form.category) return;
    setSaving(true);
    const payload: DestinationFormPayload = {
      name: form.name, state: form.state || undefined, country: form.country,
      description: form.description || undefined, bestMonths: form.bestMonths,
      averageBudget: form.averageBudget ? Number(form.averageBudget) : undefined,
      recommendedDays: form.recommendedDays ? Number(form.recommendedDays) : undefined,
      category: form.category, manualRating: form.manualRating ? Number(form.manualRating) : undefined,
      imageUrls: form.imageUrls,
      attractions: form.attractions.filter((a) => a.name.trim()).map((a) => ({
        name: a.name, description: a.description || undefined, attractionType: a.attractionType || undefined, imageUrl: a.imageUrl || undefined,
      })),
      activities: form.activities.filter((a) => a.name.trim()).map((a) => ({ name: a.name, category: a.category || undefined, imageUrl: a.imageUrl || undefined })),
    };
    try {
      if (editing) {
        await adminDestinationService.updateDestination(editing.id, payload);
        toast({ title: "Destination updated" });
      } else {
        await adminDestinationService.createDestination(payload);
        toast({ title: "Destination added" });
      }
      setDialogOpen(false);
      load();
    } catch (err) {
      toast({ title: "Save failed", description: err instanceof ApiError ? err.message : String(err), variant: "destructive" });
    }
    setSaving(false);
  };

  const toggleActive = async (d: Destination) => {
    setBusyId(d.id);
    try {
      if (d.active) {
        await adminDestinationService.delistDestination(d.id);
        toast({ title: "Destination delisted" });
      } else {
        await adminDestinationService.updateDestination(d.id, { active: true });
        toast({ title: "Destination relisted" });
      }
      load();
    } catch (err) {
      toast({ title: "Action failed", description: err instanceof ApiError ? err.message : String(err), variant: "destructive" });
    }
    setBusyId(null);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Destinations</h1>
          <p className="text-muted-foreground mt-1">{destinations.length} destinations · {filtered.length} shown</p>
        </div>
        <Button onClick={openAdd} className="bg-gradient-hero text-primary-foreground hover:opacity-90">
          <Plus size={16} className="mr-1" /> Add Destination
        </Button>
      </motion.div>

      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-3 md:items-center">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search destinations or states…" className="pl-9" />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as DestinationCategory | "all")}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="all">All categories</option>
            {DESTINATION_CATEGORIES.map((c) => <option key={c} value={c}>{c.replace("_", " ")}</option>)}
          </select>
          <div className="flex gap-2">
            {(["all", "active", "inactive"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`text-xs px-3 py-1.5 rounded-full border capitalize transition-all ${
                  statusFilter === s ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border hover:border-primary/40"
                }`}
              >{s}</button>
            ))}
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-16 text-muted-foreground"><Loader2 className="animate-spin mx-auto mb-2" /> Loading destinations…</div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="p-12 text-center text-muted-foreground">No destinations found.</CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((d, i) => (
            <motion.div key={d.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card className="hover:shadow-md transition-shadow overflow-hidden">
                {d.imageUrls[0] && (
                  <div className="relative h-32">
                    <img src={d.imageUrls[0]} alt={d.name} className="w-full h-full object-cover" />
                    <Badge variant={d.active ? "default" : "secondary"} className="absolute top-2 right-2 text-[10px]">{d.active ? "Live" : "Unpublished"}</Badge>
                  </div>
                )}
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-display font-semibold text-card-foreground">{d.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin size={11} /> {[d.state, d.country].filter(Boolean).join(", ")}</p>
                    </div>
                    {!d.imageUrls[0] && <Badge variant={d.active ? "default" : "secondary"} className="text-[10px] shrink-0">{d.active ? "Live" : "Unpublished"}</Badge>}
                  </div>

                  <Badge variant="outline" className="text-[10px] capitalize">{d.category.replace("_", " ").toLowerCase()}</Badge>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Star size={11} className="text-secondary" /> {d.manualRating.toFixed(1)}</span>
                    {d.averageBudget != null && <span className="flex items-center gap-1"><IndianRupee size={11} /> {d.averageBudget.toLocaleString()} avg</span>}
                    {d.recommendedDays != null && <span className="flex items-center gap-1"><Clock size={11} /> {d.recommendedDays}d</span>}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2 border-t border-border">
                    <span className="flex items-center gap-1"><Compass size={11} /> {d.attractions.length} attractions</span>
                    <span className="flex items-center gap-1"><Sparkles size={11} /> {d.activities.length} activities</span>
                  </div>

                  <div className="flex gap-1.5 pt-1">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => openEdit(d)}><Pencil size={13} className="mr-1" /> Edit</Button>
                    <Button size="sm" variant="outline" disabled={busyId === d.id} onClick={() => toggleActive(d)}>
                      {busyId === d.id ? <Loader2 size={13} className="animate-spin" /> : d.active ? <EyeOff size={13} /> : <Eye size={13} />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Destination" : "Add Destination"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Name</Label>
                <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Andaman Islands" />
              </div>
              <div>
                <Label className="text-xs">Category</Label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as DestinationCategory }))}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">Select category</option>
                  {DESTINATION_CATEGORIES.map((c) => <option key={c} value={c}>{c.replace("_", " ")}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">State</Label>
                <Input value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))} placeholder="Andaman & Nicobar" />
              </div>
              <div>
                <Label className="text-xs">Country</Label>
                <Input value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} />
              </div>
            </div>

            <div>
              <Label className="text-xs">Description</Label>
              <Textarea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="What makes this destination worth visiting…" />
            </div>

            <div>
              <Label className="text-xs">Best months to visit</Label>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {MONTH_NAMES.map((name, idx) => {
                  const month = idx + 1;
                  const selected = form.bestMonths.includes(month);
                  return (
                    <button
                      key={month}
                      type="button"
                      onClick={() => toggleMonth(month)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                        selected ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border hover:border-primary/40"
                      }`}
                    >
                      {name.slice(0, 3)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Avg budget (₹)</Label>
                <Input type="number" min={0} value={form.averageBudget} onChange={(e) => setForm((f) => ({ ...f, averageBudget: e.target.value }))} placeholder="15000" />
              </div>
              <div>
                <Label className="text-xs">Recommended days</Label>
                <Input type="number" min={1} value={form.recommendedDays} onChange={(e) => setForm((f) => ({ ...f, recommendedDays: e.target.value }))} placeholder="4" />
              </div>
            </div>

            <div>
              <Label className="text-xs">Rating (0–5, admin-set — not computed from reviews)</Label>
              <Input type="number" min={0} max={5} step={0.1} value={form.manualRating} onChange={(e) => setForm((f) => ({ ...f, manualRating: e.target.value }))} placeholder="4.5" className="w-32" />
            </div>

            <ChipListField label="Image URLs" icon={<MapPin size={14} className="text-primary" />} items={form.imageUrls} setItems={(v) => setForm((f) => ({ ...f, imageUrls: v }))} placeholder="https://…" />

            <div className="space-y-3 rounded-xl border border-border p-4">
              <Label className="flex items-center gap-1.5 text-sm font-medium"><Compass size={14} className="text-primary" /> Attractions</Label>
              {form.attractions.map((a, i) => (
                <div key={i} className="flex items-start gap-2 flex-wrap">
                  <Input value={a.name} onChange={(e) => setAttraction(i, "name", e.target.value)} placeholder="Name" className="flex-1 min-w-[100px]" />
                  <Input value={a.attractionType} onChange={(e) => setAttraction(i, "attractionType", e.target.value)} placeholder="Type (e.g. Beach)" className="w-28" />
                  <Input value={a.imageUrl} onChange={(e) => setAttraction(i, "imageUrl", e.target.value)} placeholder="Image URL" className="w-36" />
                  <Button type="button" variant="outline" size="sm" onClick={() => removeAttraction(i)} className="shrink-0"><X size={13} /></Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addAttraction}><Plus size={13} className="mr-1" /> Add attraction</Button>
            </div>

            <div className="space-y-3 rounded-xl border border-border p-4">
              <Label className="flex items-center gap-1.5 text-sm font-medium"><Sparkles size={14} className="text-primary" /> Activities</Label>
              {form.activities.map((a, i) => (
                <div key={i} className="flex items-start gap-2 flex-wrap">
                  <Input value={a.name} onChange={(e) => setActivity(i, "name", e.target.value)} placeholder="Name" className="flex-1 min-w-[100px]" />
                  <Input value={a.category} onChange={(e) => setActivity(i, "category", e.target.value)} placeholder="Category (e.g. Water Sports)" className="w-36" />
                  <Input value={a.imageUrl} onChange={(e) => setActivity(i, "imageUrl", e.target.value)} placeholder="Image URL" className="w-36" />
                  <Button type="button" variant="outline" size="sm" onClick={() => removeActivity(i)} className="shrink-0"><X size={13} /></Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addActivity}><Plus size={13} className="mr-1" /> Add activity</Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={submit} disabled={!valid || saving} className="bg-gradient-hero text-primary-foreground hover:opacity-90">
              {saving ? <Loader2 size={16} className="animate-spin mr-1" /> : null} {editing ? "Save changes" : "Add destination"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
