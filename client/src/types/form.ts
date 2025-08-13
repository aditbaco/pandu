export interface FormField {
  id: string;
  type: 'text' | 'email' | 'textarea' | 'number' | 'select' | 'radio' | 'checkbox' | 'file' | 'date' | 'title' | 'heading' | 'subheading' | 'divider' | 'image';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  text?: string; // For title, heading, subheading
  imageUrl?: string; // For static images
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

export interface FormData {
  id?: string;
  name: string;
  description: string;
  fields: FormField[];
  status: 'active' | 'inactive';
}

export interface Stats {
  totalForms: number;
  totalSubmissions: number;
  activeForms: number;
  completionRate: string;
}
