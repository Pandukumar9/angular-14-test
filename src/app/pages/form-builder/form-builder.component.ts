import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormField } from 'src/app/models/form-field.model';
import { FormFieldService } from 'src/app/services/form-field.service';

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss']
})
export class FormBuilderComponent implements OnInit {

  fieldTypes = ['text', 'textarea', 'dropdown', 'checkbox', 'radio'];
  newField: FormField = this.resetNewField();
  fields: FormField[] = [];
  form: FormGroup = this.fb.group({});

  constructor(private fb: FormBuilder, private formFieldService: FormFieldService) {}

  ngOnInit() {
    this.formFieldService.fields$.subscribe((fields) => {
      this.fields = fields;
      this.createForm();
    });
  }

  handleOptionsChange(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    if (input && input.value) {
      this.newField.options = input.value.split(',').map((opt) => opt.trim());
    } else {
      this.newField.options = [];
    }
  }

  addField() {
    // Validation for new field
    if (!this.newField.label) {
      alert('Field label is required!');
      return;
    }

    // For dropdown and radio, options must be provided
    if ((this.newField.type === 'dropdown' || this.newField.type === 'radio') && (!this.newField.options || this.newField.options.length === 0)) {
      alert('Options are required for dropdown or radio fields!');
      return;
    }

    // Add field to the service
    this.formFieldService.addField({ ...this.newField });
    this.newField = this.resetNewField(); // Reset field input
  }

  private resetNewField(): FormField {
    return {
      type: 'text',
      label: '',
      placeholder: '',
      required: false,
      options: [],
    };
  }

  private createForm() {
    this.form = this.fb.group({});
    this.fields.forEach((field) => {
      // Only add valid fields with unique labels to the form
      if (!field.label || this.form.contains(field.label)) {
        return;
      }

      const validators = field.required ? [Validators.required] : [];
      this.form.addControl(field.label, this.fb.control('', validators));
    });
  }

  onSubmit() {
    // Filter out invalid fields before submission
    const validFields = this.fields.filter((field) => {
      if (field.type === 'dropdown' || field.type === 'radio') {
        return field.options && field.options.length > 0;
      }
      return true;
    });

    const formValues = validFields.reduce((result, field) => {
      result[field.label] = this.form.get(field.label)?.value;
      return result;
    }, {} as Record<string, any>);

    if (this.form.valid) {
      console.log('Valid Fields:', validFields);
      console.log('Form Data:', formValues);
      alert('Form Submitted Successfully!');
    } else {
      alert('Please fill out all required fields!');
    }
  }

}
