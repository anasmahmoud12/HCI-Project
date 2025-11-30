import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductFormData } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient) {}

  createProductWithImages(productData: ProductFormData): Observable<any> {
    const formData = new FormData();
    
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('priceBefore', productData.priceBefore.toString());
    formData.append('priceAfter', productData.priceAfter.toString());
    formData.append('stock_quantity', productData.stock_quantity.toString());
    formData.append('categoryId', productData.categoryId.toString());
    formData.append('primaryImageIndex', productData.primaryImageIndex.toString());
    
    productData.images.forEach((file) => {
      formData.append('images', file, file.name);
    });
    return this.http.post(`${this.apiUrl}/with-images`, formData);
  }
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/api/categories');
  }
}