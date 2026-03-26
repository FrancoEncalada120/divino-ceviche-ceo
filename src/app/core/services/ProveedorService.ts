import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Proveedor } from '../models/insumo.model';

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

@Injectable({ providedIn: 'root' })
export class ProveedorService {
  private readonly apiUrl = `${environment.apiBaseUrl}/ceo/rec_proveedor`;

  constructor(private http: HttpClient) {}

  /* =========================
     GET ALL
  ========================= */
  getAll(): Observable<Proveedor[]> {
    console.log('[ProveedorService] GET', this.apiUrl);

    return this.http.get<ApiResponse<Proveedor[]>>(this.apiUrl).pipe(
      map((res) => {
        const arr = res?.data;
        return Array.isArray(arr) ? arr : [];
      }),
    );
  }

  /* =========================
     GET BY ID
  ========================= */
  getById(id: number): Observable<Proveedor | null> {
    const url = `${this.apiUrl}/${id}`;
    console.log('[ProveedorService] GET', url);

    return this.http.get<ApiResponse<Proveedor>>(url).pipe(
      map((res) => {
        if (!res?.success) return null;
        return res.data ?? null;
      }),
    );
  }

  /* =========================
     CREATE
  ========================= */
  create(proveedor: Partial<Proveedor>): Observable<Proveedor> {
    console.log('[ProveedorService] POST', this.apiUrl);
    console.log('[ProveedorService] data', proveedor);

    return this.http.post<ApiResponse<Proveedor>>(this.apiUrl, proveedor).pipe(
      map((res) => {
        if (!res.success) {
          throw new Error(res.message || 'Error creating proveedor');
        }
        return res.data;
      }),
    );
  }

  /* =========================
     UPDATE
  ========================= */
  update(proveedor: Proveedor): Observable<Proveedor> {
    const url = `${this.apiUrl}/${proveedor.proveedor_id}`;
    console.log('[ProveedorService] PUT', url);

    return this.http.put<ApiResponse<Proveedor>>(url, proveedor).pipe(
      map((res) => {
        if (!res.success) {
          throw new Error(res.message || 'Error updating proveedor');
        }
        return res.data;
      }),
    );
  }

  /* =========================
     DELETE (SOFT DELETE)
  ========================= */
  delete(id: number, updated_by?: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    console.log('[ProveedorService] DELETE', url);

    return this.http
      .delete<ApiResponse<any>>(url, {
        body: { updated_by },
      })
      .pipe(
        map((res) => {
          if (!res.success) {
            throw new Error(res.message || 'Error deleting proveedor');
          }
          return res;
        }),
      );
  }
}
