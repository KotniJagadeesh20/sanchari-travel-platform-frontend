import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, IndianRupee, Users, Package, Hotel as HotelIcon, Search, Eye, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCreatorPortfolio } from "@/hooks/useCreatorPortfolio";
import type { PackageBookingRecord } from "@/data/packages";
import type { HotelBookingRecord } from "@/data/hotels";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

type DisplayStatus = "pending" | "confirmed" | "completed" | "cancelled";

const statusMeta: Record<DisplayStatus, { label: string; className: string }> = {
  pending:   { label: "Pending",   className: "bg-orange-500/10 text-orange-600" },
  confirmed: { label: "Confirmed", className: "bg-emerald-500/10 text-emerald-600" },
  completed: { label: "Completed", className: "bg-primary/10 text-primary" },
  cancelled: { label: "Cancelled", className: "bg-destructive/10 text-destructive" },
};

const statusFilters: ("all" | DisplayStatus)[] = ["all", "pending", "confirmed", "completed", "cancelled"];

function packageDisplayStatus(status: PackageBookingRecord["status"]): DisplayStatus {
  return status === "CONFIRMED" ? "confirmed" : "cancelled";
}
function hotelDisplayStatus(status: HotelBookingRecord["status"]): DisplayStatus {
  if (status === "PENDING") return "pending";
  if (status === "CANCELLED") return "cancelled";
  if (status === "CHECKED_OUT") return "completed";
  return "confirmed";
}

export default function Bookings() {
  const { loading, allPackageBookings, allHotelBookings } = useCreatorPortfolio();
  const [tab, setTab] = useState<"package" | "hotel">("package");
  const [status, setStatus] = useState<"all" | DisplayStatus>("all");
  const [q, setQ] = useState("");
  const [selectedPkg, setSelectedPkg] = useState<PackageBookingRecord | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<HotelBookingRecord | null>(null);

  const filteredPackage = useMemo(() => allPackageBookings.filter(b =>
    (status === "all" || packageDisplayStatus(b.status) === status) &&
    (q === "" || b.packageTitle.toLowerCase().includes(q.toLowerCase()) || b.travelerEmail.toLowerCase().includes(q.toLowerCase()))
  ), [allPackageBookings, status, q]);

  const filteredHotel = useMemo(() => allHotelBookings.filter(b =>
    (status === "all" || hotelDisplayStatus(b.status) === status) &&
    (q === "" || b.hotelName.toLowerCase().includes(q.toLowerCase()) || b.roomLabel.toLowerCase().includes(q.toLowerCase()))
  ), [allHotelBookings, status, q]);

  const activeList = tab === "package" ? filteredPackage : filteredHotel;
  const totalGuests = tab === "package"
    ? filteredPackage.reduce((s, b) => s + b.travelersCount, 0)
    : filteredHotel.reduce((s, b) => s + b.numberOfGuests, 0);
  const totalRevenue = tab === "package"
    ? filteredPackage.filter(b => b.status !== "CANCELLED").reduce((s, b) => s + b.totalAmount, 0)
    : filteredHotel.filter(b => b.status !== "CANCELLED").reduce((s, b) => s + b.totalAmount, 0);

  if (loading) {
    return <div className="flex items-center justify-center py-24 text-muted-foreground gap-2"><Loader2 className="animate-spin" /> Loading bookings…</div>;
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Bookings</h1>
        <p className="text-muted-foreground mt-1">Reservations across your packages and hotels.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total bookings", value: activeList.length, icon: CalendarCheck, tint: "bg-primary/10 text-primary" },
          { label: "Guests", value: totalGuests, icon: Users, tint: "bg-accent/10 text-accent" },
          { label: "Revenue", value: inr(totalRevenue), icon: IndianRupee, tint: "bg-emerald-500/10 text-emerald-600" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.tint}`}>
                  <s.icon size={18} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-lg font-bold text-foreground">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as "package" | "hotel")}>
        <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
          <TabsList>
            <TabsTrigger value="package"><Package size={14} className="mr-1.5" /> Package bookings</TabsTrigger>
            <TabsTrigger value="hotel"><HotelIcon size={14} className="mr-1.5" /> Hotel bookings</TabsTrigger>
          </TabsList>
          <div className="relative w-full md:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name" className="pl-9 h-9" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {statusFilters.map(s => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                status === s
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:border-primary/40"
              }`}
            >
              {s === "all" ? "All" : statusMeta[s].label}
            </button>
          ))}
        </div>

        <TabsContent value="package" className="mt-4">
          {filteredPackage.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-3">
              {filteredPackage.map((b, i) => (
                <motion.div key={b.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  <Card className="hover:shadow-card-hover transition-all">
                    <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-display font-semibold text-card-foreground">{b.packageTitle}</h3>
                          <Badge variant="secondary" className={`text-[10px] ${statusMeta[packageDisplayStatus(b.status)].className}`}>{statusMeta[packageDisplayStatus(b.status)].label}</Badge>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                          <span>{b.travelerEmail}</span>
                          <span>{b.departureStartDate}</span>
                          <span>{b.travelersCount} traveler{b.travelersCount !== 1 ? "s" : ""}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <p className="text-lg font-bold text-primary flex items-center gap-0.5">
                          <IndianRupee size={14} />{b.totalAmount.toLocaleString("en-IN")}
                        </p>
                        <Button size="sm" variant="outline" onClick={() => setSelectedPkg(b)}>
                          <Eye size={13} /> View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="hotel" className="mt-4">
          {filteredHotel.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-3">
              {filteredHotel.map((b, i) => (
                <motion.div key={b.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  <Card className="hover:shadow-card-hover transition-all">
                    <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-display font-semibold text-card-foreground">{b.hotelName}</h3>
                          <Badge variant="secondary" className={`text-[10px] ${statusMeta[hotelDisplayStatus(b.status)].className}`}>{statusMeta[hotelDisplayStatus(b.status)].label}</Badge>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                          <span>Room {b.roomLabel}</span>
                          <span>{b.checkInDate} → {b.checkOutDate}</span>
                          <span>{b.numberOfGuests} guest{b.numberOfGuests !== 1 ? "s" : ""}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <p className="text-lg font-bold text-primary flex items-center gap-0.5">
                          <IndianRupee size={14} />{b.totalAmount.toLocaleString("en-IN")}
                        </p>
                        <Button size="sm" variant="outline" onClick={() => setSelectedHotel(b)}>
                          <Eye size={13} /> View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedPkg} onOpenChange={() => setSelectedPkg(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{selectedPkg?.packageTitle}</DialogTitle></DialogHeader>
          {selectedPkg && (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Booking ID</span><span className="font-medium">{selectedPkg.id}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Traveler</span><span className="font-medium">{selectedPkg.travelerEmail}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Departure</span><span className="font-medium">{selectedPkg.departureStartDate}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Travelers</span><span className="font-medium">{selectedPkg.travelersCount}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Status</span><Badge variant="secondary" className={statusMeta[packageDisplayStatus(selectedPkg.status)].className}>{statusMeta[packageDisplayStatus(selectedPkg.status)].label}</Badge></div>
              <div className="flex justify-between pt-3 border-t border-border"><span className="text-muted-foreground">Amount</span><span className="font-bold text-primary">{inr(selectedPkg.totalAmount)}</span></div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedHotel} onOpenChange={() => setSelectedHotel(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{selectedHotel?.hotelName}</DialogTitle></DialogHeader>
          {selectedHotel && (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Booking ID</span><span className="font-medium">{selectedHotel.id}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Room</span><span className="font-medium">{selectedHotel.roomLabel}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Dates</span><span className="font-medium">{selectedHotel.checkInDate} → {selectedHotel.checkOutDate}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Guests</span><span className="font-medium">{selectedHotel.numberOfGuests}</span></div>
              {selectedHotel.specialRequest && (
                <div className="flex justify-between"><span className="text-muted-foreground">Request</span><span className="font-medium text-right">{selectedHotel.specialRequest}</span></div>
              )}
              <div className="flex justify-between"><span className="text-muted-foreground">Status</span><Badge variant="secondary" className={statusMeta[hotelDisplayStatus(selectedHotel.status)].className}>{statusMeta[hotelDisplayStatus(selectedHotel.status)].label}</Badge></div>
              <div className="flex justify-between pt-3 border-t border-border"><span className="text-muted-foreground">Amount</span><span className="font-bold text-primary">{inr(selectedHotel.totalAmount)}</span></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EmptyState() {
  return (
    <Card>
      <CardContent className="p-10 text-center">
        <CalendarCheck className="mx-auto mb-3 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">No bookings match these filters yet.</p>
      </CardContent>
    </Card>
  );
}
