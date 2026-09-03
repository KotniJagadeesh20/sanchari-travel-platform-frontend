import { motion } from "framer-motion";
import { IndianRupee, CalendarCheck, TrendingUp, TrendingDown, Package, Hotel as HotelIcon, Star, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar,
} from "recharts";
import { useCreatorPortfolio } from "@/hooks/useCreatorPortfolio";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function Analytics() {
  const {
    loading, totalRevenue, totalBookingsCount, avgRating,
    topPackages, topHotels, monthlyRevenue,
  } = useCreatorPortfolio();

  const lastMonth = monthlyRevenue.at(-1);
  const prevMonth = monthlyRevenue.at(-2);
  const growth = prevMonth && prevMonth.revenue > 0 && lastMonth
    ? ((lastMonth.revenue - prevMonth.revenue) / prevMonth.revenue * 100)
    : null;

  const popularPackage = topPackages[0];
  const popularHotel = topHotels[0];

  const kpis = [
    { label: "Revenue (6mo)", value: inr(totalRevenue), icon: IndianRupee, tint: "bg-emerald-500/10 text-emerald-600" },
    { label: "Bookings (6mo)", value: totalBookingsCount, icon: CalendarCheck, tint: "bg-primary/10 text-primary" },
    {
      label: "MoM growth", value: growth != null ? `${growth >= 0 ? "+" : ""}${growth.toFixed(1)}%` : "—",
      icon: growth != null && growth < 0 ? TrendingDown : TrendingUp, tint: "bg-accent/10 text-accent",
    },
    { label: "Avg. rating", value: avgRating != null ? avgRating.toFixed(1) : "—", icon: Star, tint: "bg-amber-500/10 text-amber-600" },
  ];

  if (loading) {
    return <div className="flex items-center justify-center py-24 text-muted-foreground gap-2"><Loader2 className="animate-spin" /> Loading analytics…</div>;
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">Understand how your business is trending over time.</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <CardContent className="p-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${k.tint}`}>
                  <k.icon size={16} />
                </div>
                <p className="text-xl font-bold text-card-foreground">{k.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{k.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <h2 className="font-display font-semibold text-card-foreground mb-1">Monthly revenue</h2>
            <p className="text-xs text-muted-foreground mb-4">Last 6 months, from your actual bookings</p>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={monthlyRevenue}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => `${v/1000}k`} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number) => inr(v)}
                />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="font-display font-semibold text-card-foreground mb-1">Monthly bookings</h2>
            <p className="text-xs text-muted-foreground mb-4">Volume by month</p>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="bookings" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            {popularPackage ? (
              <>
                {popularPackage.thumbnailImage ? (
                  <img src={popularPackage.thumbnailImage} alt="" className="w-16 h-16 rounded-xl object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center shrink-0"><Package size={20} className="text-muted-foreground" /></div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Package size={11} /> Top package</p>
                  <p className="font-display font-semibold text-card-foreground truncate">{popularPackage.title}</p>
                  <p className="text-xs text-muted-foreground">{popularPackage.bookingCount} booking{popularPackage.bookingCount !== 1 ? "s" : ""}</p>
                </div>
                <p className="text-lg font-bold text-primary">{inr(popularPackage.price)}</p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No packages yet.</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            {popularHotel ? (
              <>
                {popularHotel.imageUrls[0] ? (
                  <img src={popularHotel.imageUrls[0]} alt="" className="w-16 h-16 rounded-xl object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center shrink-0"><HotelIcon size={20} className="text-muted-foreground" /></div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1"><HotelIcon size={11} /> Top hotel</p>
                  <p className="font-display font-semibold text-card-foreground truncate">{popularHotel.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {popularHotel.bookingCount} booking{popularHotel.bookingCount !== 1 ? "s" : ""}
                    {popularHotel.averageRating != null && <> · ★ {popularHotel.averageRating.toFixed(1)}</>}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No hotels yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
