import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title: string;
  subtitle: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="bg-white border-b border-border px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-semibold text-foreground">{title}</h1>
          <p className="text-gray-500 text-sm hidden sm:block">{subtitle}</p>
        </div>
        <div className="flex items-center space-x-2 lg:space-x-4">
          <Button variant="ghost" size="sm" className="p-2 hidden sm:flex">
            <Bell className="h-5 w-5 text-gray-400" />
          </Button>
          
        </div>
      </div>
    </header>
  );
}
