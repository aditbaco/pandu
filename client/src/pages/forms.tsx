import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FileText, Search, Plus, Edit, Eye, Copy, Trash2, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@shared/schema";

export default function Forms() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: forms, isLoading } = useQuery<(Form & { submissionCount: number })[]>({
    queryKey: ["/api/forms"],
  });

  const deleteFormMutation = useMutation({
    mutationFn: async (formId: string) => {
      await apiRequest("DELETE", `/api/forms/${formId}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Form deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/forms"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete form",
        variant: "destructive",
      });
    },
  });

  const duplicateFormMutation = useMutation({
    mutationFn: async (form: Form) => {
      const response = await apiRequest("POST", "/api/forms", {
        name: `${form.name} (Copy)`,
        description: form.description,
        fields: form.fields,
        status: "inactive",
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Form duplicated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/forms"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to duplicate form",
        variant: "destructive",
      });
    },
  });

  const filteredForms = forms?.filter(form =>
    form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (form.description && form.description.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  if (isLoading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Forms Management</h3>
              <p className="text-sm text-gray-500">Create, edit, and manage your forms</p>
            </div>
            <div className="flex flex-col space-y-3 lg:flex-row lg:space-y-0 lg:space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  type="text"
                  placeholder="Search forms..."
                  className="pl-10 w-full lg:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Link href="/builder">
                <Button className="w-full lg:w-auto">
                  <Plus className="mr-2" size={16} />
                  New Form
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {filteredForms.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No forms found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? "No forms match your search criteria" : "Get started by creating your first form"}
              </p>
              {!searchTerm && (
                <Link href="/builder">
                  <Button>
                    <Plus className="mr-2" size={16} />
                    Create New Form
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Form Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submissions</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                <TableBody>
                  {filteredForms.map((form) => (
                    <TableRow key={form.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <FileText className="text-primary" size={16} />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground">{form.name}</div>
                            {form.description && (
                              <div className="text-sm text-gray-500">{form.description}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={form.status === 'active' ? 'default' : 'secondary'}
                          className={form.status === 'active' ? 'bg-success text-success-foreground' : ''}
                        >
                          {form.status === 'active' ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-foreground">
                        {form.submissionCount || 0}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(form.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Link href={`/form/${form.id}`}>
                            <Button variant="ghost" size="sm" title="Fill Form">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm" title="Edit">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Link href={`/submissions?form=${form.id}`}>
                            <Button variant="ghost" size="sm" title="View Submissions">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            title="Duplicate"
                            onClick={() => duplicateFormMutation.mutate(form)}
                            disabled={duplicateFormMutation.isPending}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" title="Delete">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Form</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{form.name}"? This action cannot be undone
                                  and will also delete all associated submissions.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteFormMutation.mutate(form.id)}
                                  disabled={deleteFormMutation.isPending}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4 p-4">
                {filteredForms.map((form) => (
                  <Card key={form.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <FileText className="text-primary" size={18} />
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">{form.name}</h4>
                            {form.description && (
                              <p className="text-sm text-gray-500 mt-1">{form.description}</p>
                            )}
                          </div>
                        </div>
                        <Badge 
                          variant={form.status === 'active' ? 'default' : 'secondary'}
                          className={form.status === 'active' ? 'bg-success text-success-foreground' : ''}
                        >
                          {form.status === 'active' ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500">Submissions</p>
                          <p className="font-medium">{form.submissionCount || 0}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Created</p>
                          <p className="font-medium">{new Date(form.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Link href={`/form/${form.id}`}>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="mr-1 h-3 w-3" />
                            Fill
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm">
                          <Edit className="mr-1 h-3 w-3" />
                          Edit
                        </Button>
                        <Link href={`/submissions?form=${form.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="mr-1 h-3 w-3" />
                            View
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => duplicateFormMutation.mutate(form)}
                          disabled={duplicateFormMutation.isPending}
                        >
                          <Copy className="mr-1 h-3 w-3" />
                          Copy
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="mr-1 h-3 w-3" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Form</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{form.name}"? This action cannot be undone
                                and will also delete all associated submissions.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteFormMutation.mutate(form.id)}
                                disabled={deleteFormMutation.isPending}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
