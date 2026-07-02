import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  GesHorario,
  GesHorarioOverlapError,
  GesHorarioStatus,
} from '../models/ges-horario.model';

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  code?: string;
};

export type GetGesHorariosParams = {
  user_id?: number | null;
  location_id?: number | null;
  status?: GesHorarioStatus | string | null;
  start_date?: string | null;
  end_date?: string | null;
};

export type CreateGesHorarioDto = {
  user_id: number;
  location_id: number;
  start_datetime: string | Date;
  end_datetime: string | Date;
  status?: GesHorarioStatus;
  notes?: string | null;
  created_by?: number | null;
};

export type UpdateGesHorarioDto = {
  user_id?: number;
  location_id?: number;
  start_datetime?: string | Date;
  end_datetime?: string | Date;
  status?: GesHorarioStatus;
  notes?: string | null;
  updated_by?: number | null;
};

export type UpdateGesHorarioStatusDto = {
  status: GesHorarioStatus;
  updated_by?: number | null;
};

@Injectable({
  providedIn: 'root',
})
export class GesHorarioService {
  private readonly apiUrl = `${environment.apiBaseUrl}/ceo/ges_horario`;

  constructor(private http: HttpClient) {}

  getAll(params?: GetGesHorariosParams): Observable<GesHorario[]> {
    const cleanParams: Record<string, string | number> = {};

    if (params?.user_id && Number(params.user_id) !== 0) {
      cleanParams['user_id'] = Number(params.user_id);
    }

    if (params?.location_id && Number(params.location_id) !== 0) {
      cleanParams['location_id'] = Number(params.location_id);
    }

    if (params?.status) {
      cleanParams['status'] = params.status;
    }

    if (params?.start_date) {
      cleanParams['start_date'] = params.start_date;
    }

    if (params?.end_date) {
      cleanParams['end_date'] = params.end_date;
    }

    return this.http
      .get<ApiResponse<GesHorario[]>>(this.apiUrl, { params: cleanParams })
      .pipe(
        map((res) => {
          if (!res.success) {
            throw new Error(res.message || 'Error getting schedules');
          }

          return res.data ?? [];
        }),
        catchError((error) => this.handleError(error)),
      );
  }

  getById(id: number): Observable<GesHorario | null> {
    const url = `${this.apiUrl}/${id}`;

    return this.http.get<ApiResponse<GesHorario>>(url).pipe(
      map((res) => {
        if (!res.success) {
          return null;
        }

        return res.data;
      }),
      catchError((error) => this.handleError(error)),
    );
  }

  create(payload: CreateGesHorarioDto): Observable<GesHorario> {
    const body = {
      ...payload,
      start_datetime: this.formatDateTime(payload.start_datetime),
      end_datetime: this.formatDateTime(payload.end_datetime),
      status: payload.status ?? 'scheduled',
      notes: payload.notes ?? null,
      created_by: payload.created_by ?? null,
    };

    return this.http.post<ApiResponse<GesHorario>>(this.apiUrl, body).pipe(
      map((res) => {
        if (!res.success) {
          throw new Error(res.message || 'Error creating schedule');
        }

        return res.data;
      }),
      catchError((error) => this.handleError(error)),
    );
  }

  update(id: number, payload: UpdateGesHorarioDto): Observable<GesHorario> {
    const url = `${this.apiUrl}/${id}`;

    const body: Partial<UpdateGesHorarioDto> = {
      ...payload,
      updated_by: payload.updated_by ?? null,
    };

    if (payload.start_datetime) {
      body.start_datetime = this.formatDateTime(payload.start_datetime);
    }

    if (payload.end_datetime) {
      body.end_datetime = this.formatDateTime(payload.end_datetime);
    }

    return this.http.put<ApiResponse<GesHorario>>(url, body).pipe(
      map((res) => {
        if (!res.success) {
          throw new Error(res.message || 'Error updating schedule');
        }

        return res.data;
      }),
      catchError((error) => this.handleError(error)),
    );
  }

  delete(id: number): Observable<boolean> {
    const url = `${this.apiUrl}/${id}`;

    return this.http.delete<ApiResponse<null>>(url).pipe(
      map((res) => {
        if (!res.success) {
          throw new Error(res.message || 'Error deleting schedule');
        }

        return true;
      }),
      catchError((error) => this.handleError(error)),
    );
  }

  updateStatus(
    id: number,
    payload: UpdateGesHorarioStatusDto,
  ): Observable<GesHorario> {
    const url = `${this.apiUrl}/${id}/status`;

    const body = {
      status: payload.status,
      updated_by: payload.updated_by ?? null,
    };

    return this.http.patch<ApiResponse<GesHorario>>(url, body).pipe(
      map((res) => {
        if (!res.success) {
          throw new Error(res.message || 'Error updating schedule status');
        }

        return res.data;
      }),
      catchError((error) => this.handleError(error)),
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 409 && error.error?.code === 'SCHEDULE_OVERLAP') {
      return throwError(() => error.error as GesHorarioOverlapError);
    }

    const message =
      error.error?.message ||
      error.message ||
      'Unexpected schedule service error';

    return throwError(() => new Error(message));
  }

  private formatDateTime(value: string | Date): string {
    if (typeof value === 'string') {
      return value;
    }

    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    const hours = String(value.getHours()).padStart(2, '0');
    const minutes = String(value.getMinutes()).padStart(2, '0');
    const seconds = String(value.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
}
