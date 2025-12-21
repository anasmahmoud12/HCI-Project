import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { ProductView } from "../../models/product.model";
import { Subject, takeUntil } from 'rxjs';
import { ProductService } from "../../services/product.service";
import { CartService } from "../../services/cart.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NavbarComponent } from "../nav-bar/nav-bar.component";
import { SearchService } from "../../services/SearchService";

@Component({
  selector: 'app-products',
  standalone: true,
  templateUrl: './view-products.component.html',
  styleUrls: ['./view-products.component.css'],
  imports: [CommonModule, FormsModule, NavbarComponent]
})
export class ProductsComponent implements OnInit, OnDestroy {
  categoryId: number = 0;
  
  products: ProductView[] = [];
  allProducts: ProductView[] = [];
  loading: boolean = false;
  error: string = '';
  currentSearchQuery: string = '';
  
  // Sort and Filter
  showSortModal: boolean = false;
  showFilterModal: boolean = false;
  currentSortBy: string = 'date';
  sortOptions = [
    { value: 'date', label: 'Date (Newest First)' },
    { value: 'price', label: 'Price (Low to High)' },
    { value: 'discount', label: 'Discount (High to Low)' }
  ];
  
  // Filter options
  filterOptions = {
    minPrice: 0,
    maxPrice: 20000,
    productName: '',
    description: '',
    includeOutOfStock: true,
    brand: '',
    minDiscount: 0,
    maxDiscount: 100,
    category: ''
  };
  
  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private searchService: SearchService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.categoryId = params['categoryId'] ? +params['categoryId'] : 0;
      this.currentSearchQuery = '';
      this.currentSortBy = 'date';
      this.loadProducts();
    });

    this.searchService.searchQuery$
      .pipe(takeUntil(this.destroy$))
      .subscribe(query => {
        this.currentSearchQuery = query;
        this.performSearch(query);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts() {
    this.loading = true;
    this.error = '';

    console.log('Loading products - Category:', this.categoryId, 'Sort:', this.currentSortBy);

    let request;
    
    if (this.currentSortBy === 'date') {
      request = this.categoryId === 0 
        ? this.productService.getAllProducts()
        : this.productService.getProductsByCategory(this.categoryId);
    } else {
      request = this.categoryId === 0 
        ? this.productService.getAllProductsSorted(this.currentSortBy)
        : this.productService.getProductsByCategorySorted(this.categoryId, this.currentSortBy);
    }

    request.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: any) => {
        console.log('Products loaded successfully:', data?.length || 0, 'products');
        this.allProducts = data || [];
        this.products = this.allProducts;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.error = 'Failed to load products. Please try again later.';
        this.loading = false;
      }
    });
  }

  performSearch(query: string) {
    if (!query || query.trim() === '') {
      this.products = this.allProducts;
      return;
    }

    this.loading = true;
    this.error = '';

    const searchRequest = this.categoryId === 0
      ? this.searchService.searchProducts(query)
      : this.searchService.searchProductsByCategory(query, this.categoryId);

    searchRequest.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: ProductView[]) => {
        console.log('Search results:', data);
        this.products = data || [];
        this.loading = false;
        
        if (this.products.length === 0) {
          this.error = `No products found for "${query}"`;
        }
      },
      error: (err) => {
        console.error('Error searching products:', err);
        this.error = 'Failed to search products. Please try again later.';
        this.loading = false;
      }
    });
  }

  toggleSortModal() {
    this.showSortModal = !this.showSortModal;
    if (this.showSortModal) {
      this.showFilterModal = false;
    }
  }

  closeSortModal() {
    this.showSortModal = false;
  }

  applySorting(sortBy: string) {
    console.log('Applying sort:', sortBy);
    this.currentSortBy = sortBy;
    this.closeSortModal();
    this.loadProducts();
  }

  getSortLabel(sortBy: string): string {
    const option = this.sortOptions.find(opt => opt.value === sortBy);
    return option ? option.label : 'Date';
  }

  toggleFilterModal() {
    this.showFilterModal = !this.showFilterModal;
    if (this.showFilterModal) {
      this.showSortModal = false;
    }
  }

  closeFilterModal() {
    this.showFilterModal = false;
  }

  applyFilters() {
    console.log('Filters to be applied:', this.filterOptions);
    this.closeFilterModal();
    alert('Filter functionality will be implemented in the backend soon!');
  }

  resetFilters() {
    this.filterOptions = {
      minPrice: 0,
      maxPrice: 20000,
      productName: '',
      description: '',
      includeOutOfStock: true,
      brand: '',
      minDiscount: 0,
      maxDiscount: 100,
      category: ''
    };
  }

  addToCart(product: ProductView) {
    if (product.stock_quantity <= 0) {
      alert('This product is out of stock!');
      return;
    }
    
    this.cartService.addToCart(product, 1);
    this.showSuccessMessage(`${product.name} added to cart!`);
  }

  private showSuccessMessage(message: string) {
    const existingToast = document.querySelector('.success-toast');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'success-toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      z-index: 9999;
      animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }

  addToWishlist(product: ProductView) {
    console.log('Added to wishlist:', product);
  }

  getPrimaryImage(product: ProductView): string {
    if (!product.productImages || product.productImages.length === 0) {
      return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&q=80';
    }
    return `data:image/jpeg;base64,${product.productImages[0].img}`;
  }

  getDiscountPercentage(product: ProductView): number {
    if (product.priceBefore && product.priceBefore > product.priceAfter) {
      return Math.round(((product.priceBefore - product.priceAfter) / product.priceBefore) * 100);
    }
    return 0;
  }

  isInStock(product: ProductView): boolean {
    return product.stock_quantity > 0;
  }

  goBackToCategories() {
    this.router.navigate(['/categories']);
  }
}