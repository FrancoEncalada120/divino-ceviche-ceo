import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.models';
import {
  ChangeEmployeeRateDto,
  CreateGesEmpleadoCargoDto,
  GesEmpleadoCargo,
  UpdateGesEmpleadoCargoDto,
} from '../models/ges-empleado-cargo.model';

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
};

export type GetEmpleadoCargoParams = {
  user_id?: number | null;
  cargo_id?: number | null;
  location_id?: number | null;
  estado?: string | null;
};

@Injectable({
  providedIn: 'root',
})
export class GesEmpleadoCargoService {
  private readonly apiUrl = `${environment.apiBaseUrl}/ceo/ges_empleado_cargo`;

  constructor(private http: HttpClient) {}

  // ─── GET todos ────────────────────────────────────────────
  getAll(params?: GetEmpleadoCargoParams): Observable<GesEmpleadoCargo[]> {
    const cleanParams: any = {};

    const userData = localStorage.getItem('user');
    const user: User | null = userData ? (JSON.parse(userData) as User) : null;

    if (user?.user_rol === 3 && user?.location_id) {
      cleanParams.location_id = Number(user.location_id);
    } else if (params?.location_id && Number(params.location_id) !== 0) {
      cleanParams.location_id = Number(params.location_id);
    }

    if (params?.user_id && Number(params.user_id) !== 0) {
      cleanParams.user_id = Number(params.user_id);
    }

    if (params?.cargo_id && Number(params.cargo_id) !== 0) {
      cleanParams.cargo_id = Number(params.cargo_id);
    }

    if (params?.estado) {
      cleanParams.estado = params.estado;
    }

    console.log('[GesEmpleadoCargoService] GET', this.apiUrl, cleanParams);

    return this.http
      .get<ApiResponse<GesEmpleadoCargo[]>>(this.apiUrl, {
        params: cleanParams,
      })
      .pipe(
        map((res) => {
          if (!res.success) {
            throw new Error(res.message || 'Error getting employee positions');
          }

          return res.data ?? [];
        }),
      );
  }

  // ─── GET por id ───────────────────────────────────────────
  getById(id: number): Observable<GesEmpleadoCargo | null> {
    const url = `${this.apiUrl}/${id}`;

    console.log('[GesEmpleadoCargoService] GET BY ID', url);

    return this.http.get<ApiResponse<GesEmpleadoCargo>>(url).pipe(
      map((res) => {
        if (!res.success) {
          return null;
        }

        return res.data;
      }),
    );
  }

  // ─── POST crear ───────────────────────────────────────────
  create(payload: CreateGesEmpleadoCargoDto): Observable<GesEmpleadoCargo> {
    const userData = localStorage.getItem('user');
    const user: User | null = userData ? (JSON.parse(userData) as User) : null;

    const body: CreateGesEmpleadoCargoDto = {
      ...payload,
      created_by: payload.created_by ?? user?.user_id ?? null,
    };

    console.log('[GesEmpleadoCargoService] POST', this.apiUrl, body);

    return this.http.post<ApiResponse<any>>(this.apiUrl, body).pipe(
      map((res) => {
        if (!res.success) {
          throw new Error(res.message || 'Error creating employee position');
        }

        return res.data?.empleado_cargo ?? res.data;
      }),
    );
  }

  // ─── PUT actualizar ───────────────────────────────────────
  update(
    id: number,
    payload: UpdateGesEmpleadoCargoDto,
  ): Observable<GesEmpleadoCargo> {
    const url = `${this.apiUrl}/${id}`;

    const userData = localStorage.getItem('user');
    const user: User | null = userData ? (JSON.parse(userData) as User) : null;

    const body: UpdateGesEmpleadoCargoDto = {
      ...payload,
      updated_by: payload.updated_by ?? user?.user_id ?? null,
    };

    console.log('[GesEmpleadoCargoService] PUT', url, body);

    return this.http.put<ApiResponse<GesEmpleadoCargo>>(url, body).pipe(
      map((res) => {
        if (!res.success) {
          throw new Error(res.message || 'Error updating employee position');
        }

        return res.data;
      }),
    );
  }

  // ─── PATCH cambiar tarifa ─────────────────────────────────
  changeRate(
    empleadoCargoId: number,
    payload: ChangeEmployeeRateDto,
  ): Observable<any> {
    const url = `${this.apiUrl}/${empleadoCargoId}/tarifa`;

    const userData = localStorage.getItem('user');
    const user: User | null = userData ? (JSON.parse(userData) as User) : null;

    const body: ChangeEmployeeRateDto = {
      ...payload,
      updated_by: payload.updated_by ?? user?.user_id ?? null,
      created_by: payload.created_by ?? user?.user_id ?? null,
    };

    console.log('[GesEmpleadoCargoService] PATCH TARIFA', url, body);

    return this.http.patch<ApiResponse<any>>(url, body).pipe(
      map((res) => {
        if (!res.success) {
          throw new Error(res.message || 'Error changing employee rate');
        }

        return res.data;
      }),
    );
  }

  // ─── DELETE / inactivar ───────────────────────────────────
  delete(id: number, updated_by?: number | null): Observable<GesEmpleadoCargo> {
    const url = `${this.apiUrl}/${id}`;

    const userData = localStorage.getItem('user');
    const user: User | null = userData ? (JSON.parse(userData) as User) : null;

    const body = {
      updated_by: updated_by ?? user?.user_id ?? null,
    };

    console.log('[GesEmpleadoCargoService] DELETE / INACTIVATE', url, body);

    return this.http.delete<ApiResponse<GesEmpleadoCargo>>(url, { body }).pipe(
      map((res) => {
        if (!res.success) {
          throw new Error(
            res.message || 'Error inactivating employee position',
          );
        }

        return res.data;
      }),
    );
  }
}
