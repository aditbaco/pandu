import { 
  forms, 
  formSubmissions, 
  users, 
  type User, 
  type InsertUser, 
  type Form, 
  type InsertForm, 
  type FormSubmission, 
  type InsertFormSubmission 
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, count, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Forms
  getForms(): Promise<Form[]>;
  getFormsWithSubmissionCount(): Promise<(Form & { submissionCount: number })[]>;
  getForm(id: string): Promise<Form | undefined>;
  getFormBySlug(slug: string): Promise<Form | undefined>;
  createForm(form: InsertForm): Promise<Form>;
  updateForm(id: string, form: Partial<InsertForm>): Promise<Form | undefined>;
  deleteForm(id: string): Promise<boolean>;
  
  // Form Submissions
  getFormSubmissions(formId?: string): Promise<FormSubmission[]>;
  getFormSubmission(id: string): Promise<FormSubmission | undefined>;
  createFormSubmission(submission: InsertFormSubmission): Promise<FormSubmission>;
  deleteFormSubmission(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getForms(): Promise<Form[]> {
    return await db.select().from(forms).orderBy(desc(forms.createdAt));
  }

  async getFormsWithSubmissionCount(): Promise<(Form & { submissionCount: number })[]> {
    const result = await db
      .select({
        id: forms.id,
        name: forms.name,
        description: forms.description,
        fields: forms.fields,
        slug: forms.slug,
        status: forms.status,
        createdAt: forms.createdAt,
        updatedAt: forms.updatedAt,
        submissionCount: sql<number>`COALESCE(COUNT(${formSubmissions.id}), 0)`.as('submissionCount')
      })
      .from(forms)
      .leftJoin(formSubmissions, eq(forms.id, formSubmissions.formId))
      .groupBy(forms.id)
      .orderBy(desc(forms.createdAt));
    
    return result;
  }

  async getForm(id: string): Promise<Form | undefined> {
    const [form] = await db.select().from(forms).where(eq(forms.id, id));
    return form || undefined;
  }

  async getFormBySlug(slug: string): Promise<Form | undefined> {
    const [form] = await db.select().from(forms).where(eq(forms.slug, slug));
    return form || undefined;
  }

  async createForm(insertForm: InsertForm): Promise<Form> {
    const [form] = await db
      .insert(forms)
      .values(insertForm)
      .returning();
    return form;
  }

  async updateForm(id: string, updateForm: Partial<InsertForm>): Promise<Form | undefined> {
    const [form] = await db
      .update(forms)
      .set({
        ...updateForm,
        updatedAt: new Date(),
      })
      .where(eq(forms.id, id))
      .returning();
    return form || undefined;
  }

  async deleteForm(id: string): Promise<boolean> {
    const result = await db.delete(forms).where(eq(forms.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async getFormSubmissions(formId?: string): Promise<FormSubmission[]> {
    if (formId) {
      return await db
        .select()
        .from(formSubmissions)
        .where(eq(formSubmissions.formId, formId))
        .orderBy(desc(formSubmissions.createdAt));
    }
    return await db
      .select()
      .from(formSubmissions)
      .orderBy(desc(formSubmissions.createdAt));
  }

  async getFormSubmission(id: string): Promise<FormSubmission | undefined> {
    const [submission] = await db
      .select()
      .from(formSubmissions)
      .where(eq(formSubmissions.id, id));
    return submission || undefined;
  }

  async createFormSubmission(insertSubmission: InsertFormSubmission): Promise<FormSubmission> {
    const [submission] = await db
      .insert(formSubmissions)
      .values(insertSubmission)
      .returning();
    return submission;
  }

  async deleteFormSubmission(id: string): Promise<boolean> {
    const result = await db.delete(formSubmissions).where(eq(formSubmissions.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }
}

export const storage = new DatabaseStorage();
