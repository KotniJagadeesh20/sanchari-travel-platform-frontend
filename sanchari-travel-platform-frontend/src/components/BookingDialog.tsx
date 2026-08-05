import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Calendar, User, Phone, Mail, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packageTitle: string;
  price: number;
}

export default function BookingDialog({ open, onOpenChange, packageTitle, price }: BookingDialogProps) {
  const [people, setPeople] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const total = price * people;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Booking request sent!");
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => setSubmitted(false), 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {submitted ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} className="text-primary" />
            </div>
            <h3 className="text-xl font-display font-bold text-foreground">Booking Confirmed!</h3>
            <p className="text-sm text-muted-foreground">Your booking for <strong>{packageTitle}</strong> has been received. We'll contact you shortly.</p>
            <Button onClick={handleClose} className="bg-gradient-hero text-primary-foreground">Done</Button>
          </motion.div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display">Book — {packageTitle}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground flex items-center gap-1 mb-1"><User size={13} /> Full Name</label>
                  <Input required placeholder="John Doe" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground flex items-center gap-1 mb-1"><Phone size={13} /> Phone</label>
                  <Input required type="tel" placeholder="+91 9876543210" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground flex items-center gap-1 mb-1"><Mail size={13} /> Email</label>
                <Input required type="email" placeholder="you@example.com" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground flex items-center gap-1 mb-1"><Users size={13} /> No. of People</label>
                  <Input type="number" min={1} max={20} value={people} onChange={e => setPeople(Math.max(1, Number(e.target.value)))} />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground flex items-center gap-1 mb-1"><Calendar size={13} /> Travel Date</label>
                  <Input required type="date" />
                </div>
              </div>

              <div className="bg-muted/50 rounded-xl p-4 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total ({people} × ₹{price.toLocaleString()})</span>
                <span className="text-xl font-display font-bold text-primary">₹{total.toLocaleString()}</span>
              </div>

              <Button type="submit" className="w-full bg-gradient-hero text-primary-foreground py-3 font-semibold">
                Confirm Booking
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
