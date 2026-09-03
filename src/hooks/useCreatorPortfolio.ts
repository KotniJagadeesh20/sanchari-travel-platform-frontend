import { useEffect, useMemo, useState } from "react";
import { adminPackageService } from "@/services/adminPackageService";
import { adminHotelService } from "@/services/adminHotelService";
import { hotelService } from "@/services/hotelService";
import type { TravelPackage, PackageBookingRecord } from "@/data/packages";
import type { Hotel, HotelBookingRecord, HotelReview } from "@/data/hotels";
import { toast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/api";

/**
 * Fetches everything a creator's dashboard/analytics needs — their own
 * packages and hotels, plus every booking and review across all of them —
 * and derives the aggregate numbers both pages show. One place for this so
 * PlannerDashboard.tsx and Analytics.tsx can't drift out of sync on how a
 * number is computed.
 *
 * This is genuinely N+1 (one bookings call per package/hotel, one reviews
 * call per hotel) rather than a single aggregate backend endpoint — no such
 * endpoint exists. Acceptable for a creator's own (typically small)
 * portfolio; would need a real backend aggregation if that assumption
 * stops holding.
 */
export function useCreatorPortfolio() {
  const [loading, setLoading] = useState(true);
  const [myPackages, setMyPackages] = useState<TravelPackage[]>([]);
  const [myHotels, setMyHotels] = useState<Hotel[]>([]);
  const [packageBookingsByPkg, setPackageBookingsByPkg] = useState<Record<string, PackageBookingRecord[]>>({});
  const [hotelBookingsByHotel, setHotelBookingsByHotel] = useState<Record<string, HotelBookingRecord[]>>({});
  const [latestReviews, setLatestReviews] = useState<(HotelReview & { hotelName: string })[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [packages, hotels] = await Promise.all([
          adminPackageService.getMyPackages(),
          adminHotelService.getMyHotels(),
        ]);
        setMyPackages(packages);
        setMyHotels(hotels);

        const [pkgBookingsEntries, hotelBookingsEntries, reviewEntries] = await Promise.all([
          Promise.all(packages.map(async (p) => [p.id, await adminPackageService.getBookingsForPackage(p.id)] as const)),
          Promise.all(hotels.map(async (h) => [h.id, await adminHotelService.getBookingsForHotel(h.id)] as const)),
          Promise.all(hotels.map(async (h) => (await hotelService.getReviews(h.id)).map((r) => ({ ...r, hotelName: h.name })))),
        ]);
        setPackageBookingsByPkg(Object.fromEntries(pkgBookingsEntries));
        setHotelBookingsByHotel(Object.fromEntries(hotelBookingsEntries));
        setLatestReviews(reviewEntries.flat().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)));
      } catch (err) {
        toast({ title: "Could not load your portfolio data", description: err instanceof ApiError ? err.message : String(err), variant: "destructive" });
      }
      setLoading(false);
    })();
  }, []);

  const allPackageBookings = useMemo(() => Object.values(packageBookingsByPkg).flat(), [packageBookingsByPkg]);
  const allHotelBookings = useMemo(() => Object.values(hotelBookingsByHotel).flat(), [hotelBookingsByHotel]);

  const activeBookings = useMemo(() =>
    allPackageBookings.filter((b) => b.status === "CONFIRMED").length +
    allHotelBookings.filter((b) => b.status === "CONFIRMED" || b.status === "CHECKED_IN").length,
    [allPackageBookings, allHotelBookings]);

  // Packages have no PENDING state (only CONFIRMED/CANCELLED) — hotel-only.
  const pendingBookings = useMemo(() => allHotelBookings.filter((b) => b.status === "PENDING").length, [allHotelBookings]);

  const totalRevenue = useMemo(() =>
    allPackageBookings.filter((b) => b.status !== "CANCELLED").reduce((s, b) => s + b.totalAmount, 0) +
    allHotelBookings.filter((b) => b.status !== "CANCELLED").reduce((s, b) => s + b.totalAmount, 0),
    [allPackageBookings, allHotelBookings]);

  const totalBookingsCount = useMemo(() =>
    allPackageBookings.filter((b) => b.status !== "CANCELLED").length +
    allHotelBookings.filter((b) => b.status !== "CANCELLED").length,
    [allPackageBookings, allHotelBookings]);

  const ratedHotels = useMemo(() => myHotels.filter((h) => h.averageRating != null), [myHotels]);
  const avgRating = ratedHotels.length
    ? ratedHotels.reduce((s, h) => s + (h.averageRating || 0), 0) / ratedHotels.length
    : null;
  const totalReviewCount = useMemo(() => myHotels.reduce((s, h) => s + h.reviewCount, 0), [myHotels]);

  const topPackages = useMemo(() =>
    [...myPackages]
      .map((p) => ({ ...p, bookingCount: (packageBookingsByPkg[p.id] || []).filter((b) => b.status !== "CANCELLED").length }))
      .sort((a, b) => b.bookingCount - a.bookingCount),
    [myPackages, packageBookingsByPkg]);

  const topHotels = useMemo(() =>
    [...myHotels]
      .map((h) => ({ ...h, bookingCount: (hotelBookingsByHotel[h.id] || []).filter((b) => b.status !== "CANCELLED").length }))
      .sort((a, b) => b.bookingCount - a.bookingCount),
    [myHotels, hotelBookingsByHotel]);

  /**
   * Real month-bucketed revenue/booking-count from actual booking
   * amounts/dates — not a backend analytics endpoint (none exists), but
   * genuinely derived from the same real booking records driving every
   * other number here.
   */
  const monthlyRevenue = useMemo(() => {
    const buckets = new Map<string, { revenue: number; bookings: number }>();
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets.set(d.toLocaleString("en-IN", { month: "short" }), { revenue: 0, bookings: 0 });
    }
    const addToBucket = (dateStr: string, amount: number) => {
      const label = new Date(dateStr).toLocaleString("en-IN", { month: "short" });
      const bucket = buckets.get(label);
      if (bucket) { bucket.revenue += amount; bucket.bookings += 1; }
    };
    allPackageBookings.filter((b) => b.status !== "CANCELLED").forEach((b) => addToBucket(b.bookingTime, b.totalAmount));
    allHotelBookings.filter((b) => b.status !== "CANCELLED").forEach((b) => addToBucket(b.bookingDate, b.totalAmount));
    return Array.from(buckets.entries()).map(([month, v]) => ({ month, ...v }));
  }, [allPackageBookings, allHotelBookings]);

  return {
    loading, myPackages, myHotels, allPackageBookings, allHotelBookings, latestReviews,
    activeBookings, pendingBookings, totalRevenue, totalBookingsCount,
    avgRating, totalReviewCount, topPackages, topHotels, monthlyRevenue,
  };
}
