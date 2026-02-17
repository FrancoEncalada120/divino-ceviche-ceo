import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Unidad } from '../models/unidad.model';

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

@Injectable({ providedIn: 'root' })
export class UnidadService {
  private readonly apiUrl = `${environment.apiBaseUrl}/ceo/rec_unidades`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Unidad[]> {
    console.log('[UnidadService] GET', this.apiUrl);

    return this.http.get<ApiResponse<Unidad[]>>(this.apiUrl).pipe(
      map((res) => {
        const arr = res?.data;
        return Array.isArray(arr) ? arr : [];
      }),
    );
  }

  getById(id: number): Observable<Unidad | null> {
    const url = `${this.apiUrl}/${id}`;
    console.log('[UnidadService] GET', url);

    return this.http.get<ApiResponse<Unidad>>(url).pipe(
      map((res) => {
        if (!res?.success) return null;
        return res.data ?? null;
      }),
    );
  }

  create(unidad: Partial<Unidad>): Observable<Unidad> {
    console.log('[UnidadService] POST', this.apiUrl);
    console.log('[UnidadService] data', unidad);

    return this.http.post<ApiResponse<Unidad>>(this.apiUrl, unidad).pipe(
      map((res) => {
        if (!res.success) {
          throw new Error(res.message || 'Error creating unidad');
        }
        return res.data;
      }),
    );
  }

  update(unidad: Unidad): Observable<Unidad> {
    const url = `${this.apiUrl}/${unidad.unidad_id}`;
    console.log('[UnidadService] PUT', url);

    return this.http.put<ApiResponse<Unidad>>(url, unidad).pipe(
      map((res) => {
        if (!res.success) {
          throw new Error(res.message || 'Error updating unidad');
        }
        return res.data;
      }),
    );
  }
}
