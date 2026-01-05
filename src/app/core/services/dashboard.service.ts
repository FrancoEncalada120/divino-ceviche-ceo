import { Injectable } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';
import {
  DashboardFilters,
  DashboardResponse,
} from '../models/dashboard.models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  getDashboard(filters: DashboardFilters): Observable<DashboardResponse> {
    // MOCK: simula API con delay
    return of(null).pipe(
      delay(300),
      map(() => ({
        hasMissingYesterday: true,
        locations: [
          { id: 'all', name: 'All locations' },
          { id: '1', name: 'Miraflores' },
          { id: '2', name: 'San Isidro' },
        ],
        kpis: [
          {
            key: 'netSales',
            title: 'Net Sales',
            value: 85012,
            format: 'currency',
            icon: 'bi-currency-dollar',
          },
          {
            key: 'cogs',
            title: 'COGS %',
            value: 13.0,
            format: 'percent',
            icon: 'bi-receipt',
          },
          {
            key: 'labor',
            title: 'Labor Cost %',
            value: 18.3,
            format: 'percent',
            icon: 'bi-people',
          },
          {
            key: 'prime',
            title: 'Prime Cost %',
            value: 31.3,
            format: 'percent',
            icon: 'bi-calculator',
          },
          {
            key: 'aov',
            title: 'Average Order Value',
            value: 49,
            format: 'currency',
            icon: 'bi-bag',
          },
          {
            key: 'netMargin',
            title: 'Net Margin %',
            value: 5.3,
            format: 'percent',
            icon: 'bi-graph-up',
          },
        ],
      }))
    );
  }

  // Cuando conectes a API: aquí solo reemplazas por HttpClient.get(...)
  // getDashboard(filters: DashboardFilters): Observable<DashboardResponse> {
  //   return this.http.get<DashboardResponse>('/api/dashboard', { params: {...} });
  // }
}
