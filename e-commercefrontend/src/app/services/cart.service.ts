// services/cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart } from '../models/Cart';
import { CartItem } from '../models/CartItem';
import { ProductView } from '../models/product.model';
import { OrderDto, OrderItemRequest } from '../models/Order';

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
      
      // Check if the stock is available
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

  // NEW METHOD: Convert cart to OrderDto for backend
  convertCartToOrderDto(): OrderDto {
    const cart = this.getCart();
    
    if (cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    const orderItems: OrderItemRequest[] = cart.items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      priceOfOne: item.price, // Current price from cart (should be priceAfter)
      totalPrice: item.price * item.quantity
    }));

    return {
      status: 'PENDING', // Optional, backend will set default
      totalPriceOfOrder: cart.total,
      items: orderItems
    };
  }

  // NEW METHOD: Clear cart after successful order
  clearCartAfterOrder(): void {
    this.clearCart();
  }

  // NEW METHOD: Get cart item by product ID
  getCartItem(productId: number): CartItem | undefined {
    return this.getCart().items.find(item => item.productId === productId);
  }
}