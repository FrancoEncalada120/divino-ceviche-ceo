import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

import { InventoryPriceAlert } from '../../../../core/models/inventory.model';
import { InventoryService } from '../../../../core/services/inventory.service';

import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';

@Component({
  imports: [CommonModule, CardModule, TableModule, ButtonModule, TabViewModule],
  selector: 'app-dashboard-insumos',
  templateUrl: './dasboard-insumos.component.html',
  styleUrl: './dasboard-insumos.component.scss',
})
export class DashboardInsumosComponent implements OnInit, OnChanges {
  @Input() selectedLocation: any[] = [];
  @Input() dateRange: Date[] | null = null;

  loading: boolean = false;

  alerts: InventoryPriceAlert[] = [];
  selectedAlert: InventoryPriceAlert | null = null;

  totalSubidas: number = 0;
  incrementoPromedio: number = 0;
  mayorSubida: InventoryPriceAlert | null = null;
  impactoTotal: number = 0;

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    console.log('[DashboardInsumos] ngOnInit');
    console.log(
      '[DashboardInsumos] selectedLocation inicial:',
      this.selectedLocation,
    );
    console.log('[DashboardInsumos] dateRange inicial:', this.dateRange);

    this.loadPriceAlerts();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('[DashboardInsumos] ngOnChanges:', changes);

    const locationChanged =
      changes['selectedLocation'] && !changes['selectedLocation'].firstChange;

    const dateChanged =
      changes['dateRange'] && !changes['dateRange'].firstChange;

    console.log('[DashboardInsumos] locationChanged:', locationChanged);
    console.log('[DashboardInsumos] dateChanged:', dateChanged);
    console.log(
      '[DashboardInsumos] selectedLocation actual:',
      this.selectedLocation,
    );
    console.log('[DashboardInsumos] dateRange actual:', this.dateRange);

    if (locationChanged || dateChanged) {
      this.loadPriceAlerts();
    }
  }
  loadPriceAlerts(): void {
    this.loading = true;

    console.log('================ DASHBOARD INSUMOS LOAD ================');
    console.log(
      '[DashboardInsumos] selectedLocation recibido:',
      this.selectedLocation,
    );
    console.log('[DashboardInsumos] dateRange recibido:', this.dateRange);

    const locationId = this.getSelectedLocationId();
    const dateFrom = this.getDateFrom();
    const dateTo = this.getDateTo();

    const params: {
      soloSubidas: 'S' | 'N';
      location_id?: number | null;
      date_from?: string | null;
      date_to?: string | null;
    } = {
      soloSubidas: 'S',
      location_id: locationId ?? null,
      date_from: dateFrom ?? null,
      date_to: dateTo ?? null,
    };

    console.log('[DashboardInsumos] locationId calculado:', locationId);
    console.log('[DashboardInsumos] dateFrom calculado:', dateFrom);
    console.log('[DashboardInsumos] dateTo calculado:', dateTo);
    console.log('[DashboardInsumos] Params enviados al backend:', params);

    this.inventoryService.getPriceAlerts(params).subscribe({
      next: (data) => {
        console.log('[DashboardInsumos] Respuesta completa del backend:', data);
        console.log('[DashboardInsumos] ¿data es array?:', Array.isArray(data));
        console.log(
          '[DashboardInsumos] Total recibido:',
          Array.isArray(data) ? data.length : 'NO ES ARRAY',
        );

        this.alerts = Array.isArray(data) ? data : [];

        console.log('[DashboardInsumos] alerts asignado:', this.alerts);
        console.log('[DashboardInsumos] Total alerts:', this.alerts.length);

        this.calculateKpis();

        console.log('[DashboardInsumos] KPIs calculados:', {
          totalSubidas: this.totalSubidas,
          incrementoPromedio: this.incrementoPromedio,
          mayorSubida: this.mayorSubida,
          impactoTotal: this.impactoTotal,
        });

        this.selectedAlert = this.alerts.length > 0 ? this.alerts[0] : null;

        console.log('[DashboardInsumos] selectedAlert:', this.selectedAlert);

        this.loading = false;
        console.log('[DashboardInsumos] loading:', this.loading);
      },
      error: (error) => {
        console.error(
          '[DashboardInsumos] Error cargando alertas de precios:',
          error,
        );
        console.error('[DashboardInsumos] Status:', error?.status);
        console.error('[DashboardInsumos] Error body:', error?.error);
        console.error('[DashboardInsumos] Message:', error?.message);

        this.alerts = [];
        this.selectedAlert = null;
        this.calculateKpis();

        this.loading = false;
      },
      complete: () => {
        console.log('[DashboardInsumos] Petición completada');
      },
    });
  }

  getSelectedLocationId(): number | undefined {
    if (!this.selectedLocation || this.selectedLocation.length === 0) {
      return undefined;
    }

    const firstLocation = this.selectedLocation[0];

    return Number(firstLocation.location_id || 0) || undefined;
  }

  getDateFrom(): string | undefined {
    if (!this.dateRange || !this.dateRange[0]) {
      return undefined;
    }

    return this.formatDateForApi(this.dateRange[0]);
  }

  getDateTo(): string | undefined {
    if (!this.dateRange || !this.dateRange[1]) {
      return undefined;
    }

    return this.formatDateForApi(this.dateRange[1]);
  }

  formatDateForApi(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  calculateKpis(): void {
    this.totalSubidas = this.alerts.length;

    if (!this.alerts.length) {
      this.incrementoPromedio = 0;
      this.mayorSubida = null;
      this.impactoTotal = 0;
      return;
    }

    const totalPorcentaje = this.alerts.reduce((sum, item) => {
      return sum + this.toNumber(item.variacion_porcentaje);
    }, 0);

    this.incrementoPromedio = totalPorcentaje / this.alerts.length;

    this.mayorSubida = this.alerts.reduce((max, item) => {
      return this.toNumber(item.variacion_porcentaje) >
        this.toNumber(max.variacion_porcentaje)
        ? item
        : max;
    }, this.alerts[0]);

    this.impactoTotal = this.alerts.reduce((sum, item) => {
      return sum + this.toNumber(item.diferencia_precio);
    }, 0);
  }

  selectAlert(item: InventoryPriceAlert): void {
    this.selectedAlert = item;
  }

  refresh(): void {
    this.loadPriceAlerts();
  }

  toNumber(value: string | number | null | undefined): number {
    if (value === null || value === undefined) {
      return 0;
    }

    return Number(value) || 0;
  }

  formatMoney(value: string | number | null | undefined): string {
    return this.toNumber(value).toFixed(2);
  }

  formatPercent(value: string | number | null | undefined): string {
    return this.toNumber(value).toFixed(2);
  }

  getNivelClass(nivel: string | null | undefined): string {
    const value = (nivel || '').toUpperCase();

    switch (value) {
      case 'CRITICA':
        return 'nivel-critica';
      case 'ALTA':
        return 'nivel-alta';
      case 'MEDIA':
        return 'nivel-media';
      case 'BAJA':
      case 'BAJO':
        return 'nivel-baja';
      default:
        return 'nivel-default';
    }
  }

  getNivelLabel(nivel: string | null | undefined): string {
    const value = (nivel || '').toUpperCase();

    if (value === 'CRITICA') return 'Crítica';
    if (value === 'ALTA') return 'Alta';
    if (value === 'MEDIA') return 'Media';
    if (value === 'BAJA' || value === 'BAJO') return 'Baja';

    return value || '-';
  }
}
