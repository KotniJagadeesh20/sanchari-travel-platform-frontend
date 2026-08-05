import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Users, Type, FileText, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function PlannerCreateTroop() {
  const [destination, setDestination] = useState("");
  const [type, setType] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Troop created successfully! 🎉");
  };

  const fieldAnim = (i: number) => ({
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.1 + i * 0.06 },
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/planner/troops" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm mb-4 transition-colors">
          <ArrowLeft size={16} /> Back to My Troops
        </Link>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Create Troop</h1>
        <p className="text-muted-foreground mt-1">Start a new group trip and gather your tribe.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div {...fieldAnim(0)} className="space-y-2">
                <Label className="flex items-center gap-1.5 text-sm font-medium">
                  <MapPin size={14} className="text-primary" /> Destination
                </Label>
                <Select value={destination} onValueChange={setDestination}>
                  <SelectTrigger><SelectValue placeholder="Choose destination" /></SelectTrigger>
                  <SelectContent>
                    {["Goa", "Manali", "Kashmir", "Coorg", "Ooty", "Rajasthan"].map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div {...fieldAnim(1)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5 text-sm font-medium">
                    <Calendar size={14} className="text-primary" /> Start Date
                  </Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5 text-sm font-medium">
                    <Calendar size={14} className="text-primary" /> End Date
                  </Label>
                  <Input type="date" />
                </div>
              </motion.div>

              <motion.div {...fieldAnim(2)} className="space-y-2">
                <Label className="flex items-center gap-1.5 text-sm font-medium">
                  <Type size={14} className="text-primary" /> Trip Type
                </Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {["Road Trip", "Backpacking", "Group Trip", "Weekend Getaway"].map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div {...fieldAnim(3)} className="space-y-2">
                <Label className="flex items-center gap-1.5 text-sm font-medium">
                  <Users size={14} className="text-primary" /> Max Members
                </Label>
                <Input type="number" placeholder="e.g. 10" min={2} max={50} />
              </motion.div>

              <motion.div {...fieldAnim(4)} className="space-y-2">
                <Label className="flex items-center gap-1.5 text-sm font-medium">
                  <FileText size={14} className="text-primary" /> Description
                </Label>
                <Textarea placeholder="Tell travelers what this trip is about..." rows={5} />
              </motion.div>

              <motion.div {...fieldAnim(5)}>
                <Button type="submit" className="w-full bg-gradient-hero text-primary-foreground hover:opacity-90 h-11 text-sm font-semibold shadow-glow">
                  <Users size={18} className="mr-2" /> Create Troop
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
