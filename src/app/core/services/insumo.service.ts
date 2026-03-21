import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CalcularPrecioRequest,
  CalcularPrecioResponse,
  Insumo,
} from '../models/insumo.model';

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

@Injectable({ providedIn: 'root' })
export class InsumoService {
  private readonly apiUrl = `${environment.apiBaseUrl}/ceo/rec_insumos`;

  constructor(private http: HttpClient) { }

  getAll(params?: {
    text?: string;
  }): Observable<Insumo[]> {

    console.log('[InsumoService] GET', this.apiUrl);

    return this.http.get<ApiResponse<Insumo[]>>(this.apiUrl, { params: params as any }).pipe(
      map((res) => {
        const arr = res?.data;
        return Array.isArray(arr) ? arr : [];
      }),
    );
  }

  getById(id: number): Observable<Insumo | null> {
    const url = `${this.apiUrl}/${id}`;
    console.log('[InsumoService] GET', url);

    return this.http.get<ApiResponse<Insumo>>(url).pipe(
      map((res) => {
        if (!res?.success) return null;
        return res.data ?? null;
      }),
    );
  }

  create(insumo: Partial<Insumo>): Observable<Insumo> {
    console.log('[InsumoService] POST', this.apiUrl);
    console.log('[InsumoService] data', insumo);

    return this.http.post<ApiResponse<Insumo>>(this.apiUrl, insumo).pipe(
      map((res) => {
        console.log('[InsumoService] res', res);

        if (!res.success) {
          throw new Error(res.message || 'Error creating insumo');
        }
        return res.data;
      }),
    );
  }

  update(insumo: Insumo): Observable<Insumo> {
    const url = `${this.apiUrl}/${insumo.insumo_id}`;
    console.log('[InsumoService] PUT', url);
    console.log('[InsumoService] data', insumo);

    return this.http.put<ApiResponse<Insumo>>(url, insumo).pipe(
      map((res) => {
        if (!res.success) {
          throw new Error(res.message || 'Error updating insumo');
        }
        return res.data;
      }),
    );
  }

  calcularPrecio(data: CalcularPrecioRequest): Observable<number> {
    const url = `${this.apiUrl}/calcular-precio`;

    console.log('[InsumoService] POST', url);
    console.log('[InsumoService] data', data);

    return this.http.post<ApiResponse<CalcularPrecioResponse>>(url, data).pipe(
      map((res) => {
        if (!res.success) {
          throw new Error(res.message || 'Error calculando precio');
        }

        return Number(res.data?.precio_calculado ?? 0);
      }),
    );
  }
}
