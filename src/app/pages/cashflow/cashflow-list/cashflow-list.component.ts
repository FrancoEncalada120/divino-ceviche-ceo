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
  @Input() movimientos: CashFlow[] = [];
  @Input() movimientosMonth: CashFlow[] = [];

  treeData: any[] = [];

  col1 = '15%';
  colSaldos = '23%';
  colApps = '23%';

  chartData: any;
  chartOptions: any;
  saldosChartData: any;
  saldosChartOptions: any;
  depositsChartData: any;
  depositsChartOptions: any;
  appsBarData: any;
  appsBarOptions: any;
  appsDoughnutData: any;
  appsDoughnutOptions: any;

  get monthsLabel(): string {
    if (!this.movimientos?.length) return '';
    const months = new Set(
      this.movimientos.map((m) => m.fecha.substring(0, 7)),
    );
    return [...months]
      .sort()
      .map((ym) => {
        const [year, month] = ym.split('-');
        return new Date(+year, +month - 1, 1).toLocaleString('en-US', {
          month: 'short',
          year: 'numeric',
        });
      })
      .join(' · ');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['movimientos'] && this.movimientos) {
      this.buildTreeTable();
    }
    if (changes['movimientosMonth'] || changes['movimientos']) {
      this.buildNetMarginChart();
      this.buildSaldosChart();
      this.buildAppsChart();
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
    const source = this.movimientosMonth?.length ? this.movimientosMonth : null;

    const dayMap = new Map<
      string,
      { ventaNeta: number; gananciaNeta: number }
    >();

    (source ?? []).forEach((cf) => {
      if (!dayMap.has(cf.fecha)) {
        dayMap.set(cf.fecha, { ventaNeta: 0, gananciaNeta: 0 });
      }
      const entry = dayMap.get(cf.fecha)!;
      entry.ventaNeta += Number(cf.venta_neta || 0);
      entry.gananciaNeta += Number(cf.ganancia_neta || 0);
    });

    const sorted = [...dayMap.entries()].sort(([a], [b]) => a.localeCompare(b));
    const labels = source
      ? sorted.map(([fecha]) => fecha)
      : this.treeData.map((n) => n.data.label);
    const netMarginData = source
      ? sorted.map(([, v]) =>
          v.ventaNeta > 0 ? (v.gananciaNeta / v.ventaNeta) * 100 : 0,
        )
      : this.treeData.map((n) => n.data.net_margin);

    this.chartData = {
      labels,
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

  buildSaldosChart() {
    const source = this.movimientosMonth?.length ? this.movimientosMonth : null;

    const dayMap = new Map<
      string,
      {
        depositos: number;
        debitos: number;
        saldoInicial: number;
        saldoFinal: number;
      }
    >();

    (source ?? []).forEach((cf) => {
      if (!dayMap.has(cf.fecha)) {
        dayMap.set(cf.fecha, {
          depositos: 0,
          debitos: 0,
          saldoInicial: 0,
          saldoFinal: 0,
        });
      }
      const entry = dayMap.get(cf.fecha)!;
      entry.depositos += Number(cf.depositos_banco || 0);
      entry.debitos += Number(cf.debitos_banco || 0);
      entry.saldoInicial += Number(cf.saldo_inicial || 0);
      entry.saldoFinal += Number(cf.saldo_final || 0);
    });

    const sorted = [...dayMap.entries()].sort(([a], [b]) => a.localeCompare(b));
    const labels = sorted.map(([fecha]) => fecha);
    const saldoInicial = sorted.map(([, v]) => v.saldoInicial);
    const saldoFinal = sorted.map(([, v]) => v.saldoFinal);

    // ── Chart 1: Opening vs Closing Balance ──────────────────────────────
    this.saldosChartData = {
      labels,
      datasets: [
        {
          type: 'bar',
          label: 'Opening Balance',
          data: saldoInicial,
          backgroundColor: '#378ADD',
          order: 2,
        },
        {
          type: 'bar',
          label: 'Closing Balance',
          data: saldoFinal,
          backgroundColor: '#1D9E75',
          order: 2,
        },
      ],
    };

    this.saldosChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: true, position: 'top' },
        tooltip: { mode: 'index' },
      },
      scales: {
        y: { beginAtZero: false, title: { display: true, text: 'USD' } },
        x: { title: { display: true, text: 'Date' } },
      },
    };

    // ── Chart 2: Deposits vs Debits ──────────────────────────────────────
    const depositos = sorted.map(([, v]) => v.depositos);
    const debitos = sorted.map(([, v]) => -Math.abs(v.debitos));

    this.depositsChartData = {
      labels,
      datasets: [
        {
          type: 'bar',
          label: 'Bank Deposits',
          data: depositos,
          backgroundColor: '#42A5F5',
          order: 2,
        },
        {
          type: 'bar',
          label: 'Bank Debits',
          data: debitos,
          backgroundColor: '#EF5350',
          order: 2,
        },
        {
          type: 'line',
          label: 'Net Flow',
          data: sorted.map(([, v]) => v.depositos - v.debitos),
          borderColor: '#FFA726',
          backgroundColor: 'rgba(255,167,38,0.12)',
          pointBackgroundColor: '#FFA726',
          fill: true,
          tension: 0.3,
          order: 1,
        },
      ],
    };

    this.depositsChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: true, position: 'top' },
        tooltip: { mode: 'index' },
      },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: 'USD' } },
        x: { title: { display: true, text: 'Date' } },
      },
    };
  }

  buildAppsChart() {
    const source = this.movimientosMonth?.length ? this.movimientosMonth : null;

    const APPS = [
      { key: 'venta_uber', label: 'Uber', color: '#06C167' },
      { key: 'venta_doordash', label: 'DoorDash', color: '#FF3008' },
      { key: 'venta_owner', label: 'Owner', color: '#5B5EA6' },
      { key: 'venta_grubhub', label: 'Grubhub', color: '#F26722' },
      { key: 'venta_inkdind', label: 'Inkind', color: '#00AEEF' },
    ];

    const dayMap = new Map<string, Record<string, number>>();

    (source ?? []).forEach((cf: any) => {
      if (!dayMap.has(cf.fecha)) {
        const init: Record<string, number> = {};
        APPS.forEach((a) => (init[a.key] = 0));
        dayMap.set(cf.fecha, init);
      }
      const entry = dayMap.get(cf.fecha)!;
      APPS.forEach((a) => (entry[a.key] += Number(cf[a.key] || 0)));
    });

    const sorted = [...dayMap.entries()].sort(([a], [b]) => a.localeCompare(b));
    const labels = sorted.map(([fecha]) => fecha);

    // ── Stacked bar ──────────────────────────────────────────
    this.appsBarData = {
      labels,
      datasets: APPS.map((app) => ({
        label: app.label,
        data: sorted.map(([, v]) => v[app.key]),
        backgroundColor: app.color,
        stack: 'apps',
      })),
    };

    this.appsBarOptions = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: true, position: 'top' },
        tooltip: { mode: 'index' },
      },
      scales: {
        x: { stacked: true, title: { display: true, text: 'Date' } },
        y: {
          stacked: true,
          beginAtZero: true,
          title: { display: true, text: 'USD' },
        },
      },
    };

    // ── Doughnut (totales del período) ───────────────────────
    const totals = APPS.map((app) =>
      sorted.reduce((sum, [, v]) => sum + v[app.key], 0),
    );

    this.appsDoughnutData = {
      labels: APPS.map((a) => a.label),
      datasets: [
        {
          data: totals,
          backgroundColor: APPS.map((a) => a.color),
          hoverOffset: 8,
        },
      ],
    };

    this.appsDoughnutOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: 'right' },
        tooltip: {
          callbacks: {
            label: (ctx: any) => {
              const total = totals.reduce((a, b) => a + b, 0);
              const pct =
                total > 0 ? ((ctx.raw / total) * 100).toFixed(1) : '0';
              return ` ${ctx.label}: $${ctx.raw.toFixed(0)} (${pct}%)`;
            },
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
