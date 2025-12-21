// components/add-product-modal.component.ts
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../admin-services/category.service';
import { ProductService } from '../../admin-services/product.service';
import { ProductFormData } from '../../admin-models/product.model';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-add-product-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DragDropModule],
  template: `
    <div class="modal-overlay" (click)="closeModal()">
      <div class="modal-container" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Add New Product</h2>
          <button class="close-btn" (click)="closeModal()">×</button>
        </div>
        
        <div class="modal-content">
          <form [formGroup]="form" (ngSubmit)="submit()" class="form">
            <div class="form-row">
              <div class="form-group">
                <label>Product Name *</label>
                <input 
                  type="text" 
                  formControlName="name"
                  class="input"
                  placeholder="Enter product name">
              </div>

              <div class="form-group">
                <label>Category *</label>
                <select 
                  formControlName="categoryId"
                  class="input">
                  <option value="">Select a category</option>
                  <option *ngFor="let category of categories" [value]="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Description *</label>
              <textarea 
                formControlName="description"
                rows="3"
                class="input"
                placeholder="Enter product description"></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Price *</label>
                <input 
                  type="number" 
                  formControlName="price"
                  step="0.01"
                  class="input"
                  placeholder="0.00">
              </div>

              <div class="form-group">
                <label>Stock Quantity *</label>
                <input 
                  type="number" 
                  formControlName="stock"
                  class="input"
                  placeholder="0">
              </div>
            </div>

            <div class="form-group">
              <label>Product Images</label>
              
              <div class="file-upload-area" (click)="triggerFileInput()">
                <div *ngIf="selectedFiles.length === 0" class="upload-placeholder">
                  <i class="upload-icon">📁</i>
                  <p>Click to upload images</p>
                  <p class="upload-hint">Multiple images allowed, up to 5MB each</p>
                </div>
                <div *ngIf="selectedFiles.length > 0" class="upload-preview">
                  <div class="preview-content">
                    <div class="file-info">
                      <strong>{{ selectedFiles.length }} image(s) selected</strong>
                      <p class="upload-hint">Drag to reorder, check primary image</p>
                    </div>
                  </div>
                </div>
                <input 
                  type="file" 
                  id="productImageInput"
                  multiple
                  accept="image/*"
                  (change)="onFileSelected($event)"
                  style="display: none;">
              </div>
              
              <!-- Image Previews with Drag & Drop -->
              <div *ngIf="selectedFiles.length > 0" class="image-previews">
                <div class="reorder-hint">
                  <span>Drag images to reorder. Only one image can be primary.</span>
                </div>
                <div class="image-grid" cdkDropList (cdkDropListDropped)="drop($event)">
                  <div *ngFor="let preview of imagePreviews; let i = index" 
                       class="image-card" 
                       cdkDrag>
                    <div class="drag-handle" cdkDragHandle>☰</div>
                    <img [src]="preview" class="image-preview">
                    
                    <!-- Primary Image -->
                    <div class="primary-badge" *ngIf="i === primaryImageIndex">
                      <span class="badge-text">Primary</span>
                      <span class="star-icon">⭐</span>
                    </div>
                    
                    <div class="image-name">{{ selectedFiles[i].name }}</div>
                    
                    <!-- Primary Checkbox -->
                    <div class="primary-checkbox-container">
                      <label class="primary-checkbox-label">
                        <input 
                          type="radio" 
                          name="primaryImage" 
                          [checked]="i === primaryImageIndex"
                          (change)="setAsPrimary(i)"
                          class="primary-checkbox">
                        <span class="checkmark"></span>
                        Set as Primary
                      </label>
                    </div>
                    
                    <div class="image-actions">
                      <button type="button" 
                              (click)="removeImage(i)"
                              class="btn-remove">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button 
                type="submit"
                [disabled]="isLoading || form.invalid"
                class="btn-submit">
                <span *ngIf="!isLoading">Save Product</span>
                <span *ngIf="isLoading">Saving...</span>
              </button>
              
              <button 
                type="button"
                (click)="resetForm()"
                class="btn-reset">
                Reset
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
      max-width: 700px;
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
    }

    .modal-header h2 {
      margin: 0;
      font-size: 20px;
      color: #111827;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 28px;
      color: #6b7280;
      cursor: pointer;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
    }

    .close-btn:hover {
      background: #f3f4f6;
      color: #111827;
    }

    .modal-content {
      padding: 24px;
    }

    .form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    @media (max-width: 640px) {
      .form-row {
        grid-template-columns: 1fr;
      }
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

    .input, select, textarea {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 14px;
      transition: all 0.2s;
    }

    textarea {
      min-height: 80px;
      resize: vertical;
    }

    .input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    /* File Upload Styles */
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

    /* Reorder Hint */
    .reorder-hint {
      background: #f3f4f6;
      border-radius: 6px;
      padding: 8px 12px;
      margin-bottom: 12px;
      font-size: 13px;
      color: #6b7280;
      text-align: center;
    }

    /* Image Preview Grid with Drag & Drop */
    .image-previews {
      margin-top: 16px;
    }

    .image-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 16px;
    }

    .image-card {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 12px;
      text-align: center;
      background: white;
      position: relative;
      transition: all 0.2s;
    }

    .image-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .image-card.cdk-drag-preview {
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      transform: rotate(2deg);
    }

    .image-card.cdk-drag-placeholder {
      opacity: 0.5;
      background: #f3f4f6;
    }

    .image-card.cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }

    .drag-handle {
      position: absolute;
      top: 8px;
      left: 8px;
      color: #6b7280;
      cursor: move;
      font-size: 14px;
      opacity: 0.7;
      z-index: 2;
    }

    .drag-handle:hover {
      opacity: 1;
    }

    .image-preview {
      width: 100%;
      height: 90px;
      object-fit: cover;
      border-radius: 4px;
      margin-top: 10px;
      margin-bottom: 8px;
    }

    .image-name {
      font-size: 11px;
      color: #6b7280;
      margin-bottom: 8px;
      word-break: break-all;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* Primary Badge */
    .primary-badge {
      position: absolute;
      top: 8px;
      right: 8px;
      background: #3b82f6;
      color: white;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 10px;
      display: flex;
      align-items: center;
      gap: 4px;
      z-index: 2;
    }

    .badge-text {
      font-weight: 500;
    }

    .star-icon {
      font-size: 10px;
    }

    /* Primary Checkbox */
    .primary-checkbox-container {
      margin: 8px 0;
    }

    .primary-checkbox-label {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      font-size: 11px;
      color: #374151;
      cursor: pointer;
      user-select: none;
    }

    .primary-checkbox {
      display: none; /* Hide default radio button */
    }

    .primary-checkbox + .checkmark {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid #d1d5db;
      border-radius: 50%;
      position: relative;
      background: white;
    }

    .primary-checkbox:checked + .checkmark {
      background: #3b82f6;
      border-color: #3b82f6;
    }

    .primary-checkbox:checked + .checkmark::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 6px;
      height: 6px;
      background: white;
      border-radius: 50%;
    }

    .image-actions {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-top: 4px;
    }

    .btn-remove {
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 6px;
      font-size: 11px;
      cursor: pointer;
    }

    .btn-remove:hover {
      background: #dc2626;
    }

    /* Form Actions */
    .form-actions {
      display: flex;
      gap: 12px;
      margin-top: 24px;
    }

    .btn-submit {
      flex: 1;
      background: #3b82f6;
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
      background: #2563eb;
    }

    .btn-submit:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }

    .btn-reset {
      background: #6b7280;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 12px 20px;
      font-weight: 500;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s;
    }

    .btn-reset:hover {
      background: #4b5563;
    }
  `]
})
export class AddProductModalComponent implements OnInit {
  @Output() productAdded = new EventEmitter<void>();
  @Output() modalClosed = new EventEmitter<void>();
  
  form: FormGroup;
  categories: any[] = [];
  selectedFiles: File[] = [];
  imagePreviews: string[] = [];
  isLoading = false;
  primaryImageIndex = 0; 

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      categoryId: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (file.size > 5 * 1024 * 1024) {
          alert(`File "${file.name}" exceeds 5MB limit`);
          continue;
        }
        
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
          alert(`File "${file.name}" is not a valid image type`);
          continue;
        }
        
        this.selectedFiles.push(file);
        
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreviews.push(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  triggerFileInput() {
    const fileInput = document.getElementById('productImageInput') as HTMLInputElement;
    fileInput.click();
  }

  // Drag and drop handler
  drop(event: CdkDragDrop<string[]>) {
    // Move items in both arrays
    moveItemInArray(this.selectedFiles, event.previousIndex, event.currentIndex);
    moveItemInArray(this.imagePreviews, event.previousIndex, event.currentIndex);
    
    // Update primary image index if it was moved
    if (this.primaryImageIndex === event.previousIndex) {
      this.primaryImageIndex = event.currentIndex;
    } else if (this.primaryImageIndex > event.previousIndex && this.primaryImageIndex <= event.currentIndex) {
      this.primaryImageIndex--;
    } else if (this.primaryImageIndex < event.previousIndex && this.primaryImageIndex >= event.currentIndex) {
      this.primaryImageIndex++;
    }
  }

  // Set image as primary (simple index update)
  setAsPrimary(index: number) {
    this.primaryImageIndex = index;
  }

  removeImage(index: number) {
    // Check if we're removing the primary image
    if (index === this.primaryImageIndex) {
      // If removing the primary image, set first image as primary
      this.primaryImageIndex = 0;
    } else if (index < this.primaryImageIndex) {
      // If removing an image before the primary, adjust index
      this.primaryImageIndex--;
    }
    
    this.selectedFiles.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  submit() {
    if (this.form.valid) {
      this.isLoading = true;
      
      const price = parseFloat(this.form.value.price);
      const productData: ProductFormData = {
        name: this.form.value.name,
        description: this.form.value.description,
        priceBefore: price,
        priceAfter: price,
        stock_quantity: parseInt(this.form.value.stock),
        categoryId: parseInt(this.form.value.categoryId),
        primaryImageIndex: this.primaryImageIndex,
        images: this.selectedFiles
      };
      
      console.log('Submitting product data:', productData);
      console.log('Primary image index:', this.primaryImageIndex);
      console.log('Images array order:', this.selectedFiles.map(f => f.name));
      
      this.productService.createProductWithImages(productData).subscribe({
        next: (response: any) => {
          alert('Product created successfully!');
          this.productAdded.emit();
          this.resetForm();
          this.closeModal();
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error creating product:', error);
          alert('Error creating product: ' + (error.error?.message || error.message));
          this.isLoading = false;
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  resetForm() {
    this.form.reset();
    this.selectedFiles = [];
    this.imagePreviews = [];
    this.primaryImageIndex = 0;
  }

  closeModal() {
    this.modalClosed.emit();
  }
}