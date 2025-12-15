// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { CategoryService } from '../../services/category.service';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';
// import {CategoryFormData} from '../../models/category.model'


// @Component({
//   selector: 'app-add-category',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, RouterModule],
//   templateUrl: './add-category.component.html',
//   styleUrls: ['./add-category.component.css']
// })
// export class AddCategoryComponent {
//   form: FormGroup;
//   selectedFile: File | null = null;
//   previewUrl: string | ArrayBuffer | null = null;
//   isSubmitting: boolean = false;

//   constructor(private fb: FormBuilder, private service: CategoryService) {
//     this.form = this.fb.group({
//       name: ['', [Validators.required, Validators.minLength(2)]],
//       description: ['', [Validators.required]],
//       isactive: [true]
//     });
//   }

//   onFileSelected(event: any) {
//     const file = event.target.files[0];
//     if (file) {
//       // Validate file size (5MB max)
//       if (file.size > 5 * 1024 * 1024) {
//         alert('File size should not exceed 5MB');
//         return;
//       }
      
//       // Validate file type
//       const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
//       if (!validTypes.includes(file.type)) {
//         alert('Only JPEG, PNG, GIF, and WebP images are allowed');
//         return;
//       }
      
//       this.selectedFile = file;
      
//       // Create preview
//       const reader = new FileReader();
//       reader.onload = () => {
//         this.previewUrl = reader.result;
//       };
//       reader.readAsDataURL(file);
//     }
//   }

//   triggerFileInput() {
//     const fileInput = document.getElementById('imageInput') as HTMLInputElement;
//     fileInput.click();
//   }

//   removeImage(event: Event) {
//     event.stopPropagation();
//     this.selectedFile = null;
//     this.previewUrl = null;
//     const fileInput = document.getElementById('imageInput') as HTMLInputElement;
//     if (fileInput) {
//       fileInput.value = '';
//     }
//   }

//   getFileSize(bytes: number): string {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//   }

//   submit() {
//     if (this.form.valid) {
//       this.isSubmitting = true;
      
//       // Create CategoryFormData object
//       const categoryData: CategoryFormData = {
//         name: this.form.get('name')?.value,
//         description: this.form.get('description')?.value,
//         isactive: this.form.get('isactive')?.value,
//         image: this.selectedFile || undefined
//       };
      
//       console.log('Submitting category:', categoryData);
      
//       this.service.createCategoryWithImage(categoryData).subscribe({
//         next: (response) => {
//           console.log('Category saved successfully:', response);
//           alert("Category saved successfully!");
//           this.resetForm();
//           this.isSubmitting = false;
//         },
//         error: (error) => {
//           console.error('Error saving category:', error);
//           alert("Error saving category: " + (error.error?.message || error.message));
//           this.isSubmitting = false;
//         },
//         complete: () => {
//           console.log('Request completed');
//           this.isSubmitting = false;
//         }
//       });
//     } else {
//       console.log('Form is invalid');
//       this.form.markAllAsTouched();
//     }
//   }

//   resetForm() {
//     this.form.reset({ isactive: true });
//     this.selectedFile = null;
//     this.previewUrl = null;
//     this.isSubmitting = false;
    
//     // Reset file input
//     const fileInput = document.getElementById('imageInput') as HTMLInputElement;
//     if (fileInput) {
//       fileInput.value = '';
//     }
//   }
// }
