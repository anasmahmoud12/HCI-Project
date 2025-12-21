import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../services/category.service';
import { CategoryView } from '../../models/category.model';
import { NavbarComponent } from '../nav-bar/nav-bar.component';
import { Subject, takeUntil } from 'rxjs';  // Add this
import { SearchService } from '../../services/SearchService';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './view-category.component.html',
  styleUrls: ['./view-category.component.css']
})
export class CategoriesComponent implements OnInit, OnDestroy {  // Add OnDestroy
  categories: CategoryView[] = [];
  allCategories: CategoryView[] = [];  // Add this
  loading: boolean = false;
  error: string = '';
  currentSearchQuery: string = '';  // Add this
  
  private destroy$ = new Subject<void>();  // Add this

  constructor(
    private categoryService: CategoryService,
    private searchService: SearchService,  // Add this
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCategories();
    
    // Subscribe to search queries from navbar
    this.searchService.searchQuery$
      .pipe(takeUntil(this.destroy$))
      .subscribe(query => {
        this.currentSearchQuery = query;
        this.performSearch(query);
      });
  }

  ngOnDestroy() {  // Add this method
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCategories() {
    this.loading = true;
    this.error = '';

    this.categoryService.getCategories().subscribe({
      next: (data: CategoryView[]) => {
        console.log('Categories received:', data);
        this.allCategories = data;  // Store all categories
        this.categories = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.error = 'Failed to load categories. Please try again later.';
        this.loading = false;
      },
      complete: () => {
        console.log('Categories loading complete');
        this.loading = false;
      }
    });
  }

  // Add this new method
  performSearch(query: string) {
    if (!query || query.trim() === '') {
      // If search is empty, show all categories
      this.categories = this.allCategories;
      return;
    }

    this.loading = true;
    this.error = '';

    this.searchService.searchCategories(query)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: CategoryView[]) => {
          console.log('Search results:', data);
          this.categories = data || [];
          this.loading = false;
          
          if (this.categories.length === 0) {
            this.error = `No categories found for "${query}"`;
          }
        },
        error: (err) => {
          console.error('Error searching categories:', err);
          this.error = 'Failed to search categories';
          this.loading = false;
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