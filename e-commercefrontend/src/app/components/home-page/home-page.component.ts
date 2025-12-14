import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../nav-bar/nav-bar.component';

@Component({
  selector: 'app-home',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  imports:[FormsModule,CommonModule,NavbarComponent]
})
export class HomeComponent implements OnInit, OnDestroy {
  currentSlide: number = 0;
  private slideInterval: any;

  slides = [
    {
      title: 'Latest Laptops',
      description: 'Explore high-performance laptops for work and entertainment.',
      image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=1600&h=600&fit=crop&q=80'
    },
    {
      title: 'Smart Watches Collection',
      description: 'Discover the newest collection of smartwatches and fitness trackers.',
      image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=1600&h=600&fit=crop&q=80'
    },
    {
      title: 'Premium Headphones',
      description: 'Experience superior sound quality with our premium audio collection.',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&h=600&fit=crop&q=80'
    },
    {
      title: 'Gaming Accessories',
      description: 'Upgrade your gaming setup with top-tier peripherals and gear.',
      image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1600&h=600&fit=crop&q=80'
    }
  ];

 

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  startAutoSlide() {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  addToCart(product: any) {
    console.log('Added to cart:', product);
    // Add your cart logic here
  }
}
