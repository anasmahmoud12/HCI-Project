import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddProductModalComponent } from './add-product-component/add-product-modal.component';
import { EditProductModalComponent } from './edit-product-component/edit-product-modal.component';
import { ProductService } from '../admin-services/product.service';
import { CategoryService } from '../admin-services/category.service';
import { TruncatePipe } from '../truncate.pipe';
import { Product } from '../admin-models/product.model';
import { OrderService } from '../admin-services/order.service';
import { Order } from '../admin-models/order.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, AddProductModalComponent, EditProductModalComponent, TruncatePipe],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class Products implements OnInit {
  showAddModal = false;
  showEditModal = false;
  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedProduct: Product | null = null;
  isLoading = false;
  searchQuery = '';
  filterStatus: 'all' | 'inStock' | 'lowStock' = 'all';
  viewMode: 'grid' | 'table' = 'grid';
  sortColumn: string = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  categories: any[] = []; // Store categories separately

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    const savedViewMode = localStorage.getItem('productsViewMode');
    if (savedViewMode === 'grid' || savedViewMode === 'table') {
      this.viewMode = savedViewMode;
    }
    this.loadCategoriesAndProducts();
  }

  loadCategoriesAndProducts() {
    this.isLoading = true;
    
    // Load categories first
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        console.log('Categories loaded:', this.categories);
        
        // Then load products
        this.productService.getProducts().subscribe({
          next: (products) => {
            this.products = this.enrichProductsWithCategory(products);
            console.log('Products after enrichment:', this.products);
            this.filterProducts();
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error loading products:', error);
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        // Try to load products anyway
        this.loadProducts();
      }
    });
  }

  loadProducts() {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = this.enrichProductsWithCategory(products);
        console.log('Products loaded:', this.products);
        this.filterProducts();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading = false;
      }
    });
  }

  // Enrich products with category information
  enrichProductsWithCategory(products: any[]): Product[] {
    return products.map(product => {
      // If product already has category object, return as is
      if (product.category) {
        return product;
      }
      
      // If product has categoryId, find the category in our categories array
      if (product.categoryId && this.categories.length > 0) {
        const category = this.categories.find(cat => cat.id === product.categoryId);
        return {
          ...product,
          category: category ? { id: category.id, name: category.name } : undefined
        };
      }
      
      // Try to find categoryId in the product data
      const catId = product.categoryId || product.categoryid;
      if (catId && this.categories.length > 0) {
        const category = this.categories.find(cat => cat.id === catId);
        return {
          ...product,
          category: category ? { id: category.id, name: category.name } : undefined
        };
      }
      
      return product;
    });
  }

  setViewMode(mode: 'grid' | 'table') {
    this.viewMode = mode;
    localStorage.setItem('productsViewMode', mode);
  }

  filterProducts() {
    let filtered = this.products;
    
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(product => {
        const categoryName = product.category?.name?.toLowerCase() || '';
        return product.name.toLowerCase().includes(query) ||
               product.description.toLowerCase().includes(query) ||
               categoryName.includes(query);
      });
    }
    
    switch (this.filterStatus) {
      case 'inStock':
        filtered = filtered.filter(p => p.stock_quantity > 10);
        break;
      case 'lowStock':
        filtered = filtered.filter(p => p.stock_quantity > 0 && p.stock_quantity <= 10);
        break;
      default:
        break;
    }
    
    this.filteredProducts = filtered;
  }

  get sortedProducts(): Product[] {
    if (!this.sortColumn) return this.filteredProducts;
    
    return [...this.filteredProducts].sort((a, b) => {
      let aValue: any;
      let bValue: any;
      
      // Handle category sorting
      if (this.sortColumn === 'category') {
        aValue = a.category?.name || '';
        bValue = b.category?.name || '';
      } else {
        aValue = a[this.sortColumn as keyof Product];
        bValue = b[this.sortColumn as keyof Product];
      }
      
      // Handle different data types
      if (typeof aValue === 'string') {
        aValue = aValue.toString().toLowerCase();
        bValue = bValue.toString().toLowerCase();
      } else if (typeof aValue === 'number') {
        // Keep as numbers for numeric comparison
        aValue = aValue as number;
        bValue = bValue as number;
      } else if (aValue === null || aValue === undefined) {
        aValue = '';
      }
      if (bValue === null || bValue === undefined) {
        bValue = '';
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

  sortTable(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  setFilter(status: 'all' | 'inStock' | 'lowStock') {
    this.filterStatus = status;
    this.filterProducts();
  }

  getCategoryName(product: Product): string {
    return product.category?.name || 'No category';
  }

  getCategoryById(categoryId: number): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category?.name || `Category ${categoryId}`;
  }

  get lowStockCount(): number {
    return this.products.filter(p => p.stock_quantity > 0 && p.stock_quantity <= 10).length;
  }

  get activeProductsCount(): number {
    return this.products.filter(p => p.stock_quantity > 0).length;
  }

  getPrimaryImage(product: Product): string {
    if (!product.productImages || product.productImages.length === 0) {
      return this.getDefaultImage(product?.name || 'Product');
    }
    
    const primaryImage = product.productImages.find((img: any) => img.is_primary) || product.productImages[0];
    
    if (!primaryImage || !primaryImage.img) {
      return this.getDefaultImage(product?.name || 'Product');
    }
    
    const cleanImg = primaryImage.img.trim();
    return `data:image/jpeg;base64,${cleanImg}`;
  }

  getDefaultImage(productName: string): string {
    const initial = productName.charAt(0).toUpperCase();
    return 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#f3f4f6"/>
        <text x="200" y="150" font-family="Arial" font-size="32" fill="#6b7280" 
              text-anchor="middle" dy=".3em" font-weight="bold">
          ${initial}
        </text>
        <text x="200" y="180" font-family="Arial" font-size="14" fill="#9ca3af" 
              text-anchor="middle">
          No Image
        </text>
      </svg>
    `);
  }

  getStockStatus(product: Product): string {
    if (product.stock_quantity === 0) return 'Out of Stock';
    if (product.stock_quantity <= 10) return 'Low Stock';
    return 'In Stock';
  }

  getStockStatusClass(product: Product): string {
    if (product.stock_quantity === 0) return 'stock-out';
    if (product.stock_quantity <= 10) return 'stock-low';
    return 'stock-in';
  }

  getDiscountPercentage(product: Product): number {
    if (product.priceBefore <= product.priceAfter) return 0;
    const discount = ((product.priceBefore - product.priceAfter) / product.priceBefore) * 100;
    return Math.round(discount);
  }

  onImageError(event: any) {
    const element = event.target;
    const productName = element.getAttribute('alt') || 'Product';
    element.src = this.getDefaultImage(productName);
    element.onerror = null;
  }

  onProductAdded() {
    this.loadCategoriesAndProducts();
  }

  onProductUpdated() {
    this.loadCategoriesAndProducts();
  }

  openEditModal(product: Product) {
    this.selectedProduct = product;
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedProduct = null;
  }

  viewProductDetails(product: Product) {
    const categoryName = this.getCategoryName(product);
    alert(`Viewing: ${product.name}\n\nPrice: $${product.priceAfter}\nStock: ${product.stock_quantity}\nCategory: ${categoryName}`);
  }

  deleteProduct(product: Product) {
    if (confirm(`Are you sure you want to delete "${product.name}"?\nThis will permanently delete the product and all its images.`)) {
      this.isLoading = true;
      this.productService.deleteProduct(product.id!).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== product.id);
          this.filterProducts();
          this.isLoading = false;
          alert(`Product "${product.name}" deleted successfully!`);
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          this.isLoading = false;
          alert('Error deleting product. Please try again.');
        }
      });
    }
  }
}