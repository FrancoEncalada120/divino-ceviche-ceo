import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { LocationService } from '../../../core/services/location.service';
import { Location } from '../../../core/models/location.model';
import { finalize, Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import {
  DailyMetric,
  DailyMetricCreateDto,
} from '../../../core/models/dashboard.models';
import { DailyMetricService } from '../../../core/services/dailymetri.service';
import { ModalComponent } from '../modal/modal.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-dailymetric-list',
  imports: [
    CommonModule,
    DatePickerModule,
    MultiSelectModule,
    TabViewModule,
    TableModule,
    ButtonModule,
    CardModule,
    MultiSelectModule,
    FormsModule,
    ModalComponent,
  ],
  templateUrl: './dailymetric-list.component.html',
  styleUrl: './dailymetric-list.component.scss',
})
export class DailymetricListComponent {
  locations: Location[] = [];
  selectedLocation!: Location[];
  dateRange: Date[] | null = null;
  private locationChange$ = new Subject<void>();
  loading = false;
  showAddLocationModal = false;
  editingDailyMetric: DailyMetricCreateDto | null = null;
  dailyMetric: DailyMetric[] = [];
  saving = false;

  constructor(
    private locationService: LocationService,
    private dailymetricService: DailyMetricService,
    private messageService: MessageService,
    private userService: UserService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    this.dateRange = [new Date(yesterday), new Date(yesterday)];
    this.loadLocations();

  }

  load(): void {
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

    this.loading = true;

    this.dailymetricService
      .getAll({
        locacion: locales,
        fechaIni: startDate, // string
        fechaFin: endDate, // string
      })
      .subscribe({
        next: (data) => {
          this.dailyMetric = data;
          const dailyMetric = data ?? []; // ✅ array real

          console.log('dailyMetric items:', dailyMetric.length, dailyMetric);
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        },
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

        this.load();

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

  openUpdateInvoice(item: DailyMetricCreateDto) {
    this.editingDailyMetric = item;
    this.showAddLocationModal = true;
  }

  openDeleteInvoice(item: DailyMetricCreateDto) {
    const id = item.daily_metric_id ?? null;

    if (!id) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Missing ID',
        detail: 'Cannot delete: daily_metric_id is missing.',
      });
      return;
    }

    const title = `Delete daily metric #${id}?`;
    const detail = `This action cannot be undone.`;

    this.confirmationService.confirm({
      header: title,
      message: detail,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',

      accept: () => {
        this.saving = true;

        this.dailymetricService
          .delete(id)
          .pipe(finalize(() => (this.saving = false)))
          .subscribe({
            next: (res) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Deleted',
                detail: res.message ?? 'Daily metric deleted successfully',
              });

              // ✅ refresca tu lista (usa el método que ya tengas)
              this.load();
              // o si tienes array local:
              // this.items = this.items.filter(x => x.daily_metric_id !== id);
            },
            error: (err) => {
              console.error(err);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail:
                  err?.message ??
                  err?.error?.message ??
                  'Error deleting daily metric',
              });
            },
          });
      },
    });
  }

  closeModal() {
    this.showAddLocationModal = false;
  }

  handleSubmit(invoice: DailyMetricCreateDto) {
    // ✅ Validación: para update necesitas ID
    const id = invoice.daily_metric_id ?? null;
    if (!id) {
      console.error(
        '[handleSubmit] Missing daily_metric_id for update',
        invoice
      );
      alert('Missing daily_metric_id to update');
      return;
    }

    const auditUserId = this.userService.getUser()?.user_id;
    // ✅ Payload parcial (no mandes el id en el body)
    const payload: Partial<DailyMetricCreateDto> = {
      location_id: invoice.location_id,
      daily_metric_date: invoice.daily_metric_date, // string YYYY-MM-DD
      daily_metric_tickets: invoice.daily_metric_tickets,
      daily_metric_net_sales: invoice.daily_metric_net_sales,
      daily_metric_daily_hourly: invoice.daily_metric_daily_hourly,
      updated_by: auditUserId ?? null, // si lo usas
    };

    this.saving = true;

    console.log('[payload', payload);
    this.dailymetricService
      .update(id, payload)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: (updated) => {
          console.log('[handleSubmit] Updated ok', updated);

          // opcional: cerrar modal / refrescar lista
          this.closeModal();
          this.load();

          this.messageService?.add?.({
            severity: 'success',
            summary: 'Updated',
            detail: 'Daily metric updated successfully',
          });
        },
        error: (err) => {
          console.error('[handleSubmit] Update error', err);
          alert(
            err?.message ?? err?.error?.message ?? 'Error updating daily metric'
          );
        },
      });
  }
}
