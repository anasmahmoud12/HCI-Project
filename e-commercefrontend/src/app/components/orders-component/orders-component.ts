// src/app/components/order-history/order-history.component.ts - SIMPLIFIED FOR TESTING
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { OrderService } from '../../services/OrderService';
import { OrderResponse } from '../../models/Order';
import { NavbarComponent } from '../nav-bar/nav-bar.component';
import { Router } from '@angular/router';
import { PaypalPaymentComponent } from '../admin-components/admin-payment-component - Copy/paypal-payment.component';
import { UserService } from '../../services/UserService';
@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterModule,NavbarComponent],
  templateUrl: './orders-component.html',
  styleUrls: ['./orders-component.css']
})
export class OrderHistoryComponent implements OnInit, OnDestroy {
  orders: OrderResponse[] = [];
  loading = false;
  error = '';
  selectedOrder: OrderResponse | null = null;
  
  private destroy$ = new Subject<void>();

  constructor(private orderService: OrderService, private router: Router, private userService: UserService) {}

  ngOnInit() {
    console.log('🟢 Order History Component Initialized');
    this.loadOrders();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
// Check if order needs payment
needsPayment(order: OrderResponse): boolean {
  // Check if order is PENDING and payment is not COMPLETED
  // Adjust this logic based on your backend statuses
  const needsPayment = (
    order.status.toUpperCase() === 'PENDING' && 
    (!order.payment || order.payment.toUpperCase() !== 'COMPLETED')
  );
  
  console.log('Order needs payment check:', {
    orderId: order.id,
    status: order.status,
    payment: order.payment,
    needsPayment: needsPayment
  });
  
  return needsPayment;
}

// Pay with PayPal
payWithPaypal(order: OrderResponse): void {
  console.log('Initiating PayPal payment for order:', order.id);
  
  // Show confirmation
  if (!confirm(`Pay $${order.totalPrice.toFixed(2)} for Order ${order.orderNumber} via PayPal?`)) {
    return;
  }
  
  // Navigate to PayPal payment component
     this.router.navigate(['/paypal-payment', order.id], {
  queryParams: {
    userId: this.userService.getUserId()
  }
});
}


  loadOrders() {
    this.loading = true;
    this.error = '';

    console.log('🟢 Starting to load orders...');

    this.orderService.getMyOrders()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (orders) => {
          console.log('✅ Orders loaded successfully:', orders);
          this.orders = orders;
          this.loading = false;
        },
        error: (error) => {
          console.error('❌ Error loading orders:', error);
          this.error = 'Failed to load orders. Please try again.';
          this.loading = false;
        }
      });
  }

  // Format date
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Get status badge class
  // getStatusClass(status: string): string {
  //   const statusLower = status?.toLowerCase() || 'pending';
  //   return `status-${statusLower}`;
  // }
getStatusClass(status: string, payment?: string): string {
  const statusLower = status?.toLowerCase() || 'pending';
  
  // If payment is completed, show as paid regardless of order status
  if (payment && payment.toUpperCase() === 'COMPLETED') {
    return 'status-paid';
  }
  
  return `status-${statusLower}`;
}
  // Get total items in an order
  getTotalItems(order: OrderResponse): number {
    return order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  // View order details in modal
  viewOrderDetails(order: OrderResponse) {
    console.log('👁️ Viewing order details:', order);
    this.selectedOrder = order;
  }

  // Close modal
  closeOrderDetails() {
    this.selectedOrder = null;
  }

  // Check if order can be cancelled
  canCancelOrder(order: OrderResponse): boolean {
    return order.status.toUpperCase() === 'PENDING';
  }

  // Cancel order
  cancelOrder(orderId: number) {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    console.log('🔴 Cancelling order:', orderId);

    this.orderService.cancelOrder(orderId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cancelledOrder) => {
          console.log('✅ Order cancelled successfully:', cancelledOrder);
          
          // Update order in list
          const index = this.orders.findIndex(o => o.id === orderId);
          if (index !== -1) {
            this.orders[index] = cancelledOrder;
          }
          
          // Update selected order if it's the cancelled one
          if (this.selectedOrder && this.selectedOrder.id === orderId) {
            this.selectedOrder = cancelledOrder;
          }
          
          alert('✅ Order cancelled successfully!');
        },
        error: (error) => {
          console.error('❌ Error cancelling order:', error);
          alert('Failed to cancel order. ' + error.message);
        }
      });
  }

  // Reorder functionality
  reorder(order: OrderResponse) {
    const itemsList = order.orderItems
      .map(item => `- ${item.product.name} (x${item.quantity})`)
      .join('\n');
    
    alert(
      `Reorder Feature\n\n` +
      `This would add these items back to your cart:\n\n${itemsList}\n\n` +
      `Total: $${order.totalPrice.toFixed(2)}`
    );
  }

  // Retry loading
  retryLoadOrders() {
    console.log('🔄 Retrying to load orders...');
    this.loadOrders();
  }
  payWithCash(order: OrderResponse): void {
  if (!confirm(`Pay $${order.totalPrice.toFixed(2)} for Order ${order.orderNumber} with Cash?\n\nYou will pay upon delivery.`)) {
    return;
  }
  
  this.loading = true;
  
  this.orderService.makeCashPayment(order.id, order.user.id)
    .pipe(
      switchMap(updatedOrder => {
        // Reload orders after successful update
        return this.orderService.getMyOrders();
      })
    )
    .subscribe({
      next: (orders) => {
        this.loading = false;
        this.orders = orders;
        
        // Update selected order if it's the current one
        if (this.selectedOrder && this.selectedOrder.id === order.id) {
          this.selectedOrder = orders.find(o => o.id === order.id) || null;
        }
        
        alert(`✅ Order ${order.orderNumber} updated to Cash payment!\nYou will pay upon delivery.`);
      },
      error: (error) => {
        this.loading = false;
        console.error('Error updating payment method:', error);
        alert('❌ Failed to update payment method. Please try again.');
      }
    });
}
makeCashPayment(orderId: number): void {
    console.log('🔵 Setting cash payment for order:', orderId)  ;
    const userId = this.userService.getUserId();
    if (userId !== null && userId !== undefined) {
      this.orderService.makeCashPayment(orderId, userId).subscribe();
    }
}}