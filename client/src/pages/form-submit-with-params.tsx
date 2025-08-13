import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormRenderer } from "@/components/form-renderer/form-renderer";
import { AlertCircle, CheckCircle } from "lucide-react";
import type { Form as FormType } from "@shared/schema";

export function FormSubmitWithParams() {
  const [match, params] = useRoute("/:formSlug/:kunjunganId/:nopen/:norm/:oleh");
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
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

  const formData = {
    id: form.id,
    name: form.name,
    description: form.description || "",
    fields: Array.isArray(form.fields) ? form.fields : [],
    status: form.status,
  };

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

        {/* Form using FormRenderer with URL parameters */}
        <FormRenderer 
          formData={formData} 
          kunjunganId={kunjunganId}
          nopen={nopen}
          norm={norm}
          oleh={oleh}
          onSubmitSuccess={() => setIsSubmitted(true)}
        />
      </div>
    </div>
  );
}

export default FormSubmitWithParams;