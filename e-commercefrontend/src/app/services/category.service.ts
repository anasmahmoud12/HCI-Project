import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { CategoryFormData } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:8080/api/categories';

  constructor(private http: HttpClient) {}

  // createCategory(category: Category): Observable<Category> {
  //   return this.http.post<Category>(this.apiUrl, category);
  // }

  //  createCategoryWithImage(categoryData: CategoryFormData): Observable<Category> {
  //   const formData = new FormData();
    
  //   formData.append('name', categoryData.name);
  //   formData.append('description', categoryData.description);
  //   formData.append('isactive', categoryData.isactive.toString());
    
  //   // Append single image if exists
  //   if (categoryData.image) {
  //     formData.append('image', categoryData.image, categoryData.image.name);
  //   }
    
  //   return this.http.post<Category>(this.apiUrl, formData);
  // }
   createCategoryWithImage(categoryData: CategoryFormData): Observable<any> {
      const formData = new FormData();
      
      formData.append('name', categoryData.name);
      formData.append('description', categoryData.description);
          formData.append('isactive', categoryData.isactive.toString());

     
       if (categoryData.image) {
      formData.append('image', categoryData.image, categoryData.image.name);
    }
      // productData.images.forEach((file) => {
      //   formData.append('images', file, file.name);
      // });
      return this.http.post(`${this.apiUrl}`, formData);
    }
    getCategories(): Observable<any[]> {
      return this.http.get<any[]>('http://localhost:8080/api/categories');
    }

    updateCategory(id: number, categoryData: CategoryFormData): Observable<any> {
    const formData = new FormData();
    
    // Append text fields
    formData.append('name', categoryData.name);
    formData.append('description', categoryData.description);
    formData.append('isactive', categoryData.isactive.toString());
    
    // Append removeImage flag if true
    if (categoryData.removeImage === true) {
      formData.append('removeImage', 'true');
    }
    
    // Append image file if provided
    if (categoryData.image instanceof File) {
      formData.append('image', categoryData.image);
    }
    
    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }
    deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
