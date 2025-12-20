import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';  // ← Import from @angular/common
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,  // ← Add this
  imports: [CommonModule, FormsModule],  // ← Now it's correct
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  @Input() isTransparent: boolean = false;
  @Input() username!: string;
  
  searchQuery: string = '';
  cartItemCount: number = 0;
  
  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartService.cart$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cart => {
        this.cartItemCount = cart.totalItems;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch() {
    console.log('Search query:', this.searchQuery);
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  goToWishlist() {
    console.log('Navigate to wishlist');
  }

  goToProfile() {
    console.log('Navigate to profile');
  }

 navetohome(){
      this.router.navigate(['/home']);

 }
 navtocategories(){
        this.router.navigate(['/categories']);

 }
navtoproducts() {
          this.router.navigate(['/products']);

}

navtoorders(){
            this.router.navigate(['/orders']);

}












}