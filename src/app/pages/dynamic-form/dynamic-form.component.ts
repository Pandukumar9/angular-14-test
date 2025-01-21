import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormField } from 'src/app/models/form-field.model';
import { FormFieldService } from 'src/app/services/form-field.service';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {
  fields: FormField[] = [];
  form: FormGroup = this.fb.group({});

  constructor(private fb: FormBuilder, private formFieldService: FormFieldService) {}

  ngOnInit() {
    this.formFieldService.fields$.subscribe((fields) => {
      this.fields = fields;
      this.createForm();
    });
  }

  private createForm() {
    this.form = this.fb.group({});
    this.fields.forEach((field) => {
      const control = field.required ? [Validators.required] : [];
      this.form.addControl(field.label, this.fb.control('', control));
    });
  }

  onSubmit() {
    if (this.form.valid) {
      console.log('Form Data:', this.form.value);
      alert('Form Submitted Successfully!');
    } else {
      alert('Please fill out all required fields!');
    }
  }

}
