import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuditInfoComponent } from '../../../../shared/components/audit-info/audit-info.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  DailyMetric,
  DailyMetricCreateDto,
} from '../../../../core/models/dashboard.models';
import { LocationService } from '../../../../core/services/location.service';
import { Location } from '../../../../core/models/location.model';
import { merge } from 'rxjs';

@Component({
  selector: 'app-modal',
  imports: [CommonModule, FormsModule, AuditInfoComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<DailyMetricCreateDto>();
  @Input() dailyMetric: DailyMetricCreateDto | null = null;

  loading = false;
  locations: Location[] = [];
  selectedLocation!: Location[];

  constructor(private locationService: LocationService) { }

  formData: Partial<DailyMetricCreateDto> = {
    daily_metric_id: null,
    location_id: 0,
    daily_metric_date: '',
    daily_metric_tickets: 0,
    daily_metric_net_sales: 0,
    daily_metric_daily_hourly: 0,
    daily_metric_grossSales: 0,
    daily_metric_tips: 0,
    daily_metric_discounts: 0,
    daily_metric_otherPayments: 0,
    daily_metric_taxes: 0,
    created_at: null,
    created_by: 0,
    updated_at: null,
    updated_by: 0,
  };

  ngOnInit(): void {
    this.formData = { ...this.dailyMetric };

    this.load();


  }

  public calculateNetSales(): void {

    const grossSales = Number(this.formData.daily_metric_grossSales || 0);
    const taxes = Number(this.formData.daily_metric_taxes || 0);
    const tips = Number(this.formData.daily_metric_tips || 0);
    const discounts = Number(this.formData.daily_metric_discounts || 0);
    const otherPayments = Number(this.formData.daily_metric_otherPayments || 0);

    console.log('Calculating Net Sales with:', { grossSales, taxes, tips, discounts, otherPayments });

    this.formData.daily_metric_net_sales =
      Number(
        (
          grossSales -
          (taxes + tips + discounts + otherPayments)
        ).toFixed(2)
      );
  }

  load(): void {
    this.locationService.getLocationAll().subscribe({
      next: (data) => {
        this.locations = data ?? [];
      },
      error: (err) => {
        console.error('[Locations] GET error:', err);
      },
      complete: () => { },
    });
  }

  onClose(): void {
    this.close.emit();
  }

  onSubmit() {
    this.submit.emit(this.formData as DailyMetricCreateDto);
  }
}
