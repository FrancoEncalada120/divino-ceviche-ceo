import { CommonModule, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

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
import { DropdownModule } from 'primeng/dropdown';
import { UserService } from '../../../core/services/user.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { User } from '../../../core/models/user.models';
import { DailyMetricCreateDto } from '../../../core/models/dashboard.models';

type DailyMetricForm = {
  location_id: FormControl<number | null>;
  date: FormControl<Date | null>;
  tickets: FormControl<number | null>;
  netSales: FormControl<number | null>;
  dailyHourly: FormControl<number | null>;
};

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
    DropdownModule,
  ],
  templateUrl: './dailymetri-upd-ins.component.html',
  styleUrl: './dailymetri-upd-ins.component.scss',
})
export class DailymetriUpdInsComponent {
  private fb = inject(FormBuilder);
  locations: AppLocation[] = [];
  private locationChange$ = new Subject<void>();
  saving = false;
  user: User | null = null;

  form = this.fb.group<DailyMetricForm>({
    location_id: this.fb.control<number | null>(null, {
      validators: [Validators.required],
    }),
    date: this.fb.control<Date | null>(null, {
      validators: [Validators.required],
    }),

    // ✅ tickets NO obligatorio
    tickets: this.fb.control<number | null>(0, {
      validators: [Validators.min(0)],
    }),

    // ✅ obligatorios
    netSales: this.fb.control<number | null>(null, {
      validators: [Validators.required, Validators.min(0)],
    }),
    dailyHourly: this.fb.control<number | null>(null, {
      validators: [Validators.required, Validators.min(0)],
    }),
  });

  constructor(
    private locationService: LocationService,
    private dailyMetricService: DailyMetricService,
    private userService: UserService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.user = this.userService.currentUser;
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
  private dateToYYYYMMDD(d: Date): string {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`; // ✅ string YYYY-MM-DD
  }

  save(): void {
    // 1) Forzar validación
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();
    const auditUserId = this.userService.getUser2()?.user_id;

    const payload: DailyMetricCreateDto = {
      location_id: Number(v.location_id),
      daily_metric_date: this.dateToYYYYMMDD(v.date!),
      daily_metric_tickets: Number(v.tickets ?? 0),
      daily_metric_net_sales: Number(v.netSales),
      daily_metric_daily_hourly: Number(v.dailyHourly),
      created_by: auditUserId ?? null,
    };

    this.saving = true;

    console.log('payload', payload);

    this.dailyMetricService
      .create(payload)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: () => {
          this.form.patchValue({
            tickets: 0,
            netSales: 0,
            dailyHourly: 0,
          });

          this.form.markAsPristine();
          this.form.markAsUntouched();

          this.messageService.add({
            severity: 'success',
            summary: 'Saved',
            detail: 'Daily metric saved successfully',
          });
        },
        error: (err) => {
          console.error(err);
          alert(err?.error?.message ?? err?.message ?? 'Error saving');
        },
      });
  }
}
