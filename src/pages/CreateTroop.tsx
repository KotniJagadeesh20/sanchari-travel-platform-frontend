import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Users, Type, FileText, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const CreateTroop = () => {
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
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pt-28 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
          <Link to="/troops" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors">
            <ArrowLeft size={16} /> Back to Troops
          </Link>

          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-3">
              <Users size={16} /> Create Your Troop
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Start a <span className="text-primary">Group Trip</span>
            </h1>
            <p className="text-muted-foreground mt-2">Gather your tribe and explore together</p>
          </div>

          <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 md:p-8 space-y-6">
            <motion.div {...fieldAnim(0)} className="space-y-2">
              <Label className="flex items-center gap-2"><MapPin size={14} /> Destination</Label>
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
                <Label className="flex items-center gap-2"><Calendar size={14} /> Start Date</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Calendar size={14} /> End Date</Label>
                <Input type="date" />
              </div>
            </motion.div>

            <motion.div {...fieldAnim(2)} className="space-y-2">
              <Label className="flex items-center gap-2"><Type size={14} /> Trip Type</Label>
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
              <Label className="flex items-center gap-2"><Users size={14} /> Max Members</Label>
              <Input type="number" placeholder="e.g. 10" min={2} max={50} />
            </motion.div>

            <motion.div {...fieldAnim(4)} className="space-y-2">
              <Label className="flex items-center gap-2"><FileText size={14} /> Description</Label>
              <Textarea placeholder="Tell travelers what this trip is about, what to expect, and why they should join..." rows={5} />
            </motion.div>

            <motion.div {...fieldAnim(5)}>
              <Button
                type="submit"
                className="w-full bg-gradient-hero text-primary-foreground py-6 text-lg font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                <Users size={20} className="mr-2" /> Create Troop
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default CreateTroop;
