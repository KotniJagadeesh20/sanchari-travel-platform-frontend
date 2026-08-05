import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Eye, Ban, Trash2, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { adminUsers, type AdminUser } from "@/data/admin";
import { toast } from "@/hooks/use-toast";

type RoleFilter = "all" | "traveler" | "creator" | "admin";

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>(adminUsers);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<RoleFilter>("all");

  const filtered = users.filter((u) => {
    if (role !== "all" && u.role !== role) return false;
    if (query && !u.name.toLowerCase().includes(query.toLowerCase()) && !u.email.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const suspend = (id: string) => {
    setUsers((s) => s.map((u) => u.id === id ? { ...u, status: u.status === "active" ? "suspended" : "active" } : u));
    toast({ title: "User status updated" });
  };
  const remove = (id: string) => {
    setUsers((s) => s.filter((u) => u.id !== id));
    toast({ title: "User removed" });
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Users</h1>
        <p className="text-muted-foreground mt-1">Travelers, creators and admins across Sanchari.</p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search users by name or email…" className="pl-9" />
        </div>
        <Tabs value={role} onValueChange={(v) => setRole(v as RoleFilter)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="traveler">Travelers</TabsTrigger>
            <TabsTrigger value="creator">Creators</TabsTrigger>
            <TabsTrigger value="admin">Admins</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((u, i) => (
          <motion.div key={u.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold shrink-0">
                    {u.name.split(" ").map(n => n[0]).slice(0,2).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-display font-semibold text-card-foreground truncate">{u.name}</p>
                      <Badge variant={u.status === "active" ? "default" : "destructive"} className="text-[10px] capitalize">{u.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge variant="outline" className="text-[10px] capitalize gap-1">
                        {u.role === "admin" && <ShieldCheck size={10} />}
                        {u.role}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">Joined {u.joined}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-1.5 pt-2 border-t border-border">
                  <Button size="sm" variant="outline" className="flex-1"><Eye size={13} className="mr-1" /> View</Button>
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => suspend(u.id)}><Ban size={13} className="mr-1" /> {u.status === "active" ? "Suspend" : "Unsuspend"}</Button>
                  <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => remove(u.id)}><Trash2 size={13} /></Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
