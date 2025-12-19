import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { ProductView } from "../../models/product.model";
import { Subject, takeUntil } from 'rxjs';
import { ProductService } from "../../services/product.service";
import { CartService } from "../../services/cart.service";
import { WishlistService } from "../../services/wishlist.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NavbarComponent } from "../nav-bar/nav-bar.component";

@Component({
  selector: 'app-products',
  templateUrl: './view-products.component.html',
  styleUrls: ['./view-products.component.css'],
  imports:[CommonModule, FormsModule, NavbarComponent]
})
export class ProductsComponent implements OnInit, OnDestroy {
  @Input() categoryId: number = 0;
  
  products: ProductView[] = [];
  loading: boolean = false;
  error: string = '';
  wishlistStatus: Map<number, boolean> = new Map();
  
  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadWishlistStatus();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts() {
    this.loading = true;
    this.error = '';

    const request = this.categoryId === 0 
      ? this.productService.getAllProducts()
      : this.productService.getProductsByCategory(this.categoryId);

    request.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: any) => {
        console.log('Products received:', data);
        this.products = data || [];
        this.loading = false;
        this.checkWishlistStatus();
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.error = 'Failed to load products. Please try again later.';
        this.loading = false;
      }
    });
  }

  loadWishlistStatus() {
    this.wishlistService.wishlist$
      .pipe(takeUntil(this.destroy$))
      .subscribe(wishlist => {
        this.wishlistStatus.clear();
        wishlist.forEach(item => {
          this.wishlistStatus.set(item.product.id, true);
        });
      });
  }

  checkWishlistStatus() {
    this.products.forEach(product => {
      this.wishlistService.isInWishlist(product.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (isInWishlist) => {
            this.wishlistStatus.set(product.id, isInWishlist);
          },
          error: () => {
            this.wishlistStatus.set(product.id, false);
          }
        });
    });
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistStatus.get(productId) || false;
  }

  addToCart(product: ProductView) {
    if (product.stock_quantity <= 0) {
      alert('This product is out of stock!');
      return;
    }
    
    this.cartService.addToCart(product, 1);
    this.showSuccessMessage(`${product.name} added to cart!`);
  }

  toggleWishlist(product: ProductView, event: Event) {
    event.stopPropagation();
    
    this.wishlistService.toggleWishlist(product.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          const isAdded = response.action === 'added';
          this.wishlistStatus.set(product.id, isAdded);
          
          if (isAdded) {
            this.showSuccessMessage(`${product.name} added to wishlist!`, 'success');
          } else {
            this.showSuccessMessage(`${product.name} removed from wishlist!`, 'info');
          }
        },
        error: (err) => {
          console.error('Error toggling wishlist:', err);
          this.showSuccessMessage('Failed to update wishlist', 'error');
        }
      });
  }

  private showSuccessMessage(message: string, type: 'success' | 'info' | 'error' = 'success') {
    const existingToast = document.querySelector('.success-toast');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'success-toast';
    toast.textContent = message;
    
    const bgColors = {
      success: '#10b981',
      info: '#3b82f6',
      error: '#ef4444'
    };
    
    toast.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: ${bgColors[type]};
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

  getPrimaryImage(product: ProductView): string {
    if (!product.productImages || product.productImages.length === 0) {
      console.log('No images found, using fallback');
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
}