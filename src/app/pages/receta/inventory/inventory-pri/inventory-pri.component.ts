import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Inventario } from '../../../../core/models/inventory.model';
import { Insumo } from '../../../../core/models/insumo.model';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import * as XLSX from 'xlsx';
import { ButtonModule } from 'primeng/button';

import { TimeAgoPipe } from '../../../../core/pipes/timeAgo';
import { TabPanel, TabView } from 'primeng/tabview';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-inventory-pri',
  imports: [
    TableModule,
    CommonModule,
    ButtonModule,
    ChartModule,
    TimeAgoPipe,
    TabPanel,
    TabView,
  ],
  templateUrl: './inventory-pri.component.html',
  styleUrl: './inventory-pri.component.scss',
})
export class InventoryPriComponent {
  @Input()
  inventoryList: Inventario[] = [];

  @Input()
  insumo: Insumo | null = null;
  @Output() close = new EventEmitter<void>();

  chartData: any;
  chartOptions: any;
  ngOnInit() {
    this.buildChart();
  }

  getTrend(curr: number, prev: number): 'up' | 'down' | 'same' {
    if (curr > prev) return 'up';
    if (curr < prev) return 'down';
    return 'same';
  }

  priceTrend(i: number): 'up' | 'down' | 'same' | null {
    if (i === 0) return null;
    return this.getTrend(this.inventoryList[i].precio, this.inventoryList[i - 1].precio);
  }

  stockTrend(i: number): 'up' | 'down' | 'same' | null {
    if (i === 0) return null;
    return this.getTrend(this.inventoryList[i].stock, this.inventoryList[i - 1].stock);
  }

  prevPrice(i: number): number | null {
    return i > 0 ? this.inventoryList[i - 1].precio : null;
  }

  prevStock(i: number): number | null {
    return i > 0 ? this.inventoryList[i - 1].stock : null;
  }

  getColorPrice(i: number): string {
    if (i == 0) return '';
    let diff = this.inventoryList[i].precio - this.inventoryList[i - 1].precio;
    if (diff > 0) return 'text-green-500';
    else if (diff < 0) return 'text-red-500';
    else return '';
  }

  getIconClassPrice(i: number): string {
    if (i == 0) return 'text-green-500';
    let diff = this.inventoryList[i].precio - this.inventoryList[i - 1].precio;
    if (diff > 0) return `pi pi-arrow-up ${this.getColorPrice(i)}`;
    else if (diff < 0) return `pi pi-arrow-down ${this.getColorPrice(i)}`;
    else return 'pi pi-arrows-h';
  }

  getColor(desc: string): string {
    switch (desc) {
      case '1':
        return 'text-green-500';
      case '2':
        return 'text-red-500';
      case '3':
        return 'text-green-500';
      case '4':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  }

  getIconClass(desc: string): string {
    switch (desc) {
      case '1':
        return `pi pi-arrow-up ${this.getColor(desc)}`;
      case '2':
        return `pi pi-arrow-down ${this.getColor(desc)}`;
      case '3':
        return `pi pi-arrow-up ${this.getColor(desc)}`;
      case '4':
        return `pi pi-arrow-down ${this.getColor(desc)}`;
      default:
        return `pi pi-minus ${this.getColor(desc)}`;
    }
  }

  getDesc(desc: string, compra_id: string = ''): string {
    switch (desc) {
      case '1':
        return '(+) Actualización del insumo';
      case '2':
        return '(-) Actualización del insumo';
      case '3':
        return 'ID de Compra: ' + compra_id;
      case '4':
        return 'Compra eliminada';
      default:
        return desc || '-';
    }
  }

  exportToExcel() {
    if (!this.inventoryList || this.inventoryList.length === 0) return;

    // Mapear data a columnas planas en inglés
    const data = this.inventoryList.map((i) => ({
      Date: i.inventario_fecha,
      //Insumo: `${this.insumo?.nombre} ${this.insumo?.cantidad || 0} x ${this.insumo?.unidad?.abreviatura || ''}`,
      // Cantidad: i.cantidad,
      Price: i.precio,
      Total: i.total,
      Stock: i.stock,
      Descripción: this.getDesc(i.inventario_desc!, i.compra_id.toString()),
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventory List');
    XLSX.writeFile(wb, 'inventory-list.xlsx');
  }

  buildChart() {
    const labels = this.inventoryList.map((item) =>
      new Date(item.inventario_fecha).toLocaleDateString('es-PE'),
    );

    const stockData = this.inventoryList.map((item) => item.stock);
    const priceData = this.inventoryList.map((item) => item.precio);

    this.chartData = {
      labels: labels,
      datasets: [
        {
          type: 'line',
          label: 'Stock',
          data: stockData,
          borderColor: '#42A5F5',
          backgroundColor: '#42A5F5',
          tension: 0.3,
          fill: false,
          yAxisID: 'y',
        },
        {
          type: 'line', // 👈 mejor línea que barra para precio
          label: 'Price',
          data: priceData,
          borderColor: '#FFA726',
          backgroundColor: '#FFA726',
          tension: 0.3,
          fill: false,
          yAxisID: 'y1',
        },
      ],
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top',
        },
      },
      scales: {
        y: {
          type: 'linear',
          position: 'left',
          title: {
            display: true,
            text: 'Stock',
          },
        },
        y1: {
          type: 'linear',
          position: 'right',
          grid: {
            drawOnChartArea: false,
          },
          title: {
            display: true,
            text: 'Precio',
          },
        },
      },
    };
  }
}
