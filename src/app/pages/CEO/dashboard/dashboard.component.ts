import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '../../../core/models/location.model';
import { DashboardService } from '../../../core/services/dashboard.service';
import {
  CashFlow,
  DailyMetric,
  Invoice,
  Resumenes,
  TotalMetric,
} from '../../../core/models/dashboard.models';
import { LocationService } from '../../../core/services/location.service';
import { DatePickerModule } from 'primeng/datepicker';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { TxtsignoPipe } from '../../../core/pipes/txtsigno.pipe';
import { CardModule } from 'primeng/card';
import { CashflowListComponent } from '../../cashflow/cashflow-list/cashflow-list.component';
import { DialogModule } from 'primeng/dialog';
import { AccordionModule } from 'primeng/accordion';
import { LoadingComponent } from "../../../shared/components/loading/loading.component";

@Component({
  selector: 'app-dashboard',

  imports: [
    CommonModule,
    FormsModule,
    DatePickerModule,
    MultiSelectModule,
    TxtsignoPipe,
    CashflowListComponent,
    TableModule,
    TabViewModule,
    CardModule,
    DialogModule,
    AccordionModule,
    LoadingComponent
],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  loading = false;
  locations: Location[] = [];

  //dasboard: DashboardResponse | null = null;
  invoices: Invoice[] = [];
  invoicespopUp: Invoice[] = [];

  resumenes: Resumenes[] = [];
  resumenespopUp: Resumenes[] = [];

  //ProjectedDebits: Invoice[] = [];
  totales: TotalMetric[] = [];
  dailyMetrics: DailyMetric[] = [];

  dateRange: Date[] | null = null;

  selectedLocation!: Location[];
  movimientos: CashFlow[] = [];
  cashflowMonths: CashFlow[] = [];

  showInvoicesDialog = false;
  InviceTitulo: string = '';
  showDailyDialog = false;
  showResumenDialog = false;

  cssCard = 'kpi-card';
  cssinner = 'sum-inner';

  groupedInvoices: any[] = [];
  totalInvoicesPopUp = 0;

  groupedResumen: any[] = [];
  totalResumenPopUp = 0;

  groupInvoices() {
    const groups: Record<string, { items: Invoice[]; total: number }> = {};

    this.invoicespopUp.forEach((invoice) => {
      const category = invoice.category?.category_code || 'Sin categoría';
      const amount = Number(invoice.invoice_amount) || 0;

      if (!groups[category]) {
        groups[category] = {
          items: [],
          total: 0,
        };
      }

      groups[category].items.push(invoice);
      groups[category].total += amount;
    });

    this.groupedInvoices = Object.keys(groups).map((category) => ({
      category,
      items: groups[category].items,
      total: groups[category].total,
    }));

    this.totalInvoicesPopUp = this.groupedInvoices.reduce(
      (sum, group) => sum + group.total,
      0
    );
  }

  groupResumen() {

    const groups: Record<string, { items: Resumenes[]; total: number }> = {};

    this.resumenespopUp.forEach((invoice) => {

      const category = invoice.nombre || 'Sin categoría';
      const amount = Number(invoice.importe) || 0;

      if (!groups[category]) {
        groups[category] = {
          items: [],
          total: 0,
        };
      }

      groups[category].items.push(invoice);
      groups[category].total += amount;
    });

    this.groupedResumen = Object.keys(groups).map((category) => ({
      category,
      items: groups[category].items,
      total: groups[category].total,
    }));

    this.totalResumenPopUp = this.groupedResumen.reduce(
      (sum, group) => sum + group.total,
      0
    );
  }

  mostrarInvoice(titulo: string, InvoiceTye: number, categoria: number, type: string, tipo: string = '', exclude: number[] = []) {

    this.loading = true;
    this.showInvoicesDialog = false;
    this.showDailyDialog = false;
    this.showResumenDialog = false;

    if (type == '' || type === null || type === undefined) {
      this.loading = false;
      return;
    } else if (type === 'Daily') {
      this.showDailyDialog = true;
      this.loading = false;
    }
    else if (type === 'Invoice') {

      this.invoicespopUp = this.invoices.filter(
        (inv) =>
          inv.category.invoice_type_id === InvoiceTye &&
          (categoria === 0 || inv.category.category_id === categoria) &&
          (!exclude || !exclude.includes(inv.category.category_id))
      );

      this.invoicespopUp.sort((a, b) => {

        const categoryCompare = a.category.category_code.localeCompare(
          b.category.category_code
        );

        if (categoryCompare !== 0) {
          return categoryCompare;
        }

        return new Date(a.invoice_date).getTime() -
          new Date(b.invoice_date).getTime();
      });

      this.groupInvoices();

      setTimeout(() => {
        this.showInvoicesDialog = true;
        this.loading = false;
      }, 1000);


    } else if (type === 'Discount') {

      this.resumenespopUp = this.resumenes.filter(
        (inv) =>
          inv.tipo === tipo && inv.nombre != 'Total'
      );

      this.resumenespopUp.sort((a, b) => {

        const categoryCompare = a.nombre.localeCompare(
          b.nombre
        );

        if (categoryCompare !== 0) {
          return categoryCompare;
        }

        return new Date(a.fecha).getTime() -
          new Date(b.fecha).getTime();
      });

      this.groupResumen();

      setTimeout(() => {
        this.showResumenDialog = true;
        this.loading = false;
      }, 500);

    }

    this.InviceTitulo = titulo;

  }

  constructor(
    private dashboardSvc: DashboardService,
    private locationService: LocationService,
  ) { }

  ngOnInit(): void {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const firstOfMonth = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      1,
    );

    this.dateRange = [firstOfMonth, yesterday];

    this.loadLocations();

    this.locationChange$.pipe(debounceTime(1000)).subscribe(() => {
      this.load();
    });
  }

  load(): void {
    this.loading = true;

    if (!this.dateRange || this.dateRange.length !== 2) {
      console.warn('Date range is not properly set.');
      this.loading = false;
      return;
    }

    if (
      !this.selectedLocation ||
      this.selectedLocation === null ||
      this.selectedLocation.length === 0
    ) {
      console.warn('No locations selected.');
      this.loading = false;
      return;
    }

    const locales = this.selectedLocation
      .map((loc) => loc.location_id)
      .join(',');

    const startDate = this.dateRange[0].toISOString().split('T')[0];
    const endDate = this.dateRange[1].toISOString().split('T')[0];

    this.dashboardSvc.getDashboard(startDate, endDate, locales).subscribe({
      next: (res) => {
        // this.dasboard = res;
        this.movimientos = res.cashflow;
        this.invoices = res.invoices;
        // this.invoices = res.invoices.filter(
        //   (inv) => inv.category.invoice_type_id === 7,
        // );
        // this.ProjectedDebits = res.invoices.filter(
        //   (inv) => inv.category.invoice_type_id !== 7,
        // );
        this.totales = res.totales;
        this.dailyMetrics = res.dailyMetrics;
        this.resumenes = res.resumenes;

        //console.log('Dashboard data loaded:', res.cashflow);
      },
      error: () => (this.loading = false),
      complete: () => (this.loading = false),
    });
  }

  loadLocations(): void {
    this.locationService.getLocationAll().subscribe({
      next: (data) => {
        this.locations = data ?? [];

        // 👇 TODOS seleccionados por defecto
        this.selectedLocation = [...this.locations];

        this.load();
      },
      error: (err) => {
        console.error('[Locations] GET error:', err);
      },
      complete: () => { },
    });
  }

  get selectedLocationNames(): string {
    if (!this.selectedLocation?.length) {
      return 'None';
    }

    if (this.selectedLocation.length === this.locations.length) {
      return 'All locations';
    }

    return this.selectedLocation.map((c) => c.location_name).join(', ');
  }

  get formattedDateRange(): string {
    if (
      !this.dateRange ||
      this.dateRange.length !== 2 ||
      !this.dateRange[0] ||
      !this.dateRange[1]
    ) {
      return 'No date selected';
    }

    const format = (d: Date) => d.toISOString().split('T')[0];

    return `${format(this.dateRange[0])} - ${format(this.dateRange[1])}`;
  }

  private locationChange$ = new Subject<void>();

  onLocationsChange() {

    if (
      !this.dateRange ||
      this.dateRange.length !== 2 ||
      !this.dateRange[0] ||
      !this.dateRange[1]
    ) {
      return;
    }

    this.locationChange$.next();
  }

  onLocationsChangeDate(event: any) {

    if (
      !this.dateRange ||
      this.dateRange.length !== 2 ||
      !this.dateRange[0] ||
      !this.dateRange[1]
    ) {
      return;
    }



    this.load();
  }
}
