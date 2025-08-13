import { Card } from "@/components/ui/card";
import { DraggableField } from "./draggable-field";
import { 
  Type, 
  Mail, 
  AlignLeft, 
  Hash, 
  ChevronDown, 
  CircleDot, 
  CheckSquare, 
  Paperclip, 
  Calendar 
} from "lucide-react";

const allFields = [
  { type: 'text' as const, label: 'Text Input', icon: 'Type' },
  { type: 'email' as const, label: 'Email', icon: 'Mail' },
  { type: 'textarea' as const, label: 'Textarea', icon: 'AlignLeft' },
  { type: 'number' as const, label: 'Number', icon: 'Hash' },
  { type: 'select' as const, label: 'Select Dropdown', icon: 'ChevronDown' },
  { type: 'radio' as const, label: 'Radio Button', icon: 'CircleDot' },
  { type: 'checkbox' as const, label: 'Checkbox', icon: 'CheckSquare' },
  { type: 'file' as const, label: 'File Upload', icon: 'Paperclip' },
  { type: 'date' as const, label: 'Date Picker', icon: 'Calendar' },
];

const iconComponents = {
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

export function MobileFieldPalette() {
  return (
    <Card className="fixed top-4 left-4 right-4 z-50 bg-white/95 backdrop-blur-sm border shadow-lg">
      <div className="p-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {allFields.map((field) => {
            const IconComponent = iconComponents[field.icon as keyof typeof iconComponents];
            return (
              <div key={field.type} className="flex-shrink-0">
                <DraggableField 
                  field={field} 
                  compact={true}
                  icon={<IconComponent size={16} />}
                />
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}