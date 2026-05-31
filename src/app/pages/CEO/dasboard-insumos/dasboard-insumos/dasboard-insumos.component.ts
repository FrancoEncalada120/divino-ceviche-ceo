import { Component, OnInit } from '@angular/core';
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
export class DashboardInsumosComponent implements OnInit {
  loading: boolean = false;

  alerts: InventoryPriceAlert[] = [];
  selectedAlert: InventoryPriceAlert | null = null;

  totalSubidas: number = 0;
  incrementoPromedio: number = 0;
  mayorSubida: InventoryPriceAlert | null = null;
  impactoTotal: number = 0;

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.loadPriceAlerts();
  }

  loadPriceAlerts(): void {
    this.loading = true;

    this.inventoryService.getPriceAlerts({ soloSubidas: 'S' }).subscribe({
      next: (data) => {
        this.alerts = data || [];
        this.calculateKpis();
        this.selectedAlert = this.alerts.length > 0 ? this.alerts[0] : null;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando alertas de precios:', error);
        this.alerts = [];
        this.selectedAlert = null;
        this.calculateKpis();
        this.loading = false;
      },
    });
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
