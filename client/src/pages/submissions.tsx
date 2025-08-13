import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Download, Eye, FileText, Trash2, Inbox } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Form, FormSubmission } from "@shared/schema";

export default function Submissions() {
  const [selectedFormId, setSelectedFormId] = useState<string>("all");
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [location] = useLocation();

  // Handle URL parameters to pre-select form
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const formParam = urlParams.get('form');
    if (formParam) {
      setSelectedFormId(formParam);
    }
  }, [location]);

  const { data: forms } = useQuery<Form[]>({
    queryKey: ["/api/forms"],
  });

  const { data: submissions, isLoading } = useQuery<FormSubmission[]>({
    queryKey: ["/api/submissions", selectedFormId],
    queryFn: async () => {
      const url = selectedFormId === "all" ? "/api/submissions" : `/api/submissions?formId=${selectedFormId}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch submissions: ${response.statusText}`);
      }
      const data = await response.json();
      // Ensure we always return an array
      return Array.isArray(data) ? data : [];
    }
  });

  // Always ensure submissions is an array
  const submissionsArray = Array.isArray(submissions) ? submissions : [];

  const deleteSubmissionMutation = useMutation({
    mutationFn: async (submissionId: string) => {
      await apiRequest("DELETE", `/api/submissions/${submissionId}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Submission deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/submissions"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete submission",
        variant: "destructive",
      });
    },
  });

  const exportData = () => {
    if (!submissionsArray || submissionsArray.length === 0) {
      toast({
        title: "No Data",
        description: "No submissions available to export",
        variant: "destructive",
      });
      return;
    }

    // Create CSV content
    const headers = ["ID", "Form", "Submitted By", "Email", "Date", "Status", "Kunjungan", "Nopen", "Norm", "Oleh"];
    const csvContent = [
      headers.join(","),
      ...submissionsArray.map(submission => [
        submission.id,
        forms?.find(f => f.id === submission.formId)?.name || "Unknown Form",
        submission.oleh || submission.submittedBy || "Anonymous",
        submission.submittedByEmail || "",
        new Date(submission.createdAt).toLocaleString(),
        submission.status,
        submission.kunjunganId || "",
        submission.nopen || "",
        submission.norm || "",
        submission.oleh || ""
      ].join(","))
    ].join("\n");

    // Download CSV file
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `submissions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Submissions exported successfully",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-success-foreground';
      case 'in_review':
        return 'bg-primary text-primary-foreground';
      case 'processed':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

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
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Form Submissions</h3>
              <p className="text-sm text-gray-500">View and manage form responses</p>
            </div>
            <div className="flex space-x-3">
              <Select value={selectedFormId} onValueChange={setSelectedFormId}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Forms</SelectItem>
                  {forms?.map((form) => (
                    <SelectItem key={form.id} value={form.id}>
                      {form.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={exportData} className="bg-success hover:bg-success/90">
                <Download className="mr-2" size={16} />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {!submissionsArray || submissionsArray.length === 0 ? (
            <div className="text-center py-12">
              <Inbox className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
              <p className="text-gray-500">
                {selectedFormId !== "all" 
                  ? "This form hasn't received any submissions yet"
                  : "No form submissions have been received yet"
                }
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Submission ID</TableHead>
                  <TableHead>Form</TableHead>
                  <TableHead>Submitted By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissionsArray.map((submission) => {
                  const form = forms?.find(f => f.id === submission.formId);
                  
                  return (
                    <TableRow key={submission.id}>
                      <TableCell className="text-sm font-mono text-foreground">
                        #{submission.id.slice(-8)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium text-foreground">
                          {form?.name || "Unknown Form"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-foreground">
                          {submission.submittedByEmail || "Anonymous"}
                        </div>
                        {submission.submittedBy && (
                          <div className="text-sm text-gray-500">{submission.submittedBy}</div>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(submission.createdAt).toLocaleDateString()} {new Date(submission.createdAt).toLocaleTimeString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(submission.status)}>
                          {submission.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                title="View Details"
                                onClick={() => setSelectedSubmission(submission)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Submission Details</DialogTitle>
                              </DialogHeader>
                              {selectedSubmission && (
                                <div className="space-y-4">
                                  <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">
                                      Form
                                    </label>
                                    <div className="text-sm text-gray-600">
                                      {forms?.find(f => f.id === selectedSubmission.formId)?.name || "Unknown Form"}
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">
                                      Submitted By
                                    </label>
                                    <div className="text-sm text-gray-600">
                                      {selectedSubmission.oleh || selectedSubmission.submittedBy || "Anonymous"} 
                                      {selectedSubmission.submittedByEmail && ` (${selectedSubmission.submittedByEmail})`}
                                    </div>
                                  </div>
                                  
                                  {/* New medical fields */}
                                  {selectedSubmission.kunjunganId && (
                                    <div>
                                      <label className="block text-sm font-medium text-foreground mb-1">
                                        Kunjungan
                                      </label>
                                      <div className="text-sm text-gray-600">
                                        {selectedSubmission.kunjunganId}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {selectedSubmission.nopen && (
                                    <div>
                                      <label className="block text-sm font-medium text-foreground mb-1">
                                        Nopen
                                      </label>
                                      <div className="text-sm text-gray-600">
                                        {selectedSubmission.nopen}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {selectedSubmission.norm && (
                                    <div>
                                      <label className="block text-sm font-medium text-foreground mb-1">
                                        Norm
                                      </label>
                                      <div className="text-sm text-gray-600">
                                        {selectedSubmission.norm}
                                      </div>
                                    </div>
                                  )}
                                  
                                  <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">
                                      Submission Date
                                    </label>
                                    <div className="text-sm text-gray-600">
                                      {new Date(selectedSubmission.createdAt).toLocaleString()}
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">
                                      Form Data
                                    </label>
                                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded border">
                                      <pre className="whitespace-pre-wrap">
                                        {JSON.stringify(selectedSubmission.data, null, 2)}
                                      </pre>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button variant="ghost" size="sm" title="Download PDF">
                            <FileText className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" title="Delete">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Submission</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this submission? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteSubmissionMutation.mutate(submission.id)}
                                  disabled={deleteSubmissionMutation.isPending}
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
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
