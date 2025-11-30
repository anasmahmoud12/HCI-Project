import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-category.component.html',
  styleUrl:'./add-category.component.css'
})
export class AddCategoryComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private service: CategoryService) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required]],
      isactive: [true]
    });
  }

 submit() {
  console.log('Form submitted with values:', this.form.value);
  
  if (this.form.valid) {
    console.log('Form is valid, calling service...');
    
    this.service.createCategory(this.form.value).subscribe({
      next: (response) => {
        console.log('Server response:', response);
        alert("Category saved successfully!");
        this.form.reset({ isactive: true });
      },
      error: (error) => {
        console.error('Error saving category:', error);
        alert("Error saving category: " + error.message);
      },
      complete: () => {
        console.log('Request completed');
      }
    });
  } else {
    console.log('Form is invalid');
    this.form.markAllAsTouched();
  }
}
}