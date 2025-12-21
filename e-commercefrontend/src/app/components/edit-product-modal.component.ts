// import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { CategoryService } from '../services/category.service';
// import { ProductService } from '../services/product.service';
// import { Product, ProductFormData } from '../models/product.model';
// import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

// @Component({
//   selector: 'app-edit-product-modal',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, DragDropModule],
//   template: `
//     <div class="modal-overlay" (click)="closeModal()">
//       <div class="modal-container" (click)="$event.stopPropagation()">
//         <div class="modal-header">
//           <h2>Edit Product</h2>
//           <button class="close-btn" (click)="closeModal()">×</button>
//         </div>
        
//         <div class="modal-content">
//           <form [formGroup]="form" (ngSubmit)="submit()" class="form">
//             <!-- Basic Information -->
//             <div class="section">
//               <h3 class="section-title">Basic Information</h3>
              
//               <div class="form-row">
//                 <div class="form-group">
//                   <label>Product Name *</label>
//                   <input 
//                     type="text" 
//                     formControlName="name"
//                     class="input"
//                     placeholder="Enter product name">
//                 </div>

//                 <div class="form-group">
//                   <label>Category *</label>
//                   <select 
//                     formControlName="categoryId"
//                     class="input">
//                     <option value="">Select a category</option>
//                     <option *ngFor="let category of categories" [value]="category.id">
//                       {{ category.name }}
//                     </option>
//                   </select>
//                 </div>
//               </div>

//               <div class="form-group">
//                 <label>Description *</label>
//                 <textarea 
//                   formControlName="description"
//                   rows="3"
//                   class="input"
//                   placeholder="Enter product description"></textarea>
//               </div>
//             </div>

//             <!-- Pricing and Stock -->
//             <div class="section">
//               <h3 class="section-title">Pricing & Stock</h3>
              
//               <div class="form-row">
//                 <div class="form-group">
//                   <label>Original Price ($)</label>
//                   <input 
//                     type="number" 
//                     formControlName="priceBefore"
//                     step="0.01"
//                     class="input"
//                     placeholder="0.00">
//                 </div>

//                 <div class="form-group">
//                   <label>Sale Price ($)</label>
//                   <input 
//                     type="number" 
//                     formControlName="priceAfter"
//                     step="0.01"
//                     class="input"
//                     placeholder="0.00">
//                 </div>

//                 <div class="form-group">
//                   <label>Stock Quantity</label>
//                   <input 
//                     type="number" 
//                     formControlName="stock_quantity"
//                     class="input"
//                     placeholder="0">
//                 </div>
//               </div>
//             </div>

//             <!-- Product Images -->
//             <div class="section">
//               <h3 class="section-title">Product Images</h3>
              
//               <!-- Current Images -->
//               <div *ngIf="currentImages.length > 0" class="current-images-section">
//                 <h4>Current Images</h4>
//                 <div class="image-grid" cdkDropList (cdkDropListDropped)="dropCurrentImages($event)">
//                   <div *ngFor="let image of currentImages; let i = index" 
//                        class="image-card current"
//                        cdkDrag>
//                     <div class="drag-handle" cdkDragHandle>☰</div>
//                     <img [src]="'data:image/jpeg;base64,' + image.img" class="image-preview">
                    
//                     <!-- Primary Badge -->
//                     <div class="primary-badge" *ngIf="image.isPrimary">
//                       <span class="star-icon">⭐</span>
//                       <span class="badge-text">Primary</span>
//                     </div>
                    
//                     <!-- Set as Primary Button -->
//                     <button 
//                       type="button"
//                       class="btn-set-primary"
//                       (click)="setCurrentImageAsPrimary(i)"
//                       [disabled]="image.isPrimary">
//                       {{ image.isPrimary ? 'Is Primary' : 'Set as Primary' }}
//                     </button>
                    
//                     <!-- Remove Button -->
//                     <button 
//                       type="button"
//                       class="btn-remove-current"
//                       (click)="removeCurrentImage(image.id!, i)">
//                       Remove
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               <!-- Add New Images -->
//               <div class="new-images-section">
//                 <h4>Add New Images</h4>
                
//                 <div class="file-upload-area" (click)="triggerFileInput()">
//                   <div class="upload-content">
//                     <div class="upload-icon">📁</div>
//                     <div class="upload-text">
//                       <p class="upload-title">Click to upload new images</p>
//                       <p class="upload-subtitle">Multiple images allowed, up to 5MB each</p>
//                     </div>
//                   </div>
//                   <input 
//                     type="file" 
//                     id="productImageInput"
//                     multiple
//                     accept="image/*"
//                     (change)="onFileSelected($event)"
//                     style="display: none;">
//                 </div>

//                 <!-- New Image Previews -->
//                 <div *ngIf="newImages.length > 0" class="new-image-previews">
//                   <div class="reorder-hint">
//                     <span>Drag new images to reorder. Check to set as primary.</span>
//                   </div>
//                   <div class="image-grid" cdkDropList (cdkDropListDropped)="dropNewImages($event)">
//                     <div *ngFor="let preview of newImagePreviews; let i = index" 
//                          class="image-card new"
//                          cdkDrag>
//                       <div class="drag-handle" cdkDragHandle>☰</div>
//                       <img [src]="preview" class="image-preview">
                      
//                       <!-- Primary Selection -->
//                       <div class="primary-selection">
//                         <label class="checkbox-label">
//                           <input 
//                             type="radio" 
//                             name="newPrimaryImage"
//                             [checked]="getNewImagePrimaryIndex() === i"
//                             (change)="setNewImageAsPrimary(i)"
//                             class="checkbox">
//                           <span>Set as Primary</span>
//                         </label>
//                       </div>
                      
//                       <div class="image-name">{{ newImages[i].name }}</div>
                      
//                       <button 
//                         type="button"
//                         class="btn-remove-new"
//                         (click)="removeNewImage(i)">
//                         Remove
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <!-- Form Actions -->
//             <div class="form-actions">
//               <button 
//                 type="submit"
//                 [disabled]="isSubmitting || form.invalid"
//                 class="btn-submit">
//                 <span *ngIf="!isSubmitting">💾 Update Product</span>
//                 <span *ngIf="isSubmitting">
//                   <span class="spinner"></span> Updating...
//                 </span>
//               </button>
              
//               <div class="action-buttons">
//                 <button 
//                   type="button"
//                   class="btn-secondary"
//                   (click)="resetForm()">
//                   ↺ Reset Changes
//                 </button>
                
//                 <button 
//                   type="button"
//                   class="btn-cancel"
//                   (click)="closeModal()">
//                   Cancel
//                 </button>
//               </div>
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
//       background: rgba(0, 0, 0, 0.7);
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       z-index: 1000;
//       backdrop-filter: blur(5px);
//     }

//     .modal-container {
//       background: white;
//       border-radius: 16px;
//       width: 90%;
//       max-width: 800px;
//       max-height: 90vh;
//       overflow-y: auto;
//       box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
//     }

//     .modal-header {
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       padding: 24px 28px;
//       border-bottom: 1px solid #e5e7eb;
//       background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
//       color: white;
//       position: sticky;
//       top: 0;
//       z-index: 10;
//     }

//     .modal-header h2 {
//       margin: 0;
//       font-size: 22px;
//       font-weight: 600;
//       color: white;
//     }

//     .close-btn {
//       background: rgba(255, 255, 255, 0.15);
//       border: none;
//       font-size: 28px;
//       color: white;
//       cursor: pointer;
//       padding: 0;
//       width: 36px;
//       height: 36px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       border-radius: 8px;
//       transition: all 0.2s;
//       font-weight: 300;
//     }

//     .close-btn:hover {
//       background: rgba(255, 255, 255, 0.25);
//       transform: rotate(90deg);
//     }

//     .modal-content {
//       padding: 28px;
//     }

//     .section {
//       margin-bottom: 32px;
//     }

//     .section-title {
//       font-size: 18px;
//       font-weight: 600;
//       color: #374151;
//       margin: 0 0 20px 0;
//       padding-bottom: 12px;
//       border-bottom: 2px solid #f3f4f6;
//     }

//     .form {
//       display: flex;
//       flex-direction: column;
//       gap: 24px;
//     }

//     .form-row {
//       display: grid;
//       grid-template-columns: 1fr 1fr;
//       gap: 16px;
//     }

//     @media (max-width: 640px) {
//       .form-row {
//         grid-template-columns: 1fr;
//       }
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

//     .input, select, textarea {
//       width: 100%;
//       padding: 12px 16px;
//       border: 2px solid #e5e7eb;
//       border-radius: 10px;
//       font-size: 15px;
//       transition: all 0.2s;
//       background: #f9fafb;
//     }

//     textarea {
//       min-height: 100px;
//       resize: vertical;
//       line-height: 1.5;
//     }

//     .input:focus, select:focus, textarea:focus {
//       outline: none;
//       border-color: #f59e0b;
//       background: white;
//       box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
//     }

//     /* Image Sections */
//     .current-images-section, .new-images-section {
//       margin-bottom: 24px;
//     }

//     h4 {
//       font-size: 16px;
//       font-weight: 600;
//       color: #4b5563;
//       margin: 0 0 16px 0;
//     }

//     .file-upload-area {
//       border: 3px dashed #d1d5db;
//       border-radius: 12px;
//       padding: 24px;
//       cursor: pointer;
//       transition: all 0.3s;
//       margin-bottom: 20px;
//     }

//     .file-upload-area:hover {
//       border-color: #f59e0b;
//       background: #fffbeb;
//     }

//     .upload-content {
//       display: flex;
//       align-items: center;
//       gap: 16px;
//     }

//     .upload-icon {
//       font-size: 32px;
//       color: #f59e0b;
//     }

//     .upload-text {
//       text-align: left;
//       flex: 1;
//     }

//     .upload-title {
//       font-weight: 600;
//       color: #374151;
//       margin: 0 0 4px 0;
//       font-size: 15px;
//     }

//     .upload-subtitle {
//       color: #6b7280;
//       margin: 0;
//       font-size: 13px;
//     }

//     /* Image Grid */
//     .image-grid {
//       display: grid;
//       grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
//       gap: 16px;
//       margin-top: 16px;
//     }

//     .image-card {
//       border: 2px solid #e5e7eb;
//       border-radius: 12px;
//       padding: 12px;
//       text-align: center;
//       background: white;
//       position: relative;
//       transition: all 0.2s;
//     }

//     .image-card.current {
//       border-color: #d1fae5;
//       background: #f0fdf4;
//     }

//     .image-card.new {
//       border-color: #fef3c7;
//       background: #fffbeb;
//     }

//     .image-card:hover {
//       box-shadow: 0 4px 12px rgba(0,0,0,0.1);
//       transform: translateY(-2px);
//     }

//     .image-card.cdk-drag-preview {
//       box-shadow: 0 8px 24px rgba(0,0,0,0.2);
//       transform: rotate(2deg);
//     }

//     .image-card.cdk-drag-placeholder {
//       opacity: 0.5;
//       background: #f3f4f6;
//     }

//     .drag-handle {
//       position: absolute;
//       top: 8px;
//       left: 8px;
//       color: #6b7280;
//       cursor: move;
//       font-size: 14px;
//       opacity: 0.7;
//       z-index: 2;
//     }

//     .drag-handle:hover {
//       opacity: 1;
//     }

//     .image-preview {
//       width: 100%;
//       height: 100px;
//       object-fit: cover;
//       border-radius: 8px;
//       margin-bottom: 12px;
//     }

//     .primary-badge {
//       position: absolute;
//       top: 8px;
//       right: 8px;
//       background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
//       color: white;
//       padding: 4px 8px;
//       border-radius: 12px;
//       font-size: 10px;
//       display: flex;
//       align-items: center;
//       gap: 4px;
//       z-index: 2;
//     }

//     .star-icon {
//       font-size: 10px;
//     }

//     .badge-text {
//       font-weight: 500;
//     }

//     .image-name {
//       font-size: 11px;
//       color: #6b7280;
//       margin-bottom: 12px;
//       word-break: break-all;
//       overflow: hidden;
//       text-overflow: ellipsis;
//       white-space: nowrap;
//     }

//     /* Buttons */
//     .btn-set-primary, .btn-remove-current, .btn-remove-new {
//       width: 100%;
//       padding: 8px;
//       border: none;
//       border-radius: 6px;
//       font-size: 12px;
//       font-weight: 500;
//       cursor: pointer;
//       transition: all 0.2s;
//       margin-top: 4px;
//     }

//     .btn-set-primary {
//       background: #3b82f6;
//       color: white;
//     }

//     .btn-set-primary:hover:not(:disabled) {
//       background: #2563eb;
//     }

//     .btn-set-primary:disabled {
//       background: #9ca3af;
//       cursor: not-allowed;
//     }

//     .btn-remove-current {
//       background: #ef4444;
//       color: white;
//     }

//     .btn-remove-current:hover {
//       background: #dc2626;
//     }

//     .btn-remove-new {
//       background: #6b7280;
//       color: white;
//     }

//     .btn-remove-new:hover {
//       background: #4b5563;
//     }

//     .primary-selection {
//       margin-bottom: 8px;
//     }

//     .checkbox-label {
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       gap: 6px;
//       font-size: 11px;
//       color: #374151;
//       cursor: pointer;
//     }

//     .checkbox {
//       width: 14px;
//       height: 14px;
//       cursor: pointer;
//     }

//     .reorder-hint {
//       background: #f3f4f6;
//       border-radius: 6px;
//       padding: 8px 12px;
//       margin-bottom: 12px;
//       font-size: 13px;
//       color: #6b7280;
//       text-align: center;
//     }

//     /* Form Actions */
//     .form-actions {
//       margin-top: 32px;
//       padding-top: 24px;
//       border-top: 2px solid #f3f4f6;
//     }

//     .btn-submit {
//       width: 100%;
//       background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
//       color: white;
//       border: none;
//       border-radius: 12px;
//       padding: 16px;
//       font-weight: 600;
//       cursor: pointer;
//       font-size: 16px;
//       transition: all 0.3s;
//       margin-bottom: 16px;
//     }

//     .btn-submit:hover:not(:disabled) {
//       transform: translateY(-2px);
//       box-shadow: 0 8px 25px rgba(245, 158, 11, 0.3);
//     }

//     .btn-submit:disabled {
//       background: #9ca3af;
//       cursor: not-allowed;
//       transform: none;
//       box-shadow: none;
//     }

//     .action-buttons {
//       display: flex;
//       gap: 12px;
//     }

//     .btn-secondary {
//       flex: 1;
//       background: white;
//       color: #6b7280;
//       border: 2px solid #e5e7eb;
//       border-radius: 10px;
//       padding: 12px;
//       font-weight: 500;
//       cursor: pointer;
//       font-size: 14px;
//       transition: all 0.2s;
//     }

//     .btn-secondary:hover {
//       background: #f9fafb;
//       border-color: #d1d5db;
//       transform: translateY(-1px);
//     }

//     .btn-cancel {
//       flex: 1;
//       background: #6b7280;
//       color: white;
//       border: none;
//       border-radius: 10px;
//       padding: 12px;
//       font-weight: 500;
//       cursor: pointer;
//       font-size: 14px;
//       transition: all 0.2s;
//     }

//     .btn-cancel:hover {
//       background: #4b5563;
//       transform: translateY(-1px);
//     }

//     .spinner {
//       width: 18px;
//       height: 18px;
//       border: 2px solid rgba(255, 255, 255, 0.3);
//       border-radius: 50%;
//       border-top-color: white;
//       animation: spin 1s linear infinite;
//       display: inline-block;
//     }

//     @keyframes spin {
//       to { transform: rotate(360deg); }
//     }

//     /* Responsive */
//     @media (max-width: 640px) {
//       .modal-container {
//         width: 95%;
//         margin: 10px;
//       }
      
//       .modal-content {
//         padding: 20px;
//       }
      
//       .upload-content {
//         flex-direction: column;
//         text-align: center;
//         gap: 12px;
//       }
      
//       .action-buttons {
//         flex-direction: column;
//       }
//     }
//   `]
// })
// export class EditProductModalComponent implements OnInit {
//   @Output() productUpdated = new EventEmitter<void>();
//   @Output() modalClosed = new EventEmitter<void>();
//   @Input() product!: Product;
  
//   form!: FormGroup;
//   categories: any[] = [];
//   currentImages: any[] = [];
//   removedImageIds: number[] = [];
//   newImages: File[] = [];
//   newImagePreviews: string[] = [];
//   newPrimaryImageIndex: number | null = null;
//   isSubmitting = false;

//   constructor(
//     private fb: FormBuilder,
//     private categoryService: CategoryService,
//     private productService: ProductService
//   ) {
//     this.initializeForm();
//   }

//   ngOnInit() {
//     this.loadCategories();
//     this.loadProductData();
//   }

//   private initializeForm() {
//     this.form = this.fb.group({
//       name: ['', [Validators.required, Validators.minLength(2)]],
//       categoryId: ['', [Validators.required]],
//       description: ['', [Validators.required]],
//       priceBefore: ['', [Validators.required, Validators.min(0)]],
//       priceAfter: ['', [Validators.required, Validators.min(0)]],
//       stock_quantity: ['', [Validators.required, Validators.min(0)]]
//     });
//   }

//   loadCategories() {
//     this.categoryService.getCategories().subscribe({
//       next: (categories) => {
//         this.categories = categories;
//       },
//       error: (error) => {
//         console.error('Error loading categories:', error);
//       }
//     });
//   }

//   loadProductData() {
//     if (this.product) {
//       // Load product data
//       this.form.patchValue({
//         name: this.product.name,
//         categoryId: this.product.categoryId,
//         description: this.product.description,
//         priceBefore: this.product.priceBefore,
//         priceAfter: this.product.priceAfter,
//         stock_quantity: this.product.stock_quantity
//       });

//       // Load current images
//       if (this.product.productImages) {
//         this.currentImages = [...this.product.productImages];
//       }
//     }
//   }

//   getNewImagePrimaryIndex(): number {
//     if (this.newPrimaryImageIndex !== null) return this.newPrimaryImageIndex;
    
//     // If no current primary image exists in current images, set first new image as primary
//     const hasCurrentPrimary = this.currentImages.some(img => img.isPrimary);
//     if (!hasCurrentPrimary && this.newImages.length > 0) {
//       return 0;
//     }
    
//     return -1; // No new image is primary
//   }

//   // Drag and drop for current images
//   dropCurrentImages(event: CdkDragDrop<any[]>) {
//     moveItemInArray(this.currentImages, event.previousIndex, event.currentIndex);
//   }

//   // Drag and drop for new images
//   dropNewImages(event: CdkDragDrop<string[]>) {
//     moveItemInArray(this.newImages, event.previousIndex, event.currentIndex);
//     moveItemInArray(this.newImagePreviews, event.previousIndex, event.currentIndex);
    
//     // Update primary image index if moved
//     if (this.newPrimaryImageIndex === event.previousIndex) {
//       this.newPrimaryImageIndex = event.currentIndex;
//     } else if (this.newPrimaryImageIndex !== null) {
//       if (this.newPrimaryImageIndex > event.previousIndex && this.newPrimaryImageIndex <= event.currentIndex) {
//         this.newPrimaryImageIndex--;
//       } else if (this.newPrimaryImageIndex < event.previousIndex && this.newPrimaryImageIndex >= event.currentIndex) {
//         this.newPrimaryImageIndex++;
//       }
//     }
//   }

//   onFileSelected(event: any) {
//     const files = event.target.files;
//     if (files && files.length > 0) {
//       for (let i = 0; i < files.length; i++) {
//         const file = files[i];
        
//         if (file.size > 5 * 1024 * 1024) {
//           alert(`File "${file.name}" exceeds 5MB limit`);
//           continue;
//         }
        
//         const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
//         if (!validTypes.includes(file.type)) {
//           alert(`File "${file.name}" is not a valid image type`);
//           continue;
//         }
        
//         this.newImages.push(file);
        
//         const reader = new FileReader();
//         reader.onload = () => {
//           this.newImagePreviews.push(reader.result as string);
//         };
//         reader.readAsDataURL(file);
//       }
//     }
//   }

//   triggerFileInput() {
//     const fileInput = document.getElementById('productImageInput') as HTMLInputElement;
//     fileInput.click();
//   }

//   setCurrentImageAsPrimary(index: number) {
//     // Set all current images to non-primary
//     this.currentImages.forEach((img, i) => {
//       img.isPrimary = i === index;
//     });
//     // Clear new primary image selection
//     this.newPrimaryImageIndex = null;
//   }

//   setNewImageAsPrimary(index: number) {
//     this.newPrimaryImageIndex = index;
//     // Set all current images to non-primary
//     this.currentImages.forEach(img => img.isPrimary = false);
//   }

//   removeCurrentImage(imageId: number, index: number) {
//     this.removedImageIds.push(imageId);
//     this.currentImages.splice(index, 1);
//   }

//   removeNewImage(index: number) {
//     this.newImages.splice(index, 1);
//     this.newImagePreviews.splice(index, 1);
    
//     // Update primary image index if removed
//     if (this.newPrimaryImageIndex === index) {
//       this.newPrimaryImageIndex = null;
//     } else if (this.newPrimaryImageIndex !== null && this.newPrimaryImageIndex > index) {
//       this.newPrimaryImageIndex--;
//     }
//   }

//   submit() {
//     if (this.form.valid && this.product.id) {
//       this.isSubmitting = true;

//       const productData: ProductFormData = {
//         name: this.form.value.name,
//         description: this.form.value.description,
//         priceBefore: parseFloat(this.form.value.priceBefore),
//         priceAfter: parseFloat(this.form.value.priceAfter),
//         stock_quantity: parseInt(this.form.value.stock_quantity),
//         categoryId: parseInt(this.form.value.categoryId),
//         primaryImageIndex: this.calculatePrimaryImageIndex(),
//         images: this.newImages,
//         removedImageIds: this.removedImageIds
//       };

//       console.log('Updating product:', productData);

//       this.productService.updateProductWithImages(this.product.id, productData).subscribe({
//         next: (response) => {
//           console.log('Product updated successfully:', response);
//           alert('Product updated successfully!');
//           this.productUpdated.emit();
//           this.closeModal();
//           this.isSubmitting = false;
//         },
//         error: (error) => {
//           console.error('Error updating product:', error);
//           alert('Error updating product: ' + (error.error?.message || error.message));
//           this.isSubmitting = false;
//         }
//       });
//     } else {
//       this.form.markAllAsTouched();
//     }
//   }

//   private calculatePrimaryImageIndex(): number {
//     // If a new image is set as primary
//     if (this.newPrimaryImageIndex !== null) {
//       return this.newPrimaryImageIndex;
//     }
    
//     // If a current image is primary, find its index in the combined array
//     const currentPrimaryIndex = this.currentImages.findIndex(img => img.isPrimary);
//     if (currentPrimaryIndex !== -1) {
//       return currentPrimaryIndex;
//     }
    
//     // Default to 0
//     return 0;
//   }

//   resetForm() {
//     this.loadProductData();
//     this.newImages = [];
//     this.newImagePreviews = [];
//     this.newPrimaryImageIndex = null;
//     this.removedImageIds = [];
//   }

//   closeModal() {
//     this.modalClosed.emit();
//   }
// }