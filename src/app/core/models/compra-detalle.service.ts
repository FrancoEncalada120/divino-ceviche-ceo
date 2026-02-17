import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

import { CompraDetalle } from '../models/compra-detalle.model';

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

@Injectable({ providedIn: 'root' })
export class CompraDetalleService {
  private readonly apiUrl = `${environment.apiBaseUrl}/ceo/rec_compras_detalle`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<CompraDetalle[]> {
    console.log('[CompraDetalleService] GET', this.apiUrl);

    return this.http.get<ApiResponse<CompraDetalle[]>>(this.apiUrl).pipe(
      map((res) => {
        const arr = res?.data;
        return Array.isArray(arr) ? arr : [];
      }),
    );
  }

  /**
   * Listar detalles por compra
   * GET /ceo/rec_compras_detalle?compra_id=1
   */
  getByCompraId(compraId: number): Observable<CompraDetalle[]> {
    const url = `${this.apiUrl}?compra_id=${compraId}`;
    console.log('[CompraDetalleService] GET', url);

    return this.http.get<ApiResponse<CompraDetalle[]>>(url).pipe(
      map((res) => {
        const arr = res?.data;
        return Array.isArray(arr) ? arr : [];
      }),
    );
  }

  getById(id: number): Observable<CompraDetalle | null> {
    const url = `${this.apiUrl}/${id}`;
    console.log('[CompraDetalleService] GET', url);

    return this.http.get<ApiResponse<CompraDetalle>>(url).pipe(
      map((res) => {
        if (!res?.success) return null;
        return res.data ?? null;
      }),
    );
  }

  create(detalle: Partial<CompraDetalle>): Observable<CompraDetalle> {
    console.log('[CompraDetalleService] POST', this.apiUrl);
    console.log('[CompraDetalleService] data', detalle);

    return this.http
      .post<ApiResponse<CompraDetalle>>(this.apiUrl, detalle)
      .pipe(
        map((res) => {
          console.log('[CompraDetalleService] res', res);

          if (!res.success) {
            throw new Error(res.message || 'Error creating compra detalle');
          }
          return res.data;
        }),
      );
  }

  update(detalle: CompraDetalle): Observable<CompraDetalle> {
    const url = `${this.apiUrl}/${detalle.detalle_id}`;
    console.log('[CompraDetalleService] PUT', url);
    console.log('[CompraDetalleService] data', detalle);

    return this.http.put<ApiResponse<CompraDetalle>>(url, detalle).pipe(
      map((res) => {
        if (!res.success) {
          throw new Error(res.message || 'Error updating compra detalle');
        }
        return res.data;
      }),
    );
  }
}
