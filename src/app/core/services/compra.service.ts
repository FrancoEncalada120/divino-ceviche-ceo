import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CompraFullCreate } from '../models/compra-full-create.model';
import { CompraFullResponse, DeleteCompraResponse } from '../models/compra-full-response.model';
import { CompraDetalle } from '../models/compra-detalle.model';
import { Compra } from '../models/compra.model';

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

@Injectable({ providedIn: 'root' })
export class CompraService {
  private readonly apiUrl = `${environment.apiBaseUrl}/ceo/rec_compras`;

  constructor(private http: HttpClient) { }

  getComprasAll(params?: {
    fechaIni?: string;
    fechaFin?: string;
    lstProveedor?: string;
    lstInsumo?: string;
  }): Observable<CompraDetalle[]> {

    console.log('Fetching compras with params:', params);

    return this.http.get<ApiResponse<CompraDetalle[]>>(this.apiUrl, { params: params as any }).pipe(
      map((res) => {
        const arr = res?.data;
        return Array.isArray(arr) ? arr : [];
      }),
    );
  }

  getComprasOrderAll(params?: {
    fechaIni?: string;
    fechaFin?: string;
    lstProveedor?: string;
    lstInsumo?: string;
  }): Observable<Compra[]> {

    return this.http.get<ApiResponse<Compra[]>>(this.apiUrl + "/order", { params: params as any }).pipe(
      map((res) => {
        const arr = res?.data;
        console.log("getComprasOrderAll", arr);
        return Array.isArray(arr) ? arr : [];
      }),
    );
  }

  /**
   * Crea compra + detalles en una sola llamada
   * POST /ceo/rec_compras/full
   *
   * Mientras no tengas JWT: manda x-user-id en header (temporal).
   */
  createFull(
    payload: CompraFullCreate,
    userId?: number,
  ): Observable<CompraFullResponse> {
    const url = `${this.apiUrl}/full`;

    return this.http
      .post<ApiResponse<CompraFullResponse>>(url, payload)
      .pipe(
        map((res) => {
          if (!res.success)
            throw new Error(res.message || 'Error creating compra full');
          return res.data;
        }),
      );
  }


  createFullOrder(
    payload: CompraFullCreate,
    userId?: number,
  ): Observable<CompraFullResponse> {
    const url = `${this.apiUrl}/fullorder`;

    return this.http
      .post<ApiResponse<CompraFullResponse>>(url, payload)
      .pipe(
        map((res) => {
          if (!res.success)
            throw new Error(res.message || 'Error creating compra full');
          return res.data;
        }),
      );
  }

  deleteCompra(
    compraId: number,
    userId?: number
  ): Observable<DeleteCompraResponse> {

    const url = `${this.apiUrl}/${compraId}`;

    return this.http
      .delete<ApiResponse<DeleteCompraResponse>>(url)
      .pipe(
        map((res) => {
          if (!res.success) {
            throw new Error(res.message || 'Error deleting compra');
          }
          return res.data;
        })
      );
  }

  deleteCompraOrder(
    compraId: number,
    userId?: number
  ): Observable<DeleteCompraResponse> {

    const url = `${this.apiUrl}/order/${compraId}`;

    return this.http
      .delete<ApiResponse<DeleteCompraResponse>>(url)
      .pipe(
        map((res) => {
          if (!res.success) {
            throw new Error(res.message || 'Error deleting compra');
          }
          return res.data;
        })
      );
  }

  // updateFull(
  //   payload: CompraFullCreate,
  //   userId?: number,
  // ): Observable<CompraFullResponse> {
  //   const url = `${this.apiUrl}/full`;


  //   const options = userId
  //     ? { headers: { 'x-user-id': String(userId) } }
  //     : undefined;

  //   return this.http
  //     .post<ApiResponse<CompraFullResponse>>(url, payload, options)
  //     .pipe(
  //       map((res) => {
  //         if (!res.success)
  //           throw new Error(res.message || 'Error creating compra full');
  //         return res.data;
  //       }),
  //     );s
  // }

}
