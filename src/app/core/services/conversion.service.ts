import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  RecConversion,
  RecConversionCreateRequest,
  RecConversionUpdateRequest,
} from '../models/conversion.model';

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

@Injectable({ providedIn: 'root' })
export class RecConversionService {
  private readonly apiUrl = `${environment.apiBaseUrl}/ceo/rec_conversion`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<RecConversion[]> {
    console.log('[RecConversionService] GET', this.apiUrl);

    return this.http.get<ApiResponse<RecConversion[]>>(this.apiUrl).pipe(
      map((res) => {
        const arr = res?.data;
        return Array.isArray(arr) ? arr : [];
      }),
    );
  }

  getById(id: number): Observable<RecConversion | null> {
    const url = `${this.apiUrl}/${id}`;
    console.log('[RecConversionService] GET', url);

    return this.http.get<ApiResponse<RecConversion>>(url).pipe(
      map((res) => {
        if (!res?.success) return null;
        return res.data ?? null;
      }),
    );
  }

  create(data: RecConversionCreateRequest): Observable<RecConversion> {
    console.log('[RecConversionService] POST', this.apiUrl);
    console.log('[RecConversionService] data', data);

    return this.http.post<ApiResponse<RecConversion>>(this.apiUrl, data).pipe(
      map((res) => {
        console.log('[RecConversionService] res', res);

        if (!res.success) {
          throw new Error(res.message || 'Error creating conversion');
        }

        return res.data;
      }),
    );
  }

  update(
    id: number,
    data: RecConversionUpdateRequest,
  ): Observable<RecConversion> {
    const url = `${this.apiUrl}/${id}`;
    console.log('[RecConversionService] PUT', url);
    console.log('[RecConversionService] data', data);

    return this.http.put<ApiResponse<RecConversion>>(url, data).pipe(
      map((res) => {
        if (!res.success) {
          throw new Error(res.message || 'Error updating conversion');
        }

        return res.data;
      }),
    );
  }

  delete(id: number): Observable<boolean> {
    const url = `${this.apiUrl}/${id}`;
    console.log('[RecConversionService] DELETE', url);

    return this.http.delete<ApiResponse<any>>(url).pipe(
      map((res) => {
        if (!res.success) {
          throw new Error(res.message || 'Error deleting conversion');
        }

        return true;
      }),
    );
  }
}
