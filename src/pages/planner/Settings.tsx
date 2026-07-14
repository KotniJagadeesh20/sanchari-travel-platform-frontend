import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, FileText, Bell, Shield, CreditCard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Settings() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your creator profile and preferences.</p>
      </motion.div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile"><User size={13} className="mr-1.5" /> Profile</TabsTrigger>
          <TabsTrigger value="notifications"><Bell size={13} className="mr-1.5" /> Notifications</TabsTrigger>
          <TabsTrigger value="payouts"><CreditCard size={13} className="mr-1.5" /> Payouts</TabsTrigger>
          <TabsTrigger value="security"><Shield size={13} className="mr-1.5" /> Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4 space-y-4">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground text-2xl font-bold shrink-0">W</div>
              <div className="flex-1">
                <h2 className="text-lg font-display font-semibold text-card-foreground">Wanderlust Travels</h2>
                <p className="text-sm text-muted-foreground">Creator · Since 2023</p>
              </div>
              <Button variant="outline" size="sm">Change photo</Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5 text-sm"><User size={14} className="text-primary" /> Business name</Label>
                  <Input defaultValue="Wanderlust Travels" />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5 text-sm"><Mail size={14} className="text-primary" /> Email</Label>
                  <Input defaultValue="hello@wanderlust.com" type="email" />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5 text-sm"><Phone size={14} className="text-primary" /> Phone / WhatsApp</Label>
                  <Input defaultValue="+91 98765 43210" />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5 text-sm"><MapPin size={14} className="text-primary" /> Location</Label>
                  <Input defaultValue="Bangalore, India" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5 text-sm"><FileText size={14} className="text-primary" /> About</Label>
                <Textarea
                  defaultValue="We craft unforgettable travel experiences across India's most beautiful destinations. From hill stations to beaches, we plan it all with love."
                  rows={4}
                />
              </div>
              <Button className="bg-gradient-hero text-primary-foreground hover:opacity-90 h-11 font-semibold">Save changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              {[
                { label: "New booking alerts", desc: "Get notified as soon as a guest books.", def: true },
                { label: "Guest messages", desc: "Notifications for new messages from travellers.", def: true },
                { label: "Weekly performance", desc: "Summary of your revenue and bookings each week.", def: false },
                { label: "Product updates", desc: "New Sanchari features and improvements.", def: false },
              ].map(n => (
                <div key={n.label} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium">{n.label}</p>
                    <p className="text-xs text-muted-foreground">{n.desc}</p>
                  </div>
                  <Switch defaultChecked={n.def} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="mt-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm">Bank account holder</Label>
                <Input defaultValue="Wanderlust Travels Pvt Ltd" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Account number</Label>
                  <Input defaultValue="XXXX XXXX 3421" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">IFSC</Label>
                  <Input defaultValue="HDFC0001234" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Payouts are processed every Monday for the previous week.</p>
              <Button className="bg-gradient-hero text-primary-foreground">Save payout details</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm">Current password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">New password</Label>
                  <Input type="password" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Confirm new password</Label>
                  <Input type="password" />
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div>
                  <p className="text-sm font-medium">Two-factor authentication</p>
                  <p className="text-xs text-muted-foreground">Add an extra layer of security when signing in.</p>
                </div>
                <Switch />
              </div>
              <Button className="bg-gradient-hero text-primary-foreground">Update security</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
