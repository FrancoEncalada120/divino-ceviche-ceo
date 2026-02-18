import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

import { RecetaDetalle } from '../models/receta-detalle.model';

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

@Injectable({ providedIn: 'root' })
export class RecetaDetalleService {
  private readonly apiUrl = `${environment.apiBaseUrl}/ceo/rec_receta_detalle`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<RecetaDetalle[]> {
    console.log('[RecetaDetalleService] GET', this.apiUrl);

    return this.http.get<ApiResponse<RecetaDetalle[]>>(this.apiUrl).pipe(
      map((res) => {
        const arr = res?.data;
        return Array.isArray(arr) ? arr : [];
      }),
    );
  }

  /**
   * Listar detalles por receta
   * GET /ceo/rec_receta_detalle?receta_id=1
   */
  getByRecetaId(recetaId: number): Observable<RecetaDetalle[]> {
    const url = `${this.apiUrl}?receta_id=${recetaId}`;
    console.log('[RecetaDetalleService] GET', url);

    return this.http.get<ApiResponse<RecetaDetalle[]>>(url).pipe(
      map((res) => {
        const arr = res?.data;
        return Array.isArray(arr) ? arr : [];
      }),
    );
  }

  getById(id: number): Observable<RecetaDetalle | null> {
    const url = `${this.apiUrl}/${id}`;
    console.log('[RecetaDetalleService] GET', url);

    return this.http.get<ApiResponse<RecetaDetalle>>(url).pipe(
      map((res) => {
        if (!res?.success) return null;
        return res.data ?? null;
      }),
    );
  }

  create(detalle: Partial<RecetaDetalle>): Observable<RecetaDetalle> {
    console.log('[RecetaDetalleService] POST', this.apiUrl);
    console.log('[RecetaDetalleService] data', detalle);

    return this.http
      .post<ApiResponse<RecetaDetalle>>(this.apiUrl, detalle)
      .pipe(
        map((res) => {
          console.log('[RecetaDetalleService] res', res);

          if (!res.success) {
            throw new Error(res.message || 'Error creating receta detalle');
          }
          return res.data;
        }),
      );
  }

  update(detalle: RecetaDetalle): Observable<RecetaDetalle> {
    const url = `${this.apiUrl}/${detalle.receta_detalle_id}`;
    console.log('[RecetaDetalleService] PUT', url);
    console.log('[RecetaDetalleService] data', detalle);

    return this.http.put<ApiResponse<RecetaDetalle>>(url, detalle).pipe(
      map((res) => {
        if (!res.success) {
          throw new Error(res.message || 'Error updating receta detalle');
        }
        return res.data;
      }),
    );
  }
}
