import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

import { Compra } from '../models/compra.model';
import { CompraFullCreate } from '../models/compra-full-create.model';
import { CompraFullResponse } from '../models/compra-full-response.model';

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

@Injectable({ providedIn: 'root' })
export class CompraService {
  private readonly apiUrl = `${environment.apiBaseUrl}/ceo/rec_compras`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Compra[]> {
    console.log('[CompraService] GET', this.apiUrl);

    return this.http.get<ApiResponse<Compra[]>>(this.apiUrl).pipe(
      map((res) => {
        const arr = res?.data;
        return Array.isArray(arr) ? arr : [];
      }),
    );
  }

  getById(id: number): Observable<Compra | null> {
    const url = `${this.apiUrl}/${id}`;
    console.log('[CompraService] GET', url);

    return this.http.get<ApiResponse<Compra>>(url).pipe(
      map((res) => {
        if (!res?.success) return null;
        return res.data ?? null;
      }),
    );
  }

  create(compra: Partial<Compra>): Observable<Compra> {
    console.log('[CompraService] POST', this.apiUrl);
    console.log('[CompraService] data', compra);

    return this.http.post<ApiResponse<Compra>>(this.apiUrl, compra).pipe(
      map((res) => {
        if (!res.success)
          throw new Error(res.message || 'Error creating compra');
        return res.data;
      }),
    );
  }

  update(compra: Compra): Observable<Compra> {
    const url = `${this.apiUrl}/${compra.compra_id}`;
    console.log('[CompraService] PUT', url);
    console.log('[CompraService] data', compra);

    return this.http.put<ApiResponse<Compra>>(url, compra).pipe(
      map((res) => {
        if (!res.success)
          throw new Error(res.message || 'Error updating compra');
        return res.data;
      }),
    );
  }

  /**
   * Crea compra + detalles en una sola llamada
   * POST /ceo/rec_compras/full
   *
   * Mientras no tengas JWT: manda x-user-id en header (temporal).
   */
  createFull(
    payload: CompraFullCreate,
    userId?: number,
  ): Observable<CompraFullResponse> {
    const url = `${this.apiUrl}/full`;
    console.log('[CompraService] POST', url);
    console.log('[CompraService] data', payload);

    const options = userId
      ? { headers: { 'x-user-id': String(userId) } }
      : undefined;

    return this.http
      .post<ApiResponse<CompraFullResponse>>(url, payload, options)
      .pipe(
        map((res) => {
          if (!res.success)
            throw new Error(res.message || 'Error creating compra full');
          return res.data;
        }),
      );
  }
}
