import { Switch, Route, useLocation } from "wouter";
import { useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import Dashboard from "@/pages/dashboard";
import Forms from "@/pages/forms";
import FormBuilder from "@/pages/form-builder";
import Submissions from "@/pages/submissions";
import FormSubmit from "@/pages/form-submit";
import { FormSubmitWithParams } from "@/pages/form-submit-with-params";
import NotFound from "@/pages/not-found";

const routeConfig: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Dashboard", subtitle: "Manage your forms and submissions" },
  "/forms": { title: "Forms Management", subtitle: "Create, edit, and manage your forms" },
  "/builder": { title: "Form Builder", subtitle: "Drag and drop to create custom forms" },
  "/submissions": { title: "Submissions", subtitle: "View and manage form responses" },
  "/analytics": { title: "Analytics", subtitle: "View form performance and insights" },
  "/users": { title: "Users", subtitle: "Manage user accounts and permissions" },
  "/settings": { title: "Settings", subtitle: "Configure application settings" },
};

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/forms" component={Forms} />
      <Route path="/builder" component={FormBuilder} />
      <Route path="/submissions" component={Submissions} />
      <Route path="/form/:id" component={FormSubmit} />
      <Route path="/:formSlug/:kunjunganId/:nopen/:norm/:oleh" component={FormSubmitWithParams} />
      <Route path="/analytics" component={() => <div className="p-6">Analytics page coming soon</div>} />
      <Route path="/users" component={() => <div className="p-6">Users management coming soon</div>} />
      <Route path="/settings" component={() => <div className="p-6">Settings page coming soon</div>} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const currentRoute = routeConfig[location] || { title: "FormCraft", subtitle: "Build amazing forms with drag and drop" };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex bg-background">
          <Sidebar 
            expanded={sidebarExpanded} 
            onToggle={() => setSidebarExpanded(!sidebarExpanded)} 
          />
          <div className="flex-1 overflow-hidden">
            <Header 
              title={currentRoute.title} 
              subtitle={currentRoute.subtitle}
            />
            <main className="h-full overflow-y-auto">
              <Router />
            </main>
          </div>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
