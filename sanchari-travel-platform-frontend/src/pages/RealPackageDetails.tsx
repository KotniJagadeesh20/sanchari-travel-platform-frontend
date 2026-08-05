import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Clock, Users, Check, X, IndianRupee, Shield, CalendarCheck, Loader2, Calendar, Plus, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { packageService } from "@/services/packageService";
import type { TravelPackage, Departure, BookingTraveler } from "@/data/packages";
import { toast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/api";

const emptyTraveler = (): BookingTraveler => ({ name: "", age: 0 });

const RealPackageDetails = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const [pkg, setPkg] = useState<TravelPackage | undefined>();
  const [destinationName, setDestinationName] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedDepartureId, setSelectedDepartureId] = useState<string>("");
  const [travelers, setTravelers] = useState<BookingTraveler[]>([emptyTraveler()]);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const p = await packageService.getPackage(id || "");
      setPkg(p);
      if (p) {
        const dests = await packageService.listDestinationOptions();
        setDestinationName(dests.find((d) => d.id === p.destinationId)?.name);
      }
      setLoading(false);
    })();
  }, [id]);

  const upcomingDepartures = (pkg?.departures || [])
    .filter((d) => d.active && new Date(d.startDate) >= new Date())
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

  const selectedDeparture: Departure | undefined = upcomingDepartures.find((d) => d.id === selectedDepartureId);

  const openBooking = () => {
    setConfirmed(false);
    setSelectedDepartureId(upcomingDepartures[0]?.id || "");
    setTravelers([emptyTraveler()]);
    setBookingOpen(true);
  };

  const addTraveler = () => {
    if (!selectedDeparture || travelers.length >= selectedDeparture.availableSlots) return;
    setTravelers((prev) => [...prev, emptyTraveler()]);
  };
  const removeTraveler = (i: number) => setTravelers((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev));
  const setTraveler = (i: number, field: keyof BookingTraveler, value: string | number) =>
    setTravelers((prev) => prev.map((t, idx) => (idx === i ? { ...t, [field]: value } : t)));

  const travelersValid = travelers.every((t) => t.name.trim().length > 1 && t.age > 0);
  const canConfirm = !!selectedDeparture && travelersValid && travelers.length <= (selectedDeparture?.availableSlots || 0);

  const confirmBooking = async () => {
    if (!pkg || !selectedDeparture || !canConfirm) return;
    setSubmitting(true);
    try {
      await packageService.bookPackage(selectedDeparture.id, travelers);
      setConfirmed(true);
      toast({ title: "Booking confirmed!" });
      const refreshed = await packageService.getPackage(pkg.id);
      if (refreshed) setPkg(refreshed);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
      toast({ title: "Booking failed", description: message, variant: "destructive" });
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-28 space-y-4">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold mb-4">Package not found</h1>
          <Link to="/all-packages" className="text-primary font-semibold">Back to All Packages</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="relative pt-20 pb-10 overflow-hidden">
        {pkg.thumbnailImage && (
          <div className="absolute inset-0">
            <img src={pkg.thumbnailImage} alt="" className="w-full h-full object-cover opacity-10 blur-sm" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/90 to-background" />
          </div>
        )}
        <div className="container mx-auto px-4 relative z-10 pt-6">
          <Link to="/all-packages" className="inline-flex items-center gap-1.5 text-muted-foreground text-sm mb-6 hover:text-foreground transition-colors bg-muted/50 px-3 py-1.5 rounded-full">
            <ArrowLeft size={14} /> Back to All Packages
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20 -mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {destinationName && (
                  <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">{destinationName}</span>
                )}
                {!pkg.active && (
                  <span className="inline-block bg-destructive/10 text-destructive text-xs font-semibold px-3 py-1 rounded-full">Not Published</span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">{pkg.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-full"><Clock size={14} /> {pkg.durationDays}D / {pkg.durationNights}N</span>
                <span className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-full"><Calendar size={14} /> {upcomingDepartures.length} upcoming date{upcomingDepartures.length !== 1 ? "s" : ""}</span>
                {pkg.createdBy && (
                  <span className="flex items-center gap-1.5">Delivered by <strong className="text-foreground">{pkg.createdBy.name}</strong></span>
                )}
              </div>
            </div>

            {pkg.description && (
              <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
                <h2 className="font-display font-bold text-lg mb-3 text-card-foreground">About This Package</h2>
                <p className="text-muted-foreground leading-relaxed text-[15px]">{pkg.description}</p>
              </div>
            )}

            <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
              <h2 className="font-display font-bold text-lg mb-5 text-card-foreground flex items-center gap-2"><Calendar size={16} className="text-primary" /> Upcoming Departures</h2>
              {upcomingDepartures.length === 0 ? (
                <p className="text-sm text-muted-foreground">No upcoming departure dates are open for booking right now.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {upcomingDepartures.map((d) => (
                    <div key={d.id} className={`flex items-center justify-between p-3.5 rounded-xl border ${d.availableSlots > 0 ? "border-border/60" : "border-border/30 opacity-60"}`}>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{d.startDate}</p>
                        <p className="text-xs text-muted-foreground">{d.availableSlots > 0 ? `${d.availableSlots} slots left` : "Sold out"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {pkg.placesCovered.length > 0 && (
              <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
                <h2 className="font-display font-bold text-lg mb-5 text-card-foreground flex items-center gap-2"><MapPin size={16} className="text-primary" /> Places Covered</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pkg.placesCovered.map((place) => (
                    <div key={place} className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/50">
                      <MapPin size={16} className="text-primary shrink-0" />
                      <span className="font-medium text-sm text-foreground">{place}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {pkg.itinerary.length > 0 && (
              <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
                <h2 className="font-display font-bold text-lg mb-5 text-card-foreground">Itinerary</h2>
                <div className="space-y-4">
                  {pkg.itinerary.map((day) => (
                    <div key={day.id} className="flex gap-4">
                      <div className="shrink-0 w-9 h-9 rounded-full bg-gradient-hero text-primary-foreground flex items-center justify-center text-xs font-bold">D{day.dayNumber}</div>
                      <p className="text-sm text-muted-foreground pt-1.5">{day.plan}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(pkg.inclusions.length > 0 || pkg.exclusions.length > 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pkg.inclusions.length > 0 && (
                  <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
                    <h3 className="font-display font-bold text-sm mb-3 text-card-foreground">Included</h3>
                    <ul className="space-y-2">
                      {pkg.inclusions.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground"><Check size={14} className="text-emerald-600 shrink-0" /> {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {pkg.exclusions.length > 0 && (
                  <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
                    <h3 className="font-display font-bold text-sm mb-3 text-card-foreground">Not Included</h3>
                    <ul className="space-y-2">
                      {pkg.exclusions.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground"><X size={14} className="text-destructive shrink-0" /> {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {pkg.activities.length > 0 && (
              <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
                <h2 className="font-display font-bold text-lg mb-5 text-card-foreground">Activities</h2>
                <div className="flex flex-wrap gap-2">
                  {pkg.activities.map((a) => (
                    <span key={a} className="text-sm bg-muted text-foreground px-3 py-1.5 rounded-full">{a}</span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50 sticky top-24">
              <div className="text-center mb-6 pb-6 border-b border-border">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">Starting from</p>
                <p className="text-4xl font-display font-bold text-gradient-hero">₹{pkg.price.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-1">per person</p>
              </div>

              <Button
                onClick={openBooking}
                disabled={!pkg.active || upcomingDepartures.every((d) => d.availableSlots < 1) || upcomingDepartures.length === 0}
                className="w-full bg-gradient-hero text-primary-foreground py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-glow transition-shadow h-auto"
              >
                <CalendarCheck size={16} />
                {!pkg.active ? "Not Available" : upcomingDepartures.length === 0 ? "No Dates Open" : upcomingDepartures.every((d) => d.availableSlots < 1) ? "Sold Out" : "Book Package"}
              </Button>

              <div className="mt-5 pt-5 border-t border-border flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Shield size={14} className="text-primary" />
                <span>Secure booking · Instant confirmation</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          {confirmed ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto"><Check size={32} className="text-primary" /></div>
              <h3 className="text-xl font-display font-bold text-foreground">Booking Confirmed!</h3>
              <p className="text-sm text-muted-foreground">Your booking for <strong>{pkg.title}</strong> is confirmed instantly.</p>
              <Button onClick={() => { setBookingOpen(false); nav("/my-package-bookings"); }} className="bg-gradient-hero text-primary-foreground">View My Bookings</Button>
            </div>
          ) : (
            <>
              <DialogHeader><DialogTitle className="font-display">Book — {pkg.title}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-xs flex items-center gap-1"><Calendar size={13} /> Departure date</Label>
                  <select
                    value={selectedDepartureId}
                    onChange={(e) => setSelectedDepartureId(e.target.value)}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm mt-1"
                  >
                    {upcomingDepartures.map((d) => (
                      <option key={d.id} value={d.id} disabled={d.availableSlots < 1}>
                        {d.startDate} — {d.availableSlots > 0 ? `${d.availableSlots} slots left` : "Sold out"}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs flex items-center gap-1"><Users size={13} /> Travelers</Label>
                  {travelers.map((t, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <Input
                        placeholder="Full name"
                        value={t.name}
                        onChange={(e) => setTraveler(i, "name", e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        type="number" min={1} placeholder="Age"
                        value={t.age || ""}
                        onChange={(e) => setTraveler(i, "age", Number(e.target.value) || 0)}
                        className="w-20"
                      />
                      {travelers.length > 1 && (
                        <Button type="button" variant="outline" size="sm" onClick={() => removeTraveler(i)} className="shrink-0"><Trash2 size={13} /></Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button" variant="outline" size="sm"
                    onClick={addTraveler}
                    disabled={!selectedDeparture || travelers.length >= selectedDeparture.availableSlots}
                  >
                    <Plus size={13} className="mr-1" /> Add traveler
                  </Button>
                </div>

                <div className="bg-muted/50 rounded-xl p-4 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total ({travelers.length} × ₹{pkg.price.toLocaleString()})</span>
                  <span className="text-xl font-display font-bold text-primary flex items-center"><IndianRupee size={16} />{(travelers.length * pkg.price).toLocaleString()}</span>
                </div>
                <Button onClick={confirmBooking} disabled={!canConfirm || submitting} className="w-full bg-gradient-hero text-primary-foreground py-3 font-semibold h-auto">
                  {submitting ? <Loader2 className="animate-spin" size={18} /> : "Confirm Booking"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default RealPackageDetails;
