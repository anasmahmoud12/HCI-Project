import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService } from '../admin-services/order.service';
import { Order } from '../admin-models/order.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './orders.html',
  styles: [`
    
  `]
})
export class Orders implements OnInit {
  orders: Order[] = [];
  selectedOrder: Order | null = null;
  loading = false;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        console.log("from back",orders);
        this.orders = orders;
        console.log("in front ", this.orders)

        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.loading = false;
      }
    });
  }

  getTotalItems(order: Order): number {
    return order.orderItems.reduce((total, item) => total + item.quantity, 0);
  }

  getStatusBadgeClass(status: string): string {
    const classes = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'PROCESSING': 'bg-blue-100 text-blue-800',
      'SHIPPED': 'bg-indigo-100 text-indigo-800',
      'DELIVERED': 'bg-green-100 text-green-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800'
    };
    return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }

  getOrdersByStatus(status: string): Order[] {
    return this.orders.filter(order => order.status === status);
  }

  updateOrderStatus(orderId: number, event: any): void {
    const newStatus = event.target.value;
    this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
      next: (updatedOrder) => {
        const index = this.orders.findIndex(o => o.id === orderId);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
        }
      },
      error: (error) => {
        console.error('Error updating order status:', error);
      }
    });
  }

  deleteOrder(orderId: number): void {
    if (confirm('Are you sure you want to delete this order?')) {
      this.orderService.deleteOrder(orderId).subscribe({
        next: () => {
          this.orders = this.orders.filter(order => order.id !== orderId);
        },
        error: (error) => {
          console.error('Error deleting order:', error);
        }
      });
    }
  }

  viewOrderDetails(order: Order): void {
    this.selectedOrder = order;
  }
  getPaymentStatusBadgeClass(paymentStatus: string): string {
  const classes: { [key: string]: string } = {
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'COMPLETED': 'bg-green-100 text-green-800',
    'CANCELLED': 'bg-red-100 text-red-800',
    'FAILED': 'bg-red-100 text-red-800',
    'REFUNDED': 'bg-gray-100 text-gray-800'
  };
  return classes[paymentStatus?.toUpperCase()] || 'bg-gray-100 text-gray-800';
}
}