import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Eye, Building, Car, UtensilsCrossed, Compass, MapPin, Star, Hotel, Truck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { services as allServices, type Service, type ServiceCategory } from "@/data/services";
import { useNavigate } from "react-router-dom";

const categoryIcons: Record<ServiceCategory, React.ElementType> = {
  Stays: Building,
  Transport: Car,
  Food: UtensilsCrossed,
  Guides: Compass,
};

const categoryColors: Record<ServiceCategory, string> = {
  Stays: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Transport: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Food: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Guides: "bg-purple-500/10 text-purple-600 border-purple-500/20",
};

export default function MyServices() {
  const navigate = useNavigate();
  const [servicesList, setServicesList] = useState<Service[]>(allServices.slice(0, 6));
  const [editService, setEditService] = useState<Service | null>(null);
  const [deleteService, setDeleteService] = useState<Service | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const [formData, setFormData] = useState({ name: "", category: "" as ServiceCategory | "", location: "", price: "", description: "", contact: "" });

  const openEdit = (s: Service) => {
    setFormData({ name: s.name, category: s.category, location: s.location, price: s.price, description: s.description, contact: s.contact });
    setEditService(s);
  };

  const handleSaveEdit = () => {
    if (!editService) return;
    setServicesList(prev => prev.map(s => s.id === editService.id ? { ...s, ...formData, category: formData.category as ServiceCategory } : s));
    setEditService(null);
    toast.success("Service updated successfully!");
  };

  const handleDelete = () => {
    if (!deleteService) return;
    setServicesList(prev => prev.filter(s => s.id !== deleteService.id));
    setDeleteService(null);
    toast.success("Service deleted");
  };

  const handleCreate = () => {
    if (!formData.name || !formData.category) { toast.error("Fill required fields"); return; }
    const newService: Service = {
      id: `svc-${Date.now()}`,
      name: formData.name,
      category: formData.category as ServiceCategory,
      image: allServices[0].image,
      location: formData.location,
      price: formData.price,
      rating: 4.5,
      description: formData.description,
      contact: formData.contact,
      features: [],
    };
    setServicesList(prev => [newService, ...prev]);
    setShowCreate(false);
    setFormData({ name: "", category: "", location: "", price: "", description: "", contact: "" });
    toast.success("Service created!");
  };

  const resetAndOpenCreate = () => {
    setFormData({ name: "", category: "", location: "", price: "", description: "", contact: "" });
    setShowCreate(true);
  };

  const formFields = (
    <div className="space-y-4">
      <div><Label>Service Name *</Label><Input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Mountain View Hotel" /></div>
      <div><Label>Category *</Label>
        <Select value={formData.category} onValueChange={v => setFormData(p => ({ ...p, category: v as ServiceCategory }))}>
          <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Stays">Stays</SelectItem>
            <SelectItem value="Transport">Transport</SelectItem>
            <SelectItem value="Food">Food</SelectItem>
            <SelectItem value="Guides">Guides</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Location</Label><Input value={formData.location} onChange={e => setFormData(p => ({ ...p, location: e.target.value }))} placeholder="e.g. Ooty" /></div>
        <div><Label>Price</Label><Input value={formData.price} onChange={e => setFormData(p => ({ ...p, price: e.target.value }))} placeholder="e.g. ₹2,500/night" /></div>
      </div>
      <div><Label>Contact</Label><Input value={formData.contact} onChange={e => setFormData(p => ({ ...p, contact: e.target.value }))} placeholder="+91 98765 43210" /></div>
      <div><Label>Description</Label><Textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} rows={3} placeholder="Describe your service..." /></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">My Services</h1>
          <p className="text-muted-foreground text-sm">Manage services you offer to travelers</p>
        </div>
        {servicesList.length > 0 && (
          <Button onClick={() => navigate("/planner/create-service")} className="bg-gradient-hero text-primary-foreground">
            <Plus className="h-4 w-4 mr-1" /> Add Service
          </Button>
        )}
      </div>

      {servicesList.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex gap-4 mb-6">
            {[Hotel, Truck, UtensilsCrossed, Compass].map((Icon, i) => (
              <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }} className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Icon className="h-7 w-7 text-primary" />
              </motion.div>
            ))}
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">No services added yet</h2>
          <p className="text-muted-foreground mb-6 max-w-sm">Add your services and reach travelers easily</p>
          <Button onClick={() => navigate("/planner/create-service")} size="lg" className="bg-gradient-hero text-primary-foreground">
            <Plus className="h-5 w-5 mr-2" /> Add Your First Service
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {servicesList.map((service, i) => {
            const CatIcon = categoryIcons[service.category];
            return (
              <motion.div key={service.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -4 }}>
                <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                  <div className="relative h-40 overflow-hidden">
                    <img src={service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <Badge className={`absolute top-3 left-3 ${categoryColors[service.category]}`}>
                      <CatIcon className="h-3 w-3 mr-1" />{service.category}
                    </Badge>
                  </div>
                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-semibold text-foreground truncate">{service.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{service.location}</span>
                      <span className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-500 fill-amber-500" />{service.rating}</span>
                    </div>
                    {service.price && <p className="text-sm font-medium text-primary">{service.price}</p>}
                    <p className="text-xs text-muted-foreground line-clamp-2">{service.description}</p>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" onClick={() => navigate(`/services/${service.id}`)}><Eye className="h-3.5 w-3.5 mr-1" />View</Button>
                      <Button size="sm" variant="outline" onClick={() => openEdit(service)}><Edit className="h-3.5 w-3.5 mr-1" />Edit</Button>
                      <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => setDeleteService(service)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editService} onOpenChange={() => setEditService(null)}>
        <DialogContent><DialogHeader><DialogTitle>Edit Service</DialogTitle><DialogDescription>Update your service details</DialogDescription></DialogHeader>{formFields}<DialogFooter><Button variant="outline" onClick={() => setEditService(null)}>Cancel</Button><Button onClick={handleSaveEdit} className="bg-gradient-hero text-primary-foreground">Save</Button></DialogFooter></DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteService} onOpenChange={() => setDeleteService(null)}>
        <DialogContent><DialogHeader><DialogTitle>Delete Service</DialogTitle><DialogDescription>Are you sure you want to delete "{deleteService?.name}"?</DialogDescription></DialogHeader><DialogFooter><Button variant="outline" onClick={() => setDeleteService(null)}>Cancel</Button><Button variant="destructive" onClick={handleDelete}>Delete</Button></DialogFooter></DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent><DialogHeader><DialogTitle>Add New Service</DialogTitle><DialogDescription>List a new service for travelers</DialogDescription></DialogHeader>{formFields}<DialogFooter><Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button><Button onClick={handleCreate} className="bg-gradient-hero text-primary-foreground">Create Service</Button></DialogFooter></DialogContent>
      </Dialog>
    </div>
  );
}
