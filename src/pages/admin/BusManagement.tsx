import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import {
  Plus, Search, Bus as BusIcon, User, LinkIcon, Ticket, Pencil, Trash2,
  MapPin, Clock, Phone, IdCard, ArrowRight, CheckCircle2, Loader2, AlertTriangle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  adminBusBookings, type AdminBus, type AdminDriver, type AdminBusBooking,
} from "@/data/admin";
import { adminBusService } from "@/services/adminBusService";
import { toast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/api";

type BusFormState = {
  busno: string; source: string; destination: string; busType: string;
  date: string; departure: string; arrival: string; price: string;
};
const emptyBusForm: BusFormState = { busno: "", source: "", destination: "", busType: "AC Sleeper", date: "", departure: "", arrival: "", price: "" };

type DriverFormState = { name: string; email: string; age: string; phone: string };
const emptyDriverForm: DriverFormState = { name: "", email: "", age: "", phone: "" };

export default function BusManagement() {
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") || "buses";

  const [buses, setBuses] = useState<AdminBus[]>([]);
  const [drivers, setDrivers] = useState<AdminDriver[]>([]);
  const [loadingBuses, setLoadingBuses] = useState(true);
  const [loadingDrivers, setLoadingDrivers] = useState(true);

  const [busQuery, setBusQuery] = useState("");
  const [driverQuery, setDriverQuery] = useState("");
  const [bookingTab, setBookingTab] = useState<AdminBusBooking["status"]>("upcoming");

  const [selectedBus, setSelectedBus] = useState<string>("");
  const [selectedDriver, setSelectedDriver] = useState<string>("");
  const [assigning, setAssigning] = useState(false);

  const [busDialogOpen, setBusDialogOpen] = useState(false);
  const [editingBus, setEditingBus] = useState<AdminBus | null>(null);
  const [busForm, setBusForm] = useState<BusFormState>(emptyBusForm);
  const [savingBus, setSavingBus] = useState(false);

  const [driverDialogOpen, setDriverDialogOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<AdminDriver | null>(null);
  const [driverForm, setDriverForm] = useState<DriverFormState>(emptyDriverForm);
  const [savingDriver, setSavingDriver] = useState(false);

  const setTab = (t: string) => { params.set("tab", t); setParams(params, { replace: true }); };

  const loadBuses = async () => {
    setLoadingBuses(true);
    try {
      const existing = new Map(buses.map((b) => [b.id, b]));
      setBuses(await adminBusService.listBuses(existing));
    } catch (err) {
      toast({ title: "Could not load buses", description: err instanceof ApiError ? err.message : String(err), variant: "destructive" });
    }
    setLoadingBuses(false);
  };

  const loadDrivers = async () => {
    setLoadingDrivers(true);
    try {
      const existing = new Map(drivers.map((d) => [d.id, d]));
      setDrivers(await adminBusService.listDrivers(existing));
    } catch (err) {
      toast({ title: "Could not load drivers", description: err instanceof ApiError ? err.message : String(err), variant: "destructive" });
    }
    setLoadingDrivers(false);
  };

  useEffect(() => { loadBuses(); loadDrivers(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const driverForBus = (busId: string) => drivers.find((d) => d.assignedBusId === busId);
  const busForDriver = (driverId: string) => buses.find((b) => b.id === drivers.find((d) => d.id === driverId)?.assignedBusId);

  const filteredBuses = buses.filter((b) =>
    !busQuery || b.busno.toLowerCase().includes(busQuery.toLowerCase()) || (b.operator || "").toLowerCase().includes(busQuery.toLowerCase())
  );
  const filteredDrivers = drivers.filter((d) =>
    !driverQuery || d.name.toLowerCase().includes(driverQuery.toLowerCase()) || d.email.toLowerCase().includes(driverQuery.toLowerCase())
  );

  // ─── Bus dialog ───────────────────────────────────────────────────────────

  const openAddBus = () => { setEditingBus(null); setBusForm(emptyBusForm); setBusDialogOpen(true); };
  const openEditBus = (b: AdminBus) => {
    setEditingBus(b);
    setBusForm({
      busno: b.busno, source: b.source, destination: b.destination, busType: b.busType,
      date: b.date, departure: b.departure, arrival: b.arrival || "", price: String(b.price),
    });
    setBusDialogOpen(true);
  };

  const busFormValid = busForm.busno && busForm.source && busForm.destination && busForm.busType &&
    busForm.date && busForm.departure && Number(busForm.price) > 0;

  const submitBusForm = async () => {
    if (!busFormValid) return;
    setSavingBus(true);
    const payload = {
      busno: busForm.busno, source: busForm.source, destination: busForm.destination,
      busType: busForm.busType, date: busForm.date, departure: busForm.departure,
      arrival: busForm.arrival || undefined, price: Number(busForm.price),
    };
    try {
      if (editingBus) {
        await adminBusService.editBus({ id: editingBus.id, ...payload });
        toast({ title: "Bus updated" });
      } else {
        await adminBusService.addBus(payload);
        toast({ title: "Bus added" });
      }
      setBusDialogOpen(false);
      loadBuses();
    } catch (err) {
      toast({ title: "Save failed", description: err instanceof ApiError ? err.message : String(err), variant: "destructive" });
    }
    setSavingBus(false);
  };

  const deleteBus = async (b: AdminBus) => {
    try {
      await adminBusService.deleteBus(b.busno);
      toast({ title: "Bus removed" });
      loadBuses();
    } catch (err) {
      toast({ title: "Delete failed", description: err instanceof ApiError ? err.message : String(err), variant: "destructive" });
    }
  };

  // ─── Driver dialog ────────────────────────────────────────────────────────

  const openAddDriver = () => { setEditingDriver(null); setDriverForm(emptyDriverForm); setDriverDialogOpen(true); };
  const openEditDriver = (d: AdminDriver) => {
    setEditingDriver(d);
    setDriverForm({ name: d.name, email: d.email, age: String(d.age), phone: d.phone });
    setDriverDialogOpen(true);
  };

  const driverFormValid = driverForm.name && driverForm.email && Number(driverForm.age) > 0 &&
    /^[6-9]\d{9}$/.test(driverForm.phone.replace(/\D/g, ""));

  const submitDriverForm = async () => {
    if (!driverFormValid) return;
    setSavingDriver(true);
    const payload = { name: driverForm.name, email: driverForm.email, age: Number(driverForm.age), phone: driverForm.phone };
    try {
      if (editingDriver) {
        await adminBusService.editDriver({ id: editingDriver.id, ...payload });
        toast({ title: "Driver updated" });
      } else {
        await adminBusService.addDriver(payload);
        toast({ title: "Driver added" });
      }
      setDriverDialogOpen(false);
      loadDrivers();
    } catch (err) {
      toast({ title: "Save failed", description: err instanceof ApiError ? err.message : String(err), variant: "destructive" });
    }
    setSavingDriver(false);
  };

  const deleteDriver = async (d: AdminDriver) => {
    try {
      await adminBusService.deleteDriver(d.id);
      toast({ title: "Driver removed" });
      loadDrivers();
    } catch (err) {
      toast({ title: "Delete failed", description: err instanceof ApiError ? err.message : String(err), variant: "destructive" });
    }
  };

  // ─── Assignment ───────────────────────────────────────────────────────────

  const handleAssign = async () => {
    if (!selectedBus || !selectedDriver) return;
    setAssigning(true);
    try {
      await adminBusService.assignDriver(selectedBus, selectedDriver);
      toast({ title: "Driver assigned" });
      setSelectedBus(""); setSelectedDriver("");
      loadBuses(); loadDrivers();
    } catch (err) {
      toast({ title: "Assignment failed", description: err instanceof ApiError ? err.message : String(err), variant: "destructive" });
    }
    setAssigning(false);
  };

  const assignments = drivers.filter((d) => d.assignedBusId).map((d) => ({
    driver: d, bus: buses.find((b) => b.id === d.assignedBusId)!,
  })).filter((a) => a.bus);

  const filteredBookings = adminBusBookings.filter((b) => b.status === bookingTab);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Bus Management</h1>
        <p className="text-muted-foreground mt-1">Manage fleet, drivers, assignments and bookings in one place.</p>
      </motion.div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="buses"><BusIcon size={13} className="mr-1.5" /> Buses</TabsTrigger>
          <TabsTrigger value="drivers"><User size={13} className="mr-1.5" /> Drivers</TabsTrigger>
          <TabsTrigger value="assignments"><LinkIcon size={13} className="mr-1.5" /> Assignments</TabsTrigger>
          <TabsTrigger value="bookings"><Ticket size={13} className="mr-1.5" /> Bookings</TabsTrigger>
        </TabsList>

        {/* BUSES */}
        <TabsContent value="buses" className="mt-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={busQuery} onChange={(e) => setBusQuery(e.target.value)} placeholder="Search by bus number or operator…" className="pl-9" />
            </div>
            <Button onClick={openAddBus} className="bg-gradient-hero text-primary-foreground hover:opacity-90">
              <Plus size={16} className="mr-1" /> Add Bus
            </Button>
          </div>

          {loadingBuses ? (
            <div className="text-center py-16 text-muted-foreground"><Loader2 className="animate-spin mx-auto mb-2" /> Loading buses…</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredBuses.map((b, i) => {
                const driver = driverForBus(b.id);
                return (
                  <motion.div key={b.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-5 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                              <BusIcon size={18} className="text-primary" />
                            </div>
                            <div>
                              <p className="font-display font-semibold text-card-foreground">{b.busno}</p>
                              <p className="text-xs text-muted-foreground">{b.operator || b.busType}</p>
                            </div>
                          </div>
                          <Badge variant={b.status === "active" ? "default" : b.status === "maintenance" ? "secondary" : "outline"} className="capitalize text-[10px]">{b.status}</Badge>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-card-foreground">
                          <MapPin size={13} className="text-muted-foreground" />
                          <span className="font-medium">{b.source}</span>
                          <ArrowRight size={12} className="text-muted-foreground" />
                          <span className="font-medium">{b.destination}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock size={11} /> {b.departure}{b.arrival ? ` – ${b.arrival}` : ""}</span>
                          <span>₹{b.price.toLocaleString()}</span>
                        </div>

                        <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Driver</span>
                          <span className="text-card-foreground font-medium">{driver?.name || "Unassigned"}</span>
                        </div>

                        <div className="flex gap-1.5">
                          <Button size="sm" variant="outline" className="flex-1" onClick={() => openEditBus(b)}><Pencil size={13} /></Button>
                          <Button size="sm" variant="outline" className="flex-1 text-destructive hover:text-destructive" onClick={() => deleteBus(b)}><Trash2 size={13} /></Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
              {filteredBuses.length === 0 && (
                <Card className="md:col-span-2 xl:col-span-3"><CardContent className="p-12 text-center text-muted-foreground">No buses found.</CardContent></Card>
              )}
            </div>
          )}
        </TabsContent>

        {/* DRIVERS */}
        <TabsContent value="drivers" className="mt-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={driverQuery} onChange={(e) => setDriverQuery(e.target.value)} placeholder="Search drivers…" className="pl-9" />
            </div>
            <Button onClick={openAddDriver} className="bg-gradient-hero text-primary-foreground hover:opacity-90">
              <Plus size={16} className="mr-1" /> Add Driver
            </Button>
          </div>

          {loadingDrivers ? (
            <div className="text-center py-16 text-muted-foreground"><Loader2 className="animate-spin mx-auto mb-2" /> Loading drivers…</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredDrivers.map((d, i) => {
                const bus = busForDriver(d.id);
                return (
                  <motion.div key={d.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-5 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="h-12 w-12 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold shrink-0">
                            {d.name.split(" ").map(n => n[0]).slice(0,2).join("")}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-display font-semibold text-card-foreground truncate">{d.name}</p>
                              <Badge variant={d.status === "on-duty" ? "default" : d.status === "leave" ? "destructive" : "secondary"} className="text-[10px] capitalize">{d.status}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><IdCard size={11} /> {d.email}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone size={11} /> {d.phone}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-center">
                          <div className="rounded-lg bg-muted/50 py-2">
                            <p className="text-sm font-semibold text-card-foreground">{d.age} yrs</p>
                            <p className="text-[10px] text-muted-foreground">Age</p>
                          </div>
                          <div className="rounded-lg bg-muted/50 py-2">
                            <p className="text-sm font-semibold text-card-foreground truncate">{bus?.busno || "—"}</p>
                            <p className="text-[10px] text-muted-foreground">Assigned bus</p>
                          </div>
                        </div>

                        <div className="flex gap-1.5">
                          <Button size="sm" variant="outline" className="flex-1" onClick={() => openEditDriver(d)}><Pencil size={13} className="mr-1" /> Edit</Button>
                          <Button size="sm" variant="outline" className="flex-1 text-destructive hover:text-destructive" onClick={() => deleteDriver(d)}><Trash2 size={13} /></Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
              {filteredDrivers.length === 0 && (
                <Card className="md:col-span-2 xl:col-span-3"><CardContent className="p-12 text-center text-muted-foreground">No drivers found.</CardContent></Card>
              )}
            </div>
          )}
        </TabsContent>

        {/* ASSIGNMENTS */}
        <TabsContent value="assignments" className="mt-6 space-y-4">
          <Card>
            <CardContent className="p-6">
              <h2 className="font-display font-semibold text-card-foreground mb-1">Assign a driver</h2>
              <p className="text-xs text-muted-foreground mb-5">Match an available driver to an active bus.</p>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto] gap-3 items-end">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Bus</label>
                  <Select value={selectedBus} onValueChange={setSelectedBus}>
                    <SelectTrigger><SelectValue placeholder="Select a bus" /></SelectTrigger>
                    <SelectContent>
                      {buses.map((b) => (
                        <SelectItem key={b.id} value={b.id}>{b.busno} · {b.source} → {b.destination}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <ArrowRight size={16} className="text-muted-foreground hidden md:block mb-3" />
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Driver</label>
                  <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                    <SelectTrigger><SelectValue placeholder="Select a driver" /></SelectTrigger>
                    <SelectContent>
                      {drivers.map((d) => (
                        <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAssign} disabled={!selectedBus || !selectedDriver || assigning} className="bg-gradient-hero text-primary-foreground hover:opacity-90">
                  {assigning ? <Loader2 size={16} className="animate-spin mr-1" /> : <CheckCircle2 size={16} className="mr-1" />} Assign
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="font-display font-semibold text-card-foreground mb-4">Current assignments</h2>
              <ul className="space-y-3">
                {assignments.map((a) => (
                  <li key={a.driver.id} className="flex flex-wrap items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/40 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <BusIcon size={16} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-card-foreground">{a.bus.busno}</p>
                      <p className="text-xs text-muted-foreground">{a.bus.source} → {a.bus.destination}</p>
                    </div>
                    <ArrowRight size={14} className="text-muted-foreground" />
                    <div className="flex items-center gap-2">
                      <div className="h-9 w-9 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground text-xs font-bold">
                        {a.driver.name.split(" ").map(n => n[0]).slice(0,2).join("")}
                      </div>
                      <p className="text-sm font-medium text-card-foreground">{a.driver.name}</p>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 border-0">Active</Badge>
                  </li>
                ))}
                {assignments.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-6">No active assignments yet.</p>
                )}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* BOOKINGS */}
        <TabsContent value="bookings" className="mt-6 space-y-4">
          <div className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800">
            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
            <span>Showing sample data — there's no backend endpoint yet that returns bookings across all users/buses (the existing booking-history endpoint is scoped to the calling user only). This tab needs a new admin endpoint before it can show real data.</span>
          </div>
          <Tabs value={bookingTab} onValueChange={(v) => setBookingTab(v as AdminBusBooking["status"])}>
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBookings.map((b, i) => (
              <motion.div key={b.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Card>
                  <CardContent className="p-5 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-display font-semibold text-card-foreground">{b.operator} · {b.busNumber}</p>
                        <p className="text-xs text-muted-foreground">Booking {b.id}</p>
                      </div>
                      <Badge variant={b.status === "upcoming" ? "default" : b.status === "completed" ? "secondary" : "destructive"} className="capitalize text-[10px]">{b.status}</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-border">
                      <div><p className="text-muted-foreground">Passenger</p><p className="font-medium text-card-foreground">{b.passenger}</p></div>
                      <div><p className="text-muted-foreground">Seats</p><p className="font-medium text-card-foreground">{b.seats.join(", ")}</p></div>
                      <div><p className="text-muted-foreground">Journey</p><p className="font-medium text-card-foreground">{b.journeyDate}</p></div>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <p className="text-lg font-bold text-primary">₹{b.amount.toLocaleString("en-IN")}</p>
                      <Button size="sm" variant="outline">View booking</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            {filteredBookings.length === 0 && (
              <Card className="md:col-span-2"><CardContent className="p-12 text-center text-muted-foreground">No {bookingTab} bookings.</CardContent></Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Bus add/edit dialog */}
      <Dialog open={busDialogOpen} onOpenChange={setBusDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingBus ? "Edit Bus" : "Add Bus"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Bus number</Label>
                <Input value={busForm.busno} onChange={(e) => setBusForm((f) => ({ ...f, busno: e.target.value.toUpperCase() }))} placeholder="AP09AB1234" disabled={!!editingBus} />
              </div>
              <div>
                <Label className="text-xs">Bus type</Label>
                <select
                  value={busForm.busType}
                  onChange={(e) => setBusForm((f) => ({ ...f, busType: e.target.value }))}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  {["AC Sleeper", "Non-AC Sleeper", "AC Seater", "Non-AC Seater"].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Source</Label>
                <Input value={busForm.source} onChange={(e) => setBusForm((f) => ({ ...f, source: e.target.value }))} placeholder="Hyderabad" />
              </div>
              <div>
                <Label className="text-xs">Destination</Label>
                <Input value={busForm.destination} onChange={(e) => setBusForm((f) => ({ ...f, destination: e.target.value }))} placeholder="Vizag" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs">Date</Label>
                <Input type="date" value={busForm.date} onChange={(e) => setBusForm((f) => ({ ...f, date: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs">Departure</Label>
                <Input type="time" value={busForm.departure} onChange={(e) => setBusForm((f) => ({ ...f, departure: e.target.value }))} />
              </div>
              <div>
                <Label className="text-xs">Arrival (optional)</Label>
                <Input type="time" value={busForm.arrival} onChange={(e) => setBusForm((f) => ({ ...f, arrival: e.target.value }))} />
              </div>
            </div>
            <div>
              <Label className="text-xs">Price (₹)</Label>
              <Input type="number" min={1} value={busForm.price} onChange={(e) => setBusForm((f) => ({ ...f, price: e.target.value }))} placeholder="1250" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBusDialogOpen(false)}>Cancel</Button>
            <Button onClick={submitBusForm} disabled={!busFormValid || savingBus} className="bg-gradient-hero text-primary-foreground hover:opacity-90">
              {savingBus ? <Loader2 size={16} className="animate-spin mr-1" /> : null} {editingBus ? "Save changes" : "Add bus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Driver add/edit dialog */}
      <Dialog open={driverDialogOpen} onOpenChange={setDriverDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingDriver ? "Edit Driver" : "Add Driver"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Full name</Label>
              <Input value={driverForm.name} onChange={(e) => setDriverForm((f) => ({ ...f, name: e.target.value }))} placeholder="Ramesh Naidu" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Email</Label>
                <Input type="email" value={driverForm.email} onChange={(e) => setDriverForm((f) => ({ ...f, email: e.target.value }))} placeholder="driver@example.com" disabled={!!editingDriver} />
              </div>
              <div>
                <Label className="text-xs">Age</Label>
                <Input type="number" min={18} value={driverForm.age} onChange={(e) => setDriverForm((f) => ({ ...f, age: e.target.value }))} />
              </div>
            </div>
            <div>
              <Label className="text-xs">Phone</Label>
              <Input type="tel" value={driverForm.phone} onChange={(e) => setDriverForm((f) => ({ ...f, phone: e.target.value }))} placeholder="9876543210" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDriverDialogOpen(false)}>Cancel</Button>
            <Button onClick={submitDriverForm} disabled={!driverFormValid || savingDriver} className="bg-gradient-hero text-primary-foreground hover:opacity-90">
              {savingDriver ? <Loader2 size={16} className="animate-spin mr-1" /> : null} {editingDriver ? "Save changes" : "Add driver"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
