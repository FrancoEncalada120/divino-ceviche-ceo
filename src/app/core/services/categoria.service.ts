import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/dashboard.models';
import { map, Observable } from 'rxjs';

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly apiUrl = `${environment.apiBaseUrl}/ceo/category`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Category[]> {
    console.log('[CategoryService] GET', this.apiUrl);

    return this.http.get<ApiResponse<Category[]>>(this.apiUrl).pipe(
      map((res) => {
        const arr = res?.data;
        return Array.isArray(arr) ? arr : [];
      })
    );
  }

  create(category: Category): Observable<Category> {
    console.log('[CategoryService] POST', this.apiUrl);
    console.log('[CategoryService] data', category);

    return this.http.post<ApiResponse<Category>>(this.apiUrl, category).pipe(
      map((res) => {
        console.log('[CategoryService] res', res);

        if (!res.success) {
          throw new Error(res.message || 'Error creating category');
        }
        return res.data;
      })
    );
  }

  update(category: Category): Observable<Category> {
    const url = `${this.apiUrl}/${category.category_id}`;

    console.log('[CategoryService] PUT', url);
    console.log('[CategoryService] data', category);

    return this.http.put<ApiResponse<Category>>(url, category).pipe(
      map((res) => {
        if (!res.success) {
          throw new Error(res.message || 'Error updating category');
        }
        return res.data;
      })
    );
  }
}
