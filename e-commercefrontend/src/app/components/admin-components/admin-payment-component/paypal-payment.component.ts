// paypal-payment.component.ts
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  
  loading = false;
  paymentInProgress = false;
  errorMessage: string = '';
  successMessage: string = '';
  
  private paypalWindow: Window | null = null;
  private checkInterval: any;
  
  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  
  ngOnInit(): void {
    // Auto-start payment when component loads
    if (!this.orderId) {
      this.route.params.subscribe(params => {
        if (params['orderId']) {
          this.orderId = params['orderId'];
          this.startPayment();
        }
      });
    } else {
      // Small delay to ensure component is rendered
      setTimeout(() => this.startPayment(), 100);
    }
  }
  
  ngOnDestroy(): void {
    this.stopChecking();
  }
  
  // Start PayPal payment automatically
  startPayment(): void {
    if (!this.orderId) {
      this.errorMessage = 'Order ID is required';
      return;
    }
    
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    const params: any = { orderId: this.orderId };
    if (this.userId) params.userId = this.userId;
    
    this.http.post<any>('/api/payments/create', {}, { params })
      .subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success && response.approvalUrl) {
            this.openPopup(response.approvalUrl);
          } else {
            this.errorMessage = response.error || 'Failed to initiate payment';
            this.goBackAfterDelay(3000);
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Error connecting to payment service';
          this.goBackAfterDelay(3000);
        }
      });
  }
  
  // Open PayPal popup
  private openPopup(url: string): void {
    if (this.paypalWindow) {
      this.paypalWindow.close();
    }
    
    this.paymentInProgress = true;
    
    const width = 500;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    this.paypalWindow = window.open(
      url,
      'PayPal',
      `width=${width},height=${height},left=${left},top=${top}`
    );
    
    if (!this.paypalWindow) {
      this.errorMessage = 'Please allow popups for this site to complete payment';
      this.paymentInProgress = false;
      this.goBackAfterDelay(5000);
      return;
    }
    
    // Start checking every 2 seconds
    this.checkInterval = setInterval(() => {
      this.checkStatus();
    }, 2000);
  }
  
  // Check payment status
  private checkStatus(): void {
    if (!this.orderId) return;
    
    let url = `/api/payments/status/${this.orderId}`;
    if (this.userId) {
      url = `/api/orders/${this.orderId}/user/${this.userId}`;
    }
    
    this.http.get<any>(url).subscribe({
      next: (response) => {
        const status = response.paymentStatus;
        
        if (status === 'COMPLETED' || status === 'PAID') {
          this.paymentDone('Payment successful!', true);
        } else if (status === 'FAILED' || status === 'CANCELLED') {
          this.paymentDone('Payment was not completed', false);
        }
        // If still pending, do nothing - keep checking
      },
      error: () => {
        // Ignore errors during checking
      }
    });
  }
  
private paymentDone(message: string, isSuccess: boolean): void {
  this.stopChecking();
  this.paymentInProgress = false;
  
  if (isSuccess) {
    this.successMessage = message;
    // Navigate away automatically after showing success
    setTimeout(() => {
      this.router.navigate(['/orders']); // or wherever you want to go
    }, 3000); // Show success message for 3 seconds then navigate
  } else {
    this.errorMessage = message;
  }
}
  // Go back to previous page after delay
  private goBackAfterDelay(delay: number): void {
    setTimeout(() => {
      this.goBack();
    }, delay);
  }
  
  // Navigate back to orders page
  private goBack(): void {
    if (this.userId) {
      this.router.navigate(['/orders'], { 
        queryParams: { userId: this.userId } 
      });
    } else {
      this.router.navigate(['/orders']);
    }
  }
  
  // Stop checking and close window
  private stopChecking(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    
    if (this.paypalWindow && !this.paypalWindow.closed) {
      this.paypalWindow.close();
    }
    this.paypalWindow = null;
  }
}