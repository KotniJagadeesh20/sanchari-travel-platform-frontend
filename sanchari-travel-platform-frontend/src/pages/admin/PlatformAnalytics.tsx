import { motion } from "framer-motion";
import { Users, CalendarCheck, IndianRupee, TrendingUp, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, Legend,
} from "recharts";
import { monthlyStats, topDestinations, busOccupancy, bookingDistribution, platformKpis } from "@/data/admin";

const inr = (n: number) => `₹${(n / 1000).toFixed(0)}k`;
const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "#10b981", "#f59e0b"];

const chartTooltip = { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 };

export default function PlatformAnalytics() {
  const kpis = [
    { label: "Monthly active users", value: monthlyStats.at(-1)!.users.toLocaleString("en-IN"), icon: Users, tint: "bg-primary/10 text-primary" },
    { label: "Monthly bookings", value: monthlyStats.at(-1)!.bookings.toLocaleString("en-IN"), icon: CalendarCheck, tint: "bg-accent/10 text-accent" },
    { label: "Monthly revenue", value: `₹${(monthlyStats.at(-1)!.revenue / 1000).toFixed(0)}k`, icon: IndianRupee, tint: "bg-emerald-500/10 text-emerald-600" },
    { label: "Growth rate", value: "+12.4%", icon: TrendingUp, tint: "bg-amber-500/10 text-amber-600" },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Platform Analytics</h1>
        <p className="text-muted-foreground mt-1">A birds-eye view of how Sanchari is performing.</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k) => (
          <Card key={k.label}>
            <CardContent className="p-4">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${k.tint}`}>
                <k.icon size={16} />
              </div>
              <p className="text-xl font-bold text-card-foreground">{k.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{k.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <h2 className="font-display font-semibold text-card-foreground mb-1">Monthly revenue</h2>
            <p className="text-xs text-muted-foreground mb-4">Last 7 months (INR)</p>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={monthlyStats}>
                <defs>
                  <linearGradient id="mr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={inr} />
                <Tooltip contentStyle={chartTooltip} formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#mr)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="font-display font-semibold text-card-foreground mb-1">Users vs bookings</h2>
            <p className="text-xs text-muted-foreground mb-4">Trend by month</p>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={chartTooltip} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="bookings" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="font-display font-semibold text-card-foreground mb-1">Top destinations</h2>
            <p className="text-xs text-muted-foreground mb-4">By bookings this quarter</p>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={topDestinations} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} width={70} />
                <Tooltip contentStyle={chartTooltip} />
                <Bar dataKey="bookings" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="font-display font-semibold text-card-foreground mb-1">Bus occupancy</h2>
            <p className="text-xs text-muted-foreground mb-4">Average % by operator</p>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={busOccupancy}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="operator" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={chartTooltip} formatter={(v: number) => `${v}%`} />
                <Bar dataKey="occupancy" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="font-display font-semibold text-card-foreground mb-1">Booking distribution</h2>
            <p className="text-xs text-muted-foreground mb-4">By service type</p>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={bookingDistribution} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={4}>
                  {bookingDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={chartTooltip} formatter={(v: number) => `${v}%`} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="font-display font-semibold text-card-foreground mb-1">Platform statistics</h2>
            <p className="text-xs text-muted-foreground mb-4">All-time totals</p>
            <ul className="space-y-3">
              {[
                { label: "Total users", value: platformKpis.totalUsers.toLocaleString("en-IN") },
                { label: "Destinations live", value: platformKpis.totalDestinations },
                { label: "Bus operators", value: platformKpis.totalOperators },
                { label: "Total buses", value: platformKpis.totalBuses },
                { label: "Lifetime revenue", value: `₹${platformKpis.platformRevenue.toLocaleString("en-IN")}` },
              ].map((s) => (
                <li key={s.label} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <MapPin size={12} /> {s.label}
                  </span>
                  <span className="text-sm font-semibold text-card-foreground">{s.value}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
