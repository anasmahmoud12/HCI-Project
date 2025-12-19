// components/cart/cart.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/Cart';
import { CartItem } from '../../models/CartItem';

import { Subject, takeUntil } from 'rxjs';
import { NavbarComponent } from '../nav-bar/nav-bar.component';
import { OrderService } from '../../services/OrderService';
import { UserService } from '../../services/UserService';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  cart: Cart = {
    items: [],
    totalItems: 0,
    subtotal: 0,
    total: 0
  };

  isPlacingOrder = false;
  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartService.cart$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cart => {
        this.cart = cart;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateQuantity(item: CartItem, change: number) {
    const newQuantity = item.quantity + change;
    if (newQuantity < 1) {
      return;
    }
    this.cartService.updateQuantity(item.productId, newQuantity);
  }

  setQuantity(item: CartItem, quantity: number) {
    if (quantity < 1 || isNaN(quantity)) {
      return;
    }
    this.cartService.updateQuantity(item.productId, quantity);
  }

  removeItem(item: CartItem) {
    if (confirm(`Remove ${item.productName} from cart?`)) {
      this.cartService.removeFromCart(item.productId);
    }
  }

  clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartService.clearCart();
    }
  }

  continueShopping() {
    this.router.navigate(['/products']);
  }

  proceedToCheckout() {
    if (this.cart.items.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    // Check if user is logged in
    if (!this.userService.isLoggedIn()) {
      alert('Please login to place an order');
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/cart' } });
      return;
    }

    if (!confirm('Are you sure you want to place this order?')) {
      return;
    }

    this.isPlacingOrder = true;

    try {
      // Convert cart to OrderDto
      const orderDto = this.cartService.convertCartToOrderDto();
      console.log('Sending order to backend:', orderDto);
      
      // Send to backend
      this.orderService.placeOrder(orderDto).subscribe({
        next: (orderResponse) => {
          this.isPlacingOrder = false;
          console.log('Order placed successfully:', orderResponse);
          
          // Clear cart after successful order
          this.cartService.clearCartAfterOrder();
          
          // Show success message
          alert(`✅ Order placed successfully!\nOrder #: ${orderResponse.orderNumber}\nTotal: $${orderResponse.totalPrice.toFixed(2)}`);
          
          // Navigate to order confirmation or home page
          this.router.navigate(['/order-confirmation', orderResponse.id]);
        },
        error: (error) => {
          this.isPlacingOrder = false;
          console.error('Error placing order:', error);
          
          if (error.status === 400) {
            // Handle specific errors from backend (e.g., insufficient stock)
            const errorMessage = error.error || 'Unknown error';
            alert(`❌ Order failed: ${errorMessage}`);
            
            // If stock error, refresh cart from backend
            if (errorMessage.includes('stock') || errorMessage.includes('Stock')) {
              // Optionally refresh product data or show specific message
              alert('Some items in your cart may be out of stock. Please update your cart.');
            }
          } else if (error.status === 401) {
            alert('❌ Please login to place an order');
            this.router.navigate(['/login']);
          } else if (error.status === 403) {
            alert('❌ You are not authorized to place an order');
          } else if (error.status === 404) {
            alert('❌ Product not found. Please update your cart.');
          } else {
            alert('❌ Failed to place order. Please try again.');
          }
        }
      });
    } catch (error: any) {
      this.isPlacingOrder = false;
      console.error('Error creating order:', error);
      alert(error.message || '❌ Failed to create order. Please try again.');
    }
  }

  // Calculate item total
  calculateItemTotal(item: CartItem): number {
    return item.price * item.quantity;
  }
}