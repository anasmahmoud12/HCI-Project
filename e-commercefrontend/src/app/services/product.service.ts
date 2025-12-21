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

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getProduct(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createProductWithImages(productData: any): Observable<any> {
    const formData = new FormData();
    
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('priceBefore', productData.priceBefore.toString());
    formData.append('priceAfter', productData.priceAfter.toString());
    formData.append('stock_quantity', productData.stock_quantity.toString());
    formData.append('categoryId', productData.categoryId.toString());
    formData.append('primaryImageIndex', productData.primaryImageIndex.toString());
    
    productData.images.forEach((file: File) => {
      formData.append('images', file, file.name);
    });
    
    return this.http.post(`${this.apiUrl}/with-images`, formData);
  }

  updateProductWithImages(id: number, productData: any): Observable<any> {
    const formData = new FormData();
    
    console.log('Product Data to update:', {
      id: id,
      name: productData.name,
      description: productData.description,
      priceBefore: productData.priceBefore,
      priceAfter: productData.priceAfter,
      stock_quantity: productData.stock_quantity,
      categoryId: productData.categoryId,
      primaryImageIndex: productData.primaryImageIndex,
      removedImageIds: productData.removedImageIds,
      hasImages: !!productData.images,
      imagesCount: productData.images ? productData.images.length : 0
    });
    
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('priceBefore', productData.priceBefore.toString());
    formData.append('priceAfter', productData.priceAfter.toString());
    formData.append('stock_quantity', productData.stock_quantity.toString());
    formData.append('categoryId', productData.categoryId.toString());
    formData.append('primaryImageIndex', productData.primaryImageIndex.toString());
    
    if (productData.removedImageIds && productData.removedImageIds.length > 0) {
      console.log('Removing image IDs:', productData.removedImageIds);
      formData.append('removedImageIds', JSON.stringify(productData.removedImageIds));
    } else {
      console.log('No images to remove');
      formData.append('removedImageIds', '[]');
    }
    
    if (productData.images && productData.images.length > 0) {
      console.log('Adding new images:', productData.images.length);
      productData.images.forEach((file: File, index: number) => {
        console.log(`Image ${index}:`, file.name, file.size, file.type);
        formData.append('images', file, file.name);
      });
    } else {
      console.log('No new images to add');
      formData.append('images', new Blob(), '');
    }
    
    console.log('FormData entries:');
    for (let pair of (formData as any).entries()) {
      console.log(pair[0], pair[1]);
    }
    
    return this.http.put(`${this.apiUrl}/${id}/with-images`, formData);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getAllProducts(): Observable<ProductView[]> {
    console.log('Fetching all products');
    return this.http.get<ProductView[]>(this.apiUrl);
  }

  getProductById(id: number): Observable<ProductView> {
    console.log('Fetching product by ID:', id);
    return this.http.get<ProductView>(`${this.apiUrl}/${id}`);
  }

  getProductsByCategory(categoryId: number): Observable<ProductView[]> {
    console.log('Fetching products by category:', categoryId);
    return this.http.get<ProductView[]>(`${this.apiUrl}/category/${categoryId}`);
  }

  // SORTING METHODS
  getAllProductsSorted(sortBy: string = 'date'): Observable<ProductView[]> {
    console.log('Fetching all products sorted by:', sortBy);
    return this.http.get<ProductView[]>(`${this.apiUrl}/sorted?sortBy=${sortBy}`);
  }

  getProductsByCategorySorted(categoryId: number, sortBy: string = 'date'): Observable<ProductView[]> {
    console.log('Fetching products by category:', categoryId, 'sorted by:', sortBy);
    return this.http.get<ProductView[]>(`${this.apiUrl}/category/${categoryId}/sorted?sortBy=${sortBy}`);
  }

  // NEW FILTER METHODS
  filterProducts(filterOptions: any): Observable<ProductView[]> {
    console.log('Filtering all products with options:', filterOptions);
    
    const params: any = {};
    
    if (filterOptions.productName && filterOptions.productName.trim() !== '') {
      params.productName = filterOptions.productName;
    }
    if (filterOptions.description && filterOptions.description.trim() !== '') {
      params.description = filterOptions.description;
    }
    if (filterOptions.minPrice !== null && filterOptions.minPrice !== undefined) {
      params.minPrice = filterOptions.minPrice;
    }
    if (filterOptions.maxPrice !== null && filterOptions.maxPrice !== undefined) {
      params.maxPrice = filterOptions.maxPrice;
    }
    if (filterOptions.minDiscount !== null && filterOptions.minDiscount !== undefined) {
      params.minDiscount = filterOptions.minDiscount;
    }
    if (filterOptions.maxDiscount !== null && filterOptions.maxDiscount !== undefined) {
      params.maxDiscount = filterOptions.maxDiscount;
    }
    params.includeOutOfStock = filterOptions.includeOutOfStock;
    
    return this.http.get<ProductView[]>(`${this.apiUrl}/filter`, { params });
  }

  filterProductsByCategory(categoryId: number, filterOptions: any): Observable<ProductView[]> {
    console.log('Filtering products by category:', categoryId, 'with options:', filterOptions);
    
    const params: any = {};
    
    if (filterOptions.productName && filterOptions.productName.trim() !== '') {
      params.productName = filterOptions.productName;
    }
    if (filterOptions.description && filterOptions.description.trim() !== '') {
      params.description = filterOptions.description;
    }
    if (filterOptions.minPrice !== null && filterOptions.minPrice !== undefined) {
      params.minPrice = filterOptions.minPrice;
    }
    if (filterOptions.maxPrice !== null && filterOptions.maxPrice !== undefined) {
      params.maxPrice = filterOptions.maxPrice;
    }
    if (filterOptions.minDiscount !== null && filterOptions.minDiscount !== undefined) {
      params.minDiscount = filterOptions.minDiscount;
    }
    if (filterOptions.maxDiscount !== null && filterOptions.maxDiscount !== undefined) {
      params.maxDiscount = filterOptions.maxDiscount;
    }
    params.includeOutOfStock = filterOptions.includeOutOfStock;
    
    return this.http.get<ProductView[]>(`${this.apiUrl}/category/${categoryId}/filter`, { params });
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/api/categories');
  }
}