import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/Cart';
import { CartItem } from '../../models/CartItem';
import { Subject, takeUntil } from 'rxjs';
import { NavbarComponent } from '../nav-bar/nav-bar.component';

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

  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
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
    // Navigate to checkout page
    this.router.navigate(['/checkout']);
  }
}