import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GesCargo } from '../models/ges-cargo.model';

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
};

export type GetGesCargosParams = {
  text?: string | null;
  location_id?: number | null;
  estado?: string | null;
};

export type CreateGesCargoDto = {
  cargo_nombre: string;
  cargo_descripcion?: string | null;
  location_id?: number | null;
  tarifa_hora: number;
  tarifa_hora_extra: number;
  created_by?: number | null;
};

export type UpdateGesCargoDto = {
  cargo_nombre?: string;
  cargo_descripcion?: string | null;
  cargo_estado?: string;
  location_id?: number | null;
  tarifa_hora?: number;
  tarifa_hora_extra?: number;
  updated_by?: number | null;
};

@Injectable({
  providedIn: 'root',
})
export class GesCargoService {
  private readonly apiUrl = `${environment.apiBaseUrl}/ceo/ges_cargos`;

  constructor(private http: HttpClient) {}

  // ─── GET todos ────────────────────────────────────────────
  getAll(params?: GetGesCargosParams): Observable<GesCargo[]> {
    const cleanParams: any = {};

    if (params?.text?.trim()) {
      cleanParams.text = params.text.trim();
    }

    if (params?.location_id && Number(params.location_id) !== 0) {
      cleanParams.location_id = Number(params.location_id);
    }

    if (params?.estado) {
      cleanParams.estado = params.estado;
    }

    console.log('[GesCargoService] GET', this.apiUrl, cleanParams);

    return this.http
      .get<ApiResponse<GesCargo[]>>(this.apiUrl, { params: cleanParams })
      .pipe(
        map((res) => {
          if (!res.success) {
            throw new Error(res.message || 'Error obteniendo cargos');
          }

          return res.data ?? [];
        }),
      );
  }

  // ─── GET por id ───────────────────────────────────────────
  getById(id: number): Observable<GesCargo | null> {
    const url = `${this.apiUrl}/${id}`;

    console.log('[GesCargoService] GET BY ID', url);

    return this.http.get<ApiResponse<GesCargo>>(url).pipe(
      map((res) => {
        if (!res.success) {
          return null;
        }

        return res.data;
      }),
    );
  }

  // ─── POST crear ───────────────────────────────────────────
  create(payload: CreateGesCargoDto): Observable<GesCargo> {
    console.log('[GesCargoService] POST', this.apiUrl, payload);

    return this.http.post<ApiResponse<GesCargo>>(this.apiUrl, payload).pipe(
      map((res) => {
        if (!res.success) {
          throw new Error(res.message || 'Error creando cargo');
        }

        return res.data;
      }),
    );
  }

  // ─── PUT actualizar ───────────────────────────────────────
  update(id: number, payload: UpdateGesCargoDto): Observable<GesCargo> {
    const url = `${this.apiUrl}/${id}`;

    console.log('[GesCargoService] PUT', url, payload);

    return this.http.put<ApiResponse<GesCargo>>(url, payload).pipe(
      map((res) => {
        if (!res.success) {
          throw new Error(res.message || 'Error actualizando cargo');
        }

        return res.data;
      }),
    );
  }

  // ─── DELETE / inactivar ───────────────────────────────────
  delete(id: number, updated_by?: number | null): Observable<GesCargo> {
    const url = `${this.apiUrl}/${id}`;

    const body = {
      updated_by: updated_by ?? null,
    };

    console.log('[GesCargoService] DELETE / INACTIVAR', url, body);

    return this.http.delete<ApiResponse<GesCargo>>(url, { body }).pipe(
      map((res) => {
        if (!res.success) {
          throw new Error(res.message || 'Error inactivando cargo');
        }

        return res.data;
      }),
    );
  }
}
