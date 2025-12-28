import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { ProductView } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { NavbarComponent } from '../nav-bar/nav-bar.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  templateUrl: './product-details.html',
  styleUrls: ['./product-details.css'],
  imports: [CommonModule, NavbarComponent]
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: ProductView | null = null;
  loading: boolean = true;
  error: string = '';
  selectedImageIndex: number = 0;
  quantity: number = 1;
  isInWishlist: boolean = false;
  
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const productId = +params['id'];
      if (productId) {
        this.loadProductDetails(productId);
        this.checkWishlistStatus(productId);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProductDetails(productId: number): void {
    this.loading = true;
    this.error = '';

    this.productService.getProductById(productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: ProductView) => {
          this.product = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading product details:', err);
          this.error = 'Failed to load product details. Please try again later.';
          this.loading = false;
        }
      });
  }

  checkWishlistStatus(productId: number): void {
    this.wishlistService.isInWishlist(productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (status) => {
          this.isInWishlist = status;
        },
        error: (err) => {
          console.error('Error checking wishlist status:', err);
        }
      });
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  getImageUrl(index: number): string {
    if (!this.product?.productImages || this.product.productImages.length === 0) {
      return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop&q=80';
    }
    return `data:image/jpeg;base64,${this.product.productImages[index].img}`;
  }

  getCurrentImageUrl(): string {
    return this.getImageUrl(this.selectedImageIndex);
  }

  getDiscountPercentage(): number {
    if (!this.product) return 0;
    if (this.product.priceBefore && this.product.priceBefore > this.product.priceAfter) {
      return Math.round(((this.product.priceBefore - this.product.priceAfter) / this.product.priceBefore) * 100);
    }
    return 0;
  }

  isInStock(): boolean {
    return this.product ? this.product.stock_quantity > 0 : false;
  }

  incrementQuantity(): void {
    if (this.product && this.quantity < this.product.stock_quantity) {
      this.quantity++;
    }
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (!this.product) return;

    if (!this.isInStock()) {
      this.showMessage('This product is out of stock!', 'error');
      return;
    }

    if (this.quantity > this.product.stock_quantity) {
      this.showMessage(`Only ${this.product.stock_quantity} items available in stock.`, 'error');
      return;
    }

    this.cartService.addToCart(this.product, this.quantity);
    this.showMessage(`${this.product.name} added to cart!`, 'success');
  }

  toggleWishlist(): void {
    if (!this.product) return;

    this.wishlistService.toggleWishlist(this.product.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isInWishlist = !this.isInWishlist;
          const message = this.isInWishlist 
            ? `${this.product!.name} added to wishlist!`
            : `${this.product!.name} removed from wishlist!`;
          this.showMessage(message, 'success');
        },
        error: (err) => {
          console.error('Error toggling wishlist:', err);
          this.showMessage('Failed to update wishlist. Please try again.', 'error');
        }
      });
  }

  buyNow(): void {
    if (!this.product) return;

    if (!this.isInStock()) {
      this.showMessage('This product is out of stock!', 'error');
      return;
    }

    // Add to cart first
    this.cartService.addToCart(this.product, this.quantity);
    
    // Navigate to cart/checkout page
    this.router.navigate(['/cart']);
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  private showMessage(message: string, type: 'success' | 'error'): void {
    const existingToast = document.querySelector('.toast-message');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast-message ${type}`;
    toast.textContent = message;
    
    const bgColor = type === 'success' ? '#10b981' : '#ef4444';
    
    toast.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: ${bgColor};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      z-index: 9999;
      animation: slideIn 0.3s ease-out;
      font-weight: 500;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}