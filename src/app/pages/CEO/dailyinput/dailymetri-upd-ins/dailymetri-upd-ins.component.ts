import { CommonModule, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { LocationService } from '../../../../core/services/location.service';
import { DailyMetricService } from '../../../../core/services/dailymetri.service';

import { finalize, forkJoin, merge, Subject } from 'rxjs';

// PrimeNG
import { MultiSelectModule } from 'primeng/multiselect';

import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';

import { Location as AppLocation } from '../../../../core/models/location.model';
import { DatePickerModule } from 'primeng/datepicker';
import { DropdownModule } from 'primeng/dropdown';
import { UserService } from '../../../../core/services/user.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { User } from '../../../../core/models/user.models';
import { DailyMetricCreateDto } from '../../../../core/models/dashboard.models';

type DailyMetricForm = {
  location_id: FormControl<number | null>;
  date: FormControl<Date | null>;
  tickets: FormControl<number | null>;
  netSales: FormControl<number | null>;
  dailyHourly: FormControl<number | null>;
  grossSales: FormControl<number | null>;
  tips: FormControl<number | null>;
  discounts: FormControl<number | null>;
  otherPayments: FormControl<number | null>;
  taxes: FormControl<number | null>;
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
    netSales: this.fb.control<number | null>({ value: null, disabled: true }, {
      validators: [Validators.required, Validators.min(0)],
    }),
    dailyHourly: this.fb.control<number | null>(null, {
      validators: [Validators.required, Validators.min(0)],
    }),
    discounts: this.fb.control<number | null>(0, {
      validators: [Validators.min(0)],
    }),
    grossSales: this.fb.control<number | null>(0, {
      validators: [Validators.min(0)],
    }),
    tips: this.fb.control<number | null>(0, {
      validators: [Validators.min(0)],
    }),
    otherPayments: this.fb.control<number | null>(0, {
      validators: [Validators.min(0)],
    }),
    taxes: this.fb.control<number | null>(0, {
      validators: [Validators.min(0)],
    }),
  });

  constructor(
    private locationService: LocationService,
    private dailyMetricService: DailyMetricService,
    private userService: UserService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {

    this.user = this.userService.getUser();
    this.loadLocations();
    this.form.patchValue({ date: new Date() });


    this.form.controls.netSales.disable();

    merge(
      this.form.controls.grossSales.valueChanges,
      this.form.controls.taxes.valueChanges,
      this.form.controls.tips.valueChanges,
      this.form.controls.discounts.valueChanges,
      this.form.controls.otherPayments.valueChanges
    ).subscribe(() => {
      this.calculateNetSales();
    });

    this.calculateNetSales();


  }

  private calculateNetSales(): void {
    const grossSales = this.form.controls.grossSales.value ?? 0;
    const taxes = this.form.controls.taxes.value ?? 0;
    const tips = this.form.controls.tips.value ?? 0;
    const discounts = this.form.controls.discounts.value ?? 0;
    const otherPayments = this.form.controls.otherPayments.value ?? 0;

    const netSales =
      grossSales - (taxes + tips + discounts + otherPayments);

    this.form.controls.netSales.setValue(
      Number(netSales.toFixed(2)),
      { emitEvent: false }
    );
  }

  loadLocations(): void {
    this.locationService.getLocationAll().subscribe({
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
    const auditUserId = this.userService.getUser()?.user_id;

    const payload: DailyMetricCreateDto = {
      location_id: Number(v.location_id),
      daily_metric_date: this.dateToYYYYMMDD(v.date!),
      daily_metric_tickets: Number(v.tickets ?? 0),
      daily_metric_net_sales: Number(v.netSales),
      daily_metric_daily_hourly: Number(v.dailyHourly),
      daily_metric_grossSales: Number(v.grossSales ?? 0),
      daily_metric_tips: Number(v.tips ?? 0),
      daily_metric_discounts: Number(v.discounts ?? 0),
      daily_metric_otherPayments: Number(v.otherPayments ?? 0),
      daily_metric_taxes: Number(v.taxes ?? 0),
      created_by: auditUserId ?? null,
    };

    this.saving = true;

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
