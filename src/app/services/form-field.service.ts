import { Injectable } from '@angular/core';
import { FormField } from '../models/form-field.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormFieldService {

  constructor() { }
  private fields = new BehaviorSubject<FormField[]>([]);
  fields$ = this.fields.asObservable();

  addField(field: FormField) {
    const currentFields = this.fields.getValue();
    this.fields.next([...currentFields, field]);
  }

  removeField(index: number) {
    const currentFields = this.fields.getValue();
    currentFields.splice(index, 1);
    this.fields.next([...currentFields]);
  }
  
}
