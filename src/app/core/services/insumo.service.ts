import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CalcularPrecioRequest,
  CalcularPrecioResponse,
  CreateInsumoDto,
  CreateInsumoResponse,
  GetInsumosParams,
  Insumo,
  InsumoDetalle,
  UpdateInsumoDto,
  UpdateInsumoResponse,
  UpdateStockInsumoDto,
  StockCriticalDashboardData,
} from '../models/insumo.model';
import { DataResponse } from '../models/grupos.model';

type ApiResponse<T> = {
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
    console.log('URL:', this.apiUrl);
    console.log('Params:', params);

    return this.http
      .get<ApiResponse<DataResponse>>(this.apiUrl, { params: params as any })
      .pipe(
        tap((res) => {
          console.log('Response:', res);
        }),
        map((res) => res?.data ?? { insumos: [], grupos: [] }),
      );
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
  ): Observable<InsumoDetalle> {
    return this.http
      .patch<
        ApiResponse<InsumoDetalle>
      >(`${this.apiUrl}/${insumo_id}/stock`, payload)
      .pipe(
        map((res) => {
          if (!res.success)
            throw new Error(res.message || 'Error actualizando stock');
          return res.data;
        }),
      );
  }

  updateStockBatch(
    payload: (UpdateStockInsumoDto & { insumo_id: number })[],
  ): Observable<InsumoDetalle[]> {
    return this.http
      .patch<
        ApiResponse<InsumoDetalle[]>
      >(`${this.apiUrl}/stock/batch`, payload)
      .pipe(
        map((res) => {
          if (!res.success)
            throw new Error(res.message || 'Error actualizando stock en lote');
          return res.data;
        }),
      );
  }

  // ─── POST calcular precio ─────────────────────────────────
  calcularPrecio(data: CalcularPrecioRequest): Observable<number> {
    const url = `${this.apiUrl}/calcular-precio`;
    console.log('[InsumoService] POST', url, data);

    return this.http.post<ApiResponse<CalcularPrecioResponse>>(url, data).pipe(
      map((res) => {
        if (!res.success)
          throw new Error(res.message || 'Error calculando precio');
        return Number(res.data?.precio_calculado ?? 0);
      }),
    );
  }

  // ─── GET dashboard stock crítico ──────────────────────────
  getStockCriticalDashboard(params?: {
    location_id?: number | null;
  }): Observable<StockCriticalDashboardData> {
    const url = `${this.apiUrl}/stock-dashboard`;

    const cleanParams: any = {};

    if (params?.location_id && Number(params.location_id) !== 0) {
      cleanParams.location_id = Number(params.location_id);
    }

    console.log(
      '[InsumoService] GET Stock Critical Dashboard',
      url,
      cleanParams,
    );

    return this.http
      .get<ApiResponse<StockCriticalDashboardData>>(url, {
        params: cleanParams,
      })
      .pipe(
        map((res) => {
          if (!res.success) {
            throw new Error(
              res.message || 'Error obteniendo dashboard de stock crítico',
            );
          }

          return (
            res.data ?? {
              kpis: {
                total_productos: 0,
                productos_sin_stock: 0,
                productos_bajo_minimo: 0,
                productos_stock_ok: 0,
                productos_sin_stock_ideal: 0,
                inventario_vencido: 0,
                valor_faltante_total: 0,
                porcentaje_saludable: 0,
                riesgo_general: 'BAJO',
              },
              productos_criticos: [],
              productos_sin_stock: [],
              productos_bajo_minimo: [],
              productos_ok: [],
              productos_sin_stock_ideal: [],
              inventario_vencido: [],
              all: [],
            }
          );
        }),
      );
  }
}
