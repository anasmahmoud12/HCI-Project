// services/OrderService.ts - SIMPLIFIED FOR TESTING (No Auth)
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { OrderDto, OrderResponse } from '../models/Order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'http://localhost:8080/api/orders';
  
  // HARDCODED USER ID FOR TESTING
  private testUserId = 1;

  constructor(private http: HttpClient) {}

  // Place a new order
  placeOrder(orderDto: OrderDto): Observable<OrderResponse> {
    console.log('🔵 Placing order for user:', this.testUserId);
    console.log('🔵 Request URL:', `${this.baseUrl}/${this.testUserId}`);
    console.log('🔵 Order data:', orderDto);
    
    return this.http.post<OrderResponse>(
      `${this.baseUrl}/${this.testUserId}`,
      orderDto
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Get all orders for current user
  getMyOrders(): Observable<OrderResponse[]> {
    console.log('🔵 Fetching orders for user:', this.testUserId);
    console.log('🔵 Request URL:', `${this.baseUrl}/user/${this.testUserId}`);
    
    return this.http.get<OrderResponse[]>(
      `${this.baseUrl}/user/${this.testUserId}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Get specific order
  getOrderById(orderId: number): Observable<OrderResponse> {
    console.log('🔵 Fetching order:', orderId, 'for user:', this.testUserId);
    console.log('🔵 Request URL:', `${this.baseUrl}/${orderId}/user/${this.testUserId}`);
    
    return this.http.get<OrderResponse>(
      `${this.baseUrl}/${orderId}/user/${this.testUserId}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Cancel an order
  cancelOrder(orderId: number): Observable<OrderResponse> {
    console.log('🔵 Cancelling order:', orderId);
    console.log('🔵 Request URL:', `${this.baseUrl}/${orderId}/cancel/user/${this.testUserId}`);
    
    return this.http.put<OrderResponse>(
      `${this.baseUrl}/${orderId}/cancel/user/${this.testUserId}`,
      {}
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Set test user ID (optional - for testing different users)
  setTestUserId(userId: number): void {
    this.testUserId = userId;
    console.log('✅ Test user ID set to:', userId);
  }

  // Error handling
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('❌ HTTP Error:', error);
    
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server Error (${error.status}): ${error.message}`;
      if (error.error) {
        console.error('❌ Error details:', error.error);
      }
    }
    
    console.error('❌ Final error message:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}