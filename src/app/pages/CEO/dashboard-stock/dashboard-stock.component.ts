import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';

import { InsumoService } from '../../../core/services/insumo.service';
import {
  StockCriticalDashboardData,
  StockCriticalItem,
  StockCriticalKpis,
} from '../../../core/models/insumo.model';

@Component({
  selector: 'app-dashboard-stock',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TableModule,
    ButtonModule,
    TabViewModule,
    TagModule,
  ],
  templateUrl: './dashboard-stock.component.html',
  styleUrls: ['./dashboard-stock.component.scss'],
})
export class DashboardStockComponent implements OnInit {
  loading = false;

  data: StockCriticalDashboardData | null = null;

  kpis: StockCriticalKpis = {
    total_productos: 0,
    productos_sin_stock: 0,
    productos_bajo_minimo: 0,
    productos_stock_ok: 0,
    productos_sin_stock_ideal: 0,
    inventario_vencido: 0,
    valor_faltante_total: 0,
    porcentaje_saludable: 0,
    riesgo_general: 'BAJO',
  };

  productosCriticos: StockCriticalItem[] = [];
  inventarioVencido: StockCriticalItem[] = [];
  selectedItem: StockCriticalItem | null = null;

  constructor(private insumoService: InsumoService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;

    this.insumoService.getStockCriticalDashboard().subscribe({
      next: (resp) => {
        this.data = resp;
        this.kpis = resp.kpis;
        this.productosCriticos = resp.productos_criticos || [];
        this.inventarioVencido = resp.inventario_vencido || [];
        this.selectedItem = this.productosCriticos.length
          ? this.productosCriticos[0]
          : null;

        this.loading = false;
      },
      error: (err) => {
        console.error('[DashboardStock] Error:', err);
        this.loading = false;
      },
    });
  }

  refresh(): void {
    this.loadDashboard();
  }

  selectItem(item: StockCriticalItem): void {
    this.selectedItem = item;
  }

  toNumber(value: string | number | null | undefined): number {
    if (value === null || value === undefined) return 0;
    return Number(value) || 0;
  }

  formatNumber(value: string | number | null | undefined): string {
    return this.toNumber(value).toFixed(2);
  }

  formatMoney(value: string | number | null | undefined): string {
    return this.toNumber(value).toFixed(2);
  }

  formatPercent(value: string | number | null | undefined): string {
    return this.toNumber(value).toFixed(2);
  }

  getStockStatusLabel(status: string | null | undefined): string {
    const value = (status || '').toUpperCase();

    if (value === 'SIN_STOCK') return 'Sin stock';
    if (value === 'BAJO_MINIMO') return 'Bajo mínimo';
    if (value === 'OK') return 'OK';
    if (value === 'SIN_STOCK_IDEAL') return 'Sin mínimo';

    return value || '-';
  }

  getRiskLabel(risk: string | null | undefined): string {
    const value = (risk || '').toUpperCase();

    if (value === 'CRITICO') return 'Crítico';
    if (value === 'ALTO') return 'Alto';
    if (value === 'MEDIO') return 'Medio';
    if (value === 'BAJO') return 'Bajo';
    if (value === 'SIN_CONFIGURAR') return 'Sin configurar';

    return value || '-';
  }

  getRiskClass(risk: string | null | undefined): string {
    const value = (risk || '').toUpperCase();

    switch (value) {
      case 'CRITICO':
        return 'nivel-critica';
      case 'ALTO':
        return 'nivel-alta';
      case 'MEDIO':
        return 'nivel-media';
      case 'BAJO':
        return 'nivel-baja';
      default:
        return 'nivel-default';
    }
  }

  getStockClass(status: string | null | undefined): string {
    const value = (status || '').toUpperCase();

    switch (value) {
      case 'SIN_STOCK':
        return 'nivel-critica';
      case 'BAJO_MINIMO':
        return 'nivel-alta';
      case 'OK':
        return 'nivel-baja';
      case 'SIN_STOCK_IDEAL':
        return 'nivel-default';
      default:
        return 'nivel-default';
    }
  }

  getGeneralRiskClass(): string {
    const value = (this.kpis.riesgo_general || '').toUpperCase();

    if (value === 'ALTO') return 'kpi-diff negative';
    if (value === 'MEDIO') return 'kpi-diff warning';
    return 'kpi-diff positive';
  }

  getRecommendedAction(item: StockCriticalItem | null): string {
    if (!item) return '-';

    const estado = (item.estado_stock || '').toUpperCase();
    const riesgo = (item.nivel_riesgo || '').toUpperCase();

    if (estado === 'SIN_STOCK') return 'Comprar urgente';
    if (riesgo === 'CRITICO') return 'Reordenar hoy';
    if (riesgo === 'ALTO') return 'Comprar pronto';
    if (estado === 'SIN_STOCK_IDEAL') return 'Configurar stock mínimo';

    return 'Monitorear';
  }
}
