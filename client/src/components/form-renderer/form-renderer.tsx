import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormField as FormFieldType, FormData } from "@/types/form";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Send } from "lucide-react";

interface FormRendererProps {
  formData: FormData;
  onSubmitSuccess?: () => void;
}

export function FormRenderer({ formData, onSubmitSuccess }: FormRendererProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitterInfo, setSubmitterInfo] = useState({ name: "", email: "" });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Create dynamic validation schema based on form fields
  const createValidationSchema = (fields: FormFieldType[]) => {
    const schemaObject: Record<string, z.ZodTypeAny> = {};

    fields.forEach((field) => {
      // Skip display fields - they don't need validation
      if (['title', 'heading', 'subheading', 'divider', 'image'].includes(field.type)) {
        return;
      }
      let fieldSchema: z.ZodTypeAny;

      switch (field.type) {
        case 'email':
          fieldSchema = z.string().email('Please enter a valid email address');
          break;
        case 'number':
          fieldSchema = z.string().refine((val) => !isNaN(Number(val)), 'Please enter a valid number');
          break;
        case 'date':
          fieldSchema = z.string().refine((val) => !isNaN(Date.parse(val)), 'Please enter a valid date');
          break;
        case 'checkbox':
          fieldSchema = z.array(z.string()).optional();
          break;
        default:
          fieldSchema = z.string();
      }

      if (field.required && field.type !== 'checkbox') {
        if (fieldSchema instanceof z.ZodString) {
          fieldSchema = fieldSchema.min(1, `${field.label} is required`);
        }
      }

      if (field.validation?.minLength && fieldSchema instanceof z.ZodString) {
        fieldSchema = fieldSchema.min(field.validation.minLength, `Minimum ${field.validation.minLength} characters required`);
      }

      if (field.validation?.maxLength && fieldSchema instanceof z.ZodString) {
        fieldSchema = fieldSchema.max(field.validation.maxLength, `Maximum ${field.validation.maxLength} characters allowed`);
      }

      schemaObject[field.id] = fieldSchema;
    });

    return z.object(schemaObject);
  };

  const validationSchema = createValidationSchema(formData.fields);
  const form = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: formData.fields
      .filter(field => !['title', 'heading', 'subheading', 'divider', 'image'].includes(field.type))
      .reduce((acc, field) => {
        acc[field.id] = field.type === 'checkbox' ? [] : '';
        return acc;
      }, {} as Record<string, any>),
  });

  const submitFormMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/submissions", {
        formId: formData.id,
        data,
        submittedBy: submitterInfo.name || null,
        submittedByEmail: submitterInfo.email || null,
        status: "completed",
      });
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Success",
        description: "Your form has been submitted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/submissions"] });
      onSubmitSuccess?.();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit form",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    submitFormMutation.mutate(data);
  };

  const renderDisplayField = (field: FormFieldType) => {
    switch (field.type) {
      case 'title':
        return (
          <div key={field.id} className="text-center mb-6">
            <h1 className="text-4xl font-bold text-foreground">
              {field.text || field.label}
            </h1>
          </div>
        );
      case 'heading':
        return (
          <div key={field.id} className="mb-4">
            <h2 className="text-2xl font-semibold text-foreground">
              {field.text || field.label}
            </h2>
          </div>
        );
      case 'subheading':
        return (
          <div key={field.id} className="mb-4">
            <h3 className="text-xl font-medium text-foreground">
              {field.text || field.label}
            </h3>
          </div>
        );
      case 'divider':
        return (
          <div key={field.id} className="my-6">
            <hr className="border-gray-300" />
          </div>
        );
      case 'image':
        return field.imageUrl ? (
          <div key={field.id} className="mb-6 text-center">
            <img 
              src={field.imageUrl} 
              alt={field.label} 
              className="max-w-full h-auto rounded-lg shadow-sm mx-auto"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        ) : (
          <div key={field.id} className="mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
            <p>Image placeholder - URL not provided</p>
          </div>
        );
      default:
        return null;
    }
  };

  const renderField = (field: FormFieldType) => {
    return (
      <FormField
        key={field.id}
        control={form.control}
        name={field.id}
        render={({ field: formField }) => (
          <FormItem className="space-y-2">
            <FormLabel className="text-sm font-medium text-foreground">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </FormLabel>
            <FormControl>
              {(() => {
                switch (field.type) {
                  case 'text':
                  case 'email':
                  case 'number':
                    return (
                      <Input
                        type={field.type}
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                        {...formField}
                      />
                    );
                  case 'textarea':
                    return (
                      <Textarea
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                        rows={4}
                        {...formField}
                      />
                    );
                  case 'select':
                    return (
                      <Select value={formField.value} onValueChange={formField.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map((option, idx) => (
                            <SelectItem key={idx} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    );
                  case 'radio':
                    return (
                      <RadioGroup value={formField.value} onValueChange={formField.onChange}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {field.options?.map((option, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <RadioGroupItem value={option} id={`${field.id}-${idx}`} />
                              <Label htmlFor={`${field.id}-${idx}`} className="text-sm">
                                {option}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    );
                  case 'checkbox':
                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {field.options?.map((option, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${field.id}-${idx}`}
                              checked={formField.value?.includes(option)}
                              onCheckedChange={(checked) => {
                                const currentValue = formField.value || [];
                                if (checked) {
                                  formField.onChange([...currentValue, option]);
                                } else {
                                  formField.onChange(currentValue.filter((v: string) => v !== option));
                                }
                              }}
                            />
                            <Label htmlFor={`${field.id}-${idx}`} className="text-sm">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </div>
                    );
                  case 'file':
                    return (
                      <Input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          formField.onChange(file?.name || '');
                        }}
                      />
                    );
                  case 'date':
                    return (
                      <Input
                        type="date"
                        {...formField}
                      />
                    );

                  default:
                    return <Input {...formField} />;
                }
              })()}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-success" size={32} />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Thank you!</h2>
          <p className="text-gray-600 mb-4">
            Your submission has been received successfully.
          </p>
          <p className="text-sm text-gray-500">
            We'll get back to you soon if a response is required.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-foreground">
          {formData.name}
        </CardTitle>
        {formData.description && (
          <p className="text-gray-600 mt-2">{formData.description}</p>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Submitter Information */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h3 className="text-lg font-medium text-foreground">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="submitter-name" className="text-sm font-medium">
                    Your Name
                  </Label>
                  <Input
                    id="submitter-name"
                    type="text"
                    placeholder="Enter your name"
                    value={submitterInfo.name}
                    onChange={(e) => setSubmitterInfo(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="submitter-email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="submitter-email"
                    type="email"
                    placeholder="Enter your email"
                    value={submitterInfo.email}
                    onChange={(e) => setSubmitterInfo(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              {formData.fields.map((field) => {
                // Display fields don't need form validation
                if (['title', 'heading', 'subheading', 'divider', 'image'].includes(field.type)) {
                  return renderDisplayField(field);
                }
                return renderField(field);
              })}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t">
              <Button
                type="submit"
                disabled={submitFormMutation.isPending}
                className="bg-primary hover:bg-primary/90"
              >
                {submitFormMutation.isPending ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send className="mr-2" size={16} />
                    Submit Form
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}