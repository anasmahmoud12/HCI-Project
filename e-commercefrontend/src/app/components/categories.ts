import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCategoryModalComponent } from './add-category-modal.component';
import { EditCategoryModalComponent } from './edit-category-modal.component'; // Import the new component
import { CategoryService } from '../services/category.service';
import { TruncatePipe } from '../truncate.pipe';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, AddCategoryModalComponent, EditCategoryModalComponent, TruncatePipe],
  template: `
    <div class="categories-page">
      
      <!-- Header -->
      <div class="page-header">
        <div class="header-left">
          <h1>Categories</h1>
          <p class="page-subtitle">Manage your product categories</p>
        </div>
        <button class="btn-primary" (click)="showAddModal = true">
          <span class="btn-icon">+</span> Add Category
        </button>
      </div>

      <!-- Stats -->
      <div class="stats-bar">
        <div class="stat-item">
          <span class="stat-number">{{ categories.length }}</span>
          <span class="stat-label">Total Categories</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ activeCategoriesCount }}</span>
          <span class="stat-label">Active</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ inactiveCategoriesCount }}</span>
          <span class="stat-label">Inactive</span>
        </div>
      </div>

      <!-- Categories Grid -->
      <div class="categories-grid">
        <div *ngFor="let category of categories" class="category-card">
          
          <div class="card-header">
            <div class="category-image">
              <img 
                [src]="getImageUrl(category)" 
                (error)="onImageError($event)" 
                class="w-24 h-24 object-cover rounded"
              />
              <span [class]="category.isactive ? 'status-badge active' : 'status-badge inactive'">
                {{ category.isactive ? 'Active' : 'Inactive' }}
              </span>
              
              <!-- Edit and Delete Buttons -->
              <div class="category-actions">
                <button class="action-btn edit-btn" (click)="openEditModal(category)" title="Edit">
                  ✏️
                </button>
                <button class="action-btn delete-btn" (click)="deleteCategory(category)" title="Delete">
                  🗑️
                </button>
              </div>
            </div>
          </div>
          
          <div class="card-body">
            <h3 class="category-name">{{ category.name }}</h3>
            <p class="category-description">{{ category.description | truncate:80 }}</p>
            <div class="category-meta">
              <span class="meta-item">
                <span class="meta-icon">📦</span>
                <span class="meta-text">{{ category.productCount || 0 }} products</span>
              </span>
              <span class="meta-item">
                <span class="meta-icon">📅</span>
                <span class="meta-text">{{ formatDate(category.createdAt) }}</span>
              </span>
            </div>
          </div>

          <!-- Card Footer with Edit Button -->
          <div class="card-footer">
            <button class="btn-view" (click)="viewCategory(category)">View Details</button>
            <button class="btn-edit" (click)="openEditModal(category)">Edit Category</button>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!isLoading && categories.length === 0" class="empty-state">
          <div class="empty-icon">📁</div>
          <h3>No categories found</h3>
          <p>Get started by adding your first category</p>
          <button class="btn-primary" (click)="showAddModal = true">+ Add First Category</button>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading categories...</p>
      </div>

      <!-- Add Category Modal -->
      <app-add-category-modal
        *ngIf="showAddModal"
        (categoryAdded)="onCategoryAdded()"
        (modalClosed)="showAddModal = false">
      </app-add-category-modal>

      <!-- Edit Category Modal -->
      <app-edit-category-modal
        *ngIf="showEditModal && selectedCategory"
        [category]="selectedCategory"
        (categoryUpdated)="onCategoryUpdated()"
        (modalClosed)="closeEditModal()">
      </app-edit-category-modal>

    </div>
  `,
  // Keep your existing styles, add these new styles:
  styles: [`
    /* ... keep all your existing styles ... */
    .categories-page {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }
    
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 30px;
      flex-wrap: wrap;
      gap: 20px;
    }
    
    .header-left h1 {
      margin: 0 0 8px 0;
      color: #2c3e50;
      font-size: 28px;
    }
    
    .page-subtitle {
      margin: 0;
      color: #7f8c8d;
      font-size: 14px;
    }
    
    .btn-primary {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
    }
    
    .btn-primary:hover {
      background: #2563eb;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
    }
    
    .btn-icon {
      font-size: 18px;
    }
    
    /* Stats Bar */
    .stats-bar {
      display: flex;
      gap: 20px;
      margin-bottom: 30px;
      flex-wrap: wrap;
    }
    
    .stat-item {
      background: white;
      border-radius: 10px;
      padding: 20px;
      min-width: 150px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: transform 0.3s ease;
    }
    
    .stat-item:hover {
      transform: translateY(-5px);
    }
    
    .stat-number {
      font-size: 32px;
      font-weight: 700;
      color: #2c3e50;
      margin-bottom: 8px;
    }
    
    .stat-label {
      font-size: 14px;
      color: #7f8c8d;
    }
    
    /* Search Bar */
    .search-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      flex-wrap: wrap;
      gap: 20px;
    }
    
    .search-input {
      position: relative;
      flex: 1;
      min-width: 300px;
    }
    
    .search-field {
      width: 100%;
      padding: 12px 16px 12px 44px;
      border: 1px solid #e0e6ed;
      border-radius: 8px;
      font-size: 14px;
      transition: all 0.3s ease;
    }
    
    .search-field:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .search-icon {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: #94a3b8;
    }
    
    .filter-buttons {
      display: flex;
      gap: 10px;
    }
    
    .filter-btn {
      padding: 10px 20px;
      border: 1px solid #e0e6ed;
      background: white;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      color: #64748b;
      transition: all 0.3s ease;
    }
    
    .filter-btn:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
    }
    
    .filter-btn.active {
      background: #3b82f6;
      color: white;
      border-color: #3b82f6;
    }
    
    /* Categories Grid */
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
      margin-top: 20px;
    }
    
    .category-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
    }
    
    .category-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }
    
    .card-header {
      position: relative;
      height: 180px;
      overflow: hidden;
    }
    
    .category-image {
      width: 100%;
      height: 100%;
      position: relative;
    }
    
    .category-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
    
    .category-card:hover .category-image img {
      transform: scale(1.05);
    }
    
    .status-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      backdrop-filter: blur(4px);
    }
    
    .status-badge.active {
      background: rgba(34, 197, 94, 0.9);
      color: white;
    }
    
    .status-badge.inactive {
      background: rgba(239, 68, 68, 0.9);
      color: white;
    }
    
    .category-actions {
      position: absolute;
      top: 12px;
      left: 12px;
      display: flex;
      gap: 8px;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .category-card:hover .category-actions {
      opacity: 1;
    }
    
    .action-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      transition: all 0.3s ease;
    }
    
    .edit-btn {
      background: rgba(59, 130, 246, 0.9);
      color: white;
    }
    
    .edit-btn:hover {
      background: #2563eb;
    }
    
    .delete-btn {
      background: rgba(239, 68, 68, 0.9);
      color: white;
    }
    
    .delete-btn:hover {
      background: #dc2626;
    }
    
    .card-body {
      padding: 20px;
      flex: 1;
    }
    
    .category-name {
      margin: 0 0 12px 0;
      font-size: 18px;
      color: #2c3e50;
      font-weight: 600;
    }
    
    .category-description {
      margin: 0 0 16px 0;
      color: #64748b;
      font-size: 14px;
      line-height: 1.5;
    }
    
    .category-meta {
      display: flex;
      justify-content: space-between;
      padding-top: 16px;
      border-top: 1px solid #f1f5f9;
    }
    
    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #64748b;
      font-size: 12px;
    }
    
    .meta-icon {
      font-size: 14px;
    }
    
    .card-footer {
      padding: 16px 20px 20px;
      border-top: 1px solid #f1f5f9;
      display: flex;
      gap: 10px;
    }
    
    .btn-view, .btn-edit {
      flex: 1;
      padding: 10px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      transition: all 0.3s ease;
    }
    
    .btn-view {
      background: #f8fafc;
      color: #475569;
    }
    
    .btn-view:hover {
      background: #e2e8f0;
    }
    
    .btn-edit {
      background: #3b82f6;
      color: white;
    }
    
    .btn-edit:hover {
      background: #2563eb;
    }
    
    /* Empty State */
    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 60px 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .empty-icon {
      font-size: 64px;
      margin-bottom: 20px;
      color: #cbd5e1;
    }
    
    .empty-state h3 {
      margin: 0 0 12px 0;
      color: #475569;
    }
    
    .empty-state p {
      margin: 0 0 24px 0;
      color: #64748b;
      max-width: 400px;
      margin: 0 auto 24px;
    }
    
    /* Loading State */
    .loading-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 60px 20px;
    }
    
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #e2e8f0;
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 16px;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .loading-state p {
      color: #64748b;
      margin: 0;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      .categories-grid {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      }
      
      .page-header {
        flex-direction: column;
      }
      
      .search-input {
        min-width: 100%;
      }
      
      .stats-bar {
        justify-content: center;
      }
      
      .stat-item {
        min-width: 120px;
        padding: 16px;
      }
    }
    
    @media (max-width: 480px) {
      .categories-grid {
        grid-template-columns: 1fr;
      }
      
      .card-footer {
        flex-direction: column;
      }
    }
    .category-actions {
      position: absolute;
      top: 12px;
      left: 12px;
      display: flex;
      gap: 8px;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .category-card:hover .category-actions {
      opacity: 1;
    }
    
    .action-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      transition: all 0.3s ease;
      backdrop-filter: blur(4px);
    }
    
    .edit-btn {
      background: rgba(59, 130, 246, 0.9);
      color: white;
    }
    
    .edit-btn:hover {
      background: #2563eb;
      transform: scale(1.1);
    }
    
    .delete-btn {
      background: rgba(239, 68, 68, 0.9);
      color: white;
    }
    
    .delete-btn:hover {
      background: #dc2626;
      transform: scale(1.1);
    }
    
    .card-footer {
      padding: 16px 20px 20px;
      border-top: 1px solid #f1f5f9;
      display: flex;
      gap: 10px;
    }
    
    .btn-view, .btn-edit {
      flex: 1;
      padding: 10px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      transition: all 0.3s ease;
    }
    
    .btn-view {
      background: #f8fafc;
      color: #475569;
    }
    
    .btn-view:hover {
      background: #e2e8f0;
    }
    
    .btn-edit {
      background: #3b82f6;
      color: white;
    }
    
    .btn-edit:hover {
      background: #2563eb;
    }
  `]
})
export class Categories implements OnInit {
  showAddModal = false;
  showEditModal = false;
  categories: any[] = [];
  selectedCategory: any = null;
  isLoading = false;

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.isLoading = true;
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.isLoading = false;
      }
    });
  }

  get activeCategoriesCount(): number {
    return this.categories.filter(c => c.isactive).length;
  }

  get inactiveCategoriesCount(): number {
    return this.categories.filter(c => !c.isactive).length;
  }

  onCategoryAdded() {
    this.loadCategories();
  }

  onCategoryUpdated() {
    this.loadCategories();
  }

  openEditModal(category: any) {
    this.selectedCategory = category;
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedCategory = null;
  }

  viewCategory(category: any) {
    // You can implement view functionality here
    console.log('View category:', category);
    alert(`Viewing category: ${category.name}\n\nDescription: ${category.description}`);
  }

  deleteCategory(category: any) {
    if (confirm(`Are you sure you want to delete "${category.name}"?\nThis action cannot be undone.`)) {
      this.categoryService.deleteCategory(category.id).subscribe({
        next: () => {
          this.loadCategories();
          alert(`Category "${category.name}" deleted successfully!`);
        },
        error: (error) => {
          console.error('Error deleting category:', error);
          alert('Error deleting category. Please try again.');
        }
      });
    }
  }

  getImageUrl(category: any): string {
    if (!category.img || category.img === '') {
      return 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
          <rect width="100" height="100" fill="#f3f4f6"/>
          <text x="50" y="50" font-family="Arial" font-size="14" fill="#6b7280" text-anchor="middle" dy=".3em">
            ${category.name ? category.name.charAt(0).toUpperCase() : 'N'}
          </text>
        </svg>
      `);
    }
    return `data:image/jpeg;base64,${category.img}`;
  }

  onImageError(event: any) {
    event.target.src = "assets/placeholder-category.png";
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
}