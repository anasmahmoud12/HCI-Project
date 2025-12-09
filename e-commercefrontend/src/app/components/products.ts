import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddProductModalComponent } from './add-product-modal.component';
import { EditProductModalComponent } from './edit-product-modal.component';
import { ProductService } from '../services/product.service';
import { CategoryService } from '../services/category.service';
import { TruncatePipe } from '../truncate.pipe';

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
  products: any[] = [];
  filteredProducts: any[] = [];
  selectedProduct: any = null;
  isLoading = false;
  searchQuery = '';
  filterStatus: 'all' | 'inStock' | 'lowStock' = 'all';

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.loadProducts();
    console.log('Error loading products:');
  }

  loadProducts() {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filterProducts();
        console.log('Error loading products:');
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading = false;
      }
    });
  }

  filterProducts() {
    let filtered = this.products;
    
    // Apply search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        (product.category?.name && product.category.name.toLowerCase().includes(query))
      );
    }
    
    // Apply stock filter
    switch (this.filterStatus) {
      case 'inStock':
        filtered = filtered.filter(p => p.stock_quantity > 10);
        break;
      case 'lowStock':
        filtered = filtered.filter(p => p.stock_quantity > 0 && p.stock_quantity <= 10);
        break;
      default:
        // 'all' - no filter
        break;
    }
    
    this.filteredProducts = filtered;
  }

  setFilter(status: 'all' | 'inStock' | 'lowStock') {
    this.filterStatus = status;
    this.filterProducts();
  }

  get lowStockCount(): number {
    return this.products.filter(p => p.stock_quantity > 0 && p.stock_quantity <= 10).length;
  }

  get activeProductsCount(): number {
    return this.products.filter(p => p.stock_quantity > 0).length;
  }

  getPrimaryImage(product: any): string {
    console.log('Product object:', product);
  console.log('Product name:', product?.name);
  console.log('Product Images:', product?.productImages);
  
    if (!product.productImages || product.productImages.length === 0) {
      return this.getDefaultImage(product?.name || 'Product');
    }
    
  const primaryImage = product.productImages.find((img: any) => img.is_primary) || product.productImages[0];
    
    // Validate the image has img property
     if (!primaryImage || !primaryImage.img) {
    return this.getDefaultImage(product?.name || 'Product');
  }
    
    // Clean up the image data
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

  getStockStatus(product: any): string {
    if (product.stock_quantity === 0) return 'Out of Stock';
    if (product.stock_quantity <= 10) return 'Low Stock';
    return 'In Stock';
  }

  getStockStatusClass(product: any): string {
    if (product.stock_quantity === 0) return 'stock-out';
    if (product.stock_quantity <= 10) return 'stock-low';
    return 'stock-in';
  }

  getDiscountPercentage(product: any): number {
    if (product.priceBefore <= product.priceAfter) return 0;
    const discount = ((product.priceBefore - product.priceAfter) / product.priceBefore) * 100;
    return Math.round(discount);
  }

  onImageError(event: any) {
    const productCard = event.target.closest('.product-card');
    const productName = productCard?.querySelector('.product-name')?.textContent || 'Product';
    
    event.target.src = this.getDefaultImage(productName);
    event.target.onerror = null;
  }

  onProductAdded() {
    this.loadProducts();
  }

  onProductUpdated() {
    this.loadProducts();
  }

  openEditModal(product: any) {
    this.selectedProduct = product;
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedProduct = null;
  }

  viewProductDetails(product: any) {
    alert(`Viewing: ${product.name}\n\nPrice: $${product.priceAfter}\nStock: ${product.stock_quantity}\nCategory: ${product.category?.name}`);
  }

  deleteProduct(product: any) {
    if (confirm(`Are you sure you want to delete "${product.name}"?\nThis will permanently delete the product and all its images.`)) {
      this.isLoading = true;
      this.productService.deleteProduct(product.id).subscribe({
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