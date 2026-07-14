import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export interface SearchFormValues {
  source: string;
  destination: string;
  date: string;
  passengers: number;
}

interface SearchFormProps {
  values: SearchFormValues;
  onChange: (v: SearchFormValues) => void;
  onSubmit: () => void;
  submitLabel?: string;
  loading?: boolean;
}

const SearchForm = ({ values, onChange, onSubmit, submitLabel = "Search", loading }: SearchFormProps) => {
  const set = <K extends keyof SearchFormValues>(k: K, v: SearchFormValues[K]) => onChange({ ...values, [k]: v });

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="glass rounded-2xl p-4 md:p-5 shadow-card"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        <Field label="From">
          <Input value={values.source} onChange={(e) => set("source", e.target.value)} placeholder="Hyderabad" />
        </Field>
        <Field label="To">
          <Input value={values.destination} onChange={(e) => set("destination", e.target.value)} placeholder="Vizag" />
        </Field>
        <Field label="Date">
          <Input type="date" value={values.date} onChange={(e) => set("date", e.target.value)} />
        </Field>
        <Field label="Passengers">
          <Input
            type="number"
            min={1}
            max={10}
            value={values.passengers}
            onChange={(e) => set("passengers", Math.max(1, Number(e.target.value) || 1))}
          />
        </Field>
        <div className="flex items-end">
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-hero text-primary-foreground hover:opacity-90 h-10"
          >
            <Search size={16} className="mr-1" /> {loading ? "Searching…" : submitLabel}
          </Button>
        </div>
      </div>
    </motion.form>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <Label className="text-xs text-muted-foreground">{label}</Label>
    {children}
  </div>
);

export default SearchForm;
