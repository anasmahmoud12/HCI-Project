import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { Order } from './admin-models/order.model';
@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  updateOrderStatus(id: number, status: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}/status?status=${status}`, {});
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getOrdersByUserId(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/user/${userId}`);
  }
  setCashPayment(orderId: number, userId?: number): Observable<any> {
    console.log('🔵 Setting cash payment for order:', orderId);
    
    const effectiveUserId = userId;
    
    const url = `${this.apiUrl}/${orderId}/user/${effectiveUserId}`;
    
    console.log('🔵 Request URL:', url);
    
    return this.http.put<any>(url, {}).pipe(
      catchError((error) => {
        console.error('Error setting cash payment:', error);
        throw error;
      })
    );
  }
}
