import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { OrderDto, OrderEntity } from "../models/Order";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient) {}

  // POST http://localhost:8080/api/orders/{userId}
  createOrder(userId: number, orderRequest: OrderDto): Observable<OrderEntity> {
    return this.http.post<OrderEntity>(`${this.apiUrl}/${userId}`, orderRequest);
  }

  // You'll need to add these endpoints in your backend
  getUserOrders(userId: number): Observable<OrderEntity[]> {
    return this.http.get<OrderEntity[]>(`${this.apiUrl}/user/${userId}`);
  }

  getOrderById(orderId: number): Observable<OrderEntity> {
    return this.http.get<OrderEntity>(`${this.apiUrl}/${orderId}`);
  }

//   cancelOrder(orderId: number): Observable<OrderEntity> {
//     return this.http.put<OrderEntity>(`${this.apiUrl}/${orderId}/cancel`, {});
//   }
}