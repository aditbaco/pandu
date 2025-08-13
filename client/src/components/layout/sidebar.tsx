import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  FileText,
  Plus,
  Inbox,
  Box,
  Menu,
  X
} from "lucide-react";

const navigationItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/forms", label: "Forms", icon: FileText },
  { href: "/submissions", label: "Submissions", icon: Inbox },
];

const SidebarItem = ({ item, isActive, expanded }: { item: any; isActive: boolean; expanded: boolean }) => {
  const Icon = item.icon;
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={item.href}>
          <div
            className={cn(
              "flex items-center px-3 py-2 rounded-lg transition-colors cursor-pointer link",
              expanded ? "lg:space-x-3" : "justify-center lg:justify-start lg:space-x-3",
              isActive
                ? "bg-primary/10 selected font-bold"
                : "hover:bg-accent/10"
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
      <div className="px-4 lg:px-6 py-4 border-b border-border relative min-h-[73px] flex items-center">
        <div className="flex items-center justify-between w-full">
          <div className={cn(
            "flex items-center",
            expanded ? "lg:space-x-2" : "justify-center lg:space-x-2 w-full"
          )}>
            <img 
              src="/attached_assets/3a86f0bd-5e46-43a7-b2c7-88aa0a81f966_1755063262600.jpg" 
              alt="PANDU Logo" 
              className="w-8 h-8 rounded-lg object-cover"
            />
            <div className={cn(
              "flex flex-col",
              expanded ? "hidden lg:block" : "hidden"
            )}>
              <span className="lg:text-2xl font-semibold text-foreground whitespace-nowrap text-[30px]">PANDU</span>
            </div>
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

      </nav>
    </div>
  );
}
