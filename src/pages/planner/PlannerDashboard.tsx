import { useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Package, Hotel, CalendarCheck, IndianRupee, Star, Clock,
  ArrowUpRight, Plus, Users, Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useCreatorPortfolio } from "@/hooks/useCreatorPortfolio";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

type UnifiedRecentBooking = {
  key: string;
  kind: "package" | "hotel";
  itemName: string;
  guests: number;
  date: string;
  sortDate: string;
  amount: number;
  status: string;
  statusTone: "confirmed" | "pending" | "completed" | "cancelled";
};

export default function PlannerDashboard() {
  const { user } = useAuth();
  const {
    loading, myPackages, myHotels, allPackageBookings, allHotelBookings, latestReviews,
    activeBookings, pendingBookings, totalRevenue, avgRating, totalReviewCount,
    topPackages, topHotels, monthlyRevenue,
  } = useCreatorPortfolio();

  const kpis = [
    { label: "My Packages", value: myPackages.length, icon: Package, tint: "bg-primary/10 text-primary" },
    { label: "My Hotels", value: myHotels.length, icon: Hotel, tint: "bg-accent/10 text-accent" },
    { label: "Active Bookings", value: activeBookings, icon: CalendarCheck, tint: "bg-emerald-500/10 text-emerald-600" },
    { label: "Revenue", value: inr(totalRevenue), icon: IndianRupee, tint: "bg-secondary/15 text-secondary" },
    { label: "Avg. Rating", value: avgRating != null ? avgRating.toFixed(1) : "—", icon: Star, tint: "bg-amber-500/10 text-amber-600", note: `${totalReviewCount} review${totalReviewCount !== 1 ? "s" : ""}` },
    { label: "Pending Bookings", value: pendingBookings, icon: Clock, tint: "bg-orange-500/10 text-orange-600", note: pendingBookings > 0 ? "Action needed" : undefined },
  ];

  const recentBookings: UnifiedRecentBooking[] = useMemo(() => {
    const pkg: UnifiedRecentBooking[] = allPackageBookings.map((b) => ({
      key: `pkg-${b.id}`,
      kind: "package",
      itemName: b.packageTitle,
      guests: b.travelersCount,
      date: b.departureStartDate,
      sortDate: b.bookingTime,
      amount: b.totalAmount,
      status: b.status === "CONFIRMED" ? "confirmed" : "cancelled",
      statusTone: b.status === "CONFIRMED" ? "confirmed" : "cancelled",
    }));
    const hotel: UnifiedRecentBooking[] = allHotelBookings.map((b) => ({
      key: `hotel-${b.id}`,
      kind: "hotel",
      itemName: b.hotelName,
      guests: b.numberOfGuests,
      date: b.checkInDate,
      sortDate: b.bookingDate,
      amount: b.totalAmount,
      status: b.status.toLowerCase().replace("_", " "),
      statusTone: b.status === "PENDING" ? "pending" : b.status === "CANCELLED" ? "cancelled" : b.status === "CHECKED_OUT" ? "completed" : "confirmed",
    }));
    return [...pkg, ...hotel].sort((a, b) => (a.sortDate < b.sortDate ? 1 : -1)).slice(0, 5);
  }, [allPackageBookings, allHotelBookings]);

  const peakRev = Math.max(1, ...monthlyRevenue.map((m) => m.revenue));

  const statusColor: Record<string, string> = {
    confirmed: "bg-emerald-500/10 text-emerald-600",
    pending: "bg-orange-500/10 text-orange-600",
    completed: "bg-primary/10 text-primary",
    cancelled: "bg-destructive/10 text-destructive",
  };

  if (loading) {
    return <div className="flex items-center justify-center py-24 text-muted-foreground gap-2"><Loader2 className="animate-spin" /> Loading your dashboard…</div>;
  }

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
            Welcome back, <span className="text-gradient-hero">{user?.name || "there"}</span>
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
                {k.note && (
                  <p className="text-[10px] text-muted-foreground/80 mt-2">{k.note}</p>
                )}
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
                  <p className="text-xs text-muted-foreground">Last 6 months, from your actual bookings</p>
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
                        style={{ height: `${Math.max(2, (m.revenue / peakRev) * 100)}%` }}
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
              {recentBookings.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">No bookings yet.</p>
              ) : (
                <div className="space-y-2">
                  {recentBookings.map(b => (
                    <div key={b.key} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/40 transition-colors">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold ${b.kind === "package" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}>
                        {b.kind === "package" ? <Package size={14} /> : <Hotel size={14} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-card-foreground truncate">{b.itemName}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {b.guests} guest{b.guests !== 1 ? "s" : ""} · {b.date}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold text-card-foreground">{inr(b.amount)}</p>
                        <Badge variant="secondary" className={`text-[10px] mt-0.5 capitalize ${statusColor[b.statusTone]}`}>
                          {b.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
              {latestReviews.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">No reviews yet.</p>
              ) : (
                <div className="space-y-4">
                  {latestReviews.slice(0, 3).map(r => (
                    <div key={r.id} className="pb-4 border-b border-border/50 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-card-foreground">{r.hotelName}</p>
                        <div className="flex items-center gap-0.5 text-amber-500">
                          {Array.from({ length: r.rating }).map((_, i) => (
                            <Star key={i} size={11} fill="currentColor" strokeWidth={0} />
                          ))}
                        </div>
                      </div>
                      {r.comment && <p className="text-xs text-card-foreground/80 line-clamp-2">{r.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
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
              {topPackages.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No packages yet.</p>
              ) : (
                <div className="space-y-3">
                  {topPackages.slice(0, 4).map(p => (
                    <div key={p.id} className="flex items-center gap-3">
                      {p.thumbnailImage ? (
                        <img src={p.thumbnailImage} alt={p.title} className="w-12 h-12 rounded-lg object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center"><Package size={16} className="text-muted-foreground" /></div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-card-foreground truncate">{p.title}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                          <span className="flex items-center gap-1"><Users size={10} /> {p.bookingCount} booking{p.bookingCount !== 1 ? "s" : ""}</span>
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-primary">{inr(p.price)}</span>
                    </div>
                  ))}
                </div>
              )}
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
              {topHotels.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No hotels yet.</p>
              ) : (
                <div className="space-y-3">
                  {topHotels.slice(0, 4).map(h => (
                    <div key={h.id} className="flex items-center gap-3">
                      {h.imageUrls[0] ? (
                        <img src={h.imageUrls[0]} alt={h.name} className="w-12 h-12 rounded-lg object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center"><Hotel size={16} className="text-muted-foreground" /></div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-card-foreground truncate">{h.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                          <span className="flex items-center gap-1"><Star size={10} className="text-amber-500" fill="currentColor" strokeWidth={0} /> {h.averageRating?.toFixed(1) || "—"}</span>
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-primary">{h.bookingCount} bkg</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
