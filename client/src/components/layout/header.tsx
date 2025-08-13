import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title: string;
  subtitle: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="bg-white border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
          <p className="text-gray-500 text-sm">{subtitle}</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="p-2">
            <Bell className="h-5 w-5 text-gray-400" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-sm font-medium text-foreground">Admin User</div>
              <div className="text-xs text-gray-500">Administrator</div>
            </div>
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white font-semibold text-sm">
              A
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
