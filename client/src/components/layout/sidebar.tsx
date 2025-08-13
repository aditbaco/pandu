import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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

const SidebarItem = ({ item, isActive }: { item: any; isActive: boolean }) => {
  const Icon = item.icon;
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={item.href}>
          <div
            className={cn(
              "flex items-center px-3 py-2 rounded-lg transition-colors cursor-pointer",
              "lg:space-x-3", // Space only on large screens
              isActive
                ? "bg-primary/10 text-primary font-medium"
                : "hover:bg-gray-50 text-gray-600"
            )}
          >
            <Icon size={16} className="flex-shrink-0" />
            <span className="hidden lg:block">{item.label}</span>
          </div>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right" className="lg:hidden">
        {item.label}
      </TooltipContent>
    </Tooltip>
  );
};

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-16 lg:w-64 bg-white border-r border-border shadow-sm">
      <div className="p-4 border-b border-border">
        <div className="flex items-center lg:space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Box className="text-white" size={16} />
          </div>
          <span className="hidden lg:block text-lg font-semibold text-foreground">FormCraft</span>
        </div>
      </div>
      
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => (
          <SidebarItem 
            key={item.href} 
            item={item} 
            isActive={location === item.href}
          />
        ))}
        
        <div className="pt-6">
          <div className="hidden lg:block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Settings
          </div>
          <div className="lg:hidden border-t border-gray-200 my-4"></div>
          {settingsItems.map((item) => (
            <SidebarItem 
              key={item.href} 
              item={item} 
              isActive={location === item.href}
            />
          ))}
        </div>
      </nav>
    </div>
  );
}
