import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ViewCategoryComponent } from '../view-category/view-category.component';
import { ViewProductsComponent } from "../view-products/view-products.component";

interface Slide {
  title: string;
  description: string;
  buttonText: string;
  link: string;
  gradientStart: string;
  gradientEnd: string;
}

@Component({
  imports: [FormsModule, CommonModule, RouterModule, ViewCategoryComponent, ViewProductsComponent],
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit, OnDestroy {
  currentSlide: number = 0;
  searchQuery: string = '';
  activeRoute: string = 'home';
  private autoSlideInterval: any;
  private routerSubscription: Subscription | undefined;

  slides: Slide[] = [
    {
      title: 'Latest Laptops',
      description: 'Explore high-performance laptops for work and entertainment',
      buttonText: 'Shop Now',
      link: '/products/laptops',
      gradientStart: '#667eea',
      gradientEnd: '#764ba2'
    },
    {
      title: 'Modern Smartphones',
      description: 'Latest technology at the best prices',
      buttonText: 'Discover More',
      link: '/products/smartphones',
      gradientStart: '#f093fb',
      gradientEnd: '#f5576c'
    },
    {
      title: 'Smart Watches',
      description: 'Track your health and daily activity with style',
      buttonText: 'View Offers',
      link: '/products/watches',
      gradientStart: '#4facfe',
      gradientEnd: '#00f2fe'
    },
    {
      title: 'Tech Accessories',
      description: 'Everything you need for your devices in one place',
      buttonText: 'Browse Now',
      link: '/products/accessories',
      gradientStart: '#43e97b',
      gradientEnd: '#38f9d7'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.startAutoSlide();
    this.updateActiveRoute();
    
    // Subscribe to route changes to update active navigation
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateActiveRoute();
      });
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private updateActiveRoute(): void {
    const currentUrl = this.router.url;
    if (currentUrl.includes('/home')) {
      this.activeRoute = 'home';
    } else if (currentUrl.includes('/categories')) {
      this.activeRoute = 'categories';
    } else if (currentUrl.includes('/products')) {
      this.activeRoute = 'products';
    } else if (currentUrl.includes('/orders')) {
      this.activeRoute = 'orders';
    }
  }

  showSlide(index: number): void {
    this.currentSlide = (index + this.slides.length) % this.slides.length;
  }

  changeSlide(direction: number): void {
    this.showSlide(this.currentSlide + direction);
    this.resetAutoSlide();
  }

  goToSlide(index: number): void {
    this.showSlide(index);
    this.resetAutoSlide();
  }

  startAutoSlide(): void {
    this.autoSlideInterval = setInterval(() => {
      this.showSlide(this.currentSlide + 1);
    }, 5000);
  }

  stopAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  resetAutoSlide(): void {
    this.stopAutoSlide();
    this.startAutoSlide();
  }

  pauseAutoSlide(): void {
    this.stopAutoSlide();
  }

  resumeAutoSlide(): void {
    this.startAutoSlide();
  }

  navigateTo(route: string): void {
    this.activeRoute = route;
    this.router.navigate([`/${route}`]);
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      console.log('Searching for:', this.searchQuery);
      // Navigate to search results or filter products
      this.router.navigate(['/search'], { 
        queryParams: { q: this.searchQuery } 
      });
    }
  }
}