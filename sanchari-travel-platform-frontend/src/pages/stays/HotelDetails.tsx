import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, MapPin, Star, Phone, Mail, Clock, Users, BedDouble,
  IndianRupee, Check, Loader2, Shield,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { hotelService } from "@/services/hotelService";
import type { Hotel, Room, HotelReview } from "@/data/hotels";
import { ROOM_TYPE_LABELS } from "@/data/hotels";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/api";

function nightsBetween(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(0, Math.round(ms / 86400000));
}

const HotelDetails = () => {
  const { id } = useParams();
  const [sp] = useSearchParams();
  const nav = useNavigate();
  const { isAuthenticated } = useAuth();

  const [hotel, setHotel] = useState<Hotel | undefined>();
  const [reviews, setReviews] = useState<HotelReview[]>([]);
  const [loading, setLoading] = useState(true);

  const [checkIn, setCheckIn] = useState(sp.get("checkIn") || new Date().toISOString().slice(0, 10));
  const [checkOut, setCheckOut] = useState(sp.get("checkOut") || new Date(Date.now() + 86400000).toISOString().slice(0, 10));
  const [guests, setGuests] = useState(Number(sp.get("guests")) || 2);

  const [bookingRoom, setBookingRoom] = useState<Room | null>(null);
  const [specialRequest, setSpecialRequest] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const load = async () => {
    setLoading(true);
    const h = await hotelService.getHotel(id || "");
    setHotel(h);
    if (h) {
      try {
        setReviews(await hotelService.getReviews(h.id));
      } catch {
        setReviews([]);
      }
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  const nights = nightsBetween(checkIn, checkOut);

  const openBooking = (room: Room) => {
    setConfirmed(false);
    setSpecialRequest("");
    setBookingRoom(room);
  };

  const confirmBooking = async () => {
    if (!hotel || !bookingRoom || nights < 1) return;
    if (!isAuthenticated) {
      toast({ title: "Please log in to book", variant: "destructive" });
      nav("/login");
      return;
    }
    setSubmitting(true);
    try {
      await hotelService.bookRoom({
        hotelId: hotel.id,
        roomId: bookingRoom.id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        numberOfGuests: guests,
        specialRequest: specialRequest || undefined,
      });
      setConfirmed(true);
      toast({ title: "Booking confirmed!" });
      load();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
      toast({ title: "Booking failed", description: message, variant: "destructive" });
    }
    setSubmitting(false);
  };

  const submitReview = async () => {
    if (!hotel) return;
    if (!isAuthenticated) {
      toast({ title: "Please log in to leave a review", variant: "destructive" });
      nav("/login");
      return;
    }
    setSubmittingReview(true);
    try {
      await hotelService.createReview(hotel.id, reviewRating, reviewComment || undefined);
      toast({ title: "Review posted" });
      setReviewComment("");
      setReviews(await hotelService.getReviews(hotel.id));
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Could not post review.";
      toast({ title: "Review failed", description: message, variant: "destructive" });
    }
    setSubmittingReview(false);
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

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold mb-4">Hotel not found</h1>
          <Link to="/stays" className="text-primary font-semibold">Back to Stays</Link>
        </div>
      </div>
    );
  }

  const rooms = (hotel.rooms || []).filter((r) => r.active);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="relative pt-20 pb-6 overflow-hidden">
        {hotel.imageUrls[0] && (
          <div className="absolute inset-0">
            <img src={hotel.imageUrls[0]} alt="" className="w-full h-full object-cover opacity-10 blur-sm" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/90 to-background" />
          </div>
        )}
        <div className="container mx-auto px-4 relative z-10 pt-6">
          <Link to="/stays/search" className="inline-flex items-center gap-1.5 text-muted-foreground text-sm mb-6 hover:text-foreground transition-colors bg-muted/50 px-3 py-1.5 rounded-full">
            <ArrowLeft size={14} /> Back to results
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20 -mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-600 text-xs font-semibold px-3 py-1 rounded-full">
                  <Star size={12} fill="currentColor" /> {hotel.starRating}-star
                </span>
                {!hotel.active && (
                  <span className="inline-block bg-destructive/10 text-destructive text-xs font-semibold px-3 py-1 rounded-full">Not Listed</span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-3">{hotel.name}</h1>
              <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
                <MapPin size={14} /> {hotel.address}, {hotel.city}{hotel.state ? `, ${hotel.state}` : ""}, {hotel.country}
              </p>
              {hotel.averageRating != null && (
                <p className="text-sm text-muted-foreground mt-1">
                  ★ {hotel.averageRating.toFixed(1)} · {hotel.reviewCount} review{hotel.reviewCount !== 1 ? "s" : ""}
                </p>
              )}
              {hotel.createdBy && (
                <p className="text-xs text-muted-foreground mt-1">Managed by <strong className="text-foreground">{hotel.createdBy.name}</strong></p>
              )}
            </div>

            {hotel.description && (
              <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
                <h2 className="font-display font-bold text-lg mb-3 text-card-foreground">About</h2>
                <p className="text-muted-foreground leading-relaxed text-[15px]">{hotel.description}</p>
              </div>
            )}

            <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {hotel.checkInTime && <div className="flex items-center gap-2 text-muted-foreground"><Clock size={14} /> Check-in from {hotel.checkInTime}</div>}
              {hotel.checkOutTime && <div className="flex items-center gap-2 text-muted-foreground"><Clock size={14} /> Check-out by {hotel.checkOutTime}</div>}
              {hotel.contactPhone && <div className="flex items-center gap-2 text-muted-foreground"><Phone size={14} /> {hotel.contactPhone}</div>}
              {hotel.contactEmail && <div className="flex items-center gap-2 text-muted-foreground"><Mail size={14} /> {hotel.contactEmail}</div>}
            </div>

            {hotel.amenities.length > 0 && (
              <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
                <h2 className="font-display font-bold text-lg mb-4 text-card-foreground">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {hotel.amenities.map((a) => (
                    <span key={a.id} className="text-sm bg-muted text-foreground px-3 py-1.5 rounded-full">{a.name}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
              <h2 className="font-display font-bold text-lg mb-5 text-card-foreground flex items-center gap-2">
                <BedDouble size={16} className="text-primary" /> Room Types
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div>
                  <Label className="text-xs">Check-in</Label>
                  <Input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Check-out</Label>
                  <Input type="date" value={checkOut} min={checkIn} onChange={(e) => setCheckOut(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Guests</Label>
                  <Input type="number" min={1} value={guests} onChange={(e) => setGuests(Math.max(1, Number(e.target.value) || 1))} className="mt-1" />
                </div>
              </div>

              {rooms.length === 0 ? (
                <p className="text-sm text-muted-foreground">No room types are listed for this hotel yet.</p>
              ) : (
                <div className="space-y-3">
                  {rooms.map((r) => (
                    <div key={r.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-border/60">
                      <div>
                        <p className="font-semibold text-sm text-foreground">{ROOM_TYPE_LABELS[r.roomType]} <span className="text-muted-foreground font-normal">— {r.label}</span></p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><Users size={11} /> Sleeps {r.capacity}</p>
                        {r.description && <p className="text-xs text-muted-foreground mt-1">{r.description}</p>}
                        {r.amenities.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {r.amenities.map((a) => <span key={a} className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{a}</span>)}
                          </div>
                        )}
                        <p className="text-xs mt-1.5 font-medium">
                          {r.availableRooms > 0 ? <span className="text-emerald-600">{r.availableRooms} available</span> : <span className="text-destructive">Sold out</span>}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 sm:flex-col sm:items-end shrink-0">
                        <p className="font-display font-bold text-primary flex items-center"><IndianRupee size={15} />{r.pricePerNight.toLocaleString()}<span className="text-xs font-normal text-muted-foreground ml-1">/night</span></p>
                        <Button size="sm" disabled={r.availableRooms < 1 || guests > r.capacity} onClick={() => openBooking(r)} className="bg-gradient-hero text-primary-foreground">
                          {guests > r.capacity ? "Too many guests" : "Book"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
              <h2 className="font-display font-bold text-lg mb-4 text-card-foreground">Reviews</h2>
              {reviews.length === 0 ? (
                <p className="text-sm text-muted-foreground mb-5">No reviews yet — be the first to stay and share your experience.</p>
              ) : (
                <div className="space-y-3 mb-5">
                  {reviews.map((rv) => (
                    <div key={rv.id} className="p-3.5 rounded-xl bg-muted/50">
                      <div className="flex items-center gap-1 text-amber-600 text-xs font-semibold mb-1">
                        {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} fill={i < rv.rating ? "currentColor" : "none"} />)}
                      </div>
                      {rv.comment && <p className="text-sm text-foreground">{rv.comment}</p>}
                      <p className="text-[11px] text-muted-foreground mt-1">{new Date(rv.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-4 border-t border-border/60">
                <Label className="text-xs mb-1 block">Leave a review</Label>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} type="button" onClick={() => setReviewRating(s)}>
                      <Star size={20} className={s <= reviewRating ? "text-amber-500" : "text-muted-foreground"} fill={s <= reviewRating ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
                <Textarea placeholder="How was your stay? (optional)" value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} className="mb-2" />
                <Button size="sm" onClick={submitReview} disabled={submittingReview} variant="outline">
                  {submittingReview ? <Loader2 size={13} className="animate-spin" /> : "Post Review"}
                </Button>
                <p className="text-[11px] text-muted-foreground mt-1.5">One review per guest per hotel.</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50 sticky top-24">
              <div className="text-center mb-4 pb-4 border-b border-border">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">From</p>
                <p className="text-3xl font-display font-bold text-gradient-hero">
                  ₹{Math.min(...rooms.map((r) => r.pricePerNight), Infinity) === Infinity ? "—" : Math.min(...rooms.map((r) => r.pricePerNight)).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground mt-1">per night</p>
              </div>
              <p className="text-sm text-muted-foreground text-center">Choose a room type on the left to book — pricing and inventory are per room type, not per specific room.</p>
              <div className="mt-5 pt-5 border-t border-border flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Shield size={14} className="text-primary" />
                <span>Instant confirmation · No payment gateway yet</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Dialog open={!!bookingRoom} onOpenChange={(open) => !open && setBookingRoom(null)}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          {confirmed ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto"><Check size={32} className="text-primary" /></div>
              <h3 className="text-xl font-display font-bold text-foreground">Booking Confirmed!</h3>
              <p className="text-sm text-muted-foreground">Your booking at <strong>{hotel.name}</strong> is confirmed instantly.</p>
              <Button onClick={() => { setBookingRoom(null); nav("/stays/bookings"); }} className="bg-gradient-hero text-primary-foreground">View My Bookings</Button>
            </div>
          ) : bookingRoom && (
            <>
              <DialogHeader><DialogTitle className="font-display">Book — {ROOM_TYPE_LABELS[bookingRoom.roomType]} ({bookingRoom.label})</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Check-in</Label>
                    <Input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs">Check-out</Label>
                    <Input type="date" value={checkOut} min={checkIn} onChange={(e) => setCheckOut(e.target.value)} className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label className="text-xs flex items-center gap-1"><Users size={13} /> Guests</Label>
                  <Input type="number" min={1} max={bookingRoom.capacity} value={guests} onChange={(e) => setGuests(Math.max(1, Number(e.target.value) || 1))} className="mt-1" />
                  <p className="text-[11px] text-muted-foreground mt-1">This room type sleeps up to {bookingRoom.capacity}.</p>
                </div>
                <div>
                  <Label className="text-xs">Special request (optional)</Label>
                  <Textarea value={specialRequest} onChange={(e) => setSpecialRequest(e.target.value)} className="mt-1" placeholder="e.g. late check-in, high floor" />
                </div>

                <div className="bg-muted/50 rounded-xl p-4 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total ({nights} night{nights !== 1 ? "s" : ""} × ₹{bookingRoom.pricePerNight.toLocaleString()})</span>
                  <span className="text-xl font-display font-bold text-primary flex items-center"><IndianRupee size={16} />{(nights * bookingRoom.pricePerNight).toLocaleString()}</span>
                </div>
                <Button
                  onClick={confirmBooking}
                  disabled={submitting || nights < 1 || guests > bookingRoom.capacity || guests < 1}
                  className="w-full bg-gradient-hero text-primary-foreground py-3 font-semibold h-auto"
                >
                  {submitting ? <Loader2 className="animate-spin" size={18} /> : nights < 1 ? "Pick valid dates" : "Confirm Booking"}
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

export default HotelDetails;
