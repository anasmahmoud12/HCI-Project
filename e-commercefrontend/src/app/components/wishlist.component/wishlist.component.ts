import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { WishlistItem } from '../../models/wishlist';
import { NavbarComponent } from '../nav-bar/nav-bar.component';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, DatePipe], // Add DatePipe and RouterModule
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit, OnDestroy {
  wishlistItems: WishlistItem[] = [];
  loading: boolean = false;
  
  private destroy$ = new Subject<void>();

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.loadWishlist();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadWishlist() {
    this.loading = true;
    this.wishlistService.getUserWishlist()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (items) => {
          this.wishlistItems = items;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading wishlist:', err);
          this.loading = false;
          // If service fails, load from localStorage as fallback
          this.loadFromLocalStorage();
        }
      });
  }

  loadFromLocalStorage() {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      this.wishlistItems = JSON.parse(savedWishlist);
    }
  }

  removeFromWishlist(productId: number) {
    if (this.wishlistService.removeFromWishlist) {
      this.wishlistService.removeFromWishlist(productId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.showMessage('Item removed from wishlist', 'info');
            this.loadWishlist();
          },
          error: (err) => {
            console.error('Error removing from wishlist:', err);
            // Fallback: remove from local storage
            this.removeFromLocalStorage(productId);
          }
        });
    } else {
      // Fallback if service method doesn't exist
      this.removeFromLocalStorage(productId);
    }
  }

  removeFromLocalStorage(productId: number) {
    this.wishlistItems = this.wishlistItems.filter(item => item.product.id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(this.wishlistItems));
    this.showMessage('Item removed from wishlist', 'info');
  }

  addToCart(item: WishlistItem) {
    if (item.product.stock_quantity <= 0) {
      this.showMessage('This product is out of stock!', 'error');
      return;
    }
    
    // Check if cartService has addToCart method
    if (this.cartService.addToCart) {
      this.cartService.addToCart(item.product, 1);
    } else {
      // Fallback: save to localStorage
      const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
      cartItems.push({...item.product, quantity: 1});
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
    
    this.showMessage(`${item.product.name} added to cart!`, 'success');
  }

  getPrimaryImage(item: WishlistItem): string {
    // 1. Safety Check: If no images array exists, return fallback
    if (!item.product.productImages || item.product.productImages.length === 0) {
      return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&q=80';
    }
    
    const image = item.product.productImages[0];
    const imgData = image.img;

    // 2. Safety Check: If image data is null/undefined
    if (!imgData) {
      return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&q=80';
    }

    // 3. If it's a web URL (http/https) or local path, return as is
    if (imgData.startsWith('http') || imgData.startsWith('/')) {
      return imgData;
    }

    // 4. If it already has the Base64 prefix, return as is
    if (imgData.startsWith('data:image')) {
      return imgData;
    }

    // 5. Default: It's a raw Base64 string from the DB, so add the prefix
    return `data:image/jpeg;base64,${imgData}`;
  }
  getDiscountPercentage(item: WishlistItem): number {
    const product = item.product;
    if (product.priceBefore && product.priceBefore > product.priceAfter) {
      return Math.round(((product.priceBefore - product.priceAfter) / product.priceBefore) * 100);
    }
    return 0;
  }

  private showMessage(message: string, type: 'success' | 'info' | 'error' = 'success') {
    const existingToast = document.querySelector('.toast-message');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast-message';
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
    }, 2500);
  }
}