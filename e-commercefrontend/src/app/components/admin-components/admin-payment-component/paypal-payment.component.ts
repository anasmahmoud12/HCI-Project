// paypal-payment.component.ts
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-paypal-payment',
  templateUrl: './paypal-payment.component.html',
  styleUrls: ['./paypal-payment.component.scss']
})
export class PaypalPaymentComponent implements OnInit, OnDestroy {
  @Input() orderId!: number;
  @Input() userId?: number;
  
  // Payment states
  loading = false;
  paymentInProgress = false;
  errorMessage: string = '';
  successMessage: string = '';
  
  // PayPal popup window reference
  private paypalWindow: Window | null = null;
  private paymentCheckInterval: any;
  private routeSub!: Subscription;
  
  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}
  
  ngOnInit(): void {
    // If orderId is not passed as input, try to get it from route params
    if (!this.orderId) {
      this.routeSub = this.route.params.subscribe(params => {
        if (params['orderId']) {
          this.orderId = params['orderId'];
        }
      });
    }
    
    // Check if we have userId in route params
    this.route.queryParams.subscribe(params => {
      if (params['userId']) {
        this.userId = params['userId'];
      }
    });
  }
  
  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
    this.cleanupPaymentWindow();
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
    
    // Prepare query parameters
    const params: any = { orderId: this.orderId };
    if (this.userId) {
      params.userId = this.userId;
    }
    
    this.http.post<any>('/api/payments/create', {}, { params })
      .subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success && response.approvalUrl) {
            this.openPaypalPopup(response.approvalUrl);
          } else {
            this.errorMessage = response.error || 'Failed to create PayPal payment';
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.error || 'An error occurred while creating payment';
          console.error('PayPal payment creation error:', error);
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
    
    // Calculate popup dimensions (centered)
    const width = 500;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    // Open popup window
    this.paypalWindow = window.open(
      approvalUrl,
      'PayPalPayment',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
    
    if (!this.paypalWindow) {
      this.errorMessage = 'Popup was blocked. Please allow popups for this site.';
      this.paymentInProgress = false;
      return;
    }
    
    // Start checking for payment completion
    this.startPaymentStatusCheck();
  }
  
  /**
   * Start checking payment status by polling the server
   */
  private startPaymentStatusCheck(): void {
    this.paymentCheckInterval = setInterval(() => {
      if (this.paypalWindow?.closed) {
        // Popup was closed, check payment status
        this.checkPaymentStatus();
        this.cleanupPaymentWindow();
      }
    }, 2000); // Check every 2 seconds
    
    // Also check after 30 seconds to handle timeouts
    setTimeout(() => {
      if (this.paymentInProgress) {
        this.checkPaymentStatus();
      }
    }, 30000);
  }
  
  /**
   * Check payment status with backend
   */
  private checkPaymentStatus(): void {
    if (!this.orderId) return;
    
    // First, get the current order status
    let url = `/api/orders/${this.orderId}`;
    if (this.userId) {
      url = `/api/orders/${this.orderId}/user/${this.userId}`;
    }
    
    this.http.get<any>(url).subscribe({
      next: (order) => {
        this.paymentInProgress = false;
        
        if (order.paymentStatus === 'COMPLETED') {
          this.successMessage = 'Payment completed successfully!';
          // Navigate to order details or show success message
          setTimeout(() => {
            this.router.navigate(['/orders', this.orderId], 
              this.userId ? { queryParams: { userId: this.userId } } : {});
          }, 2000);
        } else if (order.paymentStatus === 'FAILED') {
          this.errorMessage = 'Payment failed. Please try again.';
        } else if (order.paymentStatus === 'CANCELLED') {
          this.errorMessage = 'Payment was cancelled.';
        }
        // If still pending, user might still be in PayPal window
      },
      error: (error) => {
        this.paymentInProgress = false;
        this.errorMessage = 'Error checking payment status';
        console.error('Payment status check error:', error);
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
      this.paypalWindow.close();
    }
    this.paypalWindow = null;
  }
  
  /**
   * Cancel payment and navigate back
   */
  cancelPayment(): void {
    this.cleanupPaymentWindow();
    this.paymentInProgress = false;
    
    // Navigate back to checkout or order page
    if (this.orderId) {
      this.router.navigate(['/checkout'], { 
        queryParams: { 
          orderId: this.orderId, 
          ...(this.userId && { userId: this.userId }) 
        } 
      });
    } else {
      this.router.navigate(['/cart']);
    }
  }
  
  /**
   * Retry payment after error
   */
  retryPayment(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.initiatePaypalPayment();
  }
}