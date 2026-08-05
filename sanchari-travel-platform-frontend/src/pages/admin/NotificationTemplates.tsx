import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Save, Eye, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { notificationTemplates, type NotificationTemplate } from "@/data/admin";
import { toast } from "@/hooks/use-toast";

export default function NotificationTemplates() {
  const [templates, setTemplates] = useState<NotificationTemplate[]>(notificationTemplates);
  const [selectedId, setSelectedId] = useState(templates[0].id);
  const [previewMode, setPreviewMode] = useState(false);

  const selected = templates.find((t) => t.id === selectedId)!;

  const update = (field: "subject" | "body", value: string) => {
    setTemplates((s) => s.map((t) => t.id === selectedId ? { ...t, [field]: value } : t));
  };

  const save = () => {
    setTemplates((s) => s.map((t) => t.id === selectedId ? { ...t, lastUpdated: new Date().toISOString().slice(0, 10) } : t));
    toast({ title: "Template saved", description: `${selected.name} updated successfully.` });
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Notification Templates</h1>
        <p className="text-muted-foreground mt-1">Craft the messages that reach every traveler.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        <Card>
          <CardContent className="p-3">
            <ul className="space-y-1">
              {templates.map((t) => {
                const active = t.id === selectedId;
                return (
                  <li key={t.id}>
                    <button
                      onClick={() => { setSelectedId(t.id); setPreviewMode(false); }}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${active ? "bg-primary/10 text-primary" : "hover:bg-muted/50"}`}
                    >
                      <div className="flex items-center gap-2">
                        <Mail size={14} className={active ? "text-primary" : "text-muted-foreground"} />
                        <span className="text-sm font-medium truncate">{t.name}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1"><Clock size={9} /> Updated {t.lastUpdated}</p>
                    </button>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display font-semibold text-card-foreground">{selected.name}</h2>
                <p className="text-xs text-muted-foreground">Merge tags like <code className="bg-muted px-1 rounded">{"{{name}}"}</code> are replaced at send time.</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPreviewMode((p) => !p)}>
                  <Eye size={14} className="mr-1" /> {previewMode ? "Edit" : "Preview"}
                </Button>
                <Button size="sm" onClick={save} className="bg-gradient-hero text-primary-foreground hover:opacity-90">
                  <Save size={14} className="mr-1" /> Save
                </Button>
              </div>
            </div>

            {previewMode ? (
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="bg-muted/40 px-5 py-3 border-b border-border">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Subject</p>
                  <p className="text-sm font-medium text-card-foreground">{selected.subject}</p>
                </div>
                <div className="p-5 whitespace-pre-wrap text-sm text-card-foreground leading-relaxed bg-background">
                  {selected.body}
                </div>
                <div className="px-5 py-3 border-t border-border bg-muted/40 text-[10px] text-muted-foreground text-center">
                  Sanchari · Discover India, one journey at a time
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Subject</label>
                  <Input value={selected.subject} onChange={(e) => update("subject", e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Body</label>
                  <Textarea rows={14} value={selected.body} onChange={(e) => update("body", e.target.value)} className="font-mono text-sm" />
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {["{{name}}", "{{bookingId}}", "{{itemName}}", "{{date}}", "{{amount}}", "{{destination}}", "{{resetLink}}"].map((t) => (
                    <Badge key={t} variant="outline" className="text-[10px] cursor-pointer hover:bg-muted"
                      onClick={() => update("body", selected.body + " " + t)}>
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
