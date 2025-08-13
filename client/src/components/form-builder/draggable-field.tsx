import { Type, Mail, AlignLeft, Hash, ChevronDown, CircleDot, CheckSquare, Paperclip, Calendar } from "lucide-react";
import { FormField } from "@/types/form";

interface DraggableFieldProps {
  field: {
    type: FormField['type'];
    label: string;
    icon: string;
  };
}

const iconMap = {
  Type,
  Mail,
  AlignLeft,
  Hash,
  ChevronDown,
  CircleDot,
  CheckSquare,
  Paperclip,
  Calendar,
};

export function DraggableField({ field }: DraggableFieldProps) {
  const Icon = iconMap[field.icon as keyof typeof iconMap];

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: field.type,
      label: field.label,
    }));
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="p-3 border border-border rounded-lg hover:border-primary cursor-move bg-gray-50 hover:bg-primary/5 transition-colors"
    >
      <div className="flex items-center space-x-2">
        <Icon className="h-4 w-4 text-gray-400" />
        <span className="text-sm font-medium">{field.label}</span>
      </div>
    </div>
  );
}
