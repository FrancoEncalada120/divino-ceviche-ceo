import { CommonModule, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { LocationService } from '../../../core/services/location.service';
import { DailyMetricService } from '../../../core/services/dailymetri.service';

import { finalize, forkJoin, Subject } from 'rxjs';

// PrimeNG
import { MultiSelectModule } from 'primeng/multiselect';

import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';

import { Location as AppLocation } from '../../../core/models/location.model';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-dailymetri-upd-ins',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    ReactiveFormsModule,

    // CalendarModule,
    MultiSelectModule,
    InputNumberModule,
    ButtonModule,
    CardModule,
    TableModule,
    TabViewModule,
    DatePickerModule,
  ],
  templateUrl: './dailymetri-upd-ins.component.html',
  styleUrl: './dailymetri-upd-ins.component.scss',
})
export class DailymetriUpdInsComponent {
  private fb = inject(FormBuilder);
  locations: AppLocation[] = [];
  private locationChange$ = new Subject<void>();
  saving = false;

  form = this.fb.group({
    location_ids: [[], [Validators.required]], // array de ids
    date: [null as Date | null, [Validators.required]],
    tickets: [0, [Validators.required, Validators.min(0)]],
    netSales: [0, [Validators.required, Validators.min(0)]],
    dailyHourly: [0, [Validators.required, Validators.min(0)]],
  });

  constructor(
    private locationService: LocationService,
    private dailyMetricService: DailyMetricService
  ) {}

  ngOnInit(): void {
    this.loadLocations();
    this.form.patchValue({ date: new Date() });
  }

  loadLocations(): void {
    this.locationService.getAll().subscribe({
      next: (data: AppLocation[]) => {
        this.locations = Array.isArray(data) ? data : [];
      },
      error: (err) => console.error(err),
    });
  }

  onLocationsChange() {
    this.locationChange$.next();
  }

  isInvalid(controlName: keyof typeof this.form.controls): boolean {
    const c = this.form.controls[controlName];
    return !!(c.touched && c.invalid);
  }

  get aov(): number {
    const tickets = Number(this.form.value.tickets ?? 0);
    const net = Number(this.form.value.netSales ?? 0);
    return tickets > 0 ? net / tickets : 0;
  }

  get laborCostPercent(): number {
    const net = Number(this.form.value.netSales ?? 0);
    const labour = Number(this.form.value.dailyHourly ?? 0);
    return net > 0 ? (labour / net) * 100 : 0;
  }

  private dateToYYYYMMDD(d: Date): number {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return Number(`${yyyy}${mm}${dd}`);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;
    const locationIds = (v.location_ids ?? []) as number[];
    const dateNum = this.dateToYYYYMMDD(v.date as Date);

    const requests = locationIds.map((location_id) =>
      this.dailyMetricService.create({
        location_id,
        daily_metric_date: dateNum,
        daily_metric_tickets: Number(v.tickets),
        daily_metric_net_sales: Number(v.netSales),
        daily_metric_daily_hourly: Number(v.dailyHourly),
      })
    );

    this.saving = true;

    forkJoin(requests)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: () => {
          this.form.patchValue({ tickets: 0, netSales: 0, dailyHourly: 0 });
          alert('Saved!');
        },
        error: (err) => {
          console.error(err);
          alert(err?.error?.message ?? 'Error saving');
        },
      });
  }
}
