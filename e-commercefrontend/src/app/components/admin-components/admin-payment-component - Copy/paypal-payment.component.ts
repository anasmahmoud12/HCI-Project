import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
  
  // New state for popup closure
  private popupClosedByUser = false;
  private paymentCompleted = false;
  
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
      if (params['orderId']) {
        this.orderId = +params['orderId'];
      }
    });
    
    // Get userId from query params
    this.route.queryParams.subscribe(params => {
      if (params['userId']) {
        this.userId = +params['userId'];
      }
      if (params['orderId'] && !this.orderId) {
        this.orderId = +params['orderId'];
      }
    });
    
    // Check for existing payment status
    this.checkPaymentStatus();
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
   * Initialize PayPal payment
   */
  initiatePaypalPayment(): void {
    if (!this.orderId) {
      this.errorMessage = 'Order ID is required';
      return;
    }
    
    // Reset states
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.infoMessage = 'Creating payment request...';
    this.popupClosedByUser = false;
    this.paymentCompleted = false;
    
    // Prepare query parameters
    const params: any = { orderId: this.orderId };
    if (this.userId) {
      params.userId = this.userId;
    }
    
    console.log('🔵 Initiating PayPal payment with params:', params);
    
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
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no,status=no`
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
      if (this.paymentInProgress && !this.paymentCompleted) {
        this.errorMessage = 'Payment process timed out. Please check your PayPal account or try again.';
        this.paymentInProgress = false;
        this.cleanupPaymentWindow();
      }
    }, this.TIMEOUT_DURATION);
  }
  
  /**
   * Start checking payment status
   */
  private startPaymentStatusCheck(): void {
    // Clear any existing interval
    if (this.paymentCheckInterval) {
      clearInterval(this.paymentCheckInterval);
    }
    
    // Check immediately first time
    this.checkPaymentStatus();
    
    // Then set up interval
    this.paymentCheckInterval = setInterval(() => {
      this.checkPaymentStatus();
    }, this.CHECK_INTERVAL);
  }
  
  /**
   * Check payment status with backend
   */
  private checkPaymentStatus(): void {
    if (!this.orderId) return;
    
    // Don't check if we already know payment is completed
    if (this.paymentCompleted) {
      return;
    }
    
    const url = `http://localhost:8080/api/payments/status/${this.orderId}`;
    const params: any = {};
    if (this.userId) {
      params.userId = this.userId;
    }
    
    console.log('🔵 Checking payment status for order:', this.orderId);
    
    this.http.get<any>(url, { params }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        console.log('✅ Payment status response:', response);
        
        const paymentStatus = response.paymentStatus;
        const orderStatus = response.orderStatus;
        
        if (paymentStatus === 'COMPLETED' || paymentStatus === 'PAID') {
          // Payment completed successfully
          this.paymentCompleted = true;
          this.paymentInProgress = false;
          this.successMessage = 'Payment completed successfully!';
          this.infoMessage = 'Redirecting to orders page...';
          this.cleanupPaymentWindow();
          
          // Navigate after delay
          setTimeout(() => {
            this.router.navigate(['/orders'], {
              queryParams: { 
                paymentSuccess: true,
                orderId: this.orderId 
              }
            });
          }, 2000);
          
        } else if (paymentStatus === 'CANCELLED') {
          // Payment was cancelled
          this.paymentInProgress = false;
          this.errorMessage = 'Payment was cancelled.';
          this.infoMessage = '';
          this.cleanupPaymentWindow();
          
          // Show retry option
          setTimeout(() => {
            if (this.errorMessage.includes('cancelled')) {
              this.infoMessage = 'Click "Try Again" to restart payment.';
            }
          }, 1000);
          
        } else if (paymentStatus === 'FAILED') {
          // Payment failed
          this.paymentInProgress = false;
          this.errorMessage = 'Payment failed. Please try again.';
          this.infoMessage = '';
          this.cleanupPaymentWindow();
          
        } else if (paymentStatus === 'PENDING') {
          // Payment is still pending
          this.infoMessage = 'Payment is being processed...';
          
          // Check if popup is closed but payment is still pending
          if (this.paypalWindow?.closed && !this.popupClosedByUser) {
            // Popup closed without completing payment
            this.popupClosedByUser = true;
            this.errorMessage = 'You closed the payment window. Payment is still pending.';
            this.infoMessage = 'Please wait or check your PayPal account.';
          }
          
        } else {
          // Unknown status
          this.infoMessage = 'Waiting for payment confirmation...';
        }
      },
      error: (error) => {
        console.error('❌ Payment status check error:', error);
        
        // If popup is closed and we get an error, assume user cancelled
        if (this.paypalWindow?.closed && !this.paymentInProgress) {
          this.paymentInProgress = false;
          this.errorMessage = 'Payment was not completed. You can try again.';
          this.infoMessage = '';
          this.cleanupPaymentWindow();
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
    this.cancelOrderOnBackend();
      this.cleanupPaymentWindow();
      this.paymentInProgress = false;
      this.router.navigate(['/orders']);
    
  }
  
  /**
   * Cancel order on backend
   */
  private cancelOrderOnBackend(): void {
    this.loading = true;
  this.infoMessage = 'Cancelling order...';
  
  // CORRECT: Use GET with query parameters as per your backend endpoint
  const url = `http://localhost:8080/api/payments/cancel`; // Adjust based on your actual base path
  
  // For your specific case, it might be just:
  // const url = `http://localhost:8080/cancel`;
  
  // Add query parameters
  if (this.orderId) {
  const params = new HttpParams()
    .set('orderId', this.orderId.toString())
    .set('userId', this.userId?.toString() || '');
  
  // Use GET method since your backend uses @GetMapping
  this.http.get(url, { 
    params,
    responseType: 'text'  // Since backend returns HTML string
  }).pipe(
    takeUntil(this.destroy$)
  ).subscribe({
    next: (htmlResponse: string) => {
      this.loading = false;
      this.paymentInProgress = false;
      
      // Option 1: Display the HTML response
      
      // Option 2: Just show success message
      this.successMessage = 'Order cancelled successfully. Stock has been restored.';
      
      this.cleanupPaymentWindow();
      setTimeout(() => {
        this.router.navigate(['/orders']);
      }, 2000);
    },
    error: (error) => {
      this.loading = false;
      console.error('Order cancellation error:', error);
      this.errorMessage = 'Failed to cancel order: ' + (error.error || error.message);
      this.cleanupPaymentWindow();
      this.router.navigate(['/orders']);
    }
  });
}
  }
  
  /**
   * Retry payment after error
   */
  retryPayment(): void {
    // Clear all messages and restart
    this.errorMessage = '';
    this.successMessage = '';
    this.infoMessage = '';
    this.popupClosedByUser = false;
    this.paymentCompleted = false;
    
    // Give a small delay before retrying
    setTimeout(() => {
      this.initiatePaypalPayment();
    }, 500);
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
   * Continue shopping
   */
  continueShopping(): void {
    this.router.navigate(['/products']);
  }
}