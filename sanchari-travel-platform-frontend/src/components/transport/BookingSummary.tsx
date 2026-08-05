import { IndianRupee } from "lucide-react";

interface BookingSummaryProps {
  title: string;
  route: string;
  date?: string;
  seats?: string[] | number;
  pricePerSeat: number;
  quantity: number;
  extraRows?: { label: string; value: string }[];
}

const BookingSummary = ({ title, route, date, seats, pricePerSeat, quantity, extraRows = [] }: BookingSummaryProps) => {
  const subtotal = pricePerSeat * quantity;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  return (
    <div className="glass rounded-2xl p-6 space-y-4 sticky top-28">
      <div>
        <h3 className="font-display font-bold text-foreground text-lg">{title}</h3>
        <p className="text-sm text-muted-foreground mt-0.5">{route}</p>
        {date && <p className="text-xs text-muted-foreground mt-1">{new Date(date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric" })}</p>}
      </div>

      <div className="space-y-2 text-sm border-y border-border/60 py-4">
        {seats !== undefined && (
          <Row
            label={Array.isArray(seats) ? `Seats (${seats.length})` : `Seats`}
            value={Array.isArray(seats) ? (seats.length ? seats.join(", ") : "—") : String(seats)}
          />
        )}
        {extraRows.map((r) => <Row key={r.label} {...r} />)}
        <Row
          label={`Base fare × ${quantity}`}
          value={<span className="flex items-center"><IndianRupee size={12} />{subtotal.toLocaleString()}</span>}
        />
        <Row label="Taxes & fees" value={<span className="flex items-center"><IndianRupee size={12} />{tax.toLocaleString()}</span>} />
      </div>

      <div className="flex items-center justify-between">
        <span className="font-semibold text-foreground">Total</span>
        <span className="text-2xl font-display font-bold text-primary flex items-center">
          <IndianRupee size={18} />{total.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-start justify-between gap-4">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium text-foreground text-right">{value}</span>
  </div>
);

export default BookingSummary;
