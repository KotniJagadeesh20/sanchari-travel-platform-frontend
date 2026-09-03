import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Bell, CheckCheck, Loader2, BellOff } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { notificationService, type AppNotification, type NotificationType } from "@/services/notificationService";
import { toast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/api";

const POLL_INTERVAL_MS = 45_000;

const typeDot: Record<NotificationType, string> = {
  BOOKING_CONFIRMED: "bg-emerald-500",
  BOOKING_CANCELLED: "bg-destructive",
  BOOKING_REJECTED: "bg-destructive",
  REVIEW_POSTED: "bg-amber-500",
  GENERIC: "bg-muted-foreground",
};

/**
 * Notifications don't carry which domain (bus/ride/hotel/package) a
 * referenceId belongs to — only NotificationType, which isn't
 * domain-specific either (e.g. BOOKING_CONFIRMED fires from all four
 * booking services). So clicking through goes to Profile's unified "My
 * Bookings" tab (the same Booking Aggregator view) rather than guessing
 * which domain's booking-detail page to deep-link to.
 */
const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);

  const refreshUnreadCount = useCallback(async () => {
    try {
      setUnreadCount(await notificationService.getUnreadCount());
    } catch {
      // Silent — a failed background poll shouldn't interrupt whatever
      // else the user is doing. The bell just won't update this cycle.
    }
  }, []);

  useEffect(() => {
    refreshUnreadCount();
    const interval = setInterval(refreshUnreadCount, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [refreshUnreadCount]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      setNotifications(await notificationService.getMyNotifications());
    } catch (err) {
      toast({ title: "Could not load notifications", description: err instanceof ApiError ? err.message : String(err), variant: "destructive" });
    }
    setLoading(false);
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) loadNotifications();
  };

  const handleNotificationClick = async (n: AppNotification) => {
    if (n.read) return;
    // Optimistic — the popover shouldn't feel laggy for something this small.
    setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
    setUnreadCount((c) => Math.max(0, c - 1));
    try {
      await notificationService.markAsRead(n.id);
    } catch (err) {
      // Roll back on failure so the badge/list stay honest.
      setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: false } : x)));
      setUnreadCount((c) => c + 1);
      toast({ title: "Could not mark as read", description: err instanceof ApiError ? err.message : String(err), variant: "destructive" });
    }
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      toast({ title: "Could not mark all as read", description: err instanceof ApiError ? err.message : String(err), variant: "destructive" });
    }
    setMarkingAll(false);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button className="relative text-muted-foreground hover:text-foreground transition-colors" aria-label="Notifications">
          <Bell size={22} />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 max-h-[28rem] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="font-display font-semibold text-sm text-foreground">Notifications</span>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={markingAll}
              className="text-xs text-primary hover:underline flex items-center gap-1 disabled:opacity-50"
            >
              {markingAll ? <Loader2 size={11} className="animate-spin" /> : <CheckCheck size={11} />} Mark all read
            </button>
          )}
        </div>

        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground text-sm flex items-center justify-center gap-2">
              <Loader2 size={14} className="animate-spin" /> Loading…
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <BellOff size={22} className="mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`w-full text-left px-4 py-3 border-b border-border/60 last:border-0 hover:bg-muted/50 transition-colors flex gap-2.5 ${
                  n.read ? "" : "bg-primary/[0.03]"
                }`}
              >
                <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${n.read ? "bg-transparent" : typeDot[n.type]}`} />
                <div className="min-w-0 flex-1">
                  <p className={`text-sm truncate ${n.read ? "text-muted-foreground" : "font-semibold text-foreground"}`}>{n.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{n.message}</p>
                  <p className="text-[11px] text-muted-foreground/70 mt-1">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <div className="border-t border-border p-2">
            <Button asChild variant="ghost" size="sm" className="w-full text-xs" onClick={() => setOpen(false)}>
              <Link to="/profile?tab=bookings">View all bookings</Link>
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
