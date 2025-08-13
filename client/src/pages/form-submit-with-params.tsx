import { useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Form as FormType, FormSubmission } from "@shared/schema";
import type { FormField as FormFieldType } from "@/types/form";

export function FormSubmitWithParams() {
  const [match, params] = useRoute("/:formSlug/:kunjunganId/:nopen/:norm/:oleh");
  const [submissionData, setSubmissionData] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Extract URL parameters
  const formSlug = params?.formSlug;
  const kunjunganId = params?.kunjunganId;
  const nopen = params?.nopen;
  const norm = params?.norm;
  const oleh = params?.oleh;

  // Fetch form data
  const { data: form, isLoading, error } = useQuery<FormType>({
    queryKey: ['/api/forms/slug', formSlug],
    enabled: !!formSlug,
  });

  const { toast } = useToast();

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
        fieldSchema = fieldSchema.refine((val) => val && val.toString().trim() !== '', `${field.label} is required`);
      }

      schemaObject[field.id] = fieldSchema;
    });

    return z.object(schemaObject);
  };

  const formFields = form && Array.isArray(form.fields) ? form.fields as FormFieldType[] : [];
  const validationSchema = formFields.length > 0 ? createValidationSchema(formFields) : z.object({});

  const reactForm = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: formFields.reduce((acc, field) => {
      if (['title', 'heading', 'subheading', 'divider', 'image'].includes(field.type)) {
        return acc;
      }
      acc[field.id] = field.type === 'checkbox' ? [] : '';
      return acc;
    }, {} as Record<string, any>),
  });

  // Form submission mutation with URL parameters
  const submitMutation = useMutation({
    mutationFn: async (data: Record<string, any>) => {
      if (!form) throw new Error('Form not found');
      
      const submissionData = {
        formId: form.id,
        data,
        submittedBy: oleh || undefined, // Auto-fill submitted by with oleh parameter
        kunjunganId: kunjunganId || undefined,
        nopen: nopen || undefined,
        norm: norm ? parseInt(norm, 10) : undefined,
        oleh: oleh ? parseInt(oleh, 10) : undefined,
      };

      const response = await apiRequest('POST', '/api/form-submissions', submissionData);
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Success",
        description: "Form submitted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/form-submissions'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to submit form',
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: Record<string, any>) => {
    submitMutation.mutate(data);
  };





  if (!match) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Invalid URL</CardTitle>
            <CardDescription>
              The URL format should be: /kunjungan_id/oleh/form_slug
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading form...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center">
              <AlertCircle className="mr-2 h-5 w-5" />
              Form Not Found
            </CardTitle>
            <CardDescription>
              The requested form could not be found. Please check the URL and try again.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-green-600 flex items-center">
              <CheckCircle className="mr-2 h-5 w-5" />
              Submission Successful
            </CardTitle>
            <CardDescription>
              Your form has been submitted successfully.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Kunjungan ID:</strong> {kunjunganId}</p>
              <p><strong>Nopen:</strong> {nopen}</p>
              <p><strong>Norm:</strong> {norm}</p>
              <p><strong>Oleh:</strong> {oleh}</p>
              <p><strong>Form:</strong> {form.name}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 max-w-4xl">
        {/* Header with URL parameters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{form.name}</CardTitle>
            <CardDescription>
              {form.description && <span>{form.description}</span>}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <strong>Kunjungan ID:</strong> {kunjunganId}
              </div>
              <div>
                <strong>Nopen:</strong> {nopen}
              </div>
              <div>
                <strong>Norm:</strong> {norm}
              </div>
              <div>
                <strong>Oleh:</strong> {oleh}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <Card>
          <CardContent className="p-6">
            {submitMutation.error && (
              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {submitMutation.error instanceof Error
                    ? submitMutation.error.message
                    : 'An error occurred while submitting the form'}
                </AlertDescription>
              </Alert>
            )}

            {form && (
              <Form {...reactForm}>
                <form onSubmit={reactForm.handleSubmit(onSubmit)} className="space-y-6">
                  {formFields.map((field) => {
                    // Skip display fields - render them as static elements
                    if (field.type === 'title') {
                      return (
                        <div key={field.id} className="text-center">
                          <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {field.text || field.label}
                          </h1>
                        </div>
                      );
                    }

                    if (field.type === 'heading') {
                      return (
                        <div key={field.id}>
                          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                            {field.text || field.label}
                          </h2>
                        </div>
                      );
                    }

                    if (field.type === 'subheading') {
                      return (
                        <div key={field.id}>
                          <h3 className="text-lg font-medium text-gray-700 mb-2">
                            {field.text || field.label}
                          </h3>
                        </div>
                      );
                    }

                    if (field.type === 'divider') {
                      return (
                        <div key={field.id} className="my-6">
                          <hr className="border-gray-300" />
                        </div>
                      );
                    }

                    if (field.type === 'image') {
                      return (
                        <div key={field.id} className="text-center">
                          {field.imageUrl && (
                            <img 
                              src={field.imageUrl} 
                              alt={field.label || 'Form image'} 
                              className="max-w-full h-auto mx-auto rounded-lg"
                            />
                          )}
                        </div>
                      );
                    }

                    // Render input fields
                    return (
                      <FormField
                        key={field.id}
                        control={reactForm.control}
                        name={field.id}
                        render={({ field: formField }) => (
                          <FormItem>
                            <FormLabel className={field.required ? "required" : ""}>
                              {field.label}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </FormLabel>
                            <FormControl>
                              {field.type === 'textarea' ? (
                                <Textarea
                                  placeholder={field.placeholder}
                                  {...formField}
                                />
                              ) : field.type === 'select' ? (
                                <Select
                                  onValueChange={formField.onChange}
                                  value={formField.value}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder={field.placeholder || "Select an option"} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {field.options?.map((option) => (
                                      <SelectItem key={option} value={option}>
                                        {option}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : field.type === 'radio' ? (
                                <RadioGroup
                                  onValueChange={formField.onChange}
                                  value={formField.value}
                                >
                                  <div className="grid grid-cols-3 gap-4">
                                    {field.options?.map((option) => (
                                      <div key={option} className="flex items-center space-x-2">
                                        <RadioGroupItem value={option} id={`${field.id}-${option}`} />
                                        <Label htmlFor={`${field.id}-${option}`}>{option}</Label>
                                      </div>
                                    ))}
                                  </div>
                                </RadioGroup>
                              ) : field.type === 'checkbox' ? (
                                <div className="space-y-2">
                                  {field.options?.map((option) => (
                                    <div key={option} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`${field.id}-${option}`}
                                        checked={formField.value?.includes(option)}
                                        onCheckedChange={(checked) => {
                                          const currentValue = formField.value || [];
                                          if (checked) {
                                            formField.onChange([...currentValue, option]);
                                          } else {
                                            formField.onChange(
                                              currentValue.filter((item: string) => item !== option)
                                            );
                                          }
                                        }}
                                      />
                                      <Label htmlFor={`${field.id}-${option}`}>{option}</Label>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <Input
                                  type={field.type === 'number' ? 'number' : field.type === 'email' ? 'email' : field.type === 'date' ? 'date' : 'text'}
                                  placeholder={field.placeholder}
                                  {...formField}
                                />
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    );
                  })}

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={submitMutation.isPending}
                  >
                    {submitMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Form'
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}