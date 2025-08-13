import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stats } from "@/types/form";
import { FileText, Inbox, CheckCircle, TrendingUp, Plus, Eye, Download } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery<Stats>({
    queryKey: ["/api/stats"],
  });

  const { data: recentForms, isLoading: formsLoading } = useQuery({
    queryKey: ["/api/forms"],
  });

  if (statsLoading || formsLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Forms</p>
                <p className="text-2xl lg:text-3xl font-semibold text-foreground mt-2">
                  {stats?.totalForms || 0}
                </p>
              </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="text-primary" size={20} />
              </div>
            </div>
            <p className="text-success text-xs lg:text-sm mt-4">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              <span>Active forms available</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Submissions</p>
                <p className="text-2xl lg:text-3xl font-semibold text-foreground mt-2">
                  {stats?.totalSubmissions || 0}
                </p>
              </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Inbox className="text-secondary" size={20} />
              </div>
            </div>
            <p className="text-success text-xs lg:text-sm mt-4">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              <span>Responses received</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Forms</p>
                <p className="text-3xl font-semibold text-foreground mt-2">
                  {stats?.activeForms || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-success" size={24} />
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-4">
              {(stats?.totalForms || 0) - (stats?.activeForms || 0)} forms inactive
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Completion Rate</p>
                <p className="text-3xl font-semibold text-foreground mt-2">
                  {stats?.completionRate || 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-accent" size={24} />
              </div>
            </div>
            <p className="text-success text-sm mt-4">
              <TrendingUp className="inline w-3 h-3 mr-1" />
              <span>Overall performance</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Recent Forms */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Forms</CardTitle>
                <Link href="/forms">
                  <Button variant="ghost" size="sm" className="link hover:text-link-hover">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {Array.isArray(recentForms) && recentForms.length > 0 ? (
                <div className="space-y-4">
                  {recentForms.slice(0, 3).map((form: any) => (
                    <div key={form.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-b-0">
                      <Link href={`/form/${form.id}`} className="flex items-center space-x-3 flex-1 hover:bg-accent/10 p-2 rounded-lg transition-colors link">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FileText className="text-primary" size={16} />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{form.name}</p>
                          <p className="text-sm text-gray-500">
                            Created {new Date(form.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </Link>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">
                          {form.submissionCount || 0} submission{(form.submissionCount || 0) !== 1 ? 's' : ''}
                        </p>
                        <p className={`text-xs ${form.status === 'active' ? 'text-success' : 'text-gray-400'}`}>
                          {form.status === 'active' ? 'Active' : 'Inactive'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No forms created yet</p>
                  <p className="text-sm">Start by creating your first form</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/builder">
                <Button className="w-full justify-start h-auto p-4 bg-primary/5 hover:bg-primary/10 border border-primary/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                      <Plus className="text-white" size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-foreground">Create New Form</p>
                      <p className="text-sm text-gray-500">Drag & drop builder</p>
                    </div>
                  </div>
                </Button>
              </Link>

              <Link href="/submissions">
                <Button variant="outline" className="w-full justify-start h-auto p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                      <Eye className="text-white" size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-foreground">View Submissions</p>
                      <p className="text-sm text-gray-500">Review responses</p>
                    </div>
                  </div>
                </Button>
              </Link>

              
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
