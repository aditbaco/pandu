import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { FormRenderer } from "@/components/form-renderer/form-renderer";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Form } from "@shared/schema";

export default function FormSubmit() {
  const [match, params] = useRoute("/form/:id");
  const formId = params?.id;

  const { data: form, isLoading, error } = useQuery<Form>({
    queryKey: ["/api/forms", formId],
    enabled: !!formId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Card>
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
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 lg:py-12">
        <div className="max-w-2xl mx-auto px-4 lg:px-6">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="text-red-500" size={32} />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">Form Not Found</h2>
              <p className="text-gray-600 mb-6">
                The form you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/">
                <Button>
                  <ArrowLeft className="mr-2" size={16} />
                  Go Back
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (form.status === 'inactive') {
    return (
      <div className="min-h-screen bg-gray-50 py-6 lg:py-12">
        <div className="max-w-2xl mx-auto px-4 lg:px-6">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="text-yellow-500" size={32} />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">Form Unavailable</h2>
              <p className="text-gray-600 mb-6">
                This form is currently inactive and not accepting submissions.
              </p>
              <Link href="/">
                <Button>
                  <ArrowLeft className="mr-2" size={16} />
                  Go Back
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
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
    <div className="min-h-screen bg-gray-50 py-6 lg:py-12">
      <div className="max-w-4xl mx-auto px-4 lg:px-6">
        <div className="mb-4 lg:mb-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2" size={16} />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        
        <FormRenderer formData={formData} />
      </div>
    </div>
  );
}