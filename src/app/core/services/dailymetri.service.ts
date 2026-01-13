import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { DailyMetric, DailyMetricCreateDto } from '../models/dashboard.models';

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
};

@Injectable({ providedIn: 'root' })
export class DailyMetricService {
  private readonly apiUrl = `${environment.apiBaseUrl}/daily-metric`;

  constructor(private http: HttpClient) {}

  /** GET ALL (opcional: filtros por location_id y date) */
  getAll(filters?: {
    location_id?: number;
    date?: number;
  }): Observable<DailyMetric[]> {
    console.log('[DailyMetricService] GET', this.apiUrl);

    let params = new HttpParams();
    if (filters?.location_id != null) {
      params = params.set('location_id', String(filters.location_id));
    }
    if (filters?.date != null) {
      params = params.set('date', String(filters.date));
    }

    return this.http
      .get<ApiResponse<DailyMetric[]>>(this.apiUrl, { params })
      .pipe(
        map((res) => {
          const arr = res?.data;
          return Array.isArray(arr) ? arr : [];
        })
      );
  }

  /** GET BY ID */
  getById(id: number): Observable<DailyMetric> {
    const url = `${this.apiUrl}/${id}`;
    console.log('[DailyMetricService] GET', url);

    return this.http.get<ApiResponse<DailyMetric>>(url).pipe(
      map((res) => {
        if (!res.success)
          throw new Error(res.message || 'Error getting daily metric');
        return res.data;
      })
    );
  }

  /** CREATE */
  create(payload: DailyMetricCreateDto): Observable<DailyMetric> {
    console.log('[DailyMetricService] POST', this.apiUrl);
    console.log('[DailyMetricService] data', payload);

    return this.http.post<ApiResponse<DailyMetric>>(this.apiUrl, payload).pipe(
      map((res) => {
        if (!res.success)
          throw new Error(res.message || 'Error creating daily metric');
        return res.data;
      })
    );
  }

  /** UPDATE */
  update(
    id: number,
    payload: Partial<DailyMetricCreateDto>
  ): Observable<DailyMetric> {
    const url = `${this.apiUrl}/${id}`;
    console.log('[DailyMetricService] PUT', url);
    console.log('[DailyMetricService] data', payload);

    return this.http.put<ApiResponse<DailyMetric>>(url, payload).pipe(
      map((res) => {
        if (!res.success)
          throw new Error(res.message || 'Error updating daily metric');
        return res.data;
      })
    );
  }

  /** DELETE */
  delete(id: number): Observable<{ success: boolean; message?: string }> {
    const url = `${this.apiUrl}/${id}`;
    console.log('[DailyMetricService] DELETE', url);

    return this.http.delete<ApiResponse<any>>(url).pipe(
      map((res) => {
        if (!res.success)
          throw new Error(res.message || 'Error deleting daily metric');
        return { success: true, message: res.message };
      })
    );
  }
}
