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
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.models';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InvoiceTableComponent } from '../../shared/components/invoice-table/invoice-table.component';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
    InvoiceTableComponent,
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
  activeTab: 1 | 2 | 3 | 4 = 1; // por defecto pestaña 1

  invoice01: Invoice[] = [];
  invoice02: Invoice[] = [];
  invoice03: Invoice[] = [];
  invoice04: Invoice[] = [];
  allInvoices: any[] = [];

  totalCat1 = 0;
  totalCat2 = 0;
  totalCat3 = 0;
  totalCat4 = 0;

  cantidadCat1 = 0;
  cantidadCat2 = 0;
  cantidadCat3 = 0;
  cantidadCat4 = 0;

  selectedCategoryType: number | null = null;
  editingInvoice: Invoice | null = null;

  showAddLocationModal = false;
  modalMode: 'create' | 'edit' = 'create';
  user: User | null = null;

  constructor(
    private locationService: LocationService,
    private dashboardSvc: DashboardService,
    private invoiceService: InvoiceService,
    private userService: UserService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.user = this.userService.currentUser;
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

    const startDate = this.dateRange[0].toISOString().split('T')[0];
    const endDate = this.dateRange[1].toISOString().split('T')[0];

    this.dashboardSvc.getDashboard(startDate, endDate, locales).subscribe({
      next: (res) => {
        this.dasboard = res;

        const invoices = res.invoices ?? []; // <-- array real

        console.log('invoices  ====>:', invoices);

        this.invoice01 = invoices.filter(
          (x) => Number(x.category.invoice_type_id) === 1,
        );
        this.invoice02 = invoices.filter(
          (x) => Number(x.category.invoice_type_id) === 2,
        );
        this.invoice03 = invoices.filter(
          (x) => Number(x.category.invoice_type_id) === 3,
        );
        this.invoice04 = invoices.filter(
          (x) => Number(x.category.invoice_type_id) === 4,
        );

        this.allInvoices = invoices;

        this.calculateTotals(invoices);
      },
      error: () => (this.loading = false),
      complete: () => (this.loading = false),
    });
  }

  loadLocations(): void {
    this.locationService.getAll().subscribe({
      next: (data) => {
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
    this.locationChange$.next();
    this.load();
  }

  onLocationsChangeDate(event: any) {
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
      invoices.filter((x) => Number(x.category.invoice_type_id) === 1),
    );
    this.totalCat2 = sum(
      invoices.filter((x) => Number(x.category.invoice_type_id) === 2),
    );
    this.totalCat3 = sum(
      invoices.filter((x) => Number(x.category.invoice_type_id) === 3),
    );
    this.totalCat4 = sum(
      invoices.filter((x) => Number(x.category.invoice_type_id) === 4),
    );

    this.cantidadCat1 = invoices.filter(
      (x) => Number(x.category.invoice_type_id) === 1,
    ).length;
    this.cantidadCat2 = invoices.filter(
      (x) => Number(x.category.invoice_type_id) === 2,
    ).length;
    this.cantidadCat3 = invoices.filter(
      (x) => Number(x.category.invoice_type_id) === 3,
    ).length;
    this.cantidadCat4 = invoices.filter(
      (x) => Number(x.category.invoice_type_id) === 4,
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
    const auditUserId = this.userService.getUser2()?.user_id;

    console.log(auditUserId);

    if (!auditUserId) {
      console.error('No hay usuario logueado, no puedo auditar.');
      return;
    }

    const auditUser = String(auditUserId);
    const isCreate = this.modalMode === 'create';

    if (isCreate) {
      invoice.invoice_create_user = auditUser;
    }

    invoice.invoice_update_user = auditUser;

    const action$ = isCreate
      ? this.invoiceService.create(invoice)
      : this.invoiceService.update(invoice.invoice_id, invoice);

    action$.subscribe({
      next: () => {
        this.closeModal();
        this.load();
      },
      error: (err) => console.error('[Invoice] save error:', err),
    });
  }

  openDeleteInvoice(item: Invoice) {
    console.log('[openDeleteInvoice] CLICK', item);

    this.confirmationService.confirm({
      header: 'Confirmación',
      message: '¿Seguro que deseas eliminar esta invoice?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',

      accept: () => {
        console.log('[ConfirmDialog] ACCEPT');

        this.invoiceService.delete(item.invoice_id).subscribe({
          next: () => {
            console.log('[DELETE] OK');

            this.messageService.add({
              severity: 'success',
              summary: 'Eliminado',
              detail: 'Invoice eliminada correctamente',
            });

            this.load();
          },
          error: (err) => {
            console.error('[DELETE] ERROR', err);

            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err?.message || 'No se pudo eliminar',
            });
          },
        });
      },

      reject: () => {
        console.log('[ConfirmDialog] REJECT');
      },
    });
  }

  downloadInvoices() {
    if (!this.allInvoices.length) {
      console.warn('No hay invoices para descargar');
      return;
    }
    console.log('allInvoices', this.allInvoices);

    const data = this.allInvoices.map((item) => ({
      Date: item.invoice_date,
      Vendor: item.invoice_vendor_description,
      Category: this.getInvoiceCategory(item.category?.invoice_type_id),
      CategoryCode: item.category?.category_code ?? '',
      Amount: item.invoice_amount,
      Notes: item.invoice_notes || '-',
      Location: item.locations?.location_name ?? '',
      User: item.created_user?.user_name ?? '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Invoices');

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(blob, `invoices_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  getInvoiceCategory(typeId: number): string {
    switch (Number(typeId)) {
      case 1:
        return 'COGS';
      case 2:
        return 'Fixed Expense';
      case 3:
        return 'Other Expense';
      default:
        return 'Unknown';
    }
  }
}
