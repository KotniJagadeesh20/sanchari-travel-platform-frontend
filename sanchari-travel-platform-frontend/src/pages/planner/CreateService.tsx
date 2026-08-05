import { useState } from "react";
import { motion } from "framer-motion";
import { Building, Car, UtensilsCrossed, Compass, MapPin, IndianRupee, Phone, FileText, ArrowLeft, ImagePlus, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const categories = [
  { value: "Stays", icon: Building },
  { value: "Transport", icon: Car },
  { value: "Food", icon: UtensilsCrossed },
  { value: "Guides", icon: Compass },
];

export default function PlannerCreateService() {
  const [category, setCategory] = useState("");
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImages = Array.from(files).map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages(prev => [...prev, ...newImages]);
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Service created successfully! 🎉");
  };

  const fieldAnim = (i: number) => ({
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.1 + i * 0.06 },
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/planner/services" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm mb-4 transition-colors">
          <ArrowLeft size={16} /> Back to My Services
        </Link>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Add Service</h1>
        <p className="text-muted-foreground mt-1">List a new service for travelers at your destination.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div {...fieldAnim(0)} className="space-y-2">
                <Label className="flex items-center gap-1.5 text-sm font-medium">
                  <FileText size={14} className="text-primary" /> Service Name
                </Label>
                <Input placeholder="e.g., Mountain View Resort" required />
              </motion.div>

              <motion.div {...fieldAnim(1)} className="space-y-2">
                <Label className="flex items-center gap-1.5 text-sm font-medium">
                  <Building size={14} className="text-primary" /> Category
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.value}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div {...fieldAnim(2)} className="space-y-2">
                <Label className="flex items-center gap-1.5 text-sm font-medium">
                  <MapPin size={14} className="text-primary" /> Location
                </Label>
                <Input placeholder="e.g., Ooty, Tamil Nadu" required />
              </motion.div>

              <motion.div {...fieldAnim(3)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5 text-sm font-medium">
                    <IndianRupee size={14} className="text-primary" /> Price (₹)
                  </Label>
                  <Input type="number" placeholder="e.g., 2500" />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5 text-sm font-medium">
                    <Phone size={14} className="text-primary" /> Contact
                  </Label>
                  <Input placeholder="e.g., +91 98765 43210" required />
                </div>
              </motion.div>

              <motion.div {...fieldAnim(4)} className="space-y-2">
                <Label className="flex items-center gap-1.5 text-sm font-medium">
                  <FileText size={14} className="text-primary" /> Description
                </Label>
                <Textarea placeholder="Describe your service..." rows={4} required />
              </motion.div>

              <motion.div {...fieldAnim(5)} className="space-y-2">
                <Label className="flex items-center gap-1.5 text-sm font-medium">
                  <ImagePlus size={14} className="text-primary" /> Images
                </Label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {images.map((img, i) => (
                    <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-border">
                      <img src={img.preview} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 p-1 rounded-full bg-background/80 text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors text-muted-foreground hover:text-primary">
                    <ImagePlus size={20} />
                    <span className="text-[10px] font-medium">Add Photo</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageAdd} />
                  </label>
                </div>
              </motion.div>

              <motion.div {...fieldAnim(6)}>
                <Button type="submit" className="w-full bg-gradient-hero text-primary-foreground hover:opacity-90 h-11 text-sm font-semibold shadow-glow">
                  Create Service
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
