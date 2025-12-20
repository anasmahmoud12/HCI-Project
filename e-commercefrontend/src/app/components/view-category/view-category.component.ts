import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../services/category.service';
import { CategoryView } from '../../models/category.model';
import { NavbarComponent } from '../nav-bar/nav-bar.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule,NavbarComponent],
  templateUrl: './view-category.component.html',
  styleUrls: ['./view-category.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: CategoryView[] = [];
  loading: boolean = false;
  error: string = '';

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.error = '';

    this.categoryService.getCategories().subscribe({
      next: (data: CategoryView[]) => {
        console.log('Categories received:', data);
        // Filter only active categories
        this.categories = data;
        // console.log('Filtered categories:', this.categories);
        this.loading = false; // THIS IS CRITICAL!
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.error = 'Failed to load categories. Please try again later.';
        this.loading = false;
      },
      complete: () => {
        console.log('Categories loading complete');
        this.loading = false; // Fallback to ensure loading stops
      }
    });
  }

  getCategoryImage(category: CategoryView): string {
    if (!category.img) {
      // Fallback images based on category name
      const fallbacks: { [key: string]: string } = {
        'headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
        'laptops': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
        'phones': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
        'watches': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop'
      };
      
      const key = category.name.toLowerCase();
      return fallbacks[key] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop';
    }
    return `data:image/jpeg;base64,${category.img}`;
  }

  navigateToProducts(categoryId: number) {
    this.router.navigate(['/products', categoryId]);
  }

  navigateToAllProducts() {
    this.router.navigate(['/products']);
  }
}