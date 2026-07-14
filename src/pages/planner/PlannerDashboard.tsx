import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Package, Hotel, CalendarCheck, IndianRupee, Star, Clock,
  TrendingUp, ArrowUpRight, Plus, MapPin, Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { packages } from "@/data/trips";
import {
  hotels, bookings, reviews, creatorPackageMeta, monthlyRevenue,
} from "@/data/creator";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function PlannerDashboard() {
  const totalRevenue = bookings
    .filter(b => b.status !== "cancelled")
    .reduce((s, b) => s + b.amount, 0);
  const activeBookings = bookings.filter(b => b.status === "confirmed").length;
  const pendingBookings = bookings.filter(b => b.status === "pending").length;
  const avgRating = (
    hotels.reduce((s, h) => s + h.rating, 0) / hotels.length
  ).toFixed(1);

  const kpis = [
    { label: "My Packages", value: packages.length, icon: Package, tint: "bg-primary/10 text-primary", trend: "+2 this month" },
    { label: "My Hotels", value: hotels.length, icon: Hotel, tint: "bg-accent/10 text-accent", trend: "+1 this month" },
    { label: "Active Bookings", value: activeBookings, icon: CalendarCheck, tint: "bg-emerald-500/10 text-emerald-600", trend: "Live now" },
    { label: "Revenue (30d)", value: inr(totalRevenue), icon: IndianRupee, tint: "bg-secondary/15 text-secondary", trend: "+18% MoM" },
    { label: "Avg. Rating", value: avgRating, icon: Star, tint: "bg-amber-500/10 text-amber-600", trend: `${reviews.length} reviews` },
    { label: "Pending Bookings", value: pendingBookings, icon: Clock, tint: "bg-orange-500/10 text-orange-600", trend: "Action needed" },
  ];

  const recentBookings = bookings.slice(0, 5);
  const latestReviews = reviews.slice(0, 3);

  const topPackages = [...packages]
    .map(p => ({ ...p, meta: creatorPackageMeta[p.id] }))
    .filter(p => p.meta)
    .sort((a, b) => b.meta!.bookings - a.meta!.bookings)
    .slice(0, 4);

  const topHotels = [...hotels].sort((a, b) => b.bookings - a.bookings).slice(0, 4);

  const peakRev = Math.max(...monthlyRevenue.map(m => m.revenue));

  const statusColor: Record<string, string> = {
    confirmed: "bg-emerald-500/10 text-emerald-600",
    pending: "bg-orange-500/10 text-orange-600",
    completed: "bg-primary/10 text-primary",
    cancelled: "bg-destructive/10 text-destructive",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Creator Studio</p>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Welcome back, <span className="text-gradient-hero">Wanderlust Travels</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's how your packages and hotels are performing today.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/planner/create">
            <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
              <Plus size={16} /> New Package
            </Button>
          </Link>
          <Link to="/planner/hotels">
            <Button className="bg-gradient-hero text-primary-foreground hover:opacity-90">
              <Plus size={16} /> New Hotel
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="hover:shadow-card-hover transition-shadow h-full">
              <CardContent className="p-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${k.tint}`}>
                  <k.icon size={16} />
                </div>
                <p className="text-xl font-bold text-card-foreground leading-tight">{k.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{k.label}</p>
                <p className="text-[10px] text-muted-foreground/80 mt-2 flex items-center gap-1">
                  <TrendingUp size={9} /> {k.trend}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Revenue mini chart + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-display font-semibold text-card-foreground">Revenue trend</h2>
                  <p className="text-xs text-muted-foreground">Last 7 months</p>
                </div>
                <Link to="/planner/analytics" className="text-xs text-primary hover:underline flex items-center gap-1">
                  View analytics <ArrowUpRight size={12} />
                </Link>
              </div>
              <div className="flex items-end justify-between gap-2 h-40">
                {monthlyRevenue.map((m) => (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col justify-end h-full">
                      <div
                        className="w-full rounded-t-md bg-gradient-to-t from-primary/80 to-accent/70 transition-all"
                        style={{ height: `${(m.revenue / peakRev) * 100}%` }}
                        title={inr(m.revenue)}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground">{m.month}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full">
            <CardContent className="p-6">
              <h2 className="font-display font-semibold text-card-foreground mb-4">Quick actions</h2>
              <div className="space-y-2">
                {[
                  { to: "/planner/create", label: "Create Package", icon: Package },
                  { to: "/planner/hotels", label: "Create Hotel", icon: Hotel },
                  { to: "/planner/bookings", label: "Manage Bookings", icon: CalendarCheck },
                  { to: "/planner/reviews", label: "Reply to Reviews", icon: Star },
                ].map((q) => (
                  <Link
                    key={q.to}
                    to={q.to}
                    className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <q.icon size={14} />
                    </div>
                    <span className="text-sm text-card-foreground flex-1">{q.label}</span>
                    <ArrowUpRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent bookings + Latest reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-card-foreground">Recent bookings</h2>
                <Link to="/planner/bookings" className="text-xs text-primary hover:underline">See all</Link>
              </div>
              <div className="space-y-2">
                {recentBookings.map(b => (
                  <div key={b.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/40 transition-colors">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold ${b.kind === "package" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}>
                      {b.kind === "package" ? <Package size={14} /> : <Hotel size={14} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-card-foreground truncate">{b.itemName}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {b.customer} · {b.guests} guests · {b.date}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-card-foreground">{inr(b.amount)}</p>
                      <Badge variant="secondary" className={`text-[10px] mt-0.5 ${statusColor[b.status]}`}>
                        {b.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="h-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-card-foreground">Latest reviews</h2>
                <Link to="/planner/reviews" className="text-xs text-primary hover:underline">All</Link>
              </div>
              <div className="space-y-4">
                {latestReviews.map(r => (
                  <div key={r.id} className="pb-4 border-b border-border/50 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-card-foreground">{r.customer}</p>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} size={11} fill="currentColor" strokeWidth={0} />
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground mb-1.5">{r.itemName}</p>
                    <p className="text-xs text-card-foreground/80 line-clamp-2">{r.comment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-card-foreground">Top packages</h2>
                <Link to="/planner/packages" className="text-xs text-primary hover:underline">Manage</Link>
              </div>
              <div className="space-y-3">
                {topPackages.map(p => (
                  <div key={p.id} className="flex items-center gap-3">
                    <img src={p.meta!.image} alt={p.title} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-card-foreground truncate">{p.title}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-2">
                        <span className="flex items-center gap-1"><Users size={10} /> {p.meta!.bookings}</span>
                        <span className="flex items-center gap-1"><Star size={10} className="text-amber-500" fill="currentColor" strokeWidth={0} /> {p.meta!.rating || "—"}</span>
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-primary">{inr(p.price)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-card-foreground">Top hotels</h2>
                <Link to="/planner/hotels" className="text-xs text-primary hover:underline">Manage</Link>
              </div>
              <div className="space-y-3">
                {topHotels.map(h => (
                  <div key={h.id} className="flex items-center gap-3">
                    <img src={h.image} alt={h.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-card-foreground truncate">{h.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-2">
                        <span className="flex items-center gap-1"><MapPin size={10} /> {h.destination}</span>
                        <span className="flex items-center gap-1"><Star size={10} className="text-amber-500" fill="currentColor" strokeWidth={0} /> {h.rating}</span>
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-primary">{h.bookings} bkg</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
