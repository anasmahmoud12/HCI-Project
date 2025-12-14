import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductFormData, ProductView } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient) {}

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  createProductWithImages(productData: ProductFormData): Observable<Product> {
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

    return this.http.post<Product>(`${this.apiUrl}/with-images`, formData);
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      responseType: 'text'
    });
  }

  getAllProducts(): Observable<ProductView[]> {
    console.log('try to get ');
    return this.http.get<ProductView[]>(this.apiUrl);
  }

  getProductById(id: number): Observable<ProductView> {
        console.log('try to get ');

    return this.http.get<ProductView>(`${this.apiUrl}/${id}`);
  }

  getProductsByCategory(categoryId: number): Observable<ProductView[]> {
    return this.http.get<ProductView[]>(`${this.apiUrl}/category/${categoryId}`);
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/api/categories');
  }
}
