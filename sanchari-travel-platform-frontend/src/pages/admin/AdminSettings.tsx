import { motion } from "framer-motion";
import { Settings as SettingsIcon, Globe, Mail, ShieldCheck, Bell, CreditCard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const sections = [
  { id: "general", title: "General", icon: Globe },
  { id: "notifications", title: "Notifications", icon: Bell },
  { id: "security", title: "Security", icon: ShieldCheck },
  { id: "billing", title: "Billing", icon: CreditCard },
  { id: "email", title: "Email delivery", icon: Mail },
];

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-2">
          <SettingsIcon className="text-primary" /> Platform Settings
        </h1>
        <p className="text-muted-foreground mt-1">Configure how Sanchari operates behind the scenes.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-4">
        <Card className="h-fit">
          <CardContent className="p-3">
            <ul className="space-y-1">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors">
                    <s.icon size={14} /> {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card id="general">
            <CardContent className="p-6 space-y-4">
              <div>
                <h2 className="font-display font-semibold text-card-foreground">General</h2>
                <p className="text-xs text-muted-foreground">Basic platform identity.</p>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>Platform name</Label><Input defaultValue="Sanchari" /></div>
                <div><Label>Support email</Label><Input defaultValue="help@sanchari.travel" /></div>
                <div><Label>Default currency</Label><Input defaultValue="INR (₹)" /></div>
                <div><Label>Timezone</Label><Input defaultValue="Asia/Kolkata" /></div>
              </div>
            </CardContent>
          </Card>

          <Card id="notifications">
            <CardContent className="p-6 space-y-4">
              <div>
                <h2 className="font-display font-semibold text-card-foreground">Notifications</h2>
                <p className="text-xs text-muted-foreground">Choose when admins get pinged.</p>
              </div>
              <Separator />
              {[
                { label: "New user reports", desc: "Ping admins when users are reported." },
                { label: "New content flags", desc: "Ping when reviews or listings are flagged." },
                { label: "High-value bookings", desc: "Notify on bookings over ₹25,000." },
                { label: "Weekly digest", desc: "Send a Monday summary email." },
              ].map((n, i) => (
                <div key={n.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{n.label}</p>
                    <p className="text-xs text-muted-foreground">{n.desc}</p>
                  </div>
                  <Switch defaultChecked={i !== 3} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card id="security">
            <CardContent className="p-6 space-y-4">
              <div>
                <h2 className="font-display font-semibold text-card-foreground">Security</h2>
                <p className="text-xs text-muted-foreground">Hardening for admin accounts.</p>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-card-foreground">Require 2FA for admins</p>
                  <p className="text-xs text-muted-foreground">All admin logins must complete 2-factor auth.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-card-foreground">IP allow list</p>
                  <p className="text-xs text-muted-foreground">Restrict admin console to trusted networks.</p>
                </div>
                <Switch />
              </div>
              <Button variant="outline" size="sm">Rotate admin session keys</Button>
            </CardContent>
          </Card>

          <Card id="billing">
            <CardContent className="p-6 space-y-3">
              <div>
                <h2 className="font-display font-semibold text-card-foreground">Billing</h2>
                <p className="text-xs text-muted-foreground">Payout schedule and platform commission.</p>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>Platform commission (%)</Label><Input defaultValue="8" /></div>
                <div><Label>Creator payout cycle</Label><Input defaultValue="Weekly (Monday)" /></div>
              </div>
            </CardContent>
          </Card>

          <Card id="email">
            <CardContent className="p-6 space-y-3">
              <div>
                <h2 className="font-display font-semibold text-card-foreground">Email delivery</h2>
                <p className="text-xs text-muted-foreground">SMTP provider used for transactional emails.</p>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>Provider</Label><Input defaultValue="Resend" /></div>
                <div><Label>From address</Label><Input defaultValue="Sanchari <no-reply@sanchari.travel>" /></div>
              </div>
              <Button className="bg-gradient-hero text-primary-foreground hover:opacity-90">Save changes</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
