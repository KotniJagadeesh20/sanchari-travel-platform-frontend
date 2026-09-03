import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/api";

export default function PlannerProfile() {
  const { user, updateProfile } = useAuth();
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        name: nameRef.current?.value || undefined,
        phone: phoneRef.current?.value || undefined,
      });
      toast({ title: "Profile updated" });
    } catch (err) {
      toast({ title: "Could not save changes", description: err instanceof ApiError ? err.message : String(err), variant: "destructive" });
    }
    setSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your planner profile information.</p>
      </motion.div>

      {/* Avatar card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground text-2xl font-bold shrink-0">
              {(user?.name?.[0] || "?").toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-display font-semibold text-card-foreground">{user?.name || "—"}</h2>
              <p className="text-sm text-muted-foreground">Creator</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardContent className="p-6 space-y-5">
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-sm font-medium">
                <User size={14} className="text-primary" /> Full Name
              </Label>
              <Input ref={nameRef} defaultValue={user?.name || ""} />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-sm font-medium">
                <Mail size={14} className="text-primary" /> Email
              </Label>
              <Input defaultValue={user?.email || ""} type="email" disabled />
              <p className="text-xs text-muted-foreground">Email can't be changed here — it's your login identifier.</p>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-sm font-medium">
                <Phone size={14} className="text-primary" /> Phone / WhatsApp
              </Label>
              <Input ref={phoneRef} defaultValue={user?.phone || ""} />
            </div>

            <Button onClick={handleSave} disabled={saving} className="bg-gradient-hero text-primary-foreground hover:opacity-90 h-11 font-semibold">
              {saving ? <Loader2 size={16} className="animate-spin" /> : "Save Changes"}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
