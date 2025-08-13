import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { FieldPalette } from "@/components/form-builder/field-palette";
import { FormDesigner } from "@/components/form-builder/form-designer";
import { FieldProperties } from "@/components/form-builder/field-properties";
import { FormField } from "@/types/form";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { generateSlug } from "@shared/schema";

export default function FormBuilder() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  // Fetch existing forms to auto-generate form name
  const { data: existingForms } = useQuery({
    queryKey: ["/api/forms"],
    queryFn: () => fetch("/api/forms").then(res => res.json()),
  });

  // Auto-generate form name when component mounts
  useEffect(() => {
    if (existingForms && formName === "") {
      const formCount = existingForms.length + 1;
      setFormName(`Form ${formCount}`);
    }
  }, [existingForms, formName]);

  const createFormMutation = useMutation({
    mutationFn: async (formData: any) => {
      const response = await apiRequest("POST", "/api/forms", formData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Form created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/forms"] });
      setLocation("/forms");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create form",
        variant: "destructive",
      });
    },
  });

  const selectedField = formFields.find(field => field.id === selectedFieldId) || null;

  const handleFieldUpdate = (updatedField: FormField) => {
    setFormFields(fields =>
      fields.map(field =>
        field.id === updatedField.id ? updatedField : field
      )
    );
  };

  const handleSave = () => {
    if (!formName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a form name",
        variant: "destructive",
      });
      return;
    }

    if (formFields.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one field to your form",
        variant: "destructive",
      });
      return;
    }

    const slug = generateSlug(formName);
    
    createFormMutation.mutate({
      name: formName,
      slug: slug,
      description: formDescription,
      fields: formFields,
      status: "active",
    });
  };

  const handlePreview = () => {
    // TODO: Implement preview functionality
    toast({
      title: "Preview",
      description: "Form preview functionality coming soon!",
    });
  };

  return (
    <div className="p-6 h-full">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
        {/* Field Palette */}
        <div className="lg:col-span-1">
          <FieldPalette />
        </div>

        {/* Form Designer */}
        <div className="lg:col-span-2">
          <FormDesigner
            formName={formName}
            formDescription={formDescription}
            formFields={formFields}
            onFormNameChange={setFormName}
            onFormDescriptionChange={setFormDescription}
            onFieldsChange={setFormFields}
            onSave={handleSave}
            onPreview={handlePreview}
            selectedFieldId={selectedFieldId}
            onFieldSelect={setSelectedFieldId}
          />
        </div>

        {/* Field Properties Panel */}
        <div className="lg:col-span-1">
          <FieldProperties
            selectedField={selectedField}
            onFieldUpdate={handleFieldUpdate}
          />
        </div>
      </div>
    </div>
  );
}
