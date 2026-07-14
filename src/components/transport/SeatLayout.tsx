import { cn } from "@/lib/utils";
import type { Bus } from "@/data/transportation";

interface SeatLayoutProps {
  bus: Bus;
  selected: string[];
  onToggle: (seat: string) => void;
  maxSeats?: number;
}

// Deck layout: rows A..F, cols 1..(totalSeats/rows). Simple 2-1 sleeper style.
const buildSeats = (total: number) => {
  const rows = ["A", "B", "C", "D", "E", "F"];
  const perRow = Math.ceil(total / rows.length);
  const seats: string[] = [];
  for (const r of rows) {
    for (let c = 1; c <= perRow; c++) {
      if (seats.length < total) seats.push(`${r}${c}`);
    }
  }
  return { rows, perRow, seats };
};

const SeatLayout = ({ bus, selected, onToggle, maxSeats = 6 }: SeatLayoutProps) => {
  const { rows, perRow } = buildSeats(bus.totalSeats);

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <Legend color="bg-card border-2 border-border" label="Available" />
        <Legend color="bg-primary" label="Selected" />
        <Legend color="bg-muted border border-border" label="Booked" textColor="text-muted-foreground/60" />
      </div>

      {/* Bus body */}
      <div className="rounded-3xl border-2 border-border bg-muted/30 p-6 md:p-8 max-w-md mx-auto">
        <div className="flex justify-end mb-6">
          <div className="w-10 h-10 rounded-lg border-2 border-border flex items-center justify-center text-xs text-muted-foreground">
            🚍
          </div>
        </div>

        <div className="space-y-2">
          {rows.map((r) => (
            <div key={r} className="grid gap-2" style={{ gridTemplateColumns: `repeat(${perRow}, minmax(0,1fr))` }}>
              {Array.from({ length: perRow }).map((_, i) => {
                const label = `${r}${i + 1}`;
                const isBooked = bus.bookedSeats.includes(label);
                const isSelected = selected.includes(label);
                const disabled = isBooked || (selected.length >= maxSeats && !isSelected);

                return (
                  <button
                    key={label}
                    type="button"
                    disabled={disabled}
                    onClick={() => onToggle(label)}
                    className={cn(
                      "aspect-square rounded-lg text-xs font-semibold transition-all border-2",
                      isBooked && "bg-muted border-border text-muted-foreground/50 cursor-not-allowed",
                      !isBooked && !isSelected && "bg-card border-border text-foreground hover:border-primary hover:bg-primary/5",
                      isSelected && "bg-primary border-primary text-primary-foreground shadow-glow scale-105",
                      disabled && !isBooked && "opacity-40 cursor-not-allowed",
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Legend = ({ color, label, textColor }: { color: string; label: string; textColor?: string }) => (
  <div className="flex items-center gap-2">
    <div className={cn("w-4 h-4 rounded", color)} />
    <span className={textColor}>{label}</span>
  </div>
);

export default SeatLayout;
