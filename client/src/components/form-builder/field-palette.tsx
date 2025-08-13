import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DraggableField } from "./draggable-field";
import { FormField } from "@/types/form";

const inputFields = [
  { type: 'text' as const, label: 'Text Input', icon: 'Type' },
  { type: 'email' as const, label: 'Email', icon: 'Mail' },
  { type: 'textarea' as const, label: 'Textarea', icon: 'AlignLeft' },
  { type: 'number' as const, label: 'Number', icon: 'Hash' },
];

const choiceFields = [
  { type: 'select' as const, label: 'Select Dropdown', icon: 'ChevronDown' },
  { type: 'radio' as const, label: 'Radio Button', icon: 'CircleDot' },
  { type: 'checkbox' as const, label: 'Checkbox', icon: 'CheckSquare' },
];

const specialFields = [
  { type: 'file' as const, label: 'File Upload', icon: 'Paperclip' },
  { type: 'date' as const, label: 'Date Picker', icon: 'Calendar' },
];

export function FieldPalette() {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-lg">Field Types</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">
            Input Fields
          </h4>
          <div className="space-y-2">
            {inputFields.map((field) => (
              <DraggableField key={field.type} field={field} />
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">
            Choice Fields
          </h4>
          <div className="space-y-2">
            {choiceFields.map((field) => (
              <DraggableField key={field.type} field={field} />
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">
            Special
          </h4>
          <div className="space-y-2">
            {specialFields.map((field) => (
              <DraggableField key={field.type} field={field} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
