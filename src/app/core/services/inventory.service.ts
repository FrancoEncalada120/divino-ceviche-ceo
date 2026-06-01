import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Inventario,
  InventoryPriceAlert,
  InventoryPriceAlertResponse,
} from '../models/inventory.model';

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private readonly apiUrl = `${environment.apiBaseUrl}/ceo/rec_inventory`;

  constructor(private http: HttpClient) {}

  getAll(params?: { insumo_id?: number }): Observable<Inventario[]> {
    return this.http
      .get<ApiResponse<Inventario[]>>(this.apiUrl, { params: params as any })
      .pipe(
        map((res) => {
          const arr = res?.data;
          return Array.isArray(arr) ? arr : [];
        }),
      );
  }

  getPriceAlerts(params?: {
    insumo_id?: number;
    soloSubidas?: 'S' | 'N';
    location_id?: number | null;
    date_from?: string | null;
    date_to?: string | null;
  }): Observable<InventoryPriceAlert[]> {
    let httpParams = new HttpParams();

    if (params?.insumo_id) {
      httpParams = httpParams.set('insumo_id', String(params.insumo_id));
    }

    if (params?.soloSubidas) {
      httpParams = httpParams.set('soloSubidas', params.soloSubidas);
    }

    if (params?.location_id && Number(params.location_id) !== 0) {
      httpParams = httpParams.set('location_id', String(params.location_id));
    }

    if (params?.date_from) {
      httpParams = httpParams.set('date_from', params.date_from);
    }

    if (params?.date_to) {
      httpParams = httpParams.set('date_to', params.date_to);
    }

    console.log('[InventoryService] GET price-alerts', {
      url: `${this.apiUrl}/price-alerts`,
      params: {
        insumo_id: params?.insumo_id,
        soloSubidas: params?.soloSubidas,
        location_id: params?.location_id,
        date_from: params?.date_from,
        date_to: params?.date_to,
      },
    });

    return this.http
      .get<InventoryPriceAlertResponse>(`${this.apiUrl}/price-alerts`, {
        params: httpParams,
      })
      .pipe(
        map((res) => {
          const arr = res?.data;
          return Array.isArray(arr) ? arr : [];
        }),
      );
  }
}
