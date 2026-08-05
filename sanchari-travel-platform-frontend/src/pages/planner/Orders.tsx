import { motion } from "framer-motion";
import { IndianRupee, Calendar, User, MapPin, Clock, CheckCircle2, AlertCircle, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const orders = [
  { id: "ORD-1001", packageTitle: "Ooty Heritage Explorer", customer: "Rahul Sharma", date: "2026-03-28", people: 3, amount: 26997, status: "confirmed" as const, destination: "Ooty" },
  { id: "ORD-1002", packageTitle: "Goa Beach Bliss", customer: "Priya Nair", date: "2026-03-25", people: 2, amount: 23998, status: "confirmed" as const, destination: "Goa" },
  { id: "ORD-1003", packageTitle: "Kashmir Paradise Tour", customer: "Amit Patel", date: "2026-03-20", people: 4, amount: 99996, status: "completed" as const, destination: "Kashmir" },
  { id: "ORD-1004", packageTitle: "Coorg Coffee Trail", customer: "Sneha Reddy", date: "2026-04-01", people: 2, amount: 18998, status: "pending" as const, destination: "Coorg" },
  { id: "ORD-1005", packageTitle: "Manali Snow Adventure", customer: "Vikram Singh", date: "2026-03-15", people: 5, amount: 69995, status: "completed" as const, destination: "Manali" },
];

const statusConfig = {
  confirmed: { label: "Confirmed", color: "bg-primary/10 text-primary", icon: CheckCircle2 },
  completed: { label: "Completed", color: "bg-green-500/10 text-green-600", icon: CheckCircle2 },
  pending: { label: "Pending", color: "bg-secondary/20 text-secondary-foreground", icon: AlertCircle },
};

export default function Orders() {
  const totalRevenue = orders.reduce((s, o) => s + o.amount, 0);
  const confirmed = orders.filter(o => o.status === "confirmed").length;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground mt-1">Track customer bookings for your packages</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Orders", value: orders.length, icon: Package },
          { label: "Active Bookings", value: confirmed, icon: Clock },
          { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: IndianRupee },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <stat.icon size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-lg font-bold text-foreground">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {orders.map((order, i) => {
          const sc = statusConfig[order.status];
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className="hover:shadow-card-hover transition-all">
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display font-semibold text-card-foreground">{order.packageTitle}</h3>
                      <Badge variant="secondary" className={`text-[10px] ${sc.color}`}>
                        <sc.icon size={10} className="mr-1" /> {sc.label}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><User size={11} /> {order.customer}</span>
                      <span className="flex items-center gap-1"><MapPin size={11} /> {order.destination}</span>
                      <span className="flex items-center gap-1"><Calendar size={11} /> {order.date}</span>
                      <span>{order.people} people</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground">#{order.id}</p>
                    <p className="text-lg font-bold text-primary flex items-center justify-end gap-0.5">
                      <IndianRupee size={14} />{order.amount.toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
