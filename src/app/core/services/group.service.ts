import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Grupo, grupoCreateRequest } from '../models/grupos.model';

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

@Injectable({ providedIn: 'root' })
export class RecGroupService {
  private readonly apiUrl = `${environment.apiBaseUrl}/ceo/rec_grupos`;

  constructor(private http: HttpClient) { }

  getGrupoAll(): Observable<Grupo[]> {


    return this.http.get<ApiResponse<Grupo[]>>(this.apiUrl).pipe(
      map((res) => {
        const arr = res?.data;
        return Array.isArray(arr) ? arr : [];
      }),
    );
  }

  create(data: grupoCreateRequest): Observable<Grupo> {
    console.log('[RecConversionService] POST', this.apiUrl);
    console.log('[RecConversionService] data', data);

    return this.http.post<ApiResponse<Grupo>>(this.apiUrl, data).pipe(
      map((res) => {
        console.log('[RecConversionService] res', res);

        if (!res.success) {
          throw new Error(res.message || 'Error creating conversion');
        }

        return res.data;
      }),
    );
  }

  update(
    id: number,
    data: grupoCreateRequest,
  ): Observable<Grupo> {
    const url = `${this.apiUrl}/${id}`;
    console.log('[RecConversionService] PUT', url);
    console.log('[RecConversionService] data', data);

    return this.http.put<ApiResponse<Grupo>>(url, data).pipe(
      map((res) => {
        if (!res.success) {
          throw new Error(res.message || 'Error updating conversion');
        }

        return res.data;
      }),
    );
  }

  delete(id: number): Observable<boolean> {
    const url = `${this.apiUrl}/${id}`;
    console.log('[RecConversionService] DELETE', url);

    return this.http.delete<ApiResponse<any>>(url).pipe(
      map((res) => {
        if (!res.success) {
          throw new Error(res.message || 'Error deleting conversion');
        }

        return true;
      }),
    );
  }
}
