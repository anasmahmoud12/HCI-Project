import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { ProductView } from "../../models/product.model";
import { Subject, takeUntil } from 'rxjs';
import { ProductService } from "../../services/product.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NavbarComponent } from "../nav-bar/nav-bar.component";

@Component({
  selector: 'app-products',
  templateUrl: './view-products.component.html',
  styleUrls: ['./view-products.component.css'],
  imports:[CommonModule,FormsModule,NavbarComponent]
})
export class ProductsComponent implements OnInit, OnDestroy {
  @Input() categoryId: number = 1;
  
  products: ProductView[] = [];
  loading: boolean = false;
  error: string = '';
  
  private destroy$ = new Subject<void>();

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
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
    console.log('Added to cart:', product);
    // Add your cart logic here
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
  // Return the first image as base64
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