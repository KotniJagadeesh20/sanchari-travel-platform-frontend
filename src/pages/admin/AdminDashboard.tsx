import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Users, MapPin, Bus, Building2, CalendarCheck, IndianRupee, ShieldAlert, Clock,
  ArrowUpRight, Plus, UserPlus, LinkIcon, Activity, ArrowRight, TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import {
  platformKpis, adminUsers, adminDestinations, adminBuses, recentActivities, monthlyStats,
} from "@/data/admin";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function AdminDashboard() {
  const kpis = [
    { label: "Total Users", value: platformKpis.totalUsers.toLocaleString("en-IN"), icon: Users, tint: "bg-primary/10 text-primary", delta: "+8.2%" },
    { label: "Destinations", value: platformKpis.totalDestinations, icon: MapPin, tint: "bg-accent/10 text-accent", delta: "+2 this month" },
    { label: "Bus Operators", value: platformKpis.totalOperators, icon: Building2, tint: "bg-emerald-500/10 text-emerald-600", delta: "+1" },
    { label: "Total Buses", value: platformKpis.totalBuses, icon: Bus, tint: "bg-blue-500/10 text-blue-600", delta: "+4" },
    { label: "Today's Bookings", value: platformKpis.todaysBookings, icon: CalendarCheck, tint: "bg-violet-500/10 text-violet-600", delta: "+12%" },
    { label: "Platform Revenue", value: inr(platformKpis.platformRevenue), icon: IndianRupee, tint: "bg-emerald-500/10 text-emerald-600", delta: "+9.4%" },
    { label: "Pending Reports", value: platformKpis.pendingReports, icon: ShieldAlert, tint: "bg-amber-500/10 text-amber-600", delta: "Needs review" },
    { label: "Pending Approvals", value: platformKpis.pendingApprovals, icon: Clock, tint: "bg-rose-500/10 text-rose-600", delta: "Awaiting" },
  ];

  const recentUsers = adminUsers.slice(0, 4);
  const recentDestinations = [...adminDestinations].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4);
  const recentBuses = adminBuses.slice(0, 4);

  const quickActions = [
    { label: "Create Destination", icon: MapPin, to: "/admin/destinations" },
    { label: "Add Bus", icon: Bus, to: "/admin/buses?tab=buses" },
    { label: "Add Driver", icon: UserPlus, to: "/admin/buses?tab=drivers" },
    { label: "Assign Driver", icon: LinkIcon, to: "/admin/buses?tab=assignments" },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Platform Overview</h1>
          <p className="text-muted-foreground mt-1">A pulse-check on Sanchari's operations across India.</p>
        </div>
        <Badge variant="outline" className="gap-1"><Activity size={12} /> All systems healthy</Badge>
      </motion.div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
        {kpis.map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${k.tint}`}>
                    <k.icon size={16} />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{k.delta}</span>
                </div>
                <p className="text-xl font-bold text-card-foreground">{k.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{k.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Chart + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display font-semibold text-card-foreground">Platform health</h2>
                <p className="text-xs text-muted-foreground">Users + bookings growth · last 7 months</p>
              </div>
              <Badge className="gap-1 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 border-0">
                <TrendingUp size={11} /> +12.4%
              </Badge>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={monthlyStats}>
                <defs>
                  <linearGradient id="au" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="ab" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="bookings" stroke="hsl(var(--accent))" strokeWidth={2} fill="url(#ab)" />
                <Area type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#au)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="font-display font-semibold text-card-foreground mb-1">Quick actions</h2>
            <p className="text-xs text-muted-foreground mb-4">One-tap admin tasks</p>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((qa) => (
                <Button key={qa.label} asChild variant="outline" className="h-auto py-3 flex-col gap-1.5 hover:border-primary hover:bg-primary/5">
                  <Link to={qa.to}>
                    <qa.icon size={16} className="text-primary" />
                    <span className="text-xs font-medium">{qa.label}</span>
                  </Link>
                </Button>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Recent activity</h3>
              <ul className="space-y-3">
                {recentActivities.slice(0, 4).map((a) => (
                  <li key={a.id} className="flex items-start gap-2 text-xs">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <div className="flex-1">
                      <p className="text-card-foreground leading-snug">{a.text}</p>
                      <p className="text-muted-foreground mt-0.5">{a.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-card-foreground">Recent users</h2>
              <Link to="/admin/users" className="text-xs text-primary flex items-center gap-1 hover:underline">View all <ArrowRight size={12} /></Link>
            </div>
            <ul className="space-y-3">
              {recentUsers.map((u) => (
                <li key={u.id} className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground text-xs font-bold">
                    {u.name.split(" ").map(n => n[0]).slice(0,2).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-card-foreground truncate">{u.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] capitalize">{u.role}</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-card-foreground">Recent destinations</h2>
              <Link to="/admin/destinations" className="text-xs text-primary flex items-center gap-1 hover:underline">View all <ArrowRight size={12} /></Link>
            </div>
            <ul className="space-y-3">
              {recentDestinations.map((d) => (
                <li key={d.id} className="flex items-center gap-3">
                  <img src={d.image} alt={d.name} className="w-11 h-11 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-card-foreground truncate">{d.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{d.state} · {d.packages} pkgs</p>
                  </div>
                  <ArrowUpRight size={14} className="text-muted-foreground" />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-card-foreground">Recent bus registrations</h2>
              <Link to="/admin/buses" className="text-xs text-primary flex items-center gap-1 hover:underline">View all <ArrowRight size={12} /></Link>
            </div>
            <ul className="space-y-3">
              {recentBuses.map((b) => (
                <li key={b.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Bus size={16} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-card-foreground truncate">{b.busno}</p>
                    <p className="text-xs text-muted-foreground truncate">{b.operator} · {b.source} → {b.destination}</p>
                  </div>
                  <Badge variant={b.status === "active" ? "default" : "outline"} className="text-[10px] capitalize">{b.status}</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
