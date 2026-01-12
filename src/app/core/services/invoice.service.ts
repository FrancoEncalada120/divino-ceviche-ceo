import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Invoice } from '../models/dashboard.models';

type ApiResponseOne<T> = {
  success: boolean;
  invoice: T;
  message?: string;
  error?: string;
};

type ApiResponseList<T> = {
  success: boolean;
  invoices: T;
  message?: string;
  error?: string;
};

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private readonly apiUrl = `${environment.apiBaseUrl}/ceo/invoices`;

  constructor(private http: HttpClient) {}

  // CREATE -> devuelve { success, invoice }
  create(invoice: Partial<Invoice>): Observable<Invoice> {
    console.log('[InvoiceService] POST', this.apiUrl, invoice);

    return this.http.post<ApiResponseOne<Invoice>>(this.apiUrl, invoice).pipe(
      map((res) => {
        if (!res.success)
          throw new Error(res.message || 'Error creating invoice');
        return res.invoice;
      })
    );
  }

  // GET BY ID -> devuelve { success, invoice }
  getById(id: number): Observable<Invoice> {
    const url = `${this.apiUrl}/${id}`;
    console.log('[InvoiceService] GET', url);

    return this.http.get<ApiResponseOne<Invoice>>(url).pipe(
      map((res) => {
        if (!res.success)
          throw new Error(res.message || 'Error fetching invoice');
        return res.invoice;
      })
    );
  }

  // UPDATE -> devuelve { success, invoice }
  update(id: number, payload: Partial<Invoice>): Observable<Invoice> {
    const url = `${this.apiUrl}/${id}`;
    console.log('[InvoiceService] PUT', url, payload);

    return this.http.put<ApiResponseOne<Invoice>>(url, payload).pipe(
      map((res) => {
        if (!res.success)
          throw new Error(res.message || 'Error updating invoice');
        return res.invoice;
      })
    );
  }

  // (Opcional) LIST -> tu getInvoice devuelve { success, invoices, dailyMetrics, totales }
  // Si quieres listarlos sin dashboard, ajusta según tu response real.
  getAll(params?: {
    fechaIni?: string;
    fechaFin?: string;
    locacion?: string;
  }): Observable<Invoice[]> {
    console.log('[InvoiceService] GET', this.apiUrl, params);

    return this.http.get<any>(this.apiUrl, { params: params as any }).pipe(
      map((res) => {
        const arr = res?.invoices;
        return Array.isArray(arr) ? arr : [];
      })
    );
  }
}
