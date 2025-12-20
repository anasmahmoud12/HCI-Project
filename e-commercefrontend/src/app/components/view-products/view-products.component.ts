import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { ProductView } from "../../models/product.model";
import { Subject, takeUntil } from 'rxjs';
import { ProductService } from "../../services/product.service";
import { CartService } from "../../services/cart.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NavbarComponent } from "../nav-bar/nav-bar.component";

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
  loading: boolean = false;
  error: string = '';
  
  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Listen to route parameter changes
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.categoryId = params['categoryId'] ? +params['categoryId'] : 0;
      this.loadProducts();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts() {
    this.loading = true;
    this.error = '';

    console.log(this.categoryId);
    const request = this.categoryId === 0 
      ? this.productService.getAllProducts()
      : this.productService.getProductsByCategory(this.categoryId);

    request.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: any) => {
        console.log('Products received:', data);
        this.products = data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.error = 'Failed to load products. Please try again later.';
        this.loading = false;
      }
    });
  }

  addToCart(product: ProductView) {
    if (product.stock_quantity <= 0) {
      alert('This product is out of stock!');
      return;
    }
    
    this.cartService.addToCart(product, 1);
    
    // Show success message
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
    // Add your wishlist logic here
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
      return Math.round(((product.priceBefore - product.priceAfter) / product.priceAfter) * 100);
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