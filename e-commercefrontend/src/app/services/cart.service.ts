import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart } from '../models/Cart';
import { CartItem } from '../models/CartItem';
import { ProductView } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<Cart>(this.getInitialCart());
  public cart$: Observable<Cart> = this.cartSubject.asObservable();

  constructor() {
    // Load cart from localStorage on service initialization
    this.loadCartFromStorage();
  }

  private getInitialCart(): Cart {
    return {
      items: [],
      totalItems: 0,
      subtotal: 0,
      total: 0
    };
  }

  private loadCartFromStorage(): void {
    const savedCart = localStorage.getItem('shopping_cart');
    if (savedCart) {
      try {
        const cart: Cart = JSON.parse(savedCart);
        this.cartSubject.next(cart);
      } catch (error) {
        console.error('Error loading cart from storage:', error);
      }
    }
  }

  private saveCartToStorage(cart: Cart): void {
    localStorage.setItem('shopping_cart', JSON.stringify(cart));
  }

  private calculateCart(items: CartItem[]): Cart {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    return {
      items,
      totalItems,
      subtotal,
      total: subtotal // You can add tax/shipping calculations here
    };
  }

  getCart(): Cart {
    return this.cartSubject.value;
  }

  addToCart(product: ProductView, quantity: number = 1): void {
    const currentCart = this.getCart();
    const existingItemIndex = currentCart.items.findIndex(item => item.productId === product.id);

    let updatedItems: CartItem[];

    if (existingItemIndex > -1) {
      // Product already in cart, update quantity
      updatedItems = [...currentCart.items];
      const newQuantity = updatedItems[existingItemIndex].quantity + quantity;
      
      // Check if new quantity exceeds stock
      if (newQuantity > product.stock_quantity) {
        alert(`Cannot add more items. Only ${product.stock_quantity} available in stock.`);
        return;
      }
      
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: newQuantity
      };
    } else {
      // New product, add to cart
      if (quantity > product.stock_quantity) {
        alert(`Cannot add ${quantity} items. Only ${product.stock_quantity} available in stock.`);
        return;
      }

      const newItem: CartItem = {
        productId: product.id!,
        productName: product.name,
        productImage: product.productImages && product.productImages.length > 0 
          ? `data:image/jpeg;base64,${product.productImages[0].img}`
          : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&q=80',
        price: product.priceAfter,
        quantity: quantity,
        stockAvailable: product.stock_quantity
      };

      updatedItems = [...currentCart.items, newItem];
    }

    const updatedCart = this.calculateCart(updatedItems);
    this.cartSubject.next(updatedCart);
    this.saveCartToStorage(updatedCart);
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity < 1) {
      this.removeFromCart(productId);
      return;
    }

    const currentCart = this.getCart();
    const itemIndex = currentCart.items.findIndex(item => item.productId === productId);

    if (itemIndex > -1) {
      const item = currentCart.items[itemIndex];
      
      //check if the stock is  availabile
      if (quantity > item.stockAvailable) {
        alert(`Cannot add more items. Only ${item.stockAvailable} available in stock.`);
        return;
      }

      const updatedItems = [...currentCart.items];
      updatedItems[itemIndex] = { ...item, quantity };

      const updatedCart = this.calculateCart(updatedItems);
      this.cartSubject.next(updatedCart);
      this.saveCartToStorage(updatedCart);
    }
  }

  removeFromCart(productId: number): void {
    const currentCart = this.getCart();
    const updatedItems = currentCart.items.filter(item => item.productId !== productId);
    
    const updatedCart = this.calculateCart(updatedItems);
    this.cartSubject.next(updatedCart);
    this.saveCartToStorage(updatedCart);
  }

  clearCart(): void {
    const emptyCart = this.getInitialCart();
    this.cartSubject.next(emptyCart);
    this.saveCartToStorage(emptyCart);
  }

  getItemCount(): number {
    return this.getCart().totalItems;
  }
}