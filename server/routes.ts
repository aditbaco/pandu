import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFormSchema, insertFormSubmissionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Forms routes
  app.get("/api/forms", async (req, res) => {
    try {
      const forms = await storage.getFormsWithSubmissionCount();
      res.json(forms);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch forms" });
    }
  });

  app.get("/api/forms/:id", async (req, res) => {
    try {
      const form = await storage.getForm(req.params.id);
      if (!form) {
        return res.status(404).json({ message: "Form not found" });
      }
      res.json(form);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch form" });
    }
  });

  app.get("/api/forms/slug/:slug", async (req, res) => {
    try {
      const form = await storage.getFormBySlug(req.params.slug);
      if (!form) {
        return res.status(404).json({ message: "Form not found" });
      }
      res.json(form);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch form by slug" });
    }
  });

  app.post("/api/forms", async (req, res) => {
    try {
      console.log("Creating form with data:", JSON.stringify(req.body, null, 2));
      const validatedData = insertFormSchema.parse(req.body);
      console.log("Validated data:", JSON.stringify(validatedData, null, 2));
      const form = await storage.createForm(validatedData);
      console.log("Form created successfully:", form.id);
      res.status(201).json(form);
    } catch (error) {
      console.error("Error creating form:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create form" });
      }
    }
  });

  app.put("/api/forms/:id", async (req, res) => {
    try {
      const validatedData = insertFormSchema.partial().parse(req.body);
      const form = await storage.updateForm(req.params.id, validatedData);
      if (!form) {
        return res.status(404).json({ message: "Form not found" });
      }
      res.json(form);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to update form" });
      }
    }
  });

  app.delete("/api/forms/:id", async (req, res) => {
    try {
      const success = await storage.deleteForm(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Form not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete form" });
    }
  });

  // Form submissions routes
  app.get("/api/submissions", async (req, res) => {
    try {
      const formId = req.query.formId as string | undefined;
      const submissions = await storage.getFormSubmissions(formId);
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch submissions" });
    }
  });

  app.get("/api/submissions/:id", async (req, res) => {
    try {
      const submission = await storage.getFormSubmission(req.params.id);
      if (!submission) {
        return res.status(404).json({ message: "Submission not found" });
      }
      res.json(submission);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch submission" });
    }
  });

  app.post("/api/submissions", async (req, res) => {
    try {
      const validatedData = insertFormSubmissionSchema.parse(req.body);
      const submission = await storage.createFormSubmission(validatedData);
      res.status(201).json(submission);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create submission" });
      }
    }
  });

  app.post("/api/form-submissions", async (req, res) => {
    try {
      const validatedData = insertFormSubmissionSchema.parse(req.body);
      const submission = await storage.createFormSubmission(validatedData);
      res.status(201).json(submission);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create submission" });
      }
    }
  });

  app.delete("/api/submissions/:id", async (req, res) => {
    try {
      const success = await storage.deleteFormSubmission(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Submission not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete submission" });
    }
  });

  // Stats endpoint for dashboard
  app.get("/api/stats", async (req, res) => {
    try {
      const forms = await storage.getForms();
      const submissions = await storage.getFormSubmissions();
      
      const stats = {
        totalForms: forms.length,
        totalSubmissions: submissions.length,
        activeForms: forms.filter(f => f.status === "active").length,
        completionRate: submissions.length > 0 ? 
          (submissions.filter(s => s.status === "completed").length / submissions.length * 100).toFixed(1) : "0"
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
