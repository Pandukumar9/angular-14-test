import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormField } from 'src/app/models/form-field.model';
import { FormFieldService } from 'src/app/services/form-field.service';

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss'],
})
export class FormBuilderComponent implements OnInit {
  fieldTypes = ['text', 'textarea', 'dropdown', 'checkbox', 'radio', 'email', 'reset', 'file', 'time', 'date'];
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
    if (!this.newField.label) {
      alert('Field label is required!');
      return;
    }

    if (
      (this.newField.type === 'dropdown' || this.newField.type === 'radio') &&
      (!this.newField.options || this.newField.options.length === 0)
    ) {
      alert('Options are required for dropdown or radio fields!');
      return;
    }

    if (
      this.newField.minLength &&
      this.newField.maxLength &&
      this.newField.minLength > this.newField.maxLength
    ) {
      alert('Min Length cannot be greater than Max Length!');
      return;
    }

    this.formFieldService.addField({ ...this.newField });
    this.newField = this.resetNewField();
  }

  private resetNewField(): FormField {
    return {
      type: 'text',
      label: '',
      placeholder: '',
      required: false,
      email: false,
      minLength: undefined,
      maxLength: undefined,
      options: [],
    };
  }

  private createForm() {
    this.form = this.fb.group({});
    this.fields.forEach((field) => {
      if (!field.label || this.form.contains(field.label)) {
        return;
      }

      const validators = [];
      if (field.required) {
        validators.push(Validators.required);
      }
      if (field.email) {
        validators.push(Validators.email);
      }
      if (field.minLength) {
        validators.push(Validators.minLength(field.minLength));
      }
      if (field.maxLength) {
        validators.push(Validators.maxLength(field.maxLength));
      }

      this.form.addControl(field.label, this.fb.control('', validators));
    });
  }

  onSubmit() {
    if (this.form.valid) {
      console.log('Form Data:', this.form.value);
      alert('Form Submitted Successfully!');
      this.form.reset();
    } else {
      alert('Please fill out all required fields correctly!');
    }
  }
}
