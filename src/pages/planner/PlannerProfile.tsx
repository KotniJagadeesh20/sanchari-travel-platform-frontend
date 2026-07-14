import { motion } from "framer-motion";
import { User, Mail, Phone, Globe, MapPin, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function PlannerProfile() {
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
              W
            </div>
            <div>
              <h2 className="text-lg font-display font-semibold text-card-foreground">Wanderlust Travels</h2>
              <p className="text-sm text-muted-foreground">Travel Planner · Since 2023</p>
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
              <Input defaultValue="Wanderlust Travels" />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-sm font-medium">
                <Mail size={14} className="text-primary" /> Email
              </Label>
              <Input defaultValue="hello@wanderlust.com" type="email" />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-sm font-medium">
                <Phone size={14} className="text-primary" /> Phone / WhatsApp
              </Label>
              <Input defaultValue="+91 98765 43210" />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-sm font-medium">
                <MapPin size={14} className="text-primary" /> Location
              </Label>
              <Input defaultValue="Bangalore, India" />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-sm font-medium">
                <FileText size={14} className="text-primary" /> About
              </Label>
              <Textarea
                defaultValue="We craft unforgettable travel experiences across India's most beautiful destinations. From hill stations to beaches, we plan it all with love."
                rows={4}
              />
            </div>

            <Button className="bg-gradient-hero text-primary-foreground hover:opacity-90 h-11 font-semibold">
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
