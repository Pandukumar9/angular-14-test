export interface FormField {
  type: 'text' | 'textarea' | 'dropdown' | 'checkbox' | 'radio';
  label: string;
  placeholder?: string;
  options?: string[]; // For dropdown and radio buttons
  required: boolean;
}
