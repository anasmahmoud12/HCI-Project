
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { WishlistItem } from '../models/wishlist';

@Injectable({
    providedIn: 'root'
})
export class WishlistService {
    private apiUrl = 'http://localhost:8080/api/wishlist';

    private currentUserId = 1;

    private wishlistSubject = new BehaviorSubject<WishlistItem[]>([]);
    public wishlist$ = this.wishlistSubject.asObservable();

    constructor(private http: HttpClient) {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.http.get<WishlistItem[]>(`${this.apiUrl}/${this.currentUserId}`)
      .subscribe({
        next: (items) => this.wishlistSubject.next(items),
        error: (err) => console.error('Error loading wishlist:', err)
      });
  }

  getUserWishlist(): Observable<WishlistItem[]> {
    return this.http.get<WishlistItem[]>(`${this.apiUrl}/${this.currentUserId}`);
  }

  addToWishlist(productId: number): Observable<WishlistItem> {
    return this.http.post<WishlistItem>(
      `${this.apiUrl}/${this.currentUserId}/products/${productId}`,
      {}
    ).pipe(
      tap(() => this.loadWishlist())
    );
  }

  removeFromWishlist(productId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${this.currentUserId}/products/${productId}`
    ).pipe(
      tap(() => this.loadWishlist())
    );
  }


  toggleWishlist(productId: number): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/${this.currentUserId}/products/${productId}/toggle`,
      {}
    ).pipe(
      tap(() => this.loadWishlist())
    );
  }

  isInWishlist(productId: number): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.apiUrl}/${this.currentUserId}/products/${productId}/status`
    );
  }

  getProductWishlistStatus(productId: number): Observable<boolean> {
    const currentWishlist = this.wishlistSubject.getValue();
    const isInList = currentWishlist.some(item => item.product.id === productId);
    return new Observable(observer => {
      observer.next(isInList);
      observer.complete();
    });
  }

  getWishlistCount(): number {
    return this.wishlistSubject.getValue().length;
  }
}