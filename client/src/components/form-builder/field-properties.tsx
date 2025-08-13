import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormField } from "@/types/form";
import { Plus, X } from "lucide-react";

interface FieldPropertiesProps {
  selectedField: FormField | null;
  onFieldUpdate: (field: FormField) => void;
}

export function FieldProperties({ selectedField, onFieldUpdate }: FieldPropertiesProps) {
  if (!selectedField) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Field Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Select a field to configure its properties</p>
        </CardContent>
      </Card>
    );
  }

  const updateField = (updates: Partial<FormField>) => {
    onFieldUpdate({ ...selectedField, ...updates });
  };

  const addOption = () => {
    const options = selectedField.options || [];
    updateField({ options: [...options, `Option ${options.length + 1}`] });
  };

  const updateOption = (index: number, value: string) => {
    const options = [...(selectedField.options || [])];
    options[index] = value;
    updateField({ options });
  };

  const removeOption = (index: number) => {
    const options = [...(selectedField.options || [])];
    options.splice(index, 1);
    updateField({ options });
  };

  const needsOptions = ['select', 'radio', 'checkbox'].includes(selectedField.type);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Field Properties</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="label" className="text-sm font-medium">Label</Label>
          <Input
            id="label"
            value={selectedField.label}
            onChange={(e) => updateField({ label: e.target.value })}
          />
        </div>
        
        {/* Text content for display fields */}
        {['title', 'heading', 'subheading'].includes(selectedField.type) && (
          <div>
            <Label htmlFor="text" className="text-sm font-medium">Text Content</Label>
            <Input
              id="text"
              value={selectedField.text || selectedField.label}
              onChange={(e) => updateField({ text: e.target.value })}
              placeholder="Enter text content"
            />
          </div>
        )}

        {/* Image URL for static images */}
        {selectedField.type === 'image' && (
          <div>
            <Label htmlFor="imageUrl" className="text-sm font-medium">Image URL</Label>
            <Input
              id="imageUrl"
              type="url"
              value={selectedField.imageUrl || ''}
              onChange={(e) => updateField({ imageUrl: e.target.value })}
              placeholder="Enter image URL"
            />
          </div>
        )}

        {/* Only show placeholder and required for input fields */}
        {!['title', 'heading', 'subheading', 'divider', 'image'].includes(selectedField.type) && (
          <>
            <div>
              <Label htmlFor="placeholder" className="text-sm font-medium">Placeholder</Label>
              <Input
                id="placeholder"
                value={selectedField.placeholder || ''}
                onChange={(e) => updateField({ placeholder: e.target.value })}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="required"
                checked={selectedField.required}
                onCheckedChange={(checked) => updateField({ required: !!checked })}
              />
              <Label htmlFor="required" className="text-sm font-medium">Required</Label>
            </div>
          </>
        )}

        {needsOptions && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">Options</Label>
              <Button variant="outline" size="sm" onClick={addOption}>
                <Plus className="h-3 w-3 mr-1" />
                Add Option
              </Button>
            </div>
            <div className="space-y-2">
              {(selectedField.options || []).map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeOption(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div>
          <Label className="text-sm font-medium">Validation Rules</Label>
          <div className="mt-2 space-y-2">
            {selectedField.type === 'text' || selectedField.type === 'textarea' ? (
              <>
                <div>
                  <Label htmlFor="minLength" className="text-xs text-gray-500">Min Length</Label>
                  <Input
                    id="minLength"
                    type="number"
                    value={selectedField.validation?.minLength || ''}
                    onChange={(e) => updateField({
                      validation: {
                        ...selectedField.validation,
                        minLength: e.target.value ? parseInt(e.target.value) : undefined
                      }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="maxLength" className="text-xs text-gray-500">Max Length</Label>
                  <Input
                    id="maxLength"
                    type="number"
                    value={selectedField.validation?.maxLength || ''}
                    onChange={(e) => updateField({
                      validation: {
                        ...selectedField.validation,
                        maxLength: e.target.value ? parseInt(e.target.value) : undefined
                      }
                    })}
                  />
                </div>
              </>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
