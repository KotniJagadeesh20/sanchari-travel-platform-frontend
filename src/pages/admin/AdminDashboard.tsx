import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Users, MapPin, Bus, ShieldAlert, Clock,
  ArrowUpRight, UserPlus, LinkIcon, Activity, ArrowRight, Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { adminUserService, type AdminUserRecord } from "@/services/adminUserService";
import { adminDestinationService } from "@/services/adminDestinationService";
import { adminBusService } from "@/services/adminBusService";
import type { Destination } from "@/data/destinations";
import type { AdminBus } from "@/data/admin";
import { toast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/api";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [buses, setBuses] = useState<AdminBus[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [u, d, b] = await Promise.all([
          adminUserService.getAllUsers(),
          adminDestinationService.getAllDestinations(),
          adminBusService.listBuses(),
        ]);
        setUsers(u);
        setDestinations(d);
        setBuses(b);
      } catch (err) {
        toast({ title: "Could not load platform overview", description: err instanceof ApiError ? err.message : String(err), variant: "destructive" });
      }
      setLoading(false);
    })();
  }, []);

  const kpis = [
    { label: "Total Users", value: users.length.toLocaleString("en-IN"), icon: Users, tint: "bg-primary/10 text-primary" },
    { label: "Destinations", value: destinations.length, icon: MapPin, tint: "bg-accent/10 text-accent" },
    { label: "Total Buses", value: buses.length, icon: Bus, tint: "bg-blue-500/10 text-blue-600" },
    // No cross-service aggregation endpoint exists for platform-wide
    // bookings/revenue (would need to query bus/ride/hotel/package services
    // together — a real gap, not built yet) or for moderation-report counts
    // (Moderation.tsx itself is still a placeholder). Honest "—" rather than
    // a fabricated number.
    { label: "Today's Bookings", value: "—", icon: Clock, tint: "bg-violet-500/10 text-violet-600" },
    { label: "Pending Reports", value: "—", icon: ShieldAlert, tint: "bg-amber-500/10 text-amber-600" },
  ];

  const recentUsers = users.slice(0, 4);
  const recentDestinations = destinations.slice(0, 4);
  const recentBuses = buses.slice(0, 4);

  const quickActions = [
    { label: "Create Destination", icon: MapPin, to: "/admin/destinations" },
    { label: "Add Bus", icon: Bus, to: "/admin/buses?tab=buses" },
    { label: "Add Driver", icon: UserPlus, to: "/admin/buses?tab=drivers" },
    { label: "Assign Driver", icon: LinkIcon, to: "/admin/buses?tab=assignments" },
  ];

  if (loading) {
    return <div className="flex items-center justify-center py-24 text-muted-foreground gap-2"><Loader2 className="animate-spin" /> Loading platform overview…</div>;
  }

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
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        {kpis.map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <Card className="hover:shadow-md transition-shadow">
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

      {/* Quick actions */}
      <Card>
        <CardContent className="p-6">
          <h2 className="font-display font-semibold text-card-foreground mb-1">Quick actions</h2>
          <p className="text-xs text-muted-foreground mb-4">One-tap admin tasks</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {quickActions.map((qa) => (
              <Button key={qa.label} asChild variant="outline" className="h-auto py-3 flex-col gap-1.5 hover:border-primary hover:bg-primary/5">
                <Link to={qa.to}>
                  <qa.icon size={16} className="text-primary" />
                  <span className="text-xs font-medium">{qa.label}</span>
                </Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-card-foreground">Recent users</h2>
              <Link to="/admin/users" className="text-xs text-primary flex items-center gap-1 hover:underline">View all <ArrowRight size={12} /></Link>
            </div>
            {recentUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No users yet.</p>
            ) : (
              <ul className="space-y-3">
                {recentUsers.map((u) => (
                  <li key={u.id} className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground text-xs font-bold">
                      {u.name.split(" ").map(n => n[0]).slice(0,2).join("").toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-card-foreground truncate">{u.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px]">{u.role === "ROLE_ADMIN" ? "Admin" : "User"}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-card-foreground">Destinations</h2>
              <Link to="/admin/destinations" className="text-xs text-primary flex items-center gap-1 hover:underline">View all <ArrowRight size={12} /></Link>
            </div>
            {recentDestinations.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No destinations yet.</p>
            ) : (
              <ul className="space-y-3">
                {recentDestinations.map((d) => (
                  <li key={d.id} className="flex items-center gap-3">
                    {d.imageUrls[0] ? (
                      <img src={d.imageUrls[0]} alt={d.name} className="w-11 h-11 rounded-lg object-cover" />
                    ) : (
                      <div className="w-11 h-11 rounded-lg bg-muted flex items-center justify-center"><MapPin size={14} className="text-muted-foreground" /></div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-card-foreground truncate">{d.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{d.state || d.country}</p>
                    </div>
                    <ArrowUpRight size={14} className="text-muted-foreground" />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-card-foreground">Buses</h2>
              <Link to="/admin/buses" className="text-xs text-primary flex items-center gap-1 hover:underline">View all <ArrowRight size={12} /></Link>
            </div>
            {recentBuses.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No buses yet.</p>
            ) : (
              <ul className="space-y-3">
                {recentBuses.map((b) => (
                  <li key={b.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Bus size={16} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-card-foreground truncate">{b.busno}</p>
                      <p className="text-xs text-muted-foreground truncate">{b.source} → {b.destination}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
