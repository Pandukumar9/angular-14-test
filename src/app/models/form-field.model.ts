export interface FormField {
  type: 'text' | 'textarea' | 'dropdown' | 'checkbox' | 'radio' | 'email' | 'reset' | 'file' | 'time' | 'date';
  label: string;
  placeholder?: string;
  options?: string[];
  required: boolean;
  email?: boolean;
  minLength?: number;
  maxLength?: number;
}
