import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { Subject, takeUntil, filter } from 'rxjs';
import { SearchService } from '../../services/SearchService';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  @Input() isTransparent: boolean = false;
  @Input() username!: string;
  
  searchQuery: string = '';
  cartItemCount: number = 0;
  currentRoute: string = '';
  wishlistItemCount: number = 0 ; 
  
  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private searchService: SearchService, 
    private wishlistService: WishlistService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartService.cart$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cart => {
        this.cartItemCount = cart.totalItems;
      });

       this.wishlistService.wishlist$
      .pipe(takeUntil(this.destroy$))
      .subscribe(wishlist => {
        this.wishlistItemCount = wishlist.length;
      });

    // Track current route
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: any) => {
        this.currentRoute = event.urlAfterRedirects;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch() {
    const query = this.searchQuery.trim();
    console.log('Search query:', query);
    console.log('Current route:', this.currentRoute);
    
    // Emit search query to subscribers (the current page will handle it)
    this.searchService.emitSearchQuery(query);
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  goToWishlist() {
    this.router.navigate(['/wishlist']);
    console.log('Navigate to wishlist');
  }

  goToProfile() {
    console.log('Navigate to profile');
  }

  navetohome() {
    this.searchQuery = ''; // Clear search when navigating
    this.router.navigate(['/home']);
  }

  navtocategories() {
    this.searchQuery = ''; // Clear search when navigating
    this.router.navigate(['/categories']);
  }

  navtoproducts() {
    this.searchQuery = ''; // Clear search when navigating
    this.router.navigate(['/products']);
  }

  navtoorders() {
    this.searchQuery = ''; // Clear search when navigating
    this.router.navigate(['/orders']);
  }
}
