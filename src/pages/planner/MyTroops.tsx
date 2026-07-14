import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Calendar, MapPin, Pencil, Trash2, Plus, Eye, Route } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { troops as initialTroops } from "@/data/troops";
import type { Troop } from "@/data/troops";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const statusMap: Record<string, "Active" | "Completed"> = {
  "troop-1": "Active",
  "troop-2": "Active",
  "troop-3": "Active",
  "troop-4": "Completed",
  "troop-5": "Active",
  "troop-6": "Completed",
};

export default function MyTroops() {
  const navigate = useNavigate();
  const [troopList, setTroopList] = useState<Troop[]>(initialTroops);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editTroop, setEditTroop] = useState<Troop | null>(null);

  const handleDelete = () => {
    if (!deleteId) return;
    setTroopList((prev) => prev.filter((t) => t.id !== deleteId));
    setDeleteId(null);
    toast.success("Troop deleted successfully");
  };

  const handleEditSave = () => {
    if (!editTroop) return;
    setTroopList((prev) => prev.map((t) => (t.id === editTroop.id ? editTroop : t)));
    setEditTroop(null);
    toast.success("Troop updated successfully");
  };

  if (troopList.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center text-center py-24 px-4"
      >
        <div className="bg-primary/10 rounded-full p-6 mb-6">
          <Users className="text-primary" size={48} />
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
          No troops created yet
        </h2>
        <p className="text-muted-foreground max-w-md mb-8">
          Start your first group trip and travel with others. Create a troop, invite friends, and explore together!
        </p>
        <Button
onClick={() => navigate("/planner/create-troop")}
          className="bg-gradient-hero text-primary-foreground px-8 py-6 text-lg font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus size={20} className="mr-2" /> Create Your First Troop
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">My Troops</h1>
            <p className="text-muted-foreground mt-1">{troopList.length} troops created</p>
          </div>
          <Button
onClick={() => navigate("/planner/create-troop")}
            className="bg-gradient-hero text-primary-foreground hover:opacity-90"
          >
            <Plus size={16} className="mr-1" /> Create New
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {troopList.map((troop, i) => {
          const status = statusMap[troop.id] || "Active";
          return (
            <motion.div
              key={troop.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ y: -6 }}
            >
              <Card className="overflow-hidden hover:shadow-card-hover transition-all duration-300 h-full flex flex-col">
                {/* Cover Image */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={troop.image}
                    alt={troop.destination}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant="secondary" className="bg-background/90 text-foreground text-xs backdrop-blur-sm">
                      {troop.type}
                    </Badge>
                    <Badge
                      className={`text-xs backdrop-blur-sm ${
                        status === "Active"
                          ? "bg-green-500/90 text-white hover:bg-green-500/90"
                          : "bg-muted/90 text-muted-foreground hover:bg-muted/90"
                      }`}
                    >
                      {status}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <h3 className="text-white font-display font-bold text-lg leading-tight drop-shadow-md">
                      {troop.destination}
                    </h3>
                  </div>
                </div>

                <CardContent className="p-4 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} /> {troop.dates}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex -space-x-2">
                      {troop.members.slice(0, 4).map((m) => (
                        <img
                          key={m.id}
                          src={m.avatar}
                          alt={m.name}
                          className="w-7 h-7 rounded-full border-2 border-background"
                        />
                      ))}
                      {troop.members.length > 4 && (
                        <div className="w-7 h-7 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] font-medium text-muted-foreground">
                          +{troop.members.length - 4}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground ml-1">
                      {troop.members.length}/{troop.maxMembers} joined
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-border/50 mt-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => navigate(`/troops/${troop.id}`)}
                    >
                      <Eye size={13} className="mr-1" /> View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => setEditTroop({ ...troop })}
                    >
                      <Pencil size={13} className="mr-1" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                      onClick={() => setDeleteId(troop.id)}
                    >
                      <Trash2 size={13} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Troop</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this troop? This action cannot be undone.
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editTroop} onOpenChange={() => setEditTroop(null)}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Troop</DialogTitle>
          </DialogHeader>
          {editTroop && (
            <div className="space-y-4">
              <div>
                <Label>Destination</Label>
                <Input
                  value={editTroop.destination}
                  onChange={(e) => setEditTroop({ ...editTroop, destination: e.target.value })}
                />
              </div>
              <div>
                <Label>Dates</Label>
                <Input
                  value={editTroop.dates}
                  onChange={(e) => setEditTroop({ ...editTroop, dates: e.target.value })}
                />
              </div>
              <div>
                <Label>Trip Type</Label>
                <Select
                  value={editTroop.type}
                  onValueChange={(val) =>
                    setEditTroop({ ...editTroop, type: val as Troop["type"] })
                  }
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Road Trip", "Backpacking", "Group Trip", "Weekend Getaway"].map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Max Members</Label>
                <Input
                  type="number"
                  value={editTroop.maxMembers}
                  onChange={(e) => setEditTroop({ ...editTroop, maxMembers: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={editTroop.description}
                  onChange={(e) => setEditTroop({ ...editTroop, description: e.target.value })}
                  rows={4}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditTroop(null)}>Cancel</Button>
                <Button onClick={handleEditSave} className="bg-gradient-hero text-primary-foreground">
                  Save Changes
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
