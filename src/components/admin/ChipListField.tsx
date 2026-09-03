import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

/** Chip-list input for freeform string lists — places/inclusions/exclusions/activities/imageUrls etc. */
export default function ChipListField({ label, icon, items, setItems, placeholder }: {
  label: string; icon: React.ReactNode; items: string[]; setItems: (v: string[]) => void; placeholder: string;
}) {
  const [input, setInput] = useState("");
  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !items.includes(trimmed)) { setItems([...items, trimmed]); setInput(""); }
  };
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-1.5 text-sm font-medium">{icon} {label}</Label>
      <div className="flex gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder={placeholder}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} />
        <Button type="button" variant="outline" onClick={add} className="shrink-0">Add</Button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {items.map((item) => (
            <span key={item} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
              {item}
              <button type="button" onClick={() => setItems(items.filter((i) => i !== item))} className="hover:text-destructive transition-colors">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
