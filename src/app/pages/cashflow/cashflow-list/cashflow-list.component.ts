import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { TxtsignoPipe } from '../../../core/pipes/txtsigno.pipe';
import { TreeTableModule } from 'primeng/treetable';
import { CashFlow } from '../../../core/models/dashboard.models';
import { NgClass } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { NgApexchartsModule } from 'ng-apexcharts';

interface TreeNode {
  data: any;
  children?: TreeNode[];
}

type Opts = {
  series?: any;
  chart?: any;
  xaxis?: any;
  yaxis?: any;
  colors?: any[];
  plotOptions?: any;
  dataLabels?: any;
  legend?: any;
  tooltip?: any;
  fill?: any;
  stroke?: any;
  labels?: any[];
  markers?: any;
  annotations?: any;
  grid?: any;
};

// ─── Paleta unificada ────────────────────────────────────────────────────────
// Familia teal/verde en 6 tonos (oscuro → claro) + rojo solo para negativos
const P = {
  t0: '#0d2d4a', // más oscuro
  t1: '#1a4a6e',
  t2: '#2563a8', // tono base
  t3: '#4682c4',
  t4: '#7aadd9',
  t5: '#b3d2ee', // más claro
  neg: '#b03a2e', // rojo apagado — solo para valores negativos
  negLight: '#d4695f',
};
// ─────────────────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-cashflow-list',
  imports: [
    TxtsignoPipe,
    TreeTableModule,
    NgClass,
    TableModule,
    TabViewModule,
    NgApexchartsModule,
  ],
  templateUrl: './cashflow-list.component.html',
  styleUrl: './cashflow-list.component.scss',
})
export class CashflowListComponent implements OnChanges, OnInit {
  @Input() movimientos: CashFlow[] = [];

  treeData: any[] = [];

  col1 = '15%';
  colSaldos = '23%';
  colApps = '23%';

  netMarginOpts: Opts = {};
  saldosOpts: Opts = {};
  depositsOpts: Opts = {};
  appsBarOpts: Opts = {};
  appsDonOpts: Opts = {};
  salesOpts: Opts = {};
  expenseOpts: Opts = {};
  trendOpts: Opts = {};

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

  ngOnInit() {
    this.buildNetMarginChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['movimientos'] && this.movimientos) {
      this.buildTreeTable();
    }
    if (changes['movimientos'] || changes['movimientos']) {
      this.buildNetMarginChart();
      this.buildSaldosChart();
      this.buildAppsChart();
      this.buildSalesChart();
      this.buildExpenseChart();
      this.buildTrendChart();
    }
  }

  buildTreeTable() {
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

    const initTotals = () => {
      const obj: any = {};
      numericFields.forEach((f) => (obj[f] = 0));
      obj['net_margin'] = 0;
      return obj;
    };

    const groupedByDate: any = {};

    this.movimientos.forEach((item) => {
      if (!groupedByDate[item.fecha]) groupedByDate[item.fecha] = {};
      if (!groupedByDate[item.fecha][item.location_id])
        groupedByDate[item.fecha][item.location_id] = [];
      groupedByDate[item.fecha][item.location_id].push(item);
    });

    const tree: TreeNode[] = [];

    Object.keys(groupedByDate).forEach((fecha) => {
      let totalFecha = initTotals();

      const dateNode: TreeNode = {
        data: { label: fecha, level: 'date', ...initTotals() },
        children: [],
      };

      Object.keys(groupedByDate[fecha]).forEach((locId) => {
        const items = groupedByDate[fecha][locId];
        let totalLoc = initTotals();

        items.forEach((i: any) => {
          numericFields.forEach((field) => {
            totalLoc[field] += Number(i[field] || 0);
          });
        });

        if (totalLoc.venta_neta > 0) {
          totalLoc.net_margin =
            (totalLoc.ganancia_neta / totalLoc.venta_neta) * 100;
        }

        numericFields.forEach((field) => {
          totalFecha[field] += totalLoc[field];
        });

        dateNode.children?.push({
          data: {
            label: items[0].location_name,
            level: 'location',
            ...totalLoc,
          },
        });
      });

      if (totalFecha.venta_neta > 0) {
        totalFecha.net_margin =
          (totalFecha.ganancia_neta / totalFecha.venta_neta) * 100;
      }

      dateNode.data = { label: fecha, level: 'date', ...totalFecha };
      tree.push(dateNode);
    });

    this.treeData = tree;
  }

  private fmtDate(iso: string): string {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }

  private fmtUsd(v: number): string {
    if (Math.abs(v) >= 1000) return '$' + (v / 1000).toFixed(1) + 'k';
    return '$' + v.toFixed(0);
  }

  private get xaxisBase() {
    return {
      labels: {
        style: { fontSize: '11px', colors: '#9aa3af' },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    };
  }

  private yaxisBase(formatter: (v: number) => string) {
    return {
      labels: {
        formatter,
        style: { fontSize: '11px', colors: '#9aa3af' },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    };
  }

  private get gridBase() {
    return { borderColor: '#f0f0f0', strokeDashArray: 3 };
  }

  // ─── Net Margin — barras teal (positivo) / rojo apagado (negativo) ─────────
  buildNetMarginChart() {
    const dayMap = new Map<
      string,
      { ventaNeta: number; gananciaNeta: number }
    >();
    (this.movimientos ?? []).forEach((cf) => {
      if (!dayMap.has(cf.fecha))
        dayMap.set(cf.fecha, { ventaNeta: 0, gananciaNeta: 0 });
      const e = dayMap.get(cf.fecha)!;
      e.ventaNeta += Number(cf.venta_neta || 0);
      e.gananciaNeta += Number(cf.ganancia_neta || 0);
    });

    const sorted = [...dayMap.entries()].sort(([a], [b]) => a.localeCompare(b));
    const labels = sorted.map(([f]) => this.fmtDate(f));
    const data = sorted.map(
      ([, v]) =>
        +(v.ventaNeta > 0 ? (v.gananciaNeta / v.ventaNeta) * 100 : 0).toFixed(
          2,
        ),
    );

    this.netMarginOpts = {
      series: [{ name: 'Net Margin %', data }],
      chart: {
        type: 'bar',
        height: 280,
        toolbar: { show: false },
        fontFamily: 'inherit',
        parentHeightOffset: 0,
      },
      plotOptions: { bar: { columnWidth: '60%', distributed: true } },
      // Tono base para positivos, rojo apagado para negativos
      colors: data.map((v: number) => (v >= 0 ? P.t2 : P.neg)),
      dataLabels: { enabled: false },
      xaxis: { ...this.xaxisBase, categories: labels },
      yaxis: this.yaxisBase((v) => v.toFixed(1) + '%'),
      grid: this.gridBase,
      legend: { show: false },
      tooltip: { y: { formatter: (v: number) => v.toFixed(2) + '%' } },
    };
  }

  // ─── Saldos — Opening oscuro / Closing más claro ───────────────────────────
  buildSaldosChart() {
    const dayMap = new Map<
      string,
      {
        depositos: number;
        debitos: number;
        saldoInicial: number;
        saldoFinal: number;
      }
    >();

    (this.movimientos ?? []).forEach((cf) => {
      if (!dayMap.has(cf.fecha))
        dayMap.set(cf.fecha, {
          depositos: 0,
          debitos: 0,
          saldoInicial: 0,
          saldoFinal: 0,
        });
      const e = dayMap.get(cf.fecha)!;
      e.depositos += Number(cf.depositos_banco || 0);
      e.debitos += Number(cf.debitos_banco || 0);
      e.saldoInicial += Number(cf.saldo_inicial || 0);
      e.saldoFinal += Number(cf.saldo_final || 0);
    });

    const sorted = [...dayMap.entries()].sort(([a], [b]) => a.localeCompare(b));
    const labels = sorted.map(([f]) => this.fmtDate(f));
    const saldoInicial = sorted.map(([, v]) => +v.saldoInicial.toFixed(2));
    const saldoFinal = sorted.map(([, v]) => +v.saldoFinal.toFixed(2));
    const depositos = sorted.map(([, v]) => +v.depositos.toFixed(2));
    const debitos = sorted.map(([, v]) => +v.debitos.toFixed(2));

    this.saldosOpts = {
      series: [
        { name: 'Opening Balance', data: saldoInicial },
        { name: 'Closing Balance', data: saldoFinal },
      ],
      chart: {
        type: 'bar',
        height: 280,
        toolbar: { show: false },
        fontFamily: 'inherit',
        parentHeightOffset: 0,
      },
      plotOptions: { bar: { columnWidth: '65%' } },
      // Oscuro para opening, intermedio para closing
      colors: [P.t0, P.t3],
      dataLabels: { enabled: false },
      xaxis: { ...this.xaxisBase, categories: labels },
      yaxis: this.yaxisBase(this.fmtUsd.bind(this)),
      grid: this.gridBase,
      legend: { position: 'top' },
      tooltip: { y: { formatter: this.fmtUsd.bind(this) } },
    };

    this.depositsOpts = {
      series: [
        { name: 'Bank Deposits', type: 'column', data: depositos },
        { name: 'Bank Debits', type: 'column', data: debitos.map((v) => -v) },
        {
          name: 'Net Flow',
          type: 'line',
          data: sorted.map(([, v]) => +(v.depositos - v.debitos).toFixed(2)),
        },
      ],
      chart: {
        type: 'line',
        height: 280,
        toolbar: { show: false },
        fontFamily: 'inherit',
        parentHeightOffset: 0,
      },
      plotOptions: { bar: { columnWidth: '55%' } },
      // Deposits = teal medio, Debits = rojo apagado, Net Flow = teal claro
      colors: [P.t2, P.neg, P.t4],
      dataLabels: { enabled: false },
      stroke: { width: [0, 0, 3], curve: 'smooth' },
      fill: { opacity: [1, 1, 0.15] },
      xaxis: { ...this.xaxisBase, categories: labels },
      yaxis: this.yaxisBase(this.fmtUsd.bind(this)),
      grid: this.gridBase,
      legend: { position: 'top' },
      tooltip: { y: { formatter: this.fmtUsd.bind(this) } },
    };
  }

  // ─── Apps — 5 tonos de la misma familia teal ──────────────────────────────
  buildAppsChart() {
    const APPS = [
      { key: 'venta_uber', label: 'Uber', color: P.t0 },
      { key: 'venta_doordash', label: 'DoorDash', color: P.t1 },
      { key: 'venta_owner', label: 'Owner', color: P.t2 },
      { key: 'venta_grubhub', label: 'Grubhub', color: P.t3 },
      { key: 'venta_inkdind', label: 'Inkind', color: P.t4 },
    ];

    const dayMap = new Map<string, Record<string, number>>();
    (this.movimientos ?? []).forEach((cf: any) => {
      if (!dayMap.has(cf.fecha)) {
        const init: Record<string, number> = {};
        APPS.forEach((a) => (init[a.key] = 0));
        dayMap.set(cf.fecha, init);
      }
      const e = dayMap.get(cf.fecha)!;
      APPS.forEach((a) => (e[a.key] += Number(cf[a.key] || 0)));
    });

    const sorted = [...dayMap.entries()].sort(([a], [b]) => a.localeCompare(b));
    const labels = sorted.map(([f]) => this.fmtDate(f));

    this.appsBarOpts = {
      series: APPS.map((app) => ({
        name: app.label,
        data: sorted.map(([, v]) => +v[app.key].toFixed(2)),
      })),
      chart: {
        type: 'bar',
        stacked: true,
        height: 280,
        toolbar: { show: false },
        fontFamily: 'inherit',
        parentHeightOffset: 0,
      },
      plotOptions: { bar: { columnWidth: '75%' } },
      colors: APPS.map((a) => a.color),
      dataLabels: { enabled: false },
      xaxis: { ...this.xaxisBase, categories: labels },
      yaxis: this.yaxisBase(this.fmtUsd.bind(this)),
      grid: this.gridBase,
      legend: { position: 'top' },
      tooltip: { y: { formatter: this.fmtUsd.bind(this) } },
    };

    const totals = APPS.map(
      (app) => +sorted.reduce((sum, [, v]) => sum + v[app.key], 0).toFixed(2),
    );

    this.appsDonOpts = {
      series: totals,
      chart: {
        type: 'donut',
        height: 280,
        fontFamily: 'inherit',
        parentHeightOffset: 0,
      },
      labels: APPS.map((a) => a.label),
      colors: APPS.map((a) => a.color),
      legend: { position: 'bottom' },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => val.toFixed(1) + '%',
      },
      tooltip: {
        y: {
          formatter: (v: number) => {
            const total = totals.reduce((a, b) => a + b, 0);
            return `$${v.toFixed(0)} (${total > 0 ? ((v / total) * 100).toFixed(1) : 0}%)`;
          },
        },
      },
    };
  }

  // ─── Sales — Gross oscuro, Net medio, Profit línea clara ──────────────────
  buildSalesChart() {
    const dayMap = new Map<
      string,
      { ventaBruta: number; ventaNeta: number; gananciaNeta: number }
    >();

    (this.movimientos ?? []).forEach((cf) => {
      if (!dayMap.has(cf.fecha))
        dayMap.set(cf.fecha, { ventaBruta: 0, ventaNeta: 0, gananciaNeta: 0 });
      const e = dayMap.get(cf.fecha)!;
      e.ventaBruta += Number(cf.venta_bruta || 0);
      e.ventaNeta += Number(cf.venta_neta || 0);
      e.gananciaNeta += Number(cf.ganancia_neta || 0);
    });

    const sorted = [...dayMap.entries()].sort(([a], [b]) => a.localeCompare(b));
    const labels = sorted.map(([f]) => this.fmtDate(f));

    this.salesOpts = {
      series: [
        {
          name: 'Gross Sales',
          type: 'column',
          data: sorted.map(([, v]) => +v.ventaBruta.toFixed(2)),
        },
        {
          name: 'Net Sales',
          type: 'column',
          data: sorted.map(([, v]) => +v.ventaNeta.toFixed(2)),
        },
        {
          name: 'Net Profit',
          type: 'line',
          data: sorted.map(([, v]) => +v.gananciaNeta.toFixed(2)),
        },
      ],
      chart: {
        type: 'line',
        height: 280,
        toolbar: { show: false },
        fontFamily: 'inherit',
        parentHeightOffset: 0,
      },
      plotOptions: { bar: { columnWidth: '50%' } },
      // Gross oscuro, Net medio, Profit línea teal claro
      colors: [P.t1, P.t3, P.t5],
      dataLabels: { enabled: false },
      stroke: { width: [0, 0, 3], curve: 'smooth' },
      fill: { opacity: [0.85, 0.85, 0.2] },
      xaxis: { ...this.xaxisBase, categories: labels },
      yaxis: this.yaxisBase(this.fmtUsd.bind(this)),
      grid: this.gridBase,
      legend: { position: 'top' },
      tooltip: { y: { formatter: this.fmtUsd.bind(this) } },
    };
  }

  // ─── Expenses — 6 tonos teal de oscuro a claro ────────────────────────────
  buildExpenseChart() {
    const EXPENSES = [
      { key: 'food_cost', label: 'Food Cost', color: P.t0 },
      { key: 'labor', label: 'Labor', color: P.t1 },
      { key: 'renta', label: 'Rent', color: P.t2 },
      { key: 'gastos_operacionales', label: 'Op. Expenses', color: P.t3 },
      { key: 'fees_apps', label: 'App Fees', color: P.t4 },
      { key: 'gastos_varios', label: 'Others', color: P.t5 },
    ];

    const dayMap = new Map<string, Record<string, number>>();
    (this.movimientos ?? []).forEach((cf: any) => {
      if (!dayMap.has(cf.fecha)) {
        const init: Record<string, number> = {};
        EXPENSES.forEach((e) => (init[e.key] = 0));
        dayMap.set(cf.fecha, init);
      }
      const entry = dayMap.get(cf.fecha)!;
      EXPENSES.forEach((e) => (entry[e.key] += Number(cf[e.key] || 0)));
    });

    const sorted = [...dayMap.entries()].sort(([a], [b]) => a.localeCompare(b));
    const labels = sorted.map(([f]) => this.fmtDate(f));

    this.expenseOpts = {
      series: EXPENSES.map((exp) => ({
        name: exp.label,
        data: sorted.map(([, v]) => +v[exp.key].toFixed(2)),
      })),
      chart: {
        type: 'bar',
        stacked: true,
        height: 280,
        toolbar: { show: false },
        fontFamily: 'inherit',
        parentHeightOffset: 0,
      },
      plotOptions: { bar: { columnWidth: '70%' } },
      colors: EXPENSES.map((e) => e.color),
      dataLabels: { enabled: false },
      xaxis: { ...this.xaxisBase, categories: labels },
      yaxis: this.yaxisBase(this.fmtUsd.bind(this)),
      grid: this.gridBase,
      legend: { position: 'top' },
      tooltip: { y: { formatter: this.fmtUsd.bind(this) } },
    };
  }

  // ─── Trend — línea teal base, marcadores rojo si negativo ─────────────────
  buildTrendChart() {
    const dayMap = new Map<
      string,
      { ventaNeta: number; gananciaNeta: number }
    >();

    (this.movimientos ?? []).forEach((cf) => {
      if (!dayMap.has(cf.fecha))
        dayMap.set(cf.fecha, { ventaNeta: 0, gananciaNeta: 0 });
      const e = dayMap.get(cf.fecha)!;
      e.ventaNeta += Number(cf.venta_neta || 0);
      e.gananciaNeta += Number(cf.ganancia_neta || 0);
    });

    const sorted = [...dayMap.entries()].sort(([a], [b]) => a.localeCompare(b));
    const labels = sorted.map(([f]) => this.fmtDate(f));
    const data = sorted.map(
      ([, v]) =>
        +(v.ventaNeta > 0 ? (v.gananciaNeta / v.ventaNeta) * 100 : 0).toFixed(
          2,
        ),
    );

    this.trendOpts = {
      series: [{ name: 'Net Margin %', data }],
      chart: {
        type: 'line',
        height: 280,
        toolbar: { show: false },
        fontFamily: 'inherit',
        parentHeightOffset: 0,
      },
      colors: [P.t2],
      dataLabels: { enabled: false },
      stroke: { width: 3, curve: 'smooth' },
      markers: {
        size: 5,
        // Marcador rojo solo cuando el margen es negativo
        colors: data.map((v: number) => (v >= 0 ? P.t2 : P.neg)),
        strokeWidth: 0,
      },
      xaxis: { ...this.xaxisBase, categories: labels },
      yaxis: this.yaxisBase((v) => v.toFixed(1) + '%'),
      grid: this.gridBase,
      legend: { show: false },
      tooltip: { y: { formatter: (v: number) => v.toFixed(2) + '%' } },
      annotations: {
        yaxis: [
          { y: 0, borderColor: P.negLight, borderWidth: 1, strokeDashArray: 4 },
        ],
      },
    };
  }
}
