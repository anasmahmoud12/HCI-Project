import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { ProductView } from '../models/product.model';
import { CategoryView } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = 'http://localhost:8080/api';
  
  // Subject to emit search queries across components
  private searchQuerySubject = new Subject<string>();
  public searchQuery$ = this.searchQuerySubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Emit search query to all subscribers
   */
  emitSearchQuery(query: string): void {
    this.searchQuerySubject.next(query);
  }

  /**
   * Search all products (for home page or all products page)
   */
  searchProducts(query: string): Observable<ProductView[]> {
    let params = new HttpParams();
    if (query && query.trim()) {
      params = params.set('q', query.trim());
    }
    return this.http.get<ProductView[]>(`${this.apiUrl}/products/search`, { params });
  }

  /**
   * Search products within a specific category
   */
  searchProductsByCategory(query: string, categoryId: number): Observable<ProductView[]> {
    let params = new HttpParams();
    if (query && query.trim()) {
      params = params.set('q', query.trim());
    }
    return this.http.get<ProductView[]>(
      `${this.apiUrl}/products/search/category/${categoryId}`, 
      { params }
    );
  }

  /**
   * Search categories (for categories page)
   */
  searchCategories(query: string): Observable<CategoryView[]> {
    let params = new HttpParams();
    if (query && query.trim()) {
      params = params.set('q', query.trim());
    }
    return this.http.get<CategoryView[]>(`${this.apiUrl}/categories/search`, { params });
  }
}