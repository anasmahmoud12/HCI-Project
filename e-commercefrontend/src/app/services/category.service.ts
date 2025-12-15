import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, CategoryFormData } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = 'http://localhost:8080/api/categories';

  constructor(private http: HttpClient) {}

  createCategoryWithImage(categoryData: CategoryFormData): Observable<Category> {
    const formData = new FormData();

    formData.append('name', categoryData.name);
    formData.append('description', categoryData.description);
    formData.append('isactive', categoryData.isactive.toString());

    if (categoryData.image) {
      formData.append('image', categoryData.image, categoryData.image.name);
    }

    return this.http.post<Category>(this.apiUrl, formData);
  }

  updateCategory(id: number, category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category);
  }

  deleteCategory(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      responseType: 'text'
    });
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }
}
