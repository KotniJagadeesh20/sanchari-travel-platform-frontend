import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Package, Hotel as HotelIcon, MessageSquareReply } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { reviews, type Review } from "@/data/creator";

export default function Reviews() {
  const [tab, setTab] = useState<"package" | "hotel">("package");
  const list = reviews.filter(r => r.kind === tab);
  const avg = list.length ? (list.reduce((s, r) => s + r.rating, 0) / list.length).toFixed(1) : "—";

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Reviews</h1>
        <p className="text-muted-foreground mt-1">Guest feedback across your listings.</p>
      </motion.div>

      <Card>
        <CardContent className="p-6 flex items-center gap-6 flex-wrap">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">{avg}</p>
            <div className="flex items-center gap-0.5 text-amber-500 justify-center mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={12} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{list.length} reviews</p>
          </div>
          <div className="flex-1 min-w-[200px]">
            {[5, 4, 3, 2, 1].map(star => {
              const count = list.filter(r => r.rating === star).length;
              const pct = list.length ? (count / list.length) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2 text-xs">
                  <span className="w-3">{star}</span>
                  <Star size={10} className="text-amber-500" fill="currentColor" strokeWidth={0} />
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-6 text-right text-muted-foreground">{count}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Tabs value={tab} onValueChange={(v) => setTab(v as "package" | "hotel")}>
        <TabsList>
          <TabsTrigger value="package"><Package size={14} className="mr-1.5" /> Package reviews</TabsTrigger>
          <TabsTrigger value="hotel"><HotelIcon size={14} className="mr-1.5" /> Hotel reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="package" className="mt-4"><ReviewList items={list} /></TabsContent>
        <TabsContent value="hotel" className="mt-4"><ReviewList items={list} /></TabsContent>
      </Tabs>
    </div>
  );
}

function ReviewList({ items }: { items: Review[] }) {
  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="p-10 text-center">
          <Star className="mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No reviews yet.</p>
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((r, i) => (
        <motion.div key={r.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          <Card className="hover:shadow-card-hover transition-all h-full">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-card-foreground">{r.customer}</p>
                  <p className="text-[11px] text-muted-foreground">{r.date} · {r.itemName}</p>
                </div>
                <div className="flex items-center gap-0.5 text-amber-500">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} size={12} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-card-foreground/80">{r.comment}</p>
              <div className="mt-3 pt-3 border-t border-border/50 flex justify-end">
                <Button variant="ghost" size="sm" className="text-xs" onClick={() => toast.info("Reply coming soon")}>
                  <MessageSquareReply size={13} /> Reply
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
