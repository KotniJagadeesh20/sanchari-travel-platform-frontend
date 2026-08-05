import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { PlannerSidebar } from "./PlannerSidebar";
import { Globe, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function PlannerLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <PlannerSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Navbar */}
          <header className="h-14 flex items-center justify-between border-b border-border px-4 bg-card shrink-0">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <span className="text-sm font-medium text-muted-foreground hidden sm:inline">Creator Dashboard</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground text-sm font-bold">
                  W
                </div>
                <span className="text-sm font-medium text-foreground hidden sm:inline">Wanderlust Travels</span>
              </div>
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                  <LogOut size={16} />
                </Button>
              </Link>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
