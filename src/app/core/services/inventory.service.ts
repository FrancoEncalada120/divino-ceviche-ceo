import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Inventario } from '../models/inventory.model';


type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private readonly apiUrl = `${environment.apiBaseUrl}/ceo/rec_inventory`;

  constructor(private http: HttpClient) { }

  getAll(params?: {
    insumo_id?: number;
  }): Observable<Inventario[]> {

    return this.http.get<ApiResponse<Inventario[]>>(this.apiUrl, { params: params as any }).pipe(
      map((res) => {
        const arr = res?.data;
        return Array.isArray(arr) ? arr : [];
      }),
    );
  }

}
