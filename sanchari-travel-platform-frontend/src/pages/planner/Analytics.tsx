import { motion } from "framer-motion";
import { IndianRupee, CalendarCheck, TrendingUp, Package, Hotel as HotelIcon, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar,
} from "recharts";
import { bookings, hotels, monthlyRevenue, creatorPackageMeta } from "@/data/creator";
import { packages } from "@/data/trips";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function Analytics() {
  const totalRevenue = bookings.filter(b => b.status !== "cancelled").reduce((s, b) => s + b.amount, 0);
  const totalBookings = bookings.length;

  const popularPackage = [...packages]
    .map(p => ({ ...p, meta: creatorPackageMeta[p.id] }))
    .filter(p => p.meta)
    .sort((a, b) => b.meta!.bookings - a.meta!.bookings)[0];

  const popularHotel = [...hotels].sort((a, b) => b.bookings - a.bookings)[0];

  const growth = ((monthlyRevenue.at(-1)!.revenue - monthlyRevenue.at(-2)!.revenue) / monthlyRevenue.at(-2)!.revenue * 100).toFixed(1);

  const kpis = [
    { label: "Revenue (YTD)", value: inr(monthlyRevenue.reduce((s, m) => s + m.revenue, 0)), icon: IndianRupee, tint: "bg-emerald-500/10 text-emerald-600" },
    { label: "Bookings", value: totalBookings + monthlyRevenue.reduce((s, m) => s + m.bookings, 0), icon: CalendarCheck, tint: "bg-primary/10 text-primary" },
    { label: "MoM growth", value: `+${growth}%`, icon: TrendingUp, tint: "bg-accent/10 text-accent" },
    { label: "Avg. rating", value: (hotels.reduce((s, h) => s + h.rating, 0) / hotels.length).toFixed(1), icon: Star, tint: "bg-amber-500/10 text-amber-600" },
  ];

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
            <p className="text-xs text-muted-foreground mb-4">Last 7 months</p>
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
            {popularPackage && (
              <>
                <img src={popularPackage.meta!.image} alt="" className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Package size={11} /> Popular package</p>
                  <p className="font-display font-semibold text-card-foreground truncate">{popularPackage.title}</p>
                  <p className="text-xs text-muted-foreground">{popularPackage.meta!.bookings} bookings · ★ {popularPackage.meta!.rating}</p>
                </div>
                <p className="text-lg font-bold text-primary">{inr(popularPackage.price)}</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            {popularHotel && (
              <>
                <img src={popularHotel.image} alt="" className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1"><HotelIcon size={11} /> Popular hotel</p>
                  <p className="font-display font-semibold text-card-foreground truncate">{popularHotel.name}</p>
                  <p className="text-xs text-muted-foreground">{popularHotel.bookings} bookings · ★ {popularHotel.rating}</p>
                </div>
                <p className="text-lg font-bold text-primary">{inr(popularHotel.priceFrom)}<span className="text-xs text-muted-foreground font-normal">/n</span></p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
