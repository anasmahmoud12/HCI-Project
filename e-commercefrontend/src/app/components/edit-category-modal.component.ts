import { Component, EventEmitter, Output, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../services/category.service';
import { CategoryFormData } from '../models/category.model';

@Component({
  selector: 'app-edit-category-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-overlay" (click)="closeModal()">
      <div class="modal-container" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Edit Category</h2>
          <button class="close-btn" (click)="closeModal()">×</button>
        </div>
        
        <div class="modal-content">
          <form [formGroup]="form" (ngSubmit)="submit()" class="form">
            <!-- Name Field -->
            <div class="form-group">
              <label>Name *</label>
              <input 
                type="text" 
                formControlName="name"
                class="input"
                placeholder="Enter category name">
              <div class="error-message" *ngIf="form.get('name')?.invalid && (form.get('name')?.touched || formSubmitted)">
                <span *ngIf="form.get('name')?.errors?.['required']">Name is required</span>
                <span *ngIf="form.get('name')?.errors?.['minlength']">
                  Name must be at least 2 characters
                </span>
              </div>
            </div>

            <!-- Description Field -->
            <div class="form-group">
              <label>Description *</label>
              <textarea 
                formControlName="description"
                class="textarea"
                placeholder="Enter category description"
                rows="3"></textarea>
              <div class="error-message" *ngIf="form.get('description')?.invalid && (form.get('description')?.touched || formSubmitted)">
                <span *ngIf="form.get('description')?.errors?.['required']">Description is required</span>
              </div>
            </div>

            <!-- Category Image -->
            <div class="form-group">
              <label>Category Image</label>
              
              <!-- Current Image Preview with Small Delete Button (X) -->
              <div class="current-image-section" *ngIf="currentImageUrl && !selectedFile">
                <p class="current-image-label">Current Image:</p>
                <div class="image-preview-container">
                  <div class="image-wrapper">
                    <img [src]="currentImageUrl" alt="Current category image" class="current-image-preview">
                    <button type="button" class="btn-delete-small" (click)="removeCurrentImage()" title="Delete image">
                      ×
                    </button>
                  </div>
                  <div class="image-info">
                    <p class="image-status">Current image will be kept unless you:</p>
                    <ul class="image-options">
                      <li>• Upload a new image below</li>
                      <li>• Click the X button to delete</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <!-- File Upload Area -->
              <div class="file-upload-area" (click)="triggerFileInput()">
                <div *ngIf="!selectedFile" class="upload-placeholder">
                  <i class="upload-icon">📁</i>
                  <p>{{ currentImageUrl ? 'Upload new image' : 'Upload image' }}</p>
                  <p class="upload-hint">JPEG, PNG, GIF up to 5MB</p>
                  <p class="upload-hint" *ngIf="currentImageUrl">Leave empty to keep current image</p>
                </div>
                <div *ngIf="selectedFile" class="upload-preview">
                  <div class="preview-content">
                    <div class="file-info">
                      <strong>{{ selectedFile.name }}</strong>
                      <p class="file-size">{{ getFileSize(selectedFile.size) }}</p>
                      <p class="file-notice" *ngIf="currentImageUrl">
                        <span class="warning-icon">⚠️</span> This will replace the current image
                      </p>
                    </div>
                    <button type="button" class="btn-remove" (click)="removeImage($event)" title="Remove new image">
                      ×
                    </button>
                  </div>
                </div>
                <input 
                  type="file" 
                  id="imageInput"
                  accept="image/*"
                  (change)="onFileSelected($event)"
                  style="display: none;">
              </div>
              
              <!-- New Image Preview -->
              <div class="image-preview" *ngIf="previewUrl">
                <p class="preview-label">New Image Preview:</p>
                <div class="preview-wrapper">
                  <img [src]="previewUrl" alt="Preview" class="preview-image">
                </div>
              </div>
              
              <!-- Image Removal Status -->
              <div class="removal-status" *ngIf="removeImageFlag && !currentImageUrl">
                <p class="removal-text">
                  <span class="removal-icon">🗑️</span>
                  Current image will be removed when you save
                </p>
                <button type="button" class="btn-undo-remove" (click)="undoRemoveImage()">
                  Undo removal
                </button>
              </div>
            </div>

            <!-- Active Status -->
            <div class="form-group checkbox-group">
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  formControlName="isactive"
                  class="checkbox">
                <span>Active</span>
              </label>
            </div>

            <!-- Form Actions -->
            <div class="form-actions">
              <button 
                type="submit"
                class="btn-submit"
                [disabled]="isSubmitting || form.invalid">
                <span *ngIf="!isSubmitting">Update Category</span>
                <span *ngIf="isSubmitting">Updating...</span>
              </button>
              
              <button 
                type="button"
                class="btn-cancel"
                (click)="closeModal()">
                Cancel
              </button>
              
              <button 
                type="button"
                class="btn-reset"
                (click)="resetToOriginal()"
                [disabled]="isSubmitting">
                Reset Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(4px);
    }

    .modal-container {
      background: white;
      border-radius: 12px;
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      animation: modalSlideIn 0.3s ease-out;
    }

    @keyframes modalSlideIn {
      from {
        opacity: 0;
        transform: translateY(-30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid #e5e7eb;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 20px;
      color: white;
    }

    .close-btn {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      font-size: 28px;
      color: white;
      cursor: pointer;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      transition: background 0.2s;
    }

    .close-btn:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .modal-content {
      padding: 24px;
    }

    .form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    label {
      font-weight: 500;
      color: #374151;
      font-size: 14px;
    }

    .current-image-section {
      margin-bottom: 15px;
    }

    .current-image-label {
      font-weight: 500;
      color: #374151;
      font-size: 14px;
      margin-bottom: 8px;
    }

    .image-preview-container {
      display: flex;
      align-items: flex-start;
      gap: 15px;
      padding: 12px;
      background: #f9fafb;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
    }

    .image-wrapper {
      position: relative;
      display: inline-block;
    }

    .current-image-preview {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 6px;
      border: 2px solid #e5e7eb;
    }

    .btn-delete-small {
      position: absolute;
      top: -8px;
      right: -8px;
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      font-size: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      transition: all 0.2s;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    .btn-delete-small:hover {
      background: #dc2626;
      transform: scale(1.1);
    }

    .image-info {
      flex: 1;
    }

    .image-status {
      margin: 0 0 8px 0;
      font-size: 12px;
      color: #6b7280;
    }

    .image-options {
      margin: 0;
      padding-left: 16px;
      font-size: 11px;
      color: #6b7280;
    }

    .image-options li {
      margin-bottom: 4px;
    }

    .removal-status {
      margin-top: 10px;
      padding: 10px;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .removal-text {
      margin: 0;
      font-size: 12px;
      color: #dc2626;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .removal-icon {
      font-size: 14px;
    }

    .btn-undo-remove {
      background: #6b7280;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 4px 8px;
      font-size: 11px;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-undo-remove:hover {
      background: #4b5563;
    }

    /* File Upload Area */
    .file-upload-area {
      border: 2px dashed #d1d5db;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .file-upload-area:hover {
      border-color: #3b82f6;
      background: #f0f9ff;
    }

    .upload-placeholder {
      color: #6b7280;
    }

    .upload-icon {
      font-size: 24px;
      margin-bottom: 8px;
      display: block;
    }

    .upload-hint {
      font-size: 12px;
      color: #9ca3af;
      margin-top: 4px;
    }

    .upload-preview {
      background: white;
      border-radius: 6px;
      padding: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .preview-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .file-info strong {
      display: block;
      font-size: 14px;
      color: #111827;
    }

    .file-size {
      font-size: 12px;
      color: #6b7280;
      margin: 4px 0;
    }

    .file-notice {
      font-size: 11px;
      color: #f59e0b;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .warning-icon {
      font-size: 10px;
    }

    .btn-remove {
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      font-size: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .btn-remove:hover {
      background: #dc2626;
      transform: scale(1.1);
    }

    /* New Image Preview */
    .image-preview {
      margin-top: 12px;
    }

    .preview-label {
      font-size: 12px;
      color: #374151;
      margin: 0 0 6px 0;
      font-weight: 500;
    }

    .preview-wrapper {
      text-align: center;
    }

    .preview-image {
      max-width: 120px;
      max-height: 120px;
      border-radius: 6px;
      object-fit: cover;
      border: 2px solid #d1d5db;
    }

    /* Form Controls */
    .input, .textarea {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 14px;
      transition: all 0.2s;
    }

    .textarea {
      min-height: 80px;
      resize: vertical;
    }

    .input:focus, .textarea:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .error-message {
      color: #ef4444;
      font-size: 12px;
      margin-top: 2px;
    }

    .checkbox-group {
      margin-top: 10px;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }

    .checkbox {
      width: 16px;
      height: 16px;
      cursor: pointer;
    }

    /* Form Actions */
    .form-actions {
      display: flex;
      gap: 12px;
      margin-top: 24px;
    }

    .btn-submit {
      flex: 2;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      padding: 12px;
      font-weight: 500;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s;
    }

    .btn-submit:hover:not(:disabled) {
      opacity: 0.9;
    }

    .btn-submit:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }

    .btn-cancel {
      flex: 1;
      background: #6b7280;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 12px;
      font-weight: 500;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s;
    }

    .btn-cancel:hover {
      background: #4b5563;
    }

    .btn-reset {
      flex: 1;
      background: #f59e0b;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 12px;
      font-weight: 500;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s;
    }

    .btn-reset:hover:not(:disabled) {
      background: #d97706;
    }

    .btn-reset:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }
  `]
})
export class EditCategoryModalComponent implements OnInit, OnChanges {
  @Output() categoryUpdated = new EventEmitter<void>();
  @Output() modalClosed = new EventEmitter<void>();
  @Input() category!: any;
  
  form: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  isSubmitting: boolean = false;
  formSubmitted: boolean = false;
  currentImageUrl: string | null = null;
  removeImageFlag: boolean = false;
  originalCategory: any = null;

  constructor(private fb: FormBuilder, private service: CategoryService) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required]],
      isactive: [true]
    });
  }

  ngOnInit() {
    this.loadCategoryData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['category'] && this.category) {
      this.loadCategoryData();
    }
  }

  loadCategoryData() {
    if (this.category) {
      // Store original category for reset functionality
      this.originalCategory = { ...this.category };
      
      // Set form values
      this.form.patchValue({
        name: this.category.name,
        description: this.category.description,
        isactive: this.category.isactive
      });

      // Load current image
      if (this.category.img) {
        this.currentImageUrl = `data:image/jpeg;base64,${this.category.img}`;
      } else {
        this.currentImageUrl = null;
      }

      // Reset flags
      this.removeImageFlag = false;
      this.selectedFile = null;
      this.previewUrl = null;
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should not exceed 5MB');
        return;
      }
      
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Only JPEG, PNG, GIF, and WebP images are allowed');
        return;
      }
      
      this.selectedFile = file;
      this.removeImageFlag = false; // If uploading new image, cancel removal
      
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  triggerFileInput() {
    const fileInput = document.getElementById('imageInput') as HTMLInputElement;
    fileInput.click();
  }

  removeImage(event: Event) {
    event.stopPropagation();
    this.selectedFile = null;
    this.previewUrl = null;
    const fileInput = document.getElementById('imageInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  removeCurrentImage() {
    // Set flag to remove image
    this.removeImageFlag = true;
    this.currentImageUrl = null;
    this.selectedFile = null;
    this.previewUrl = null;
    
    // Clear file input
    const fileInput = document.getElementById('imageInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  undoRemoveImage() {
    // Restore original image if it existed
    this.removeImageFlag = false;
    if (this.originalCategory?.img) {
      this.currentImageUrl = `data:image/jpeg;base64,${this.originalCategory.img}`;
    }
  }

  getFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  submit() {
    this.formSubmitted = true;
    
    if (this.form.valid && this.category) {
      this.isSubmitting = true;
      
      const categoryData: CategoryFormData = {
        name: this.form.get('name')?.value,
        description: this.form.get('description')?.value,
        isactive: this.form.get('isactive')?.value,
        image: this.selectedFile || undefined,
        removeImage: this.removeImageFlag
      };
      
      console.log('Updating category:', categoryData);
      
      this.service.updateCategory(this.category.id, categoryData).subscribe({
        next: (response) => {
          console.log('Category updated successfully:', response);
          alert("Category updated successfully!");
          this.categoryUpdated.emit();
          this.closeModal();
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Error updating category:', error);
          alert("Error updating category: " + (error.error?.message || error.message));
          this.isSubmitting = false;
        }
      });
    } else {
      console.log('Form is invalid');
      this.form.markAllAsTouched();
    }
  }

  resetToOriginal() {
    if (this.originalCategory) {
      this.form.patchValue({
        name: this.originalCategory.name,
        description: this.originalCategory.description,
        isactive: this.originalCategory.isactive
      });
      
      // Reset image
      this.selectedFile = null;
      this.previewUrl = null;
      this.removeImageFlag = false;
      
      if (this.originalCategory.img) {
        this.currentImageUrl = `data:image/jpeg;base64,${this.originalCategory.img}`;
      } else {
        this.currentImageUrl = null;
      }
      
      // Reset file input
      const fileInput = document.getElementById('imageInput') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    }
  }

  closeModal() {
    this.modalClosed.emit();
  }
}