import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, IndianRupee, Pencil, Package, Plus, Search, Calendar, ChevronDown, Loader2, AlertTriangle, EyeOff, Eye, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { adminPackageService } from "@/services/adminPackageService";
import { packageService } from "@/services/packageService";
import type { TravelPackage, PackageBookingRecord, DestinationOption } from "@/data/packages";
import { ApiError } from "@/lib/api";

export default function MyPackages() {
  const navigate = useNavigate();
  const [pkgs, setPkgs] = useState<TravelPackage[]>([]);
  const [destinations, setDestinations] = useState<DestinationOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "delisted">("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [bookingsByPkg, setBookingsByPkg] = useState<Record<string, PackageBookingRecord[]>>({});
  const [bookingsLoading, setBookingsLoading] = useState<string | null>(null);

  const [departuresOpenId, setDeparturesOpenId] = useState<string | null>(null);
  const [newDepartureByPkg, setNewDepartureByPkg] = useState<Record<string, { date: string; maxPeople: string }>>({});
  const [departureBusyId, setDepartureBusyId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [all, dests] = await Promise.all([
        adminPackageService.getMyPackages(),
        packageService.listDestinationOptions(),
      ]);
      setPkgs(all);
      setDestinations(dests);
    } catch (err) {
      toast({ title: "Could not load packages", description: err instanceof ApiError ? err.message : String(err), variant: "destructive" });
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const destNameById = useMemo(() => new Map(destinations.map((d) => [d.id, d.name])), [destinations]);

  const filtered = useMemo(() => pkgs.filter((p) => {
    const matchesStatus = status === "all" || (status === "active" ? p.active : !p.active);
    const matchesQ = q === "" || p.title.toLowerCase().includes(q.toLowerCase()) || p.placesCovered.join(" ").toLowerCase().includes(q.toLowerCase());
    return matchesStatus && matchesQ;
  }), [pkgs, q, status]);

  const toggleActive = async (pkg: TravelPackage) => {
    setBusyId(pkg.id);
    try {
      if (pkg.active) {
        await adminPackageService.delistPackage(pkg.id);
        toast({ title: "Package delisted" });
      } else {
        await adminPackageService.updatePackage(pkg.id, { active: true });
        toast({ title: "Package relisted" });
      }
      load();
    } catch (err) {
      toast({ title: "Action failed", description: err instanceof ApiError ? err.message : String(err), variant: "destructive" });
    }
    setBusyId(null);
  };

  const toggleBookings = async (pkgId: string) => {
    if (expandedId === pkgId) { setExpandedId(null); return; }
    setExpandedId(pkgId);
    if (!bookingsByPkg[pkgId]) {
      setBookingsLoading(pkgId);
      try {
        const bookings = await adminPackageService.getBookingsForPackage(pkgId);
        setBookingsByPkg((prev) => ({ ...prev, [pkgId]: bookings }));
      } catch (err) {
        toast({ title: "Could not load bookings", description: err instanceof ApiError ? err.message : String(err), variant: "destructive" });
      }
      setBookingsLoading(null);
    }
  };

  const addDeparture = async (pkg: TravelPackage) => {
    const form = newDepartureByPkg[pkg.id];
    if (!form?.date) return;
    setDepartureBusyId(pkg.id);
    try {
      await adminPackageService.addDeparture(pkg.id, form.date, form.maxPeople ? Number(form.maxPeople) : undefined);
      toast({ title: "Departure added" });
      setNewDepartureByPkg((prev) => ({ ...prev, [pkg.id]: { date: "", maxPeople: "" } }));
      load();
    } catch (err) {
      toast({ title: "Could not add departure", description: err instanceof ApiError ? err.message : String(err), variant: "destructive" });
    }
    setDepartureBusyId(null);
  };

  const cancelDeparture = async (departureId: string) => {
    setDepartureBusyId(departureId);
    try {
      await adminPackageService.cancelDeparture(departureId);
      toast({ title: "Departure cancelled" });
      load();
    } catch (err) {
      toast({ title: "Could not cancel departure", description: err instanceof ApiError ? err.message : String(err), variant: "destructive" });
    }
    setDepartureBusyId(null);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Packages</h1>
            <p className="text-muted-foreground mt-1">{pkgs.length} packages · {filtered.length} shown</p>
          </div>
          <Button onClick={() => navigate("/planner/create")} className="bg-gradient-hero text-primary-foreground hover:opacity-90">
            <Package size={16} className="mr-1" /> Create Package
          </Button>
        </div>
      </motion.div>

      <div className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800">
        <AlertTriangle size={14} className="shrink-0 mt-0.5" />
        <span>Showing packages you created. This is scoped by <code>createdBy</code>, but not yet enforced as an access restriction — any admin can still edit or delist any package until the full ROLE_PARTNER ownership model lands (per the V2 roadmap).</span>
      </div>

      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-3 md:items-center">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title or place…" className="pl-9" />
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
        <div className="text-center py-16 text-muted-foreground"><Loader2 className="animate-spin mx-auto mb-2" /> Loading packages…</div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center">
            <Package className="mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No packages match your filters.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((pkg, i) => (
            <motion.div key={pkg.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.05 }}>
              <Card className="overflow-hidden hover:shadow-card-hover transition-all duration-300 h-full flex flex-col">
                {pkg.thumbnailImage && (
                  <div className="relative h-36">
                    <img src={pkg.thumbnailImage} alt={pkg.title} className="w-full h-full object-cover" />
                    <Badge variant={pkg.active ? "default" : "secondary"} className="absolute top-3 right-3 text-[10px]">{pkg.active ? "Live" : "Unpublished"}</Badge>
                  </div>
                )}
                <CardContent className="p-5 flex flex-col flex-1">
                  <div className="mb-2">
                    <h3 className="font-display font-semibold text-card-foreground leading-snug">{pkg.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{destNameById.get(pkg.destinationId) || "—"} · {pkg.durationDays}D/{pkg.durationNights}N</p>
                  </div>

                  <div className="flex items-center gap-1 text-lg font-bold text-primary mb-3">
                    <IndianRupee size={15} />{pkg.price.toLocaleString()}
                    <span className="text-xs text-muted-foreground font-normal ml-1">per person</span>
                  </div>

                  <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar size={11} /> {pkg.departures.filter(d => d.active && new Date(d.startDate) >= new Date()).length} upcoming date(s)</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4 flex-1">
                    {pkg.placesCovered.slice(0, 3).map((place) => (
                      <span key={place} className="flex items-center gap-1 bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full">
                        <MapPin size={9} /> {place}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-border/50 flex-wrap">
                    <Button variant="outline" size="sm" className="text-xs" onClick={() => navigate(`/all-packages/${pkg.id}`)}>View</Button>
                    <Button variant="outline" size="sm" className="text-xs" onClick={() => navigate(`/planner/create?edit=${pkg.id}`)}>
                      <Pencil size={13} className="mr-1" /> Edit
                    </Button>
                    <Button
                      variant="outline" size="sm" className="text-xs"
                      disabled={busyId === pkg.id}
                      onClick={() => toggleActive(pkg)}
                    >
                      {busyId === pkg.id ? <Loader2 size={13} className="animate-spin" /> : pkg.active ? <EyeOff size={13} /> : <><Eye size={13} className="mr-1" /> Publish</>}
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs" onClick={() => setDeparturesOpenId(departuresOpenId === pkg.id ? null : pkg.id)}>
                      <Calendar size={13} className={`mr-1 transition-transform ${departuresOpenId === pkg.id ? "rotate-180" : ""}`} />
                      Dates ({pkg.departures.length})
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs ml-auto" onClick={() => toggleBookings(pkg.id)}>
                      {bookingsLoading === pkg.id ? <Loader2 size={13} className="animate-spin mr-1" /> : <ChevronDown size={13} className={`mr-1 transition-transform ${expandedId === pkg.id ? "rotate-180" : ""}`} />}
                      Bookings
                    </Button>
                  </div>

                  <AnimatePresence>
                    {departuresOpenId === pkg.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="pt-3 mt-3 border-t border-border/50 space-y-2">
                          {pkg.departures.length === 0 ? (
                            <p className="text-xs text-muted-foreground">No departure dates yet — add one below.</p>
                          ) : (
                            pkg.departures.map((d) => (
                              <div key={d.id} className="flex items-center justify-between text-xs bg-muted/50 rounded-lg px-3 py-2">
                                <span className="text-foreground">{d.startDate} · {d.availableSlots}/{d.maxPeople} slots</span>
                                <div className="flex items-center gap-2">
                                  <Badge variant={d.active ? "default" : "secondary"} className="text-[9px] capitalize">{d.active ? "active" : "cancelled"}</Badge>
                                  {d.active && (
                                    <button onClick={() => cancelDeparture(d.id)} disabled={departureBusyId === d.id} className="text-destructive hover:opacity-70">
                                      {departureBusyId === d.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                          <div className="flex items-center gap-2 pt-1">
                            <Input
                              type="date"
                              value={newDepartureByPkg[pkg.id]?.date || ""}
                              onChange={(e) => setNewDepartureByPkg((prev) => ({ ...prev, [pkg.id]: { date: e.target.value, maxPeople: prev[pkg.id]?.maxPeople || "" } }))}
                              className="h-8 text-xs flex-1"
                            />
                            <Input
                              type="number" min={1} placeholder="Slots"
                              value={newDepartureByPkg[pkg.id]?.maxPeople || ""}
                              onChange={(e) => setNewDepartureByPkg((prev) => ({ ...prev, [pkg.id]: { date: prev[pkg.id]?.date || "", maxPeople: e.target.value } }))}
                              className="h-8 text-xs w-20"
                            />
                            <Button size="sm" className="h-8 text-xs shrink-0" disabled={departureBusyId === pkg.id || !newDepartureByPkg[pkg.id]?.date} onClick={() => addDeparture(pkg)}>
                              {departureBusyId === pkg.id ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {expandedId === pkg.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="pt-3 mt-3 border-t border-border/50 space-y-2">
                          {(bookingsByPkg[pkg.id] || []).length === 0 ? (
                            <p className="text-xs text-muted-foreground">No bookings yet.</p>
                          ) : (
                            bookingsByPkg[pkg.id].map((b) => (
                              <div key={b.id} className="flex items-center justify-between text-xs bg-muted/50 rounded-lg px-3 py-2">
                                <span className="text-foreground">{b.travelerEmail} · {b.travelersCount} traveler(s)</span>
                                <Badge variant={b.status === "CONFIRMED" ? "default" : "destructive"} className="text-[9px] capitalize">{b.status.toLowerCase()}</Badge>
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
          ))}
        </div>
      )}
    </div>
  );
}
