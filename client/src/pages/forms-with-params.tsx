import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FileText, Calendar, ArrowLeft, Search } from "lucide-react";
import { Form } from "@shared/schema";

export function FormsWithParams() {
  const [match, params] = useRoute("/forms/:kunjunganId/:nopen/:norm/:oleh");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Extract URL parameters
  const kunjunganId = params?.kunjunganId;
  const nopen = params?.nopen;
  const norm = params?.norm;
  const oleh = params?.oleh;

  const { data: forms, isLoading, error } = useQuery<Form[]>({
    queryKey: ["/api/forms"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !forms) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Unable to load forms</h2>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  const activeForms = forms.filter(form => form.status === 'active');
  
  // Filter forms based on search query
  const filteredForms = activeForms.filter(form => 
    form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (form.description && form.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 py-6 lg:py-12">
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        {/* Header with medical parameters */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">Available Forms</CardTitle>
                <CardDescription>
                  Select a form to continue with your medical record entry
                </CardDescription>
              </div>
              <Link href="/">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Current Session Parameters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Kunjungan ID:</span>
                  <span className="ml-2 text-gray-900">{kunjunganId}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Nopen:</span>
                  <span className="ml-2 text-gray-900">{nopen}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Norm:</span>
                  <span className="ml-2 text-gray-900">{norm}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Oleh:</span>
                  <span className="ml-2 text-gray-900">{oleh}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Box */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari form berdasarkan nama atau deskripsi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {searchQuery && (
              <p className="text-sm text-gray-600 mt-2">
                Ditemukan {filteredForms.length} form dari {activeForms.length} form yang tersedia
              </p>
            )}
          </CardContent>
        </Card>

        {/* Forms Grid */}
        {filteredForms.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? "No forms found" : "No forms available"}
            </h3>
            <p className="text-gray-600">
              {searchQuery 
                ? `Tidak ditemukan form yang sesuai dengan pencarian "${searchQuery}"`
                : "There are currently no active forms to display."
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredForms.map((form) => (
              <Card key={form.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                        {form.name}
                      </CardTitle>
                      {form.description && (
                        <CardDescription className="text-sm text-gray-600 mb-3">
                          {form.description}
                        </CardDescription>
                      )}
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      <FileText className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(form.createdAt).toLocaleDateString()}
                    </div>
                    <div>
                      {Array.isArray(form.fields) ? form.fields.length : 0} fields
                    </div>
                  </div>
                  
                  <Link href={`/${form.slug}/${kunjunganId}/${nopen}/${norm}/${oleh}`}>
                    <Button className="w-full">
                      Fill Form
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FormsWithParams;