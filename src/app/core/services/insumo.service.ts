import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CalcularPrecioRequest,
  CalcularPrecioResponse,
  CreateInsumoDto,
  CreateInsumoResponse,
  GetInsumosParams,
  Insumo,
  InsumoInventario,
  UpdateInsumoDto,
  UpdateInsumoResponse,
  UpdateStockInsumoDto,
} from '../models/insumo.model';
import { DataResponse, Grupo } from '../models/grupos.model';

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

type ApiResponseAll<T> = {
  success: boolean;
  data: T;
  message?: string;
};

@Injectable({ providedIn: 'root' })
export class InsumoService {
  private readonly apiUrl = `${environment.apiBaseUrl}/ceo/rec_insumos`;

  constructor(private http: HttpClient) {}

  // ─── GET todos ────────────────────────────────────────────
  getInsumoAll(params?: GetInsumosParams): Observable<DataResponse> {
    return this.http
      .get<ApiResponse<DataResponse>>(this.apiUrl, { params: params as any })
      .pipe(map((res) => res?.data ?? { insumos: [], grupos: [] }));
  }

  // ─── GET por id ───────────────────────────────────────────
  getById(id: number): Observable<Insumo | null> {
    return this.http
      .get<ApiResponse<Insumo>>(`${this.apiUrl}/${id}`)
      .pipe(map((res) => (res?.success ? res.data : null)));
  }

  // ─── POST crear ───────────────────────────────────────────
  create(payload: CreateInsumoDto): Observable<CreateInsumoResponse> {
    console.log('[InsumoService] POST', this.apiUrl, payload);

    return this.http
      .post<ApiResponse<CreateInsumoResponse>>(this.apiUrl, payload)
      .pipe(
        map((res) => {
          if (!res.success)
            throw new Error(res.message || 'Error creando insumo');
          return res.data;
        }),
      );
  }

  // ─── PUT actualizar ───────────────────────────────────────
  update(
    id: number,
    payload: UpdateInsumoDto,
  ): Observable<UpdateInsumoResponse> {
    console.log('[InsumoService] PUT', `${this.apiUrl}/${id}`, payload);

    return this.http
      .put<ApiResponse<UpdateInsumoResponse>>(`${this.apiUrl}/${id}`, payload)
      .pipe(
        map((res) => {
          if (!res.success)
            throw new Error(res.message || 'Error actualizando insumo');
          return res.data;
        }),
      );
  }

  // ─── PATCH stock ──────────────────────────────────────────
  updateStock(
    insumo_id: number,
    payload: UpdateStockInsumoDto,
  ): Observable<InsumoInventario> {
    return this.http
      .patch<
        ApiResponse<InsumoInventario>
      >(`${this.apiUrl}/${insumo_id}/stock`, payload)
      .pipe(
        map((res) => {
          if (!res.success)
            throw new Error(res.message || 'Error actualizando stock');
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
