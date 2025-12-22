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

  constructor(private http: HttpClient) {}
private getUserId(): number {
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      console.error('❌ No userId found in localStorage. Please login first.');
      throw new Error('User not authenticated. Please login.');
    }
    
    const parsedUserId = parseInt(userId, 10);
    
    if (isNaN(parsedUserId)) {
      console.error('❌ Invalid userId format in localStorage:', userId);
      throw new Error('Invalid user ID format.');
    }
    
    console.log('🔵 Retrieved userId from localStorage:', parsedUserId);
    return parsedUserId;
  }
  // Place a new order
  placeOrder(orderDto: OrderDto): Observable<OrderResponse> {
    const userId = this.getUserId();
    console.log('🔵 Placing order for user:', userId);
    console.log('🔵 Request URL:', `${this.baseUrl}/${userId}`);
    console.log('🔵 Order data:', orderDto);
    
    return this.http.post<OrderResponse>(
      `${this.baseUrl}/${userId}`,
      orderDto
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Get all orders for current user
  getMyOrders(): Observable<OrderResponse[]> {
    const userId = this.getUserId();
    console.log('🔵 Fetching orders for user:', userId);
    console.log('🔵 Request URL:', `${this.baseUrl}/user/${userId}`);
    
    return this.http.get<OrderResponse[]>(
      `${this.baseUrl}/user/${userId}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Get specific order
  getOrderById(orderId: number): Observable<OrderResponse> {
    const userId = this.getUserId();
    console.log('🔵 Fetching order:', orderId, 'for user:', userId);
    console.log('🔵 Request URL:', `${this.baseUrl}/${orderId}/user/${userId}`);
    
    return this.http.get<OrderResponse>(
      `${this.baseUrl}/${orderId}/user/${userId}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Cancel an order
  cancelOrder(orderId: number): Observable<OrderResponse> {
    const userId = this.getUserId();
    console.log('🔵 Cancelling order:', orderId);
    console.log('🔵 Request URL:', `${this.baseUrl}/${orderId}/cancel/user/${userId}`);
    
    return this.http.put<OrderResponse>(
      `${this.baseUrl}/${orderId}/cancel/user/${userId}`,
      {}
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Set test user ID (optional - for testing different users)


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
  makeCashPayment(orderId: number, userId?: number): Observable<any> {
    console.log('🔵 Setting cash payment for order:', orderId)  ;
    return this.http.put<any>(`${this.baseUrl}/${orderId}/user/${userId}`, {});
}
}