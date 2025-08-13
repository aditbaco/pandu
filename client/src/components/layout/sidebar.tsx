import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  FileText,
  Plus,
  Inbox,
  BarChart3,
  Users,
  Settings,
  Box,
  Menu,
  X
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

const SidebarItem = ({ item, isActive, expanded }: { item: any; isActive: boolean; expanded: boolean }) => {
  const Icon = item.icon;
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={item.href}>
          <div
            className={cn(
              "flex items-center px-3 py-2 rounded-lg transition-colors cursor-pointer",
              expanded ? "lg:space-x-3" : "justify-center lg:justify-start lg:space-x-3",
              isActive
                ? "bg-primary/10 text-primary font-medium"
                : "hover:bg-gray-50 text-gray-600"
            )}
          >
            <Icon size={16} className="flex-shrink-0" />
            <span className={cn(
              "whitespace-nowrap",
              expanded ? "hidden lg:block" : "hidden"
            )}>{item.label}</span>
          </div>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right" className={expanded ? "lg:hidden" : ""}>
        {item.label}
      </TooltipContent>
    </Tooltip>
  );
};

interface SidebarProps {
  expanded: boolean;
  onToggle: () => void;
}

export function Sidebar({ expanded, onToggle }: SidebarProps) {
  const [location] = useLocation();

  return (
    <div className={cn(
      "bg-white border-r border-border shadow-sm transition-all duration-300",
      expanded ? "w-16 lg:w-64" : "w-16"
    )}>
      <div className="p-4 border-b border-border relative">
        <div className="flex items-center justify-between">
          <div className={cn(
            "flex items-center",
            expanded ? "lg:space-x-2" : "justify-center lg:space-x-2 w-full"
          )}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Box className="text-white" size={16} />
            </div>
            <span className={cn(
              "text-lg font-semibold text-foreground whitespace-nowrap",
              expanded ? "hidden lg:block" : "hidden"
            )}>FormCraft</span>
          </div>
          {/* Toggle button - always visible on desktop when expanded */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggle}
            className={cn(
              "p-1.5 h-8 w-8 hidden lg:flex shrink-0",
              expanded ? "" : "absolute top-4 right-4"
            )}
          >
            {expanded ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => (
          <SidebarItem 
            key={item.href} 
            item={item} 
            isActive={location === item.href}
            expanded={expanded}
          />
        ))}
        
        <div className="pt-6">
          <div className={cn(
            "text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3",
            expanded ? "hidden lg:block" : "hidden"
          )}>
            Settings
          </div>
          <div className="lg:hidden border-t border-gray-200 my-4"></div>
          {settingsItems.map((item) => (
            <SidebarItem 
              key={item.href} 
              item={item} 
              isActive={location === item.href}
              expanded={expanded}
            />
          ))}
        </div>
      </nav>
    </div>
  );
}
