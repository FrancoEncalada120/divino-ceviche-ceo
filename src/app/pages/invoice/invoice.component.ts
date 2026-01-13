import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { MultiSelectModule } from 'primeng/multiselect';
import { debounceTime, Subject } from 'rxjs';
import { LocationService } from '../../core/services/location.service';
import { Location } from '../../core/models/location.model';
import { DashboardResponse, Invoice } from '../../core/models/dashboard.models';
import { DashboardService } from '../../core/services/dashboard.service';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InvoiceUpdInsComponent } from '../invoice-upd-ins/invoice-upd-ins.component';
import { InvoiceService } from '../../core/services/invoice.service';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePickerModule,
    MultiSelectModule,
    TabViewModule,
    TableModule,
    ButtonModule,
    CardModule,
    InvoiceUpdInsComponent,
    NgIf,
  ],

  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss',
})
export class InvoiceComponent {
  loading = false;
  locations: Location[] = [];
  selectedLocation!: Location[];
  invoice: Invoice[] = [];
  dateRange: Date[] | null = null;
  dasboard: DashboardResponse | null = null;
  private locationChange$ = new Subject<void>();
  activeTab: 1 | 2 | 3 = 1; // por defecto pestaña 1

  invoice01: Invoice[] = [];
  invoice02: Invoice[] = [];
  invoice03: Invoice[] = [];

  totalCat1 = 0;
  totalCat2 = 0;
  totalCat3 = 0;

  cantidadCat1 = 0;
  cantidadCat2 = 0;
  cantidadCat3 = 0;

  selectedCategoryType: number | null = null;
  editingInvoice: Invoice | null = null;

  showAddLocationModal = false;
  modalMode: 'create' | 'edit' = 'create';

  constructor(
    private locationService: LocationService,
    private dashboardSvc: DashboardService,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    this.dateRange = [new Date(yesterday), new Date(yesterday)];
    this.loadLocations();

    this.locationChange$.pipe(debounceTime(1000)).subscribe(() => {
      console.log('Locations changed, reloading dashboard...');
    });

    this.load();
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

    console.log('Range de fechas:', this.formattedDateRange);
    console.log('Range de fechas:', this.dateRange);

    const startDate = this.dateRange[0].toISOString().split('T')[0];
    const endDate = this.dateRange[1].toISOString().split('T')[0];

    this.dashboardSvc.getDashboard(startDate, endDate, locales).subscribe({
      next: (res) => {
        this.dasboard = res;

        const invoices = res.invoices ?? []; // <-- array real

        console.log('Dashboard .invoices:', res.invoices);

        this.invoice01 = invoices.filter(
          (x) => Number(x.category.invoice_type_id) === 1
        );
        this.invoice02 = invoices.filter(
          (x) => Number(x.category.invoice_type_id) === 2
        );
        this.invoice03 = invoices.filter(
          (x) => Number(x.category.invoice_type_id) === 3
        );
        this.calculateTotals(invoices);
      },
      error: () => (this.loading = false),
      complete: () => (this.loading = false),
    });
  }

  loadLocations(): void {
    this.locationService.getAll().subscribe({
      next: (data) => {
        console.log('[Locations] GET ok, items:', data?.length, data);
        this.locations = data ?? [];

        // 👇 TODOS seleccionados por defecto
        this.selectedLocation = [...this.locations];
      },
      error: (err) => {
        console.error('[Locations] GET error:', err);
      },
      complete: () => console.log('[Locations] GET complete'),
    });
  }

  onLocationsChange() {
    console.log(
      'Locations or date range changed, scheduling dashboard reload...'
    );

    this.locationChange$.next();
    this.load();
  }

  onLocationsChangeDate(event: any) {
    console.log('Rango de fechas cambiado:', event);
    this.load();
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

  private calculateTotals(invoices: Invoice[]) {
    const sum = (list: Invoice[]) =>
      list.reduce((acc, x) => acc + Number(x.invoice_amount || 0), 0);

    this.totalCat1 = sum(
      invoices.filter((x) => Number(x.category.invoice_type_id) === 1)
    );
    this.totalCat2 = sum(
      invoices.filter((x) => Number(x.category.invoice_type_id) === 2)
    );
    this.totalCat3 = sum(
      invoices.filter((x) => Number(x.category.invoice_type_id) === 3)
    );

    this.cantidadCat1 = invoices.filter(
      (x) => Number(x.category.invoice_type_id) === 1
    ).length;
    this.cantidadCat2 = invoices.filter(
      (x) => Number(x.category.invoice_type_id) === 2
    ).length;
    this.cantidadCat3 = invoices.filter(
      (x) => Number(x.category.invoice_type_id) === 3
    ).length;
  }

  closeModal() {
    this.showAddLocationModal = false;
  }

  openAddInvoice(invoiceTypeId: number) {
    this.modalMode = 'create';
    this.selectedCategoryType = invoiceTypeId;
    this.showAddLocationModal = true;
  }

  openUpdateInvoice(item: Invoice, invoiceTypeId: number) {
    this.modalMode = 'edit';
    this.selectedCategoryType = invoiceTypeId;

    this.editingInvoice = item;
    this.showAddLocationModal = true;
  }

  handleSubmit(invoice: Invoice) {
    const isCreate = this.modalMode === 'create';

    const action$ = isCreate
      ? this.invoiceService.create(invoice)
      : this.invoiceService.update(invoice.invoice_id, invoice);

    action$.subscribe({
      next: (savedInvoice) => {
        console.log('[Invoice] saved:', savedInvoice);

        // Si tu dashboard depende del endpoint getDashboard, lo mejor es recargar:
        this.closeModal();
        this.load();

        // (Opcional) Si quieres actualizar localmente SIN recargar:
        // if (isCreate) {
        //   this.invoice.push(savedInvoice);
        // } else {
        //   const index = this.invoice.findIndex(i => i.invoice_id === savedInvoice.invoice_id);
        //   if (index !== -1) this.invoice[index] = savedInvoice;
        // }
      },
      error: (err) => {
        console.error('[Invoice] save error:', err);
      },
    });
  }
}
