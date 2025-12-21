import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCategoryModalComponent } from './add-category-component/add-category-modal.component';
import { EditCategoryModalComponent } from './edit-category-component/edit-category-modal.component';
import { CategoryService } from '../admin-services/category.service';
import { TruncatePipe } from '../truncate.pipe';
import { Category } from '../admin-models/category.model';


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
        <div class="header-actions">
          <!-- View Toggle -->
          <div class="view-toggle">
            <button 
              class="toggle-btn" 
              [class.active]="viewMode === 'grid'"
              (click)="setViewMode('grid')"
              title="Grid View"
            >
              <span class="toggle-icon">⏹️</span>
              <span class="toggle-text">Grid</span>
            </button>
            <button 
              class="toggle-btn" 
              [class.active]="viewMode === 'table'"
              (click)="setViewMode('table')"
              title="Table View"
            >
              <span class="toggle-icon">📋</span>
              <span class="toggle-text">Table</span>
            </button>
          </div>
          
          <button class="btn-primary" (click)="showAddModal = true">
            <span class="btn-icon">+</span> Add Category
          </button>
        </div>
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

      <!-- Grid View -->
      <div *ngIf="viewMode === 'grid'" class="categories-grid">
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
                <span class="meta-text">{{ formatDate(category.created_At) }}</span>
              </span>
            </div>
          </div>

          <!-- Card Footer with Edit Button -->
          <div class="card-footer">
            <button class="btn-view" (click)="viewCategory(category)">View Details</button>
            <button class="btn-edit" (click)="openEditModal(category)">Edit Category</button>
          </div>
        </div>

        <!-- Empty State for Grid -->
        <div *ngIf="!isLoading && categories.length === 0 && viewMode === 'grid'" class="empty-state">
          <div class="empty-icon">📁</div>
          <h3>No categories found</h3>
          <p>Get started by adding your first category</p>
          <button class="btn-primary" (click)="showAddModal = true">+ Add First Category</button>
        </div>
      </div>

      <!-- Table View -->
    <div *ngIf="viewMode === 'table'" class="categories-table-container">
  <table class="categories-table">
    <thead>
      <tr>
        <th>Image</th>
        <th (click)="sortTable('name')" class="sortable">
          Name
          <span class="sort-icon" *ngIf="sortColumn === 'name'">
            {{ sortDirection === 'asc' ? '↑' : '↓' }}
          </span>
        </th>
        <th (click)="sortTable('description')" class="sortable">
          Description
          <span class="sort-icon" *ngIf="sortColumn === 'description'">
            {{ sortDirection === 'asc' ? '↑' : '↓' }}
          </span>
        </th>
        <th (click)="sortTable('isactive')" class="sortable">
          Status
          <span class="sort-icon" *ngIf="sortColumn === 'isactive'">
            {{ sortDirection === 'asc' ? '↑' : '↓' }}
          </span>
        </th>
        <th (click)="sortTable('productCount')" class="sortable">
          Products
          <span class="sort-icon" *ngIf="sortColumn === 'productCount'">
            {{ sortDirection === 'asc' ? '↑' : '↓' }}
          </span>
        </th>
        <th (click)="sortTable('created_At')" class="sortable">
          Created
          <span class="sort-icon" *ngIf="sortColumn === 'created_At'">
            {{ sortDirection === 'asc' ? '↑' : '↓' }}
          </span>
        </th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let category of sortedCategories">
        <td class="image-cell">
          <img 
            [src]="getImageUrl(category)" 
            (error)="onImageError($event)"
            class="table-image"
          />
        </td>
        <td class="name-cell">
          <strong>{{ category.name }}</strong>
        </td>
        <td class="description-cell">
          {{ category.description | truncate:50 }}
        </td>
        <td class="status-cell">
          <span [class]="category.isactive ? 'status-badge active' : 'status-badge inactive'">
            {{ category.isactive ? 'Active' : 'Inactive' }}
          </span>
        </td>
        <td class="products-cell">
          {{ category.productCount || 0 }}
        </td>
        <td class="date-cell">
          {{ formatDate(category.created_At) }}
        </td>
        <td class="actions-cell">
          <div class="table-actions">
            <button class="action-btn edit-btn" (click)="openEditModal(category)" title="Edit">
              ✏️
            </button>
            <button class="action-btn view-btn" (click)="viewCategory(category)" title="View">
              👁️
            </button>
            <button class="action-btn delete-btn" (click)="deleteCategory(category)" title="Delete">
              🗑️
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>

        <!-- Empty State for Table -->
        <div *ngIf="!isLoading && categories.length === 0 && viewMode === 'table'" class="empty-state">
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
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    
    .view-toggle {
      display: flex;
      background: #f8fafc;
      border-radius: 8px;
      padding: 4px;
      border: 1px solid #e2e8f0;
    }
    
    .toggle-btn {
      padding: 8px 16px;
      border: none;
      background: transparent;
      cursor: pointer;
      font-size: 14px;
      color: #64748b;
      display: flex;
      align-items: center;
      gap: 8px;
      border-radius: 6px;
      transition: all 0.3s ease;
    }
    
    .toggle-btn:hover {
      background: #e2e8f0;
    }
    
    .toggle-btn.active {
      background: #3b82f6;
      color: white;
    }
    
    .toggle-icon {
      font-size: 16px;
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
    .categories-table .status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
}

.categories-table .status-badge.active {
  background: #10b981;
  color: white;
}

.categories-table .status-badge.inactive {
  background: #ef4444;
  color: white;
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
    
    /* Categories Grid */
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
      margin-top: 20px;
    }
    
    /* Categories Table */
    .categories-table-container {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
      margin-top: 20px;
      overflow-x: auto;
    }
    
    .categories-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .categories-table thead {
      background: #f8fafc;
      border-bottom: 2px solid #e2e8f0;
    }
    
    .categories-table th {
      padding: 16px;
      text-align: left;
      font-weight: 600;
      color: #475569;
      font-size: 14px;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .sortable {
      cursor: pointer;
      user-select: none;
      transition: background-color 0.3s ease;
    }
    
    .sortable:hover {
      background-color: #f1f5f9;
    }
    
    .sort-icon {
      margin-left: 8px;
      font-size: 12px;
    }
    
    .categories-table tbody tr {
      border-bottom: 1px solid #f1f5f9;
      transition: background-color 0.3s ease;
    }
    
    .categories-table tbody tr:hover {
      background-color: #f8fafc;
    }
    
    .categories-table td {
      padding: 16px;
      color: #64748b;
      font-size: 14px;
      vertical-align: middle;
    }
    
    .image-cell {
      width: 60px;
    }
    
    .table-image {
      width: 40px;
      height: 40px;
      object-fit: cover;
      border-radius: 6px;
    }
    
    .name-cell {
      font-weight: 500;
      color: #2c3e50;
    }
    
    .description-cell {
      max-width: 200px;
    }
    
 .status-cell .status-badge {
  position:static;  
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
  min-width: 70px;
  text-align: center;
}
    .status-badge.active {
      background: #10b981;
      color: white;
    }
    
    .status-badge.inactive {
      background: #ef4444;
      color: white;
    }
    
    .products-cell {
      text-align: center;
      font-weight: 600;
    }
    
    .date-cell {
      white-space: nowrap;
    }
    
    .actions-cell {
      width: 150px;
    }
    
    .table-actions {
      display: flex;
      gap: 8px;
    }
    
    .table-actions .action-btn {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      transition: all 0.3s ease;
    }
    
    .table-actions .edit-btn {
      background: #3b82f6;
      color: white;
    }
    
    .table-actions .edit-btn:hover {
      background: #2563eb;
      transform: scale(1.1);
    }
    
    .table-actions .view-btn {
      background: #10b981;
      color: white;
    }
    
    .table-actions .view-btn:hover {
      background: #059669;
      transform: scale(1.1);
    }
    
    .table-actions .delete-btn {
      background: #ef4444;
      color: white;
    }
    
    .table-actions .delete-btn:hover {
      background: #dc2626;
      transform: scale(1.1);
    }
    
    /* Category Card (keep existing styles) */
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
    .status-cell .status-badge.active {
  background: #10b981;
  color: white;
}

.status-cell .status-badge.inactive {
  background: #ef4444;
  color: white;
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
      
      .header-actions {
        width: 100%;
        justify-content: space-between;
      }
      
      .stats-bar {
        justify-content: center;
      }
      
      .stat-item {
        min-width: 120px;
        padding: 16px;
      }
      
      .categories-table {
        min-width: 800px;
      }
    }
    
    @media (max-width: 480px) {
      .categories-grid {
        grid-template-columns: 1fr;
      }
      
      .card-footer {
        flex-direction: column;
      }
      
      .view-toggle {
        flex-direction: column;
      }
      
      .toggle-btn {
        justify-content: center;
      }
    }
  `]
})
export class Categories implements OnInit {
  showAddModal = false;
  showEditModal = false;
  categories: Category[] = [];
  selectedCategory: any = null;
  isLoading = false;
  viewMode: 'grid' | 'table' = 'grid'; // Added view mode
  sortColumn: string = 'name'; // Added sorting
  sortDirection: 'asc' | 'desc' = 'asc'; // Added sorting direction

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    // Try to get saved view mode from localStorage
    const savedViewMode = localStorage.getItem('categoriesViewMode');
    if (savedViewMode === 'grid' || savedViewMode === 'table') {
      this.viewMode = savedViewMode;
    }
    this.loadCategories();
  }

  setViewMode(mode: 'grid' | 'table') {
    this.viewMode = mode;
    // Save preference to localStorage
    localStorage.setItem('categoriesViewMode', mode);
  }

  loadCategories() {
    this.isLoading = true;
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        console.log('Loaded categories:', categories);
          console.log('First category:', categories[0]);
      console.log('First category isactive value:', categories[1]?.isactive);
      console.log('First category properties:', Object.keys(categories[0]));
        this.categories = categories;
        console.log('Categories set to component state:', this.categories);
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

  // get sortedCategories(): Category[] {
  //   if (!this.sortColumn) return this.categories;
    
  //   return [...this.categories].sort((a, b) => {
  //     let aValue = a[this.sortColumn];
  //     let bValue = b[this.sortColumn];
      
  //     // Handle different data types
  //     if (typeof aValue === 'string') {
  //       aValue = aValue.toLowerCase();
  //       bValue = bValue.toLowerCase();
  //     }
      
  //     if (aValue < bValue) {
  //       return this.sortDirection === 'asc' ? -1 : 1;
  //     }
  //     if (aValue > bValue) {
  //       return this.sortDirection === 'asc' ? 1 : -1;
  //     }
  //     return 0;
  //   });
  // }

  sortTable(column: string) {
    if (this.sortColumn === column) {
      // Toggle direction if same column
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // New column, default to ascending
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
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
formatDate(dateString: string | Date | undefined): string {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}
get sortedCategories(): Category[] {
  if (!this.sortColumn) return this.categories;
  
  return [...this.categories].sort((a, b) => {
    // Handle different property names for sorting
    let aValue: any;
    let bValue: any;
    
    // Map 'createdAt' to 'created_At' for sorting
    if (this.sortColumn === 'createdAt') {
      aValue = a.created_At;
      bValue = b.created_At;
    } else {
      aValue = a[this.sortColumn as keyof Category];
      bValue = b[this.sortColumn as keyof Category];
    }
    
    // Handle null/undefined values
    if (aValue == null) aValue = '';
    if (bValue == null) bValue = '';
    
    // Handle different data types
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (aValue < bValue) {
      return this.sortDirection === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return this.sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });
}
}