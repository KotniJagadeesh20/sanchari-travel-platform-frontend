import {
  Globe,
  LayoutDashboard,
  MapPin,
  Bus,
  Users,
  ShieldAlert,
  BarChart3,
  Mail,
  Settings,
  Handshake,
  Store,
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
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Destinations", url: "/admin/destinations", icon: MapPin },
  { title: "Bus Management", url: "/admin/buses", icon: Bus },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Moderation", url: "/admin/moderation", icon: ShieldAlert },
  { title: "Platform Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Notification Templates", url: "/admin/templates", icon: Mail },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

const comingSoon = [
  { title: "Partner Approvals", icon: Handshake },
  { title: "Marketplace Mgmt", icon: Store },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent>
        <div className="p-4 flex items-center gap-2">
          <div className="bg-gradient-hero rounded-xl p-2 shrink-0">
            <Globe className="text-primary-foreground" size={18} />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-base font-display font-bold text-foreground leading-tight">Sanchari</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Admin Console</div>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => {
                const isActive =
                  item.url === "/admin"
                    ? location.pathname === "/admin"
                    : location.pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.url === "/admin"}
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
