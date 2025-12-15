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

  // Get all products
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Get single product by ID
  getProduct(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Create product with images
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

  // Update product with images - FIXED VERSION
  updateProductWithImages(id: number, productData: any): Observable<any> {
    const formData = new FormData();
    
    // Log the data being sent
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
    
    // Handle removed image IDs
    if (productData.removedImageIds && productData.removedImageIds.length > 0) {
      console.log('Removing image IDs:', productData.removedImageIds);
      formData.append('removedImageIds', JSON.stringify(productData.removedImageIds));
    } else {
      console.log('No images to remove');
      // Send empty array if no images to remove
      formData.append('removedImageIds', '[]');
    }
    
    // Handle new images - only append if there are new images
    if (productData.images && productData.images.length > 0) {
      console.log('Adding new images:', productData.images.length);
      productData.images.forEach((file: File, index: number) => {
        console.log(`Image ${index}:`, file.name, file.size, file.type);
        formData.append('images', file, file.name);
      });
    } else {
      console.log('No new images to add');
      // Send empty array to backend
      formData.append('images', new Blob(), '');
    }
    
    // Log form data entries
    console.log('FormData entries:');
    for (let pair of (formData as any).entries()) {
      console.log(pair[0], pair[1]);
    }
    
    return this.http.put(`${this.apiUrl}/${id}/with-images`, formData);
  }

  // Delete product
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // // Delete product image
  // deleteProductImage(imageId: number): Observable<any> {
  //   return this.http.delete(`${this.apiUrl}/images/${imageId}`);
  // }

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
