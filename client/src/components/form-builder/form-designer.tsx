import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/types/form";
import { Edit, Trash2, GripVertical, MousePointer } from "lucide-react";
import { generateSlug, generateUniqueId, generateFieldName } from "@shared/schema";

interface FormDesignerProps {
  formName: string;
  formDescription: string;
  formFields: FormField[];
  onFormNameChange: (name: string) => void;
  onFormDescriptionChange: (description: string) => void;
  onFieldsChange: (fields: FormField[]) => void;
  onSave: () => void;
  onPreview: () => void;
  selectedFieldId: string | null;
  onFieldSelect: (fieldId: string | null) => void;
}

export function FormDesigner({
  formName,
  formDescription,
  formFields,
  onFormNameChange,
  onFormDescriptionChange,
  onFieldsChange,
  onSave,
  onPreview,
  selectedFieldId,
  onFieldSelect,
}: FormDesignerProps) {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const fieldData = JSON.parse(e.dataTransfer.getData('application/json'));
    
    const formSlug = generateSlug(formName || 'form');
    const uniqueId = generateUniqueId();
    
    const newField: FormField = {
      id: generateFieldName(fieldData.type, formSlug, uniqueId),
      type: fieldData.type,
      label: fieldData.label,
      required: false,
    };

    onFieldsChange([...formFields, newField]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const deleteField = (fieldId: string) => {
    onFieldsChange(formFields.filter(field => field.id !== fieldId));
    if (selectedFieldId === fieldId) {
      onFieldSelect(null);
    }
  };

  const renderFieldPreview = (field: FormField) => {
    const isSelected = selectedFieldId === field.id;
    
    const fieldElement = (() => {
      switch (field.type) {
        case 'text':
        case 'email':
        case 'number':
          return (
            <Input
              type={field.type}
              placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
              disabled
            />
          );
        case 'textarea':
          return (
            <Textarea
              placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
              disabled
              rows={4}
            />
          );
        case 'select':
          return (
            <select className="w-full px-3 py-2 border border-border rounded-lg bg-white" disabled>
              <option>Select an option</option>
              {field.options?.map((option, idx) => (
                <option key={idx} value={option}>{option}</option>
              ))}
            </select>
          );
        case 'radio':
          return (
            <div className="space-y-2">
              {(field.options || ['Option 1', 'Option 2']).map((option, idx) => (
                <label key={idx} className="flex items-center space-x-2">
                  <input type="radio" name={field.id} disabled className="text-primary" />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
          );
        case 'checkbox':
          return (
            <div className="space-y-2">
              {(field.options || ['Option 1', 'Option 2']).map((option, idx) => (
                <label key={idx} className="flex items-center space-x-2">
                  <input type="checkbox" disabled className="text-primary" />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
          );
        case 'file':
          return (
            <Input type="file" disabled />
          );
        case 'date':
          return (
            <Input type="date" disabled />
          );
        default:
          return <Input disabled />;
      }
    })();

    return (
      <div
        key={field.id}
        className={`p-4 border rounded-lg cursor-pointer transition-colors group ${
          isSelected ? 'border-primary bg-primary/5' : 'border-border bg-gray-50 hover:bg-white'
        }`}
        onClick={() => onFieldSelect(field.id)}
      >
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-foreground">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-auto text-gray-400 hover:text-primary"
              onClick={(e) => {
                e.stopPropagation();
                onFieldSelect(field.id);
              }}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-auto text-gray-400 hover:text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                deleteField(field.id);
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-auto text-gray-400 hover:text-gray-600 cursor-move"
            >
              <GripVertical className="h-3 w-3" />
            </Button>
          </div>
        </div>
        {fieldElement}
      </div>
    );
  };

  return (
    <Card className="flex-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Form Designer</h3>
            <p className="text-sm text-gray-500">Drag fields from the palette to build your form</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onPreview}>Preview</Button>
            <Button onClick={onSave}>Save Form</Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Form Header */}
        <div className="mb-6 p-4 border border-dashed border-gray-300 rounded-lg">
          <Input
            type="text"
            placeholder="Enter form title..."
            className="text-xl font-semibold bg-transparent border-none shadow-none px-0 focus-visible:ring-0"
            value={formName}
            onChange={(e) => onFormNameChange(e.target.value)}
          />
          <Textarea
            placeholder="Add form description..."
            className="mt-2 bg-transparent border-none shadow-none px-0 resize-none focus-visible:ring-0"
            rows={2}
            value={formDescription}
            onChange={(e) => onFormDescriptionChange(e.target.value)}
          />
        </div>

        {/* Form Fields Drop Zone */}
        <div
          className="space-y-4 min-h-96 p-4 border-2 border-dashed border-gray-200 rounded-lg"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {formFields.map(renderFieldPreview)}
          
          {formFields.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <MousePointer className="h-8 w-8 mx-auto mb-2" />
              <p>Drag fields here to build your form</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
