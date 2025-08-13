export interface FormField {
  id: string;
  type: 'text' | 'email' | 'textarea' | 'number' | 'select' | 'radio' | 'checkbox' | 'file' | 'date';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
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
