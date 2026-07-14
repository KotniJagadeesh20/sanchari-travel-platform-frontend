import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, MessageSquareWarning, EyeOff, UserX, Flag, CheckCircle2, Lock, Handshake } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { adminReports, type AdminReport } from "@/data/admin";
import { toast } from "@/hooks/use-toast";

const typeMeta: Record<AdminReport["type"], { icon: typeof Flag; label: string; tint: string }> = {
  review: { icon: MessageSquareWarning, label: "Reported Review", tint: "bg-amber-500/10 text-amber-600" },
  user: { icon: UserX, label: "Reported User", tint: "bg-rose-500/10 text-rose-600" },
  content: { icon: Flag, label: "Content Flag", tint: "bg-primary/10 text-primary" },
};

export default function Moderation() {
  const [reports, setReports] = useState<AdminReport[]>(adminReports);
  const resolve = (id: string) => {
    setReports((s) => s.map((r) => r.id === id ? { ...r, status: "resolved" } : r));
    toast({ title: "Report resolved" });
  };
  const hide = (id: string) => {
    setReports((s) => s.map((r) => r.id === id ? { ...r, status: "hidden" } : r));
    toast({ title: "Content hidden" });
  };

  const stats = [
    { label: "Reported reviews", value: reports.filter(r => r.type === "review" && r.status === "pending").length, icon: MessageSquareWarning, tint: "bg-amber-500/10 text-amber-600" },
    { label: "Hidden reviews", value: reports.filter(r => r.status === "hidden").length, icon: EyeOff, tint: "bg-muted text-muted-foreground" },
    { label: "Reported users", value: reports.filter(r => r.type === "user" && r.status === "pending").length, icon: UserX, tint: "bg-rose-500/10 text-rose-600" },
    { label: "Content flags", value: reports.filter(r => r.type === "content").length, icon: Flag, tint: "bg-primary/10 text-primary" },
  ];

  const pending = reports.filter((r) => r.status === "pending");
  const handled = reports.filter((r) => r.status !== "pending");

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-2">
          <ShieldAlert className="text-primary" /> Moderation
        </h1>
        <p className="text-muted-foreground mt-1">Keep the community safe. Review reports and take action.</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${s.tint}`}>
                <s.icon size={16} />
              </div>
              <p className="text-xl font-bold text-card-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="font-display font-semibold text-card-foreground mb-4">Pending queue</h2>
          {pending.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">All caught up! No pending reports.</p>
          ) : (
            <ul className="space-y-3">
              {pending.map((r) => {
                const meta = typeMeta[r.type];
                return (
                  <li key={r.id} className="flex flex-wrap items-start gap-3 p-4 rounded-xl border border-border hover:bg-muted/40 transition-colors">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${meta.tint}`}>
                      <meta.icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-card-foreground">{r.target}</p>
                        <Badge variant="outline" className="text-[10px]">{meta.label}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">Reason: {r.reason}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Reported by {r.reportedBy} · {r.reportedAt}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button size="sm" variant="outline" onClick={() => hide(r.id)}><EyeOff size={13} className="mr-1" /> Hide</Button>
                      <Button size="sm" className="bg-gradient-hero text-primary-foreground hover:opacity-90" onClick={() => resolve(r.id)}><CheckCircle2 size={13} className="mr-1" /> Resolve</Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <h2 className="font-display font-semibold text-card-foreground mb-4">Recently handled</h2>
            {handled.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">Nothing handled yet.</p>
            ) : (
              <ul className="space-y-3">
                {handled.map((r) => (
                  <li key={r.id} className="flex items-start gap-3 text-sm">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-muted-foreground shrink-0" />
                    <div className="flex-1">
                      <p className="text-card-foreground">{r.target}</p>
                      <p className="text-xs text-muted-foreground">{r.reason}</p>
                    </div>
                    <Badge variant="outline" className="capitalize text-[10px]">{r.status}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-1">
              <Handshake size={16} className="text-primary" />
              <h2 className="font-display font-semibold text-card-foreground">Partner approval queue</h2>
              <Badge variant="outline" className="ml-auto gap-1"><Lock size={10} /> Coming soon</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Once bus operators, hotels and guides start onboarding themselves, their applications will land here for admin review.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
