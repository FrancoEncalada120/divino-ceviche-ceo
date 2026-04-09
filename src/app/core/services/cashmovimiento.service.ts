import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { MovimientoAgrupado } from '../models/cash-movimiento.model';

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

@Injectable({ providedIn: 'root' })
export class cashMovimientoService {

  private readonly apiUrl = `${environment.apiBaseUrl}/cashflow/movimientos`;


  constructor(private http: HttpClient) { }

  getMovimientosAll(params?: {
    fechaIni?: string;
    fechaFin?: string;
    lstLocations?: string;
  }): Observable<MovimientoAgrupado[]> {

    return this.http.get<ApiResponse<MovimientoAgrupado[]>>(this.apiUrl, { params: params as any }).pipe(
      map((res) => {
        const arr = res?.data;
        return Array.isArray(arr) ? arr : [];
      })
    );

  }

}
