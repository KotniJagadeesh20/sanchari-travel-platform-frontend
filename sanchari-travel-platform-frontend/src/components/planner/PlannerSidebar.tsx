import {
  Globe,
  LayoutDashboard,
  Package,
  Hotel,
  CalendarCheck,
  BarChart3,
  Star,
  Settings,
  Sparkles,
  UtensilsCrossed,
  Compass,
  Lock,
  LogOut,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const mainNav = [
  { title: "Dashboard", url: "/planner", icon: LayoutDashboard },
  { title: "My Packages", url: "/planner/packages", icon: Package },
  { title: "My Hotels", url: "/planner/hotels", icon: Hotel },
  { title: "Bookings", url: "/planner/bookings", icon: CalendarCheck },
  { title: "Analytics", url: "/planner/analytics", icon: BarChart3 },
  { title: "Reviews", url: "/planner/reviews", icon: Star },
  { title: "Settings", url: "/planner/settings", icon: Settings },
];

const comingSoon = [
  { title: "Experiences", icon: Sparkles },
  { title: "Restaurants", icon: UtensilsCrossed },
  { title: "Guides", icon: Compass },
];

export function PlannerSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent>
        {/* Brand */}
        <div className="p-4 flex items-center gap-2">
          <div className="bg-gradient-hero rounded-xl p-2 shrink-0">
            <Globe className="text-primary-foreground" size={18} />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-base font-display font-bold text-foreground leading-tight">Sanchari</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Creator Studio</div>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Manage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => {
                const isActive =
                  item.url === "/planner"
                    ? location.pathname === "/planner"
                    : location.pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.url === "/planner"}
                        className={`hover:bg-muted/50 transition-colors ${isActive ? "bg-primary/10 text-primary font-medium" : ""}`}
                        activeClassName="bg-primary/10 text-primary font-medium"
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && (
          <SidebarGroup>
            <SidebarGroupLabel>Coming Soon</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {comingSoon.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      disabled
                      className="opacity-60 cursor-not-allowed hover:bg-transparent"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      <span className="flex-1">{item.title}</span>
                      <Lock size={11} className="opacity-70" />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors"
        >
          <LogOut size={16} />
          {!collapsed && <span>Back to Site</span>}
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
