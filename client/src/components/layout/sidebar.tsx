import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Plus,
  Inbox,
  BarChart3,
  Users,
  Settings,
  Box
} from "lucide-react";

const navigationItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/forms", label: "Forms", icon: FileText },
  { href: "/builder", label: "Form Builder", icon: Plus },
  { href: "/submissions", label: "Submissions", icon: Inbox },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

const settingsItems = [
  { href: "/users", label: "Users", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-white border-r border-border shadow-sm">
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Box className="text-white" size={16} />
          </div>
          <span className="text-lg font-semibold text-foreground">FormCraft</span>
        </div>
      </div>
      
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors cursor-pointer",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-gray-50 text-gray-600"
                )}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
        
        <div className="pt-6">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Settings
          </div>
          {settingsItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors cursor-pointer",
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-gray-50 text-gray-600"
                  )}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
