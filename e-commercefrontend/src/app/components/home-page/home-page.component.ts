import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../nav-bar/nav-bar.component';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ProductView } from '../../models/product.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  imports: [FormsModule, CommonModule, NavbarComponent]
})
export class HomeComponent implements OnInit, OnDestroy {
  currentSlide: number = 0;
  private slideInterval: any;
  private destroy$ = new Subject<void>();

  // Products data - Split into two sections
  firstRowProducts: ProductView[] = [];
  secondRowProducts: ProductView[] = [];
  loading: boolean = false;

  slides = [
    {
      title: 'Latest Laptops',
      description: 'Explore high-performance laptops for work and entertainment.',
      image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=1600&h=600&fit=crop&q=80'
    },
    {
      title: 'Smart Watches Collection',
      description: 'Discover the newest collection of smartwatches and fitness trackers.',
      image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=1600&h=600&fit=crop&q=80'
    },
    {
      title: 'Premium Headphones',
      description: 'Experience superior sound quality with our premium audio collection.',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&h=600&fit=crop&q=80'
    },
    {
      title: 'Gaming Accessories',
      description: 'Upgrade your gaming setup with top-tier peripherals and gear.',
      image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1600&h=600&fit=crop&q=80'
    }
  ];

  constructor(
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.startAutoSlide();
    this.loadTopDiscountedProducts();
  }

  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTopDiscountedProducts() {
    this.loading = true;
    this.productService.getTopDiscountedProducts(20)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products) => {
          // Split products into two rows (10 each)
          this.firstRowProducts = products.slice(0, 10);
          this.secondRowProducts = products.slice(10, 20);
          this.loading = false;
          console.log('home',products);
        },
        error: (err) => {
          console.error('Error loading products:', err);
          this.loading = false;
        }
      });
  }

  startAutoSlide() {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  shopNow() {
    this.router.navigate(['/products']);
  }

  // Product helper methods
 getPrimaryImage(product: ProductView): string {
  const fallback =
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&q=80';

  if (!product.productImages || product.productImages.length === 0) {
    return fallback;
  }

  // ✅ FIX 1: correct property name
  const primaryImage =
    
    product.productImages[0];

  const imgData = primaryImage?.img;
  if (!imgData) {
    return fallback;
  }

  // ✅ already a full URL
  if (imgData.startsWith('http') || imgData.startsWith('data:image')) {
    return imgData;
  }

  // ✅ FIX 2: raw Base64 (even if it starts with /9j/)
  return `data:image/jpeg;base64,${imgData}`;
}

  getDiscountPercentage(product: ProductView): number {
    if (product.priceBefore && product.priceBefore > product.priceAfter) {
      return Math.round(((product.priceBefore - product.priceAfter) / product.priceBefore) * 100);
    }
    return 0;
  }

  addToCart(product: ProductView, event: Event) {
    event.stopPropagation();
    
    if (product.stock_quantity <= 0) {
      this.showMessage('This product is out of stock!', 'error');
      return;
    }
    
    this.cartService.addToCart(product, 1);
    this.showMessage(`${product.name} added to cart!`, 'success');
  }

  viewProduct(product: ProductView) {
    this.router.navigate(['/products', product.id]);
  }

  scrollLeft(container: HTMLElement) {
    container.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight(container: HTMLElement) {
    container.scrollBy({ left: 300, behavior: 'smooth' });
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
