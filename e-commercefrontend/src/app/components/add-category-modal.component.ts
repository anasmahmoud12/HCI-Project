// import { Component, EventEmitter, Output } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { CategoryService } from '../services/category.service';
// import { CategoryFormData } from '../models/category.model';

// @Component({
//   selector: 'app-add-category-modal',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   template: `
//     <div class="modal-overlay" (click)="closeModal()">
//       <div class="modal-container" (click)="$event.stopPropagation()">
//         <div class="modal-header">
//           <h2>Add New Category</h2>
//           <button class="close-btn" (click)="closeModal()">×</button>
//         </div>
        
//         <div class="modal-content">
//           <form [formGroup]="form" (ngSubmit)="submit()" class="form">
//             <!-- Name Field -->
//             <div class="form-group">
//               <label>Name *</label>
//               <input 
//                 type="text" 
//                 formControlName="name"
//                 class="input"
//                 placeholder="Enter category name">
// <div class="error-message" *ngIf="form.get('name')?.invalid && (form.get('name')?.touched || formSubmitted)">
//                 <span *ngIf="form.get('name')?.errors?.['required']">Name is required</span>
//                 <span *ngIf="form.get('name')?.errors?.['minlength']">
//                   Name must be at least 2 characters
//                 </span>
//               </div>
//             </div>

//             <div class="form-group">
//               <label>Description *</label>
//               <textarea 
//                 formControlName="description"
//                 class="textarea"
//                 placeholder="Enter category description"
//                 rows="3"></textarea>
// <div class="error-message" *ngIf="form.get('description')?.invalid && (form.get('description')?.touched || formSubmitted)">                <span *ngIf="form.get('description')?.errors?.['required']">Description is required</span>
//               </div>
//             </div>

//             <div class="form-group">
//               <label>Category Image</label>
//               <div class="file-upload-area" (click)="triggerFileInput()">
//                 <div *ngIf="!selectedFile" class="upload-placeholder">
//                   <i class="upload-icon">📁</i>
//                   <p>Click to upload image</p>
//                   <p class="upload-hint">JPEG, PNG, GIF up to 5MB</p>
//                 </div>
//                 <div *ngIf="selectedFile" class="upload-preview">
//                   <div class="preview-content">
//                     <div class="file-info">
//                       <strong>{{ selectedFile.name }}</strong>
//                       <p class="file-size">{{ getFileSize(selectedFile.size) }}</p>
//                     </div>
//                     <button type="button" class="btn-remove" (click)="removeImage($event)">×</button>
//                   </div>
//                 </div>
//                 <input 
//                   type="file" 
//                   id="imageInput"
//                   accept="image/*"
//                   (change)="onFileSelected($event)"
//                   style="display: none;">
//               </div>
              
//               <div class="image-preview" *ngIf="previewUrl">
//                 <img [src]="previewUrl" alt="Preview" class="preview-image">
//               </div>
//             </div>

//             <div class="form-group checkbox-group">
//               <label class="checkbox-label">
//                 <input 
//                   type="checkbox" 
//                   formControlName="isactive"
//                   class="checkbox">
//                 <span>Active</span>
//               </label>
//             </div>

//             <div class="form-actions">
//               <button 
//                 type="submit"
//                 class="btn-submit"
//                 [disabled]="isSubmitting || form.invalid">
//                 <span *ngIf="!isSubmitting">Save Category</span>
//                 <span *ngIf="isSubmitting">Saving...</span>
//               </button>
              
//               <button 
//                 type="button"
//                 class="btn-reset"
//                 (click)="resetForm()">
//                 Reset
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   `,
//   styles: [`
//     .modal-overlay {
//       position: fixed;
//       top: 0;
//       left: 0;
//       right: 0;
//       bottom: 0;
//       background: rgba(0, 0, 0, 0.5);
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       z-index: 1000;
//       backdrop-filter: blur(4px);
//     }

//     .modal-container {
//       background: white;
//       border-radius: 12px;
//       width: 90%;
//       max-width: 500px;
//       max-height: 90vh;
//       overflow-y: auto;
//       box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
//       animation: modalSlideIn 0.3s ease-out;
//     }

//     @keyframes modalSlideIn {
//       from {
//         opacity: 0;
//         transform: translateY(-30px);
//       }
//       to {
//         opacity: 1;
//         transform: translateY(0);
//       }
//     }

//     .modal-header {
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       padding: 20px 24px;
//       border-bottom: 1px solid #e5e7eb;
//     }

//     .modal-header h2 {
//       margin: 0;
//       font-size: 20px;
//       color: #111827;
//     }

//     .close-btn {
//       background: none;
//       border: none;
//       font-size: 28px;
//       color: #6b7280;
//       cursor: pointer;
//       padding: 0;
//       width: 32px;
//       height: 32px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       border-radius: 6px;
//     }

//     .close-btn:hover {
//       background: #f3f4f6;
//       color: #111827;
//     }

//     .modal-content {
//       padding: 24px;
//     }

//     .form {
//       display: flex;
//       flex-direction: column;
//       gap: 20px;
//     }

//     .form-group {
//       display: flex;
//       flex-direction: column;
//       gap: 8px;
//     }

//     label {
//       font-weight: 500;
//       color: #374151;
//       font-size: 14px;
//     }

//     .input, .textarea {
//       width: 100%;
//       padding: 10px 14px;
//       border: 1px solid #d1d5db;
//       border-radius: 8px;
//       font-size: 14px;
//       transition: all 0.2s;
//     }

//     .textarea {
//       min-height: 80px;
//       resize: vertical;
//     }

//     .input:focus, .textarea:focus {
//       outline: none;
//       border-color: #3b82f6;
//       box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
//     }

//     .error-message {
//       color: #ef4444;
//       font-size: 12px;
//       margin-top: 2px;
//     }

//     .file-upload-area {
//       border: 2px dashed #d1d5db;
//       border-radius: 8px;
//       padding: 20px;
//       text-align: center;
//       cursor: pointer;
//       transition: all 0.2s;
//     }

//     .file-upload-area:hover {
//       border-color: #3b82f6;
//       background: #f0f9ff;
//     }

//     .upload-placeholder {
//       color: #6b7280;
//     }

//     .upload-icon {
//       font-size: 24px;
//       margin-bottom: 8px;
//       display: block;
//     }

//     .upload-hint {
//       font-size: 12px;
//       color: #9ca3af;
//       margin-top: 4px;
//     }

//     .upload-preview {
//       background: white;
//       border-radius: 6px;
//       padding: 12px;
//       box-shadow: 0 1px 3px rgba(0,0,0,0.1);
//     }

//     .preview-content {
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//     }

//     .file-info strong {
//       display: block;
//       font-size: 14px;
//       color: #111827;
//     }

//     .file-size {
//       font-size: 12px;
//       color: #6b7280;
//       margin: 0;
//     }

//     .btn-remove {
//       background: #ef4444;
//       color: white;
//       border: none;
//       border-radius: 50%;
//       width: 24px;
//       height: 24px;
//       font-size: 16px;
//       cursor: pointer;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//     }

//     .image-preview {
//       text-align: center;
//       margin-top: 12px;
//     }

//     .preview-image {
//       max-width: 120px;
//       max-height: 120px;
//       border-radius: 6px;
//       object-fit: cover;
//     }

//     .checkbox-group {
//       margin-top: 10px;
//     }

//     .checkbox-label {
//       display: flex;
//       align-items: center;
//       gap: 8px;
//       cursor: pointer;
//     }

//     .checkbox {
//       width: 16px;
//       height: 16px;
//       cursor: pointer;
//     }

//     .form-actions {
//       display: flex;
//       gap: 12px;
//       margin-top: 24px;
//     }

//     .btn-submit {
//       flex: 1;
//       background: #3b82f6;
//       color: white;
//       border: none;
//       border-radius: 8px;
//       padding: 12px;
//       font-weight: 500;
//       cursor: pointer;
//       font-size: 14px;
//       transition: all 0.2s;
//     }

//     .btn-submit:hover:not(:disabled) {
//       background: #2563eb;
//     }

//     .btn-submit:disabled {
//       background: #9ca3af;
//       cursor: not-allowed;
//     }

//     .btn-reset {
//       background: #6b7280;
//       color: white;
//       border: none;
//       border-radius: 8px;
//       padding: 12px 20px;
//       font-weight: 500;
//       cursor: pointer;
//       font-size: 14px;
//       transition: all 0.2s;
//     }

//     .btn-reset:hover {
//       background: #4b5563;
//     }
//   `]
// })
// export class AddCategoryModalComponent {
//   @Output() categoryAdded = new EventEmitter<void>();
//   @Output() modalClosed = new EventEmitter<void>();
  
//   form: FormGroup;
//   selectedFile: File | null = null;
//   previewUrl: string | ArrayBuffer | null = null;
//    isSubmitting: boolean = false;
//   formSubmitted: boolean = false; 

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
//       if (file.size > 5 * 1024 * 1024) {
//         alert('File size should not exceed 5MB');
//         return;
//       }
      
//       const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
//       if (!validTypes.includes(file.type)) {
//         alert('Only JPEG, PNG, GIF, and WebP images are allowed');
//         return;
//       }
      
//       this.selectedFile = file;
      
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
//           this.categoryAdded.emit();
//           this.resetForm();
//           this.closeModal();
//           this.isSubmitting = false;
//         },
//         error: (error) => {
//           console.error('Error saving category:', error);
//           alert("Error saving category: " + (error.error?.message || error.message));
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
//         this.formSubmitted = false; 

    
//     const fileInput = document.getElementById('imageInput') as HTMLInputElement;
//     if (fileInput) {
//       fileInput.value = '';
//     }
//   }

//   closeModal() {
//     this.modalClosed.emit();
//   }
// }