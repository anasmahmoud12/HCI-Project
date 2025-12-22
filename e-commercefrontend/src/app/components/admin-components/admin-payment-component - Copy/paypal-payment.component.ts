import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, Subscription, interval, takeUntil } from 'rxjs';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-paypal-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './paypal-payment.component.html',
  styleUrls: ['./paypal-payment.component.scss']
})
export class PaypalPaymentComponent implements OnInit, OnDestroy {
  orderId?: number;
  userId?: number;
  orderNumber?: string;
  amount?: number;
  
  // Payment states
  loading = false;
  paymentInProgress = false;
  errorMessage: string = '';
  successMessage: string = '';
  infoMessage: string = '';
  
  // PayPal popup window reference
  private paypalWindow: Window | null = null;
  private paymentCheckInterval: any;
  private destroy$ = new Subject<void>();
  private routeSub!: Subscription;
  
  private readonly CHECK_INTERVAL = 3000; // Check every 3 seconds
  private readonly TIMEOUT_DURATION = 300000; // 5 minutes timeout
  
  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  
  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    
    console.log('🟢 PayPal Payment Component Initialized');
    
    // Get orderId from route params
    this.route.params.subscribe(params => {
      console.log('Route params:', params);
      if (params['orderId']) {
        this.orderId = +params['orderId'];
        console.log('Order ID set to:', this.orderId);
      }
    });
    
    // Get userId from query params
    this.route.queryParams.subscribe(params => {
      console.log('Query params:', params);
      if (params['userId']) {
        this.userId = +params['userId'];
        console.log('User ID set to:', this.userId);
      }
      if (params['orderId'] && !this.orderId) {
        this.orderId = +params['orderId'];
      }
    });
    
    // Auto-initiate payment if we have both IDs
    if (this.orderId && this.userId) {
      // Optional: Auto-start payment (uncomment if needed)
      // this.initiatePaypalPayment();
    }
    
    // Check for payment success/cancel in URL (in case user returns manually)
    this.checkUrlForPaymentResult();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.cleanupPaymentWindow();
    
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
  
  /**
   * Check URL for payment result parameters
   */
  private checkUrlForPaymentResult(): void {
    this.route.queryParams.subscribe(params => {
      if (params['paymentStatus']) {
        const status = params['paymentStatus'];
        if (status === 'success') {
          this.successMessage = 'Payment completed successfully!';
          setTimeout(() => {
            this.router.navigate(['/orders']);
          }, 3000);
        } else if (status === 'cancelled') {
          this.errorMessage = 'Payment was cancelled.';
          setTimeout(() => {
            this.router.navigate(['/orders']);
          }, 3000);
        }
      }
    });
  }
  
  /**
   * Initialize PayPal payment
   */
  initiatePaypalPayment(): void {
    if (!this.orderId) {
      this.errorMessage = 'Order ID is required';
      return;
    }
    
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.infoMessage = 'Creating payment request...';
    
    // Validate order amount
    if (this.amount && this.amount <= 0) {
      this.errorMessage = 'Invalid order amount';
      this.loading = false;
      return;
    }
    
    // Prepare query parameters
    const params: any = { orderId: this.orderId };
    if (this.userId) {
      params.userId = this.userId;
    }
    
    console.log('🔵 Initiating PayPal payment with params:', params);
    
    // Add timeout to request
    const timeout$ = new Subject<void>();
    setTimeout(() => timeout$.next(), 10000); // 10 second timeout
    
    this.http.post<any>('http://localhost:8080/api/payments/create', {}, { 
      params,
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        this.loading = false;
        console.log('✅ PayPal payment creation response:', response);

        if (response.success && response.approvalUrl) {
          this.orderNumber = response.orderNumber;
          this.amount = response.amount;
          this.openPaypalPopup(response.approvalUrl);
        } else {
          this.errorMessage = response.error || 'Failed to create PayPal payment';
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('❌ PayPal payment creation error:', error);
        
        if (error.status === 400) {
          this.errorMessage = error.error?.error || 'Bad request. Please check order details.';
        } else if (error.status === 401 || error.status === 403) {
          this.errorMessage = 'Authentication failed. Please login again.';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else if (error.status === 404) {
          this.errorMessage = 'Order not found.';
        } else if (error.status === 409) {
          this.errorMessage = 'Payment already in progress for this order.';
        } else if (error.status >= 500) {
          this.errorMessage = 'Server error. Please try again later.';
        } else {
          this.errorMessage = error.error?.error || 'An error occurred while creating payment';
        }
      }
    });
  }
  
  /**
   * Open PayPal approval URL in a popup window
   */
  private openPaypalPopup(approvalUrl: string): void {
    // Clean up any existing popup
    this.cleanupPaymentWindow();
    
    // Set payment in progress flag
    this.paymentInProgress = true;
    this.errorMessage = '';
    this.infoMessage = 'Opening PayPal...';
    
    // Calculate popup dimensions (centered)
    const width = 500;
    const height = 700;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    // Open popup window
    this.paypalWindow = window.open(
      approvalUrl,
      'PayPalPayment',
      `width=${width},height=${height},left=${left},top=${top},resizable=no,scrollbars=no,toolbar=no,menubar=no,location=no`
    );
    
    if (!this.paypalWindow) {
      this.errorMessage = 'Popup was blocked. Please allow popups for this site and try again.';
      this.paymentInProgress = false;
      this.infoMessage = '';
      return;
    }
    
    this.infoMessage = 'Please complete payment in the PayPal window...';
    
    // Start checking for payment completion
    this.startPaymentStatusCheck();
    
    // Set timeout for payment process
    setTimeout(() => {
      if (this.paymentInProgress) {
        this.errorMessage = 'Payment process timed out. Please check your PayPal account or try again.';
        this.paymentInProgress = false;
        this.cleanupPaymentWindow();
      }
    }, this.TIMEOUT_DURATION);
  }
  
  /**
   * Start checking payment status by polling the server
   */
  private startPaymentStatusCheck(): void {
    // Clear any existing interval
    if (this.paymentCheckInterval) {
      clearInterval(this.paymentCheckInterval);
    }
    
    this.paymentCheckInterval = setInterval(() => {
      if (this.paypalWindow?.closed) {
        // Popup was closed, check payment status
        this.checkPaymentStatus();
        this.cleanupPaymentWindow();
      }
    }, this.CHECK_INTERVAL);
  }
  
  /**
   * Check payment status with backend
   */
  private checkPaymentStatus(): void {
    if (!this.orderId) return;
    
    this.infoMessage = 'Checking payment status...';
    
    let url = `http://localhost:8080/api/orders/${this.orderId}`;
    if (this.userId) {
      url = `http://localhost:8080/api/orders/${this.orderId}/user/${this.userId}`;
    }
    
    console.log('🔵 Checking payment status for order:', this.orderId);
    
    this.http.get<any>(url).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (order) => {
        this.paymentInProgress = false;
        console.log('✅ Order status after payment:', order);
        
        if (order.payment === 'COMPLETED') {
          this.successMessage = 'Payment completed successfully!';
          this.infoMessage = 'Redirecting to orders page...';
          
          // Navigate to orders page after delay
          setTimeout(() => {
            this.router.navigate(['/orders'], {
              queryParams: { paymentSuccess: true }
            });
          }, 2000);
          
        } else if (order.payment === 'FAILED') {
          this.errorMessage = 'Payment failed. Please try again.';
          this.infoMessage = '';
          
        } else if (order.payment === 'CANCELLED') {
          this.errorMessage = 'Payment was cancelled.';
          this.infoMessage = 'Redirecting to orders page...';
          
          setTimeout(() => {
            this.router.navigate(['/orders']);
          }, 2000);
          
        } else {
          // Payment still pending
          this.infoMessage = 'Payment is still being processed...';
          // Continue checking if popup is still open
          if (this.paypalWindow && !this.paypalWindow.closed) {
            this.paymentInProgress = true;
          }
        }
      },
      error: (error) => {
        this.paymentInProgress = false;
        console.error('❌ Payment status check error:', error);
        
        if (error.status === 404) {
          this.errorMessage = 'Order not found. It may have been cancelled.';
          setTimeout(() => {
            this.router.navigate(['/orders']);
          }, 2000);
        } else {
          this.errorMessage = 'Error checking payment status. Please check your orders.';
          this.infoMessage = '';
        }
      }
    });
  }
  
  /**
   * Clean up popup window reference and interval
   */
  private cleanupPaymentWindow(): void {
    if (this.paymentCheckInterval) {
      clearInterval(this.paymentCheckInterval);
      this.paymentCheckInterval = null;
    }
    
    if (this.paypalWindow && !this.paypalWindow.closed) {
      try {
        this.paypalWindow.close();
      } catch (e) {
        console.warn('Could not close PayPal window:', e);
      }
    }
    this.paypalWindow = null;
  }
  
  /**
   * Cancel payment and navigate back
   */
  cancelPayment(): void {
    this.cleanupPaymentWindow();
    this.paymentInProgress = false;
    this.infoMessage = '';
    
    // If we have an order ID, optionally cancel it on backend
    if (this.orderId && confirm('Cancel this payment?')) {
      this.cancelOrderOnBackend();
    } else {
      this.router.navigate(['/orders']);
    }
  }
  
  /**
   * Cancel order on backend
   */
  private cancelOrderOnBackend(): void {
    this.loading = true;
    this.infoMessage = 'Cancelling order...';
    
    const url = this.userId 
      ? `http://localhost:8080/api/orders/${this.orderId}/cancel/user/${this.userId}`
      : `http://localhost:8080/api/orders/${this.orderId}/cancel`;
    
    this.http.put(url, {}).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Order cancelled successfully.';
        setTimeout(() => {
          this.router.navigate(['/orders']);
        }, 2000);
      },
      error: (error) => {
        this.loading = false;
        console.error('Order cancellation error:', error);
        this.errorMessage = 'Failed to cancel order.';
        this.router.navigate(['/orders']);
      }
    });
  }
  
  /**
   * Retry payment after error
   */
  retryPayment(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.infoMessage = '';
    this.initiatePaypalPayment();
  }
  
  /**
   * Manually check payment status
   */
  manualCheckStatus(): void {
    if (!this.orderId) {
      this.errorMessage = 'No order ID available';
      return;
    }
    
    this.infoMessage = 'Checking status...';
    this.checkPaymentStatus();
  }
  
  /**
   * View order details
   */
  viewOrder(): void {
    if (this.orderId) {
      this.router.navigate(['/orders', this.orderId], 
        this.userId ? { queryParams: { userId: this.userId } } : {});
    }
  }
  
  /**
   * Continue shopping
   */
  continueShopping(): void {
    this.router.navigate(['/products']);
  }
  
}