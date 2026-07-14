import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Star, MapPin, Package, Hotel as HotelIcon, Eye, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { adminDestinations, type AdminDestination } from "@/data/admin";
import { toast } from "@/hooks/use-toast";

type Filter = "all" | "popular" | "recent" | "inactive";

export default function AdminDestinations() {
  const [items, setItems] = useState<AdminDestination[]>(adminDestinations);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState(false);

  const filtered = items.filter((d) => {
    if (query && !d.name.toLowerCase().includes(query.toLowerCase()) && !d.state.toLowerCase().includes(query.toLowerCase())) return false;
    if (filter === "popular") return d.popular;
    if (filter === "recent") return new Date(d.createdAt).getTime() > Date.now() - 1000 * 60 * 60 * 24 * 120;
    if (filter === "inactive") return d.status === "inactive";
    return true;
  });

  const handleDelete = (id: string) => {
    setItems((s) => s.filter((d) => d.id !== id));
    toast({ title: "Destination removed" });
  };

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "");
    if (!name) return;
    setItems((s) => [
      {
        id: `d${Date.now()}`,
        name,
        state: String(form.get("state") || ""),
        country: String(form.get("country") || "India"),
        image: adminDestinations[0].image,
        packages: 0,
        hotels: 0,
        rating: 0,
        status: "active",
        popular: false,
        createdAt: new Date().toISOString().slice(0, 10),
      },
      ...s,
    ]);
    setOpen(false);
    toast({ title: "Destination created", description: `${name} is now live.` });
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Destinations</h1>
          <p className="text-muted-foreground mt-1">Curate the destinations travellers can discover on Sanchari.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-hero text-primary-foreground hover:opacity-90"><Plus size={16} className="mr-1" /> Create Destination</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New destination</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="space-y-3">
              <div><Label>Name</Label><Input name="name" placeholder="e.g. Andaman Islands" required /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>State</Label><Input name="state" placeholder="Andaman & Nicobar" required /></div>
                <div><Label>Country</Label><Input name="country" defaultValue="India" required /></div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-gradient-hero text-primary-foreground hover:opacity-90">Create</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search destinations or states…" className="pl-9" />
        </div>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="recent">Recently added</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {filtered.length === 0 ? (
        <Card><CardContent className="p-16 text-center text-muted-foreground">
          <MapPin className="mx-auto mb-3 opacity-50" /> No destinations match your filters.
        </CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((d, i) => (
            <motion.div key={d.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card className="overflow-hidden group hover:shadow-lg transition-all">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={d.image} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-2 right-2 flex gap-1">
                    {d.popular && <Badge className="bg-amber-500/90 text-white border-0 text-[10px]">Popular</Badge>}
                    <Badge variant={d.status === "active" ? "default" : "secondary"} className="text-[10px] capitalize">{d.status}</Badge>
                  </div>
                </div>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-display font-semibold text-card-foreground truncate">{d.name}</h3>
                    <p className="text-xs text-muted-foreground">{d.state}, {d.country}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-muted/50 py-1.5">
                      <p className="text-sm font-semibold text-card-foreground flex items-center justify-center gap-1"><Package size={11} className="text-primary" />{d.packages}</p>
                      <p className="text-[10px] text-muted-foreground">Pkgs</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 py-1.5">
                      <p className="text-sm font-semibold text-card-foreground flex items-center justify-center gap-1"><HotelIcon size={11} className="text-primary" />{d.hotels}</p>
                      <p className="text-[10px] text-muted-foreground">Hotels</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 py-1.5">
                      <p className="text-sm font-semibold text-card-foreground flex items-center justify-center gap-1"><Star size={11} className="text-amber-500" />{d.rating || "–"}</p>
                      <p className="text-[10px] text-muted-foreground">Rating</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5 pt-1">
                    <Button size="sm" variant="outline" className="flex-1"><Eye size={13} /></Button>
                    <Button size="sm" variant="outline" className="flex-1"><Pencil size={13} /></Button>
                    <Button size="sm" variant="outline" className="flex-1 text-destructive hover:text-destructive" onClick={() => handleDelete(d.id)}><Trash2 size={13} /></Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
