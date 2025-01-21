import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  constructor(private fb: FormBuilder, private formFieldService: FormFieldService,private _snackBar: MatSnackBar) {}

  ngOnInit() {
    this.formFieldService.fields$.subscribe((fields) => {
      this.fields = fields;
      this.createForm();
    });
  }

  createForm() {
    this.form = this.fb.group({});
    this.fields.forEach((field) => {
      const control = field.required ? [Validators.required] : [];
      this.form.addControl(field.label, this.fb.control('', control));
    });
  }

  onSubmit() {
    if (this.form.valid) {
      console.log('Form Data:', this.form.value);
      this._snackBar.open('Form Submitted Successfully!', 'Close', {
        duration: 1500,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snackbar-success'],
      });
      this.form.reset();
    } else {
      this._snackBar.open('Please fill out all required fields!', 'Close', {
        duration: 1500,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snackbar-error'],
      });
    }
  }

// Remove field from form group and from the fields list
removeField(index: number) {
  this.formFieldService.removeField(index);
 }

 onFileChange(event: Event, controlName: string): void {
  const input = event.target as HTMLInputElement;
  if (input && input.files && input.files.length > 0) {
    const file = input.files[0];
    console.log(`File uploaded for ${controlName}:`, file);
    // Optionally, you can store the file in a separate object for further processing
  }
}

}
