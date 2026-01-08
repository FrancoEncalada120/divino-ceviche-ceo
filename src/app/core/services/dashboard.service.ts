import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { DashboardResponse, } from '../models/dashboard.models';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardService {

  private readonly apiUrl = `${environment.apiBaseUrl}/ceo/invoices`;

  constructor(private http: HttpClient) { }

  getDashboard(fechaIni: string, fechaFin: string, locations: string): Observable<DashboardResponse> {

    let url = `${this.apiUrl}?fechaIni=${fechaIni}&fechaFin=${fechaFin}&locacion=${locations}`;

    console.log('[Dashboard] getDashboard URL:', url);

    return this.http.get<DashboardResponse>(url);
  }

}
