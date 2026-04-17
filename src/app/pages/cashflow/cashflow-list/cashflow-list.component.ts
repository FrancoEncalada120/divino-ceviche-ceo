import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TxtsignoPipe } from '../../../core/pipes/txtsigno.pipe';
import { TreeTableModule } from 'primeng/treetable';
import { CashFlow } from '../../../core/models/dashboard.models';
import { NgClass } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { UIChart } from 'primeng/chart';

interface TreeNode {
  data: any;
  children?: TreeNode[];
}

@Component({
  selector: 'app-cashflow-list',
  imports: [
    TxtsignoPipe,
    TreeTableModule,
    NgClass,
    TableModule,
    TabViewModule,
    UIChart,
  ],
  templateUrl: './cashflow-list.component.html',
  styleUrl: './cashflow-list.component.scss',
})
export class CashflowListComponent implements OnChanges {
  @Input()
  movimientos: CashFlow[] = [];

  treeData: any[] = [];

  col1 = '15%';
  colSaldos = '23%';
  colApps = '23%';

  chartData: any;
  chartOptions: any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['movimientos'] && this.movimientos) {
      this.buildTreeTable();
      this.buildNetMarginChart();
    }
  }

  buildTreeTable() {
    // 🔥 columnas numéricas
    const numericFields = [
      'venta_bruta',
      'venta_neta',
      'food_cost',
      'labor',
      'renta',
      'gastos_operacionales',
      'fees_apps',
      'gastos_varios',
      'total_gastos',
      'ganancia_neta',
      'saldo_inicial',
      'saldo_final',
      'diferencia',
      'depositos_banco',
      'debitos_banco',
      'venta_uber',
      'venta_doordash',
      'venta_owner',
      'venta_grubhub',
      'venta_inkdind',
      'tips',
      'taxes',
      'descuentos',
    ];

    // 🔥 inicializador de totales
    const initTotals = () => {
      const obj: any = {};
      numericFields.forEach((f) => (obj[f] = 0));
      obj['net_margin'] = 0; // se calcula luego
      return obj;
    };

    // 🔹 Agrupar por fecha y location
    const groupedByDate: any = {};

    this.movimientos.forEach((item) => {
      if (!groupedByDate[item.fecha]) {
        groupedByDate[item.fecha] = {};
      }

      if (!groupedByDate[item.fecha][item.location_id]) {
        groupedByDate[item.fecha][item.location_id] = [];
      }

      groupedByDate[item.fecha][item.location_id].push(item);
    });

    const tree: TreeNode[] = [];

    // 🔹 recorrer fechas
    Object.keys(groupedByDate).forEach((fecha) => {
      let totalFecha = initTotals();

      const dateNode: TreeNode = {
        data: {
          label: fecha,
          level: 'date',
          ...initTotals(),
        },
        children: [],
      };

      // 🔹 recorrer locations
      Object.keys(groupedByDate[fecha]).forEach((locId) => {
        const items = groupedByDate[fecha][locId];

        let totalLoc = initTotals();

        // 🔥 sumar dinámicamente
        items.forEach((i: any) => {
          numericFields.forEach((field) => {
            totalLoc[field] += Number(i[field] || 0);
          });
        });

        // 🔥 recalcular net_margin correctamente
        if (totalLoc.venta_neta > 0) {
          totalLoc.net_margin =
            (totalLoc.ganancia_neta / totalLoc.venta_neta) * 100;
        }

        // 🔥 acumular a fecha
        numericFields.forEach((field) => {
          totalFecha[field] += totalLoc[field];
        });

        // 🔹 nodo location
        const locationNode: TreeNode = {
          data: {
            label: items[0].location_name,
            level: 'location',
            ...totalLoc,
          },
        };

        dateNode.children?.push(locationNode);
      });

      // 🔥 recalcular net_margin en fecha
      if (totalFecha.venta_neta > 0) {
        totalFecha.net_margin =
          (totalFecha.ganancia_neta / totalFecha.venta_neta) * 100;
      }

      // 🔹 setear totales en fecha
      dateNode.data = {
        label: fecha,
        level: 'date',
        ...totalFecha,
      };

      tree.push(dateNode);
    });

    this.treeData = tree;
  }

  ngOnInit() {
    this.buildNetMarginChart();
  }

  buildNetMarginChart() {
    // 👇 solo filas de tipo fecha
    const dateRows = this.treeData
      .map((node) => node.data)
      .filter((item) => item.level === 'date');

    const labels = dateRows.map((item) => item.label);

    const netMarginData = dateRows.map((item) => item.net_margin);

    this.chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Net Margin %',
          data: netMarginData,
          backgroundColor: netMarginData.map((val) =>
            val >= 0 ? '#66BB6A' : '#EF5350',
          ),
        },
      ],
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Net Margin %',
          },
        },
        x: {
          title: {
            display: true,
            text: 'Fecha',
          },
        },
      },
    };
  }

  // mostrarImporte(row: Concepto[], concepto_id: number): number {

  //   const movimiento = row.find(mov => mov.concepto_id === concepto_id)?.total;

  //   return movimiento ? movimiento : 0;
  // }

  // SaldoFinal(row: Concepto[]): number {

  //   let saldoFinal: number = 0;
  //   for (let i = 0; i < row.length; i++) {

  //     if (row[i].concepto_accion === '+') {
  //       saldoFinal += Number(row[i].total);
  //     } else if (row[i].concepto_accion === '-') {
  //       saldoFinal -= Number(row[i].total);
  //     }

  //   }

  //   return saldoFinal;
  // }

  // getIconClassPrice(row: Concepto[], concepto_id: number): string {

  //   if (!row) return 'text-green-500';

  //   const accion = row.find(mov => mov.concepto_id === concepto_id)?.concepto_accion;

  //   if (accion === '+') return `pi pi-plus ${this.getColorPrice(row, concepto_id)}`;
  //   else if (accion === '-') return `pi pi-minus ${this.getColorPrice(row, concepto_id)}`;
  //   else return `${this.getColorPrice(row, concepto_id)}`;
  // }

  // getColorPrice(row: Concepto[], concepto_id: number): string {

  //   if (!row) return 'text-gray-500';

  //   const accion = row.find(mov => mov.concepto_id === concepto_id)?.concepto_accion;

  //   if (accion === '+') return `text-green-500`;
  //   else if (accion === '-') return `text-red-500`;
  //   else return 'text-gray-500';
  // }
}
