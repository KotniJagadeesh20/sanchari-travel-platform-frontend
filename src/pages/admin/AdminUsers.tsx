import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, ShieldCheck, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { adminUserService, type AdminUserRecord } from "@/services/adminUserService";
import { toast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/api";

type RoleFilter = "all" | "ROLE_USER" | "ROLE_ADMIN";

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<RoleFilter>("all");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        setUsers(await adminUserService.getAllUsers());
      } catch (err) {
        toast({ title: "Could not load users", description: err instanceof ApiError ? err.message : String(err), variant: "destructive" });
      }
      setLoading(false);
    })();
  }, []);

  const filtered = users.filter((u) => {
    if (role !== "all" && u.role !== role) return false;
    if (query && !u.name.toLowerCase().includes(query.toLowerCase()) && !u.email.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Users</h1>
        <p className="text-muted-foreground mt-1">{users.length} registered users across Sanchari.</p>
      </motion.div>

      <div className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800">
        <ShieldCheck size={14} className="shrink-0 mt-0.5" />
        <span>
          No suspend/delete actions here — the backend has no enabled/status field on user accounts yet and no
          delete-user endpoint. Adding either is a separate change since it touches the login path for every user.
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search users by name or email…" className="pl-9" />
        </div>
        <Tabs value={role} onValueChange={(v) => setRole(v as RoleFilter)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="ROLE_USER">Users</TabsTrigger>
            <TabsTrigger value="ROLE_ADMIN">Admins</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground gap-2"><Loader2 className="animate-spin" /> Loading users…</div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="p-10 text-center text-sm text-muted-foreground">No users match these filters.</CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((u, i) => (
            <motion.div key={u.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold shrink-0">
                      {u.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-semibold text-card-foreground truncate">{u.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge variant="outline" className="text-[10px] gap-1">
                          {u.role === "ROLE_ADMIN" && <ShieldCheck size={10} />}
                          {u.role === "ROLE_ADMIN" ? "Admin" : "User"}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">{u.phone}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
