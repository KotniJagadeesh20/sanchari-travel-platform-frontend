import { Calendar, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BookingStatus } from "@/data/transportation";

interface BookingCardProps {
  title: string;
  subtitle?: string;
  route: string;
  date: string;
  status: BookingStatus;
  meta: { label: string; value: string }[];
  onCancel?: () => void;
}

const statusStyles: Record<BookingStatus, string> = {
  upcoming: "bg-primary/10 text-primary border-primary/20",
  completed: "bg-muted text-muted-foreground border-border",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

const BookingCard = ({ title, subtitle, route, date, status, meta, onCancel }: BookingCardProps) => (
  <div className="rounded-2xl bg-card border border-border/60 shadow-card p-5 md:p-6">
    <div className="flex items-start justify-between gap-3 mb-3">
      <div>
        <h3 className="font-display font-bold text-foreground">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      <Badge variant="outline" className={statusStyles[status]}>{status}</Badge>
    </div>

    <div className="flex items-center gap-2 text-sm text-foreground">
      <MapPin size={14} className="text-primary" /> {route}
    </div>
    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
      <Calendar size={12} /> {new Date(date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
    </div>

    <div className="mt-4 pt-4 border-t border-border/60 grid grid-cols-2 sm:grid-cols-3 gap-3">
      {meta.map((m) => (
        <div key={m.label}>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{m.label}</p>
          <p className="text-sm font-medium text-foreground mt-0.5">{m.value}</p>
        </div>
      ))}
    </div>

    {status === "upcoming" && onCancel && (
      <div className="mt-4 flex justify-end">
        <Button variant="outline" size="sm" onClick={onCancel} className="text-destructive hover:text-destructive">
          Cancel Booking
        </Button>
      </div>
    )}
  </div>
);

export default BookingCard;
