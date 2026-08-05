import { Outlet, Link } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border px-4 bg-card shrink-0">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <span className="text-sm font-medium text-muted-foreground hidden sm:inline">
                Admin Console
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-medium">
                <ShieldCheck size={12} /> Platform Admin
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground text-sm font-bold">
                  K
                </div>
                <span className="text-sm font-medium text-foreground hidden sm:inline">Kavya Reddy</span>
              </div>
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                  <LogOut size={16} />
                </Button>
              </Link>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
