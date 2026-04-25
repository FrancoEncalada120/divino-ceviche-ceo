import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

import { Receta } from '../models/receta.model';
import {
  RecetaFullCreate,
  RecetaFullUpdate,
} from '../models/receta-full-create.model';

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

@Injectable({ providedIn: 'root' })
export class RecetaService {
  private readonly apiUrl = `${environment.apiBaseUrl}/ceo/rec_recetas`;

  constructor(private http: HttpClient) {}

  getAll(locationId?: number, recetaId?: number): Observable<Receta[]> {
    let params = new HttpParams();

    if (locationId && locationId !== 0) {
      params = params.set('location_id', locationId.toString());
    }

    if (recetaId && recetaId !== 0) {
      params = params.set('receta_id', recetaId.toString());
    }

    console.log('[RecetaService] GET', this.apiUrl, params.toString());

    return this.http.get<ApiResponse<Receta[]>>(this.apiUrl, { params }).pipe(
      map((res) => {
        const arr = res?.data;
        return Array.isArray(arr) ? arr : [];
      }),
    );
  }

  getById(id: number): Observable<Receta | null> {
    const url = `${this.apiUrl}/${id}`;
    console.log('[RecetaService] GET', url);

    return this.http.get<ApiResponse<Receta>>(url).pipe(
      map((res) => {
        if (!res?.success) return null;
        return res.data ?? null;
      }),
    );
  }

  create(receta: Partial<Receta>): Observable<Receta> {
    console.log('[RecetaService] POST', this.apiUrl);
    console.log('[RecetaService] data', receta);

    return this.http.post<ApiResponse<Receta>>(this.apiUrl, receta).pipe(
      map((res) => {
        console.log('[RecetaService] res', res);

        if (!res.success) {
          throw new Error(res.message || 'Error creating receta');
        }
        return res.data;
      }),
    );
  }

  update(receta: Receta): Observable<Receta> {
    const url = `${this.apiUrl}/${receta.receta_id}`;
    console.log('[RecetaService] PUT', url);
    console.log('[RecetaService] data', receta);

    return this.http.put<ApiResponse<Receta>>(url, receta).pipe(
      map((res) => {
        if (!res.success) {
          throw new Error(res.message || 'Error updating receta');
        }
        return res.data;
      }),
    );
  }

  /**
   * Crea receta + detalles en una sola llamada
   * POST /ceo/rec_recetas/full
   */
  createFull(payload: RecetaFullCreate): Observable<any> {
    const url = `${this.apiUrl}/full`;

    return this.http.post<ApiResponse<any>>(url, payload).pipe(
      map((res) => {
        if (!res.success) {
          throw new Error(res.message || 'Error creating receta full');
        }
        return res.data;
      }),
    );
  }

  updateFull(id: number, payload: RecetaFullCreate): Observable<any> {
    const url = `${this.apiUrl}/full/${id}`;

    return this.http.put<ApiResponse<any>>(url, payload).pipe(
      map((res) => {
        if (!res.success) {
          throw new Error(res.message || 'Error updating receta full');
        }
        return res.data;
      }),
    );
  }

  // updateFull(
  //   id: number,
  //   payload: RecetaFullCreate,
  //   locationId?: number,
  // ): Observable<any> {
  //   const url = `${this.apiUrl}/full/${id}`;
  //   let params = new HttpParams();

  //   if (locationId && locationId !== 0) {
  //     params = params.set('location_id', locationId.toString());
  //   }

  //   console.log('[RecetaService] PUT', url);
  //   console.log('[RecetaService] data', payload);

  //   return this.http.put<ApiResponse<any>>(url, payload, { params }).pipe(
  //     map((res) => {
  //       console.log('[RecetaService] res', res);

  //       if (!res.success) {
  //         throw new Error(res.message || 'Error updating receta full');
  //       }

  //       return res.data;
  //     }),
  //   );
  // }

  getByInsumoId(insumoId: number): Observable<Receta[]> {
    return this.http
      .get<ApiResponse<Receta[]>>(`${this.apiUrl}/insumo/${insumoId}`)
      .pipe(
        map((res) => {
          if (!res.success) {
            throw new Error(res.message || 'Error fetching recetas');
          }
          return res.data;
        }),
      );
  }
}
