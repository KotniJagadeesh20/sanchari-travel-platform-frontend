import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, IndianRupee, Users, Package, Hotel as HotelIcon, Search, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { bookings as allBookings, type Booking, type BookingStatus } from "@/data/creator";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const statusMeta: Record<BookingStatus, { label: string; className: string }> = {
  pending:   { label: "Pending",   className: "bg-orange-500/10 text-orange-600" },
  confirmed: { label: "Confirmed", className: "bg-emerald-500/10 text-emerald-600" },
  completed: { label: "Completed", className: "bg-primary/10 text-primary" },
  cancelled: { label: "Cancelled", className: "bg-destructive/10 text-destructive" },
};

const statusFilters: ("all" | BookingStatus)[] = ["all", "pending", "confirmed", "completed", "cancelled"];

export default function Bookings() {
  const [tab, setTab] = useState<"package" | "hotel">("package");
  const [status, setStatus] = useState<"all" | BookingStatus>("all");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Booking | null>(null);

  const filtered = useMemo(() => {
    return allBookings.filter(b =>
      b.kind === tab &&
      (status === "all" || b.status === status) &&
      (q === "" || b.customer.toLowerCase().includes(q.toLowerCase()) || b.itemName.toLowerCase().includes(q.toLowerCase()))
    );
  }, [tab, status, q]);

  const totalRevenue = filtered.filter(b => b.status !== "cancelled").reduce((s, b) => s + b.amount, 0);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Bookings</h1>
        <p className="text-muted-foreground mt-1">Manage reservations across your packages and hotels.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total bookings", value: filtered.length, icon: CalendarCheck, tint: "bg-primary/10 text-primary" },
          { label: "Guests", value: filtered.reduce((s, b) => s + b.guests, 0), icon: Users, tint: "bg-accent/10 text-accent" },
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
            <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search customer or item" className="pl-9 h-9" />
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

        <TabsContent value="package" className="mt-4"><BookingList items={filtered} onView={setSelected} /></TabsContent>
        <TabsContent value="hotel" className="mt-4"><BookingList items={filtered} onView={setSelected} /></TabsContent>
      </Tabs>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{selected?.itemName}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Booking ID</span><span className="font-medium">{selected.id}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Customer</span><span className="font-medium">{selected.customer}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-medium">{selected.date}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Guests</span><span className="font-medium">{selected.guests}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Status</span><Badge variant="secondary" className={statusMeta[selected.status].className}>{statusMeta[selected.status].label}</Badge></div>
              <div className="flex justify-between pt-3 border-t border-border"><span className="text-muted-foreground">Amount</span><span className="font-bold text-primary">{inr(selected.amount)}</span></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function BookingList({ items, onView }: { items: Booking[]; onView: (b: Booking) => void }) {
  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="p-10 text-center">
          <CalendarCheck className="mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No bookings match these filters yet.</p>
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="space-y-3">
      {items.map((b, i) => (
        <motion.div key={b.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
          <Card className="hover:shadow-card-hover transition-all">
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display font-semibold text-card-foreground">{b.itemName}</h3>
                  <Badge variant="secondary" className={`text-[10px] ${statusMeta[b.status].className}`}>{statusMeta[b.status].label}</Badge>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span>#{b.id}</span>
                  <span>{b.customer}</span>
                  <span>{b.date}</span>
                  <span>{b.guests} guests</span>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <p className="text-lg font-bold text-primary flex items-center gap-0.5">
                  <IndianRupee size={14} />{b.amount.toLocaleString("en-IN")}
                </p>
                <Button size="sm" variant="outline" onClick={() => onView(b)}>
                  <Eye size={13} /> View
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
